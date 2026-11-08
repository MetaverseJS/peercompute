import { open, stat } from 'node:fs/promises';

const MAXIMUM_DBF_HEADER_BYTES = 64 * 1024;
const MAXIMUM_DBF_RECORD_BYTES = 8 * 1024;
const MAXIMUM_READ_BATCH_BYTES = 4 * 1024 * 1024;

async function readExactly(handle, buffer, position, label) {
  let offset = 0;
  while (offset < buffer.byteLength) {
    const result = await handle.read(buffer, offset, buffer.byteLength - offset, position + offset);
    if (result.bytesRead === 0) throw new Error(`${label} ended unexpectedly.`);
    offset += result.bytesRead;
  }
}

/** Validate the source DBF's fixed-width VERSION column without buffering it. */
export async function validateFederalHighwayDbfVersion(
  path,
  { expectedRecordCount, expectedVersion } = {},
) {
  if (!Number.isSafeInteger(expectedRecordCount) || expectedRecordCount < 1) {
    throw new RangeError('expectedRecordCount must be a positive safe integer.');
  }
  if (!/^\d{4}\.\d{2}\.\d{2}$/u.test(String(expectedVersion))) {
    throw new TypeError('expectedVersion must use YYYY.MM.DD.');
  }
  const file = await stat(path);
  if (!file.isFile()) throw new Error('The NHS DBF is not a regular file.');
  const handle = await open(path, 'r');
  try {
    const header = Buffer.alloc(32);
    await readExactly(handle, header, 0, 'NHS DBF header');
    const recordCount = header.readUInt32LE(4);
    const headerBytes = header.readUInt16LE(8);
    const recordBytes = header.readUInt16LE(10);
    if (recordCount !== expectedRecordCount) {
      throw new Error(`NHS archive record count ${recordCount} differs from live ${expectedRecordCount}.`);
    }
    if (headerBytes < 33 || headerBytes > MAXIMUM_DBF_HEADER_BYTES || (headerBytes - 33) % 32 !== 0) {
      throw new Error('NHS DBF header length is invalid.');
    }
    if (recordBytes < 2 || recordBytes > MAXIMUM_DBF_RECORD_BYTES) {
      throw new Error('NHS DBF record length is invalid.');
    }
    const minimumBytes = headerBytes + recordCount * recordBytes;
    if (file.size < minimumBytes || file.size > minimumBytes + 1) {
      throw new Error('NHS DBF file length does not match its fixed-width record contract.');
    }
    const descriptors = Buffer.alloc(headerBytes - 32);
    await readExactly(handle, descriptors, 32, 'NHS DBF field descriptors');
    if (descriptors.at(-1) !== 0x0d) throw new Error('NHS DBF field descriptors omit the terminator.');
    let fieldOffset = 1;
    let versionField = null;
    for (let cursor = 0; cursor < descriptors.length - 1; cursor += 32) {
      const descriptor = descriptors.subarray(cursor, cursor + 32);
      const nameEnd = descriptor.indexOf(0);
      const name = descriptor.subarray(0, nameEnd < 0 ? 11 : nameEnd).toString('ascii');
      const type = String.fromCharCode(descriptor[11]);
      const length = descriptor[16];
      if (length < 1 || fieldOffset + length > recordBytes) throw new Error(`NHS DBF field ${name} has invalid width.`);
      if (name === 'VERSION') versionField = { offset: fieldOffset, length, type };
      fieldOffset += length;
    }
    if (!versionField || versionField.type !== 'C') {
      throw new Error('NHS DBF VERSION field is missing or is not character data.');
    }
    if (fieldOffset !== recordBytes) throw new Error('NHS DBF field widths do not match the record length.');

    const recordsPerBatch = Math.max(1, Math.floor(MAXIMUM_READ_BATCH_BYTES / recordBytes));
    let activeRecords = 0;
    let deletedRecords = 0;
    const versions = new Set();
    for (let start = 0; start < recordCount; start += recordsPerBatch) {
      const count = Math.min(recordsPerBatch, recordCount - start);
      const bytes = Buffer.allocUnsafe(count * recordBytes);
      await readExactly(handle, bytes, headerBytes + start * recordBytes, 'NHS DBF records');
      for (let index = 0; index < count; index += 1) {
        const offset = index * recordBytes;
        const deletionFlag = bytes[offset];
        if (deletionFlag === 0x2a) {
          deletedRecords += 1;
          continue;
        }
        if (deletionFlag !== 0x20) throw new Error('NHS DBF contains an invalid record deletion flag.');
        activeRecords += 1;
        const version = bytes.subarray(
          offset + versionField.offset,
          offset + versionField.offset + versionField.length,
        ).toString('utf8').trim();
        versions.add(version);
        if (version !== expectedVersion) {
          throw new Error(`NHS archive VERSION ${version || '(blank)'} differs from live ${expectedVersion}.`);
        }
      }
    }
    if (activeRecords < 1) throw new Error('NHS DBF contains no active records.');
    return Object.freeze({
      recordCount,
      activeRecords,
      deletedRecords,
      recordBytes,
      headerBytes,
      versions: Object.freeze([...versions].sort()),
    });
  } finally {
    await handle.close();
  }
}
