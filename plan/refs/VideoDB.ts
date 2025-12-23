// Copyright © 2025 Jon Griebel. dgriebel2014@gmail.com - All rights reserved.
// Distributed under the MIT license.

// videoDB.ts

/**
 * A VideoDB class that stores all metadata in CPU memory, 
 * and actual data on the GPU
 */
import {
    StoreMetadata,
    BufferMetadata,
    RowMetadata,
    InitialMetrics,
    MapBufferSubsections,
    PerKeyMetrics,
    RowInfo,
    SortDefinition,
    SortField,
    PendingWrite,
    RowIdPaddingResult
} from "./types/StoreMetadata";

export class VideoDB {
    public storeMetadataMap: Map<string, StoreMetadata>;
    public storeKeyMap: Map<string, Map<string, number>>;
    public pendingWrites: PendingWrite[] = [];
    private readonly BATCH_SIZE = 10000;
    private flushTimer: number | null = null;
    public isReady: boolean | null = true;
    private waitUntilReadyPromise: Promise<void> | null = null;
    private readyResolver: (() => void) | null = null;
    private textEncoder = new TextEncoder();
    private static readonly typedArrayConstructors: { [key: string]: any } = {
        Uint8Array,
        Int8Array,
        Uint16Array,
        Int16Array,
        Uint32Array,
        Int32Array,
        Float32Array,
        Float64Array
    };

    /**
     * Initializes a new instance of the VideoDB class.
     * @param {GPUDevice} device - The GPU device to be used for buffer operations.
     */
    constructor(private device: GPUDevice) {
        this.storeMetadataMap = new Map();
        this.storeKeyMap = new Map();
    }

    /**
     * Creates a new object store with the specified configuration options.
     *
     * @param {string} storeName - The name of the store to create.
     * @param {{
     *   dataType: "TypedArray" | "ArrayBuffer" | "JSON";
     *   typedArrayType?:
     *     | "Float32Array"
     *     | "Float64Array"
     *     | "Int32Array"
     *     | "Uint32Array"
     *     | "Uint8Array";
     *   bufferSize: number;
     *   rowSize?: number;
     *   totalRows: number;
     *   sortDefinition?: {
     *     name: string;
     *     sortFields: {
     *       sortColumn: string;
     *       path: string;
     *       sortDirection: "Asc" | "Desc";
     *     }[];
     *   }[];
     * }} options - The configuration options for the new store.
     * @returns {void}
     * @throws {Error} If the store already exists or the typedArrayType is missing when dataType is "TypedArray".
     */
    public createObjectStore(
        storeName: string,
        options: {
            dataType: "TypedArray" | "ArrayBuffer" | "JSON";
            typedArrayType?:
            | "Float32Array"
            | "Float64Array"
            | "Int32Array"
            | "Uint32Array"
            | "Uint8Array";
            bufferSize: number;
            rowSize?: number;
            totalRows: number;
            sortDefinition?: {
                name: string;
                sortFields: {
                    sortColumn: string;
                    path: string;
                    sortDirection: "Asc" | "Desc";
                }[];
            }[];
        }
    ): void;
    public createObjectStore(
        storeName: string,
        options: {
            dataType: "TypedArray" | "ArrayBuffer" | "JSON";
            typedArrayType?:
            | "Float32Array"
            | "Float64Array"
            | "Int32Array"
            | "Uint32Array"
            | "Uint8Array";
            bufferSize: number;
            rowSize?: number;
            totalRows: number;
            sortDefinition?: {
                name: string;
                sortFields: {
                    sortColumn: string;
                    path: string;
                    sortDirection: "Asc" | "Desc";
                }[];
            }[];
        }
    ): void {
        // 1) Check if an object store with this name already exists. If so, throw an error.
        if (this.storeMetadataMap.has(storeName)) {
            throw new Error(`Object store "${storeName}" already exists.`);
        }

        // 2) If the data type is "TypedArray", we must have a valid typedArrayType.
        if (options.dataType === "TypedArray" && !options.typedArrayType) {
            throw new Error(
                `typedArrayType is required when dataType is "TypedArray".`
            );
        }

        // 3) If the dataType is not "JSON" and rowSize is provided, 
        //    calculate how many rows can fit into one buffer based on bufferSize.
        //    Otherwise, it remains undefined.
        const rowsPerBuffer = options.dataType !== "JSON" && options.rowSize
            ? Math.floor(options.bufferSize / options.rowSize)
            : undefined;

        // 4) Construct a StoreMetadata object that describes this new object store.
        const storeMetadata: StoreMetadata = {
            storeName,
            dataType: options.dataType,
            typedArrayType: options.typedArrayType,
            bufferSize: options.bufferSize,
            rowSize: options.rowSize,
            rowsPerBuffer,
            totalRows: options.totalRows,
            buffers: [],    // no buffers allocated yet
            rows: [],       // empty row list initially
            // 4a) Convert each sortDefinition to an internal format, marking all field data types as "string" by default.
            sortDefinition: options.sortDefinition?.map(def => ({
                name: def.name,
                sortFields: def.sortFields.map(field => ({
                    dataType: "string",
                    ...field
                }))
            })) ?? [],
            sortsDirty: false
        };

        // 5) Save the new store metadata in the storeMetadataMap.
        this.storeMetadataMap.set(storeName, storeMetadata);
        // 5a) Also create an empty keyMap for this storeName.
        this.storeKeyMap.set(storeName, new Map());
    }

    /**
     * Deletes an existing object store by name.
     * @param {string} storeName - The name of the store to delete.
     * @returns {void} This method does not return anything.
     */
    public deleteObjectStore(storeName: string): void {
        if (!this.storeMetadataMap.has(storeName)) {
            return;
        }
        this.storeMetadataMap.delete(storeName);
        this.storeKeyMap.delete(storeName);
    }

    /**
     * Retrieves a list of all existing object store names.
     * @returns {string[]} An array containing the names of all object stores.
     */
    public listObjectStores(): string[] {
        return Array.from(this.storeMetadataMap.keys());
    }

    /**
     * Adds a new record to the specified store, with delayed GPU writes.
     *
     * @async
     * @function
     * @name add
     * @memberof YourClassName
     * @param {string} storeName - The name of the store to which the record should be added.
     * @param {string} key - The key under which the record will be stored.
     * @param {*} value - The record data to add.
     * @returns {Promise<void>} Promise that resolves when the record has been added.
     * @throws {Error} If the specified object store does not exist.
     */
    public async add(storeName: string, key: string, value: any): Promise<void> {
        this.isReady = false;

        const storeMeta = this.storeMetadataMap.get(storeName);
        if (!storeMeta) {
            throw new Error(`Object store "${storeName}" does not exist.`);
        }

        // 1) Write main record
        await this.writeRecordToStore(storeMeta, key, value, "add");

        // 2) Reset flush timer and possibly flush
        this.resetFlushTimer();
        await this.checkAndFlush();
    }

    /**
     * Updates (or adds) a record in the specified store, with delayed GPU writes.
     *
     * @async
     * @function
     * @name put
     * @memberof YourClassName
     * @param {string} storeName - The name of the store to which the record should be written or updated.
     * @param {string} key - The key under which the record will be stored or updated.
     * @param {*} value - The record data to put or update.
     * @returns {Promise<void>} Promise that resolves when the record has been put or updated.
     * @throws {Error} If the specified object store does not exist.
     */
    public async put(storeName: string, key: string, value: any): Promise<void> {
        this.isReady = false;

        const storeMeta = this.storeMetadataMap.get(storeName);
        if (!storeMeta) {
            throw new Error(`Object store "${storeName}" does not exist.`);
        }

        // 1) Write main record
        await this.writeRecordToStore(storeMeta, key, value, "put");

        // 2) Reset flush timer and possibly flush
        this.resetFlushTimer();
        await this.checkAndFlush();
    }

    /**
     * Retrieves data for a specific key from the GPU-backed store by utilizing the getMultiple method.
     * Ensures all pending writes are flushed before reading.
     *
     * @param {string} storeName - The name of the object store.
     * @param {string} key - The unique key identifying the row.
     * @returns {Promise<any | null>} A promise that resolves with the retrieved data or null if not found.
     * @throws {Error} If the store does not exist.
     */
    public async get(storeName: string, key: string): Promise<any | null> {
        // Call getMultiple with a single key
        const results = await this.getMultiple(storeName, [key]);

        // Extract the first (and only) result
        const result = results[0];

        return result;
    }

    /**
     * Retrieves multiple records from the specified store, supporting two different usage patterns:
     *
     * 1. **Fetch by an array of keys**:
     *    ```ts
     *    const results = await videoDB.getMultiple("MyStore", ["key1", "key2", "key3"]);
     *    ```
     *    - Returns a Promise resolving to an array of the same length as the input `keys`.
     *    - Each position corresponds to the deserialized data for that key, or `null` if the key does not exist.
     *    - Keys can also include wildcard patterns (e.g., `%`, `_`, or bracket expressions) which will be expanded to match multiple existing keys.
     *
     * 2. **Paginated fetch**:
     *    ```ts
     *    const results = await videoDB.getMultiple("MyStore", 0, 100);
     *    ```
     *    - Interprets the second parameter as `skip` and the third parameter as `take`.
     *    - Internally retrieves all keys from the store, then returns a slice of that array starting at index `skip` and spanning `take` entries.
     *    - The returned array contains data in the store’s internal keyMap order (not necessarily sorted by key).
     *
     * @param {string} storeName
     *   The name of the target store from which to retrieve data.
     *
     * @param {string[] | number} param2
     *   - If this is an array of `string`s, the method treats it as a list of specific keys (including possible wildcards) to fetch.
     *   - If this is a `number`, the method interprets it as the `skip` value for pagination.
     *
     * @param {number} [param3]
     *   - If `param2` is a number, then this parameter is the `take` value for pagination.
     *   - Ignored if `param2` is an array of keys.
     *
     * @returns {Promise<(any|null)[]>}
     *   A promise that resolves to an array of results. Each result is either the deserialized object/typed-array/ArrayBuffer from the GPU or `null` if the record does not exist.
     *   - In “fetch by keys” mode, the array matches the order of your provided keys.
     *   - In “paginated fetch” mode, the array contains results in the order of the store’s keyMap from `skip` to `skip + take - 1`.
     *
     * @throws {Error}
     *   - If invalid parameters are provided (neither an array of keys nor valid `skip`/`take`).
     *
     * @example
     * // 1) Fetch by specific keys
     * const recordsByKey = await videoDB.getMultiple("MyStore", ["key1", "key2"]);
     *
     * @example
     * // 2) Fetch by pagination
     * const firstHundredRecords = await videoDB.getMultiple("MyStore", 0, 100);
     *
     * @remarks
     * - All pending writes are flushed before reading to ensure consistency.
     * - If keys are expanded from wildcards, the results array may be larger than the original keys array.
     * - The order of results in paginated mode depends on iteration order of the store’s internal keyMap, which is not necessarily sorted.
     */
    public async getMultiple(storeName: string, keys: string[]): Promise<(any | null)[]>;
    public async getMultiple(storeName: string, skip: number, take: number): Promise<(any | null)[]>;
    public async getMultiple(
        storeName: string,
        param2: string[] | number,
        param3?: number
    ): Promise<(any | null)[]> {
        if (Array.isArray(param2)) {
            // Overload 1: Fetch by keys
            const keys = param2;
            const { results } = await this.getMultipleByKeys(storeName, keys);
            return results;
        } else if (typeof param2 === 'number' && typeof param3 === 'number') {
            // Overload 2: Fetch by pagination (skip and take)
            const skip = param2;
            const take = param3;

            // Flush & retrieve store metadata
            const { keyMap } = await this.flushAndGetMetadata(storeName);

            // Convert the store’s keyMap into an array of all keys
            const allKeys = Array.from(keyMap.keys());

            const { results } = await this.readRowsWithPagination(storeName, allKeys, skip, take);
            return results;
        } else {
            throw new Error(
                'Invalid parameters for getMultiple. Expected either (storeName, keys[]) or (storeName, skip, take).'
            );
        }
    }

    /**
     * Deletes data for a specific key from the GPU-backed store by batching the delete operation.
     * The actual GPU write and metadata update are deferred until `flushWrites` is called.
     *
     * @param {string} storeName - The name of the object store.
     * @param {string} key - The unique key identifying the row to delete.
     * @returns {Promise<void>} A promise that resolves once the delete operation is queued.
     * @throws {Error} If the store does not exist.
     */
    public async delete(storeName: string, key: string): Promise<void> {
        // Retrieve store metadata and key map
        const storeMeta = this.getStoreMetadata(storeName);
        const keyMap = this.getKeyMap(storeName);

        // Find active row metadata for the given key
        const rowMetadata = this.findActiveRowMetadata(keyMap, key, storeMeta.rows);
        if (!rowMetadata) {
            return;
        }

        // Mark the row as deleted (set the delete flag)
        rowMetadata.flags = (rowMetadata.flags ?? 0) | 0x1;

        // Remove the key from the key map so that it is no longer accessible
        keyMap.delete(key);

        // Create a zeroed ArrayBuffer to overwrite the row data (optional)
        const zeroedArrayBuffer = new ArrayBuffer(rowMetadata.length);
        const zeroedView = new Uint8Array(zeroedArrayBuffer);
        zeroedView.fill(0); // Fill with zeros for a "true" deletion

        // Queue the delete operation as a pending write
        this.pendingWrites.push({
            storeMeta,
            rowMetadata,
            arrayBuffer: zeroedArrayBuffer,
            gpuBuffer: this.getBufferByIndex(storeMeta, rowMetadata.bufferIndex),
            operationType: 'delete',
            key, // Key included for metadata updates during flush, if needed.
        });

        // Reset the flush timer and check if we need to flush immediately
        this.resetFlushTimer();
        await this.checkAndFlush();
    }

    /**
     * Removes all rows from the specified object store, destroys all GPU buffers,
     * and then recreates a single fresh buffer for subsequent usage.
     *
     * @param {string} storeName - The name of the object store to clear.
     * @returns {void}
     * @throws {Error} If the specified store does not exist.
     */
    public async clear(storeName: string): Promise<void> {
        const storeMeta = this.storeMetadataMap.get(storeName);
        if (!storeMeta) {
            throw new Error(`Object store "${storeName}" does not exist.`);
        }

        await this.waitUntilReady();

        // Retrieve store metadata and keyMap
        const keyMap = this.getKeyMap(storeName);

        // Discard all row metadata
        storeMeta.rows = [];

        // Destroy all existing GPU buffers
        for (const bufferMeta of storeMeta.buffers) {
            if (bufferMeta.gpuBuffer) {
                bufferMeta.gpuBuffer.destroy();
            }
        }

        // Clear the array of buffers
        storeMeta.buffers = [];

        const newGpuBuffer = this.device.createBuffer({
            size: storeMeta.bufferSize,
            usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
            mappedAtCreation: false
        });

        // Add the newly created buffer to the store's metadata
        storeMeta.buffers.push({
            bufferIndex: 0,
            startRow: -1,
            rowCount: 0,
            gpuBuffer: newGpuBuffer
        });

        // Clear the keyMap so there are no active keys
        keyMap.clear();
    }

    /**
     * Opens a cursor for iterating over records in the specified object store.
     *
     * @param {string} storeName - The name of the object store to iterate over.
     * @param {{
     *   range?: {
     *     lowerBound?: string;
     *     upperBound?: string;
     *     lowerInclusive?: boolean;
     *     upperInclusive?: boolean;
     *   };
     *   direction?: 'next' | 'prev';
     * }} [options] - Optional parameters to filter and control the iteration.
     * @returns {AsyncGenerator<{ key: string; value: any }, void, unknown>} An async generator yielding key-value pairs.
     * @throws {Error} If the specified store does not exist.
     *
     * @example
     * for await (const record of videoDB.openCursor('MyStore')) {
     *     console.info(record.key, record.value);
     * }
     *
     * @example
     * const range = { lowerBound: '100', upperBound: '200', lowerInclusive: true, upperInclusive: false };
     * for await (const record of videoDB.openCursor('MyStore', { range, direction: 'prev' })) {
     *     console.info(record.key, record.value);
     * }
     */
    public async *openCursor(
        storeName: string,
        options?: {
            range?: {
                lowerBound?: string;
                upperBound?: string;
                lowerInclusive?: boolean;
                upperInclusive?: boolean;
            };
            direction?: 'next' | 'prev';
        }
    ): AsyncGenerator<{ key: string; value: any }, void, unknown> {
        const storeMeta = this.storeMetadataMap.get(storeName);
        if (!storeMeta) {
            throw new Error(`Object store "${storeName}" does not exist.`);
        }

        // Retrieve store metadata and keyMap
        const keyMap = this.getKeyMap(storeName);

        // Retrieve all active keys
        let activeKeys = Array.from(keyMap.keys());

        // Apply key range filtering if a range is provided
        if (options?.range) {
            activeKeys = this.applyCustomRange(activeKeys, options.range);
        }

        // Sort keys based on direction
        if (options?.direction === 'prev') {
            activeKeys.sort((a, b) => this.compareKeys(b, a));
        } else {
            // Default to 'next' direction
            activeKeys.sort((a, b) => this.compareKeys(a, b));
        }

        // Iterate over the sorted, filtered keys and yield records
        for (const key of activeKeys) {
            const rowMetadata = keyMap.get(key);
            if (rowMetadata == null) {
                continue; // Skip if no row metadata found
            }

            const record = await this.get(storeName, key);
            if (record !== null) {
                yield { key, value: record };
            }
        }
    }

    /**
     * Checks if the pending writes have reached a threshold or if conditions
     * dictate a flush to the GPU buffers, and performs the flush if necessary.
     *
     * @private
     * @returns {Promise<void>} A promise that resolves once the flush has been performed (if triggered).
     */
    private async checkAndFlush(): Promise<void> {
        if (this.pendingWrites.length >= this.BATCH_SIZE) {
            if (this.flushTimer !== null) {
                clearTimeout(this.flushTimer);
                this.flushTimer = null;
            }
            // Await the flush here
            await this.flushWrites();
        }
    }

    /**
     * Flushes all pending writes in batches to their respective GPU buffers.
     * Groups writes by buffer, performs the writes, then waits for GPU completion.
     *
     * @private
     * @returns {Promise<void>} A promise that resolves once all pending writes are submitted and the queue is done.
     */
    private async flushWrites(): Promise<void> {
        if (this.pendingWrites.length === 0) {
            return;
        }

        // Group all pendingWrites by their GPUBuffer
        const writesByBuffer: Map<GPUBuffer, PendingWrite[]> = new Map();
        for (const item of this.pendingWrites) {
            const { gpuBuffer } = item;
            if (!writesByBuffer.has(gpuBuffer)) {
                writesByBuffer.set(gpuBuffer, []);
            }
            writesByBuffer.get(gpuBuffer)!.push(item);
        }

        // Keep track of which writes succeed
        const successfulWrites = new Set<PendingWrite>();

        // Sort by offset and write each group
        for (const [gpuBuffer, writeGroup] of writesByBuffer.entries()) {
            // Sort by offset ascending
            writeGroup.sort((a, b) => a.rowMetadata.offset - b.rowMetadata.offset);

            for (const pendingWrite of writeGroup) {
                try {
                    const { rowMetadata, arrayBuffer } = pendingWrite;
                    this.device.queue.writeBuffer(
                        gpuBuffer,
                        rowMetadata.offset,
                        arrayBuffer
                    );
                    successfulWrites.add(pendingWrite);
                } catch (singleWriteError) {
                    console.error('Error writing single item:', singleWriteError);
                }
            }
        }

        // Wait for the GPU queue to finish
        await this.device.queue.onSubmittedWorkDone();

        // Remove successful writes from pending
        this.pendingWrites = this.pendingWrites.filter(write => !successfulWrites.has(write));
    }

    /**
     * Applies a custom string key range filter (lower/upper bounds, inclusivity)
     * to an array of keys.
     *
     * @private
     * @param {string[]} keys - The keys to be filtered.
     * @param {{
     *   lowerBound?: string;
     *   upperBound?: string;
     *   lowerInclusive?: boolean;
     *   upperInclusive?: boolean;
     * }} range - Defines the comparison bounds and inclusivity.
     * @returns {string[]} The subset of keys that meet the range criteria.
     */
    private applyCustomRange(
        keys: string[],
        range: {
            lowerBound?: string;
            upperBound?: string;
            lowerInclusive?: boolean;
            upperInclusive?: boolean;
        }
    ): string[] {
        return keys.filter((key) => {
            let withinLower = true;
            let withinUpper = true;

            if (range.lowerBound !== undefined) {
                if (range.lowerInclusive) {
                    withinLower = key >= range.lowerBound;
                } else {
                    withinLower = key > range.lowerBound;
                }
            }

            if (range.upperBound !== undefined) {
                if (range.upperInclusive) {
                    withinUpper = key <= range.upperBound;
                } else {
                    withinUpper = key < range.upperBound;
                }
            }

            return withinLower && withinUpper;
        });
    }

    /**
     * Retrieves the key-to-row-index map for the specified store name.
     *
     * @private
     * @param {string} storeName - The name of the store.
     * @returns {Map<string, number>} The store's key map.
     * @throws {Error} If the store does not exist.
     */
    private getKeyMap(storeName: string): Map<string, number> {
        const keyMap = this.storeKeyMap.get(storeName);
        if (!keyMap) {
            return new Map<string, number>();
        }
        return keyMap;
    }

    /**
     * Compares two string keys for sorting purposes.
     *
     * @private
     * @param {string} a - The first key to compare.
     * @param {string} b - The second key to compare.
     * @returns {number} Negative if a < b, 0 if equal, or positive if a > b.
     */
    private compareKeys(a: string, b: string): number {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    }

    /**
     * Finds active row metadata for a given key if it exists (and is not flagged inactive).
     *
     * @private
     * @param {Map<string, number>} keyMap - Map of key → row ID.
     * @param {string} key - The key being searched.
     * @param {RowMetadata[]} rows - The array of row metadata for the store.
     * @returns {RowMetadata | null} Metadata if found and active, otherwise null.
     */
    private findActiveRowMetadata(
        keyMap: Map<string, number>,
        key: string,
        rows: RowMetadata[]
    ): RowMetadata | null {
        const rowId = keyMap.get(key);
        if (rowId == null) {
            return null;
        }
        const rowMetadata = rows.find((r) => r.rowId === rowId);
        if (!rowMetadata) {
            return null;
        }
        if ((rowMetadata.flags ?? 0) & 0x1) {
            return null;
        }
        return rowMetadata;
    }

    /**
     * Retrieves the metadata object for a given store by name.
     *
     * @private
     * @param {string} storeName - The name of the store.
     * @returns {StoreMetadata} The metadata for the specified store.
     * @throws {Error} If the store does not exist.
     */
    private getStoreMetadata(storeName: string): StoreMetadata {
        const meta = this.storeMetadataMap.get(storeName);
        if (!meta) {
            throw new Error(`Object store "${storeName}" does not exist.`);
        }
        return meta;
    }

    /**
     * Finds or creates space in an existing GPU buffer (or a new buffer) for a given size.
     * Returns the GPU buffer reference, its index, and the offset where the data should be written.
     *
     * @private
     * @param {StoreMetadata} storeMeta - Metadata of the store to which we're allocating space.
     * @param {number} size - The size in bytes needed in the GPU buffer.
     * @returns {{ gpuBuffer: GPUBuffer; bufferIndex: number; offset: number }}
     *  An object containing the GPU buffer, the buffer index, and the offset in the buffer.
     */
    private findOrCreateSpace(
        storeMeta: StoreMetadata,
        size: number
    ): {
        gpuBuffer: GPUBuffer;
        bufferIndex: number;
        offset: number;
    } {
        if (storeMeta.buffers.length === 0) {
            // No buffers exist yet; allocate the first one
            return this.allocateFirstBufferChunk(storeMeta, size);
        }

        // Otherwise, check the last buffer for available space
        const { lastBufferMeta, usedBytes } = this.getLastBufferUsage(storeMeta);
        const capacity = storeMeta.bufferSize;

        if (usedBytes + size <= capacity) {
            // There's enough space in the last buffer
            return this.useSpaceInLastBuffer(storeMeta, lastBufferMeta, usedBytes, size);
        }

        // Not enough space, so allocate a new buffer
        return this.allocateNewBufferChunk(storeMeta, size);
    }

    /**
     * Allocates and initializes the very first buffer in the store. 
     * Dynamically upsizes the buffer if the needed size is bigger than storeMeta.bufferSize.
     *
     * @private
     * @param {StoreMetadata} storeMeta - The store metadata where the buffer is being created.
     * @param {number} size - The number of bytes initially needed in the new buffer.
     * @returns {{ gpuBuffer: GPUBuffer; bufferIndex: number; offset: number }}
     *   An object containing the new GPU buffer, the assigned buffer index, 
     *   and the offset at which data can be written (always 0 for the first chunk).
     */
    private allocateFirstBufferChunk(
        storeMeta: StoreMetadata,
        size: number
    ): {
        gpuBuffer: GPUBuffer;
        bufferIndex: number;
        offset: number;
    } {
        // Dynamically pick a capacity that can hold 'size'
        const neededCapacity = Math.max(storeMeta.bufferSize, this.roundUp(size, 256));
        const gpuBuffer = this.device.createBuffer({
            size: neededCapacity,
            usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
            mappedAtCreation: false
        });
        (gpuBuffer as any)._usedBytes = 0;

        storeMeta.buffers.push({
            bufferIndex: 0,
            startRow: -1,
            rowCount: 0,
            gpuBuffer
        });

        (gpuBuffer as any)._usedBytes = size;
        storeMeta.buffers[0].rowCount += 1;

        return {
            gpuBuffer,
            bufferIndex: 0,
            offset: 0
        };
    }

    /**
     * Retrieves usage information for the last buffer in the store, including
     * a reference to its metadata and the number of bytes already used.
     *
     * @private
     * @param {StoreMetadata} storeMeta - The store metadata containing the buffer list.
     * @returns {{ lastBufferMeta: BufferMetadata; usedBytes: number }}
     *   An object containing the last buffer's metadata and how many bytes have been used.
     */
    private getLastBufferUsage(
        storeMeta: StoreMetadata
    ): {
        lastBufferMeta: BufferMetadata;
        usedBytes: number;
    } {
        const lastIndex = storeMeta.buffers.length - 1;
        const lastBufferMeta = storeMeta.buffers[lastIndex];
        const gpuBuffer = lastBufferMeta.gpuBuffer!;
        const usedBytes = (gpuBuffer as any)._usedBytes || 0;
        return { lastBufferMeta, usedBytes };
    }

    /**
     * Attempts to use available space in the last buffer for the requested size.
     * If alignment causes an overflow, a new buffer is allocated instead.
     *
     * @private
     * @param {StoreMetadata} storeMeta - The store metadata containing buffer info.
     * @param {BufferMetadata} lastBufferMeta - Metadata for the last GPU buffer in the store.
     * @param {number} usedBytes - The currently used bytes in that buffer.
     * @param {number} size - The size (in bytes) needed.
     * @returns {{ gpuBuffer: GPUBuffer; bufferIndex: number; offset: number }}
     *   The buffer, its index, and the aligned offset at which new data should be written.
     */
    private useSpaceInLastBuffer(
        storeMeta: StoreMetadata,
        lastBufferMeta: BufferMetadata,
        usedBytes: number,
        size: number
    ): {
        gpuBuffer: GPUBuffer;
        bufferIndex: number;
        offset: number;
    } {
        const gpuBuffer = lastBufferMeta.gpuBuffer!;
        const ALIGNMENT = 256;
        // Align the offset to the nearest multiple of ALIGNMENT (256)
        const alignedOffset = this.roundUp(usedBytes, ALIGNMENT);
        // Check if alignedOffset + size exceeds the usable buffer size
        if (alignedOffset + size > gpuBuffer.size) {
            return this.allocateNewBufferChunk(storeMeta, size);
        }
        (gpuBuffer as any)._usedBytes = alignedOffset + size;
        lastBufferMeta.rowCount += 1;
        const bufferIndex = lastBufferMeta.bufferIndex;
        return {
            gpuBuffer,
            bufferIndex,
            offset: alignedOffset
        };
    }

    /**
     * Allocates a new GPU buffer chunk if the last one does not have enough space.
     * Dynamically upsizes the buffer if the needed size is bigger than storeMeta.bufferSize.
     *
     * @private
     * @param {StoreMetadata} storeMeta - The store metadata where the buffer is being created.
     * @param {number} size - The number of bytes needed.
     * @returns {{ gpuBuffer: GPUBuffer; bufferIndex: number; offset: number }}
     *   An object containing the new GPU buffer, the assigned buffer index, 
     *   and the offset (always 0 for new buffers).
     */
    private allocateNewBufferChunk(
        storeMeta: StoreMetadata,
        size: number
    ): {
        gpuBuffer: GPUBuffer;
        bufferIndex: number;
        offset: number;
    } {
        const newBufferIndex = storeMeta.buffers.length;
        // Dynamically pick a capacity that can hold 'size'
        const neededCapacity = Math.max(storeMeta.bufferSize, this.roundUp(size, 256));
        const newGpuBuffer = this.device.createBuffer({
            size: neededCapacity,
            usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
            mappedAtCreation: false
        });

        (newGpuBuffer as any)._usedBytes = size;
        storeMeta.buffers.push({
            bufferIndex: newBufferIndex,
            startRow: -1,
            rowCount: 1,
            gpuBuffer: newGpuBuffer
        });

        return {
            gpuBuffer: newGpuBuffer,
            bufferIndex: newBufferIndex,
            offset: 0
        };
    }

    /**
     * If the new data is larger than the existing row’s allocated space, this method
     * deactivates the old row and allocates a new buffer space. Otherwise, it
     * simply updates the length field for in-place overwriting.
     *
     * @private
     * @param {StoreMetadata} storeMeta - The metadata of the store.
     * @param {RowMetadata} oldRowMeta - The existing row metadata.
     * @param {ArrayBuffer} arrayBuffer - The new data to overwrite or reallocate.
     * @param {Map<string, number>} keyMap - A mapping of keys to row indices.
     * @param {string} key - The unique key identifying the row being overwritten.
     * @returns {Promise<RowMetadata>} A promise that resolves with the (possibly new) row metadata.
     */
    private async updateRowOnOverwrite(
        storeMeta: StoreMetadata,
        oldRowMeta: RowMetadata,
        arrayBuffer: ArrayBuffer,
        keyMap: Map<string, number>,
        key: string
    ): Promise<RowMetadata> {
        // If the new data fits in the old space:
        if (arrayBuffer.byteLength <= oldRowMeta.length) {
            // Overwrite in-place later during flushWrites.
            if (arrayBuffer.byteLength < oldRowMeta.length) {
                oldRowMeta.length = arrayBuffer.byteLength;
            }
            return oldRowMeta;
        } else {
            // Mark old row inactive
            oldRowMeta.flags = (oldRowMeta.flags ?? 0) | 0x1;

            // Find new space for the bigger data
            const { bufferIndex, offset } = this.findOrCreateSpace(storeMeta, arrayBuffer.byteLength);

            const newRowId = storeMeta.rows.length + 1;
            const newRowMeta: RowMetadata = {
                rowId: newRowId,
                bufferIndex,
                offset,
                length: arrayBuffer.byteLength
            };
            storeMeta.rows.push(newRowMeta);
            keyMap.set(key, newRowId);

            return newRowMeta;
        }
    }

    /**
     * Deserializes raw data from a GPU buffer into its original form (JSON, TypedArray, or ArrayBuffer).
     *
     * This method ensures that if the dataType is "TypedArray", we correctly
     * construct the typed array from the subarray’s offset and length rather
     * than using the entire underlying buffer.
     *
     * @private
     * @param {StoreMetadata} storeMeta - The store metadata (contains dataType, typedArrayType, etc.).
     * @param {Uint8Array} copiedData - A Uint8Array representing the raw copied bytes from the GPU.
     * @returns {any} The deserialized value, whose type depends on `storeMeta.dataType`.
     * @throws {Error} If the store's dataType or typedArrayType is invalid.
     */
    private deserializeData(storeMeta: StoreMetadata, copiedData: Uint8Array): any {
        switch (storeMeta.dataType) {
            case "JSON": {
                const jsonString = new TextDecoder().decode(copiedData);
                return JSON.parse(jsonString.trim());
            }

            case "TypedArray": {
                if (!storeMeta.typedArrayType) {
                    throw new Error(
                        `typedArrayType is missing for store with dataType "TypedArray".`
                    );
                }
                const TypedArrayCtor = (globalThis as any)[storeMeta.typedArrayType];
                if (typeof TypedArrayCtor !== "function") {
                    throw new Error(
                        `Invalid typedArrayType "${storeMeta.typedArrayType}".`
                    );
                }

                // Ensure we use the subarray's offset and length in elements
                const bytesPerElement = this.getBytesPerElement(storeMeta.typedArrayType);
                return new TypedArrayCtor(
                    copiedData.buffer,
                    copiedData.byteOffset,
                    copiedData.byteLength / bytesPerElement
                );
            }

            case "ArrayBuffer": {
                return copiedData.buffer;
            }

            default:
                throw new Error(`Unknown dataType "${storeMeta.dataType}".`);
        }
    }

    /**
     * Determines the number of bytes per element for a given typed array type name.
     *
     * @private
     * @param {string} typedArrayType - The name of the typed array constructor (e.g. "Float32Array").
     * @returns {number} The number of bytes each element in the typed array occupies.
     * @throws {Error} If the typed array type is unsupported.
     */
    private getBytesPerElement(typedArrayType: string): number {
        switch (typedArrayType) {
            case "Float32Array":
            case "Int32Array":
            case "Uint32Array":
                return 4;
            case "Float64Array":
                return 8;
            case "Uint8Array":
                return 1;
            default:
                throw new Error(`Unsupported typedArrayType: ${typedArrayType}`);
        }
    }

    /**
     * Resets the timer that triggers an automatic flush of pending writes.
     * If the timer is already running, it is cleared and restarted.
     * Once the timer fires, this method:
     *  1) flushes all pending writes,
     *  2) rebuilds all dirty sorts by calling `rebuildAllDirtySorts`,
     *  3) resolves the internal `readyResolver` if present,
     *  4) sets `isReady` to `true`.
     *
     * @private
     * @returns {void}
     */
    private resetFlushTimer(): void {
        if (this.flushTimer !== null) {
            clearTimeout(this.flushTimer);
        }
        this.flushTimer = window.setTimeout(async () => {
            try {
                await this.flushWrites();
            } catch (error) {
                console.error('Error during timed flush operation:', error);
            } finally {
                this.flushTimer = null;

                if (this.readyResolver) {
                    this.readyResolver();
                    this.readyResolver = null;
                    this.waitUntilReadyPromise = null;
                }

                this.isReady = true;
            }
        }, 250);
    }

    /**
     * Logs performance metrics for debugging and analysis purposes.
     *
     * @private
     * @param {InitialMetrics} initialMetrics - Overall metrics (e.g., flushWrites time, metadata retrieval time).
     * @param {PerKeyMetrics} perKeyMetrics - Detailed metrics for per-key operations (e.g. copyBuffer, deserialize, etc.).
     * @returns {void}
     */
    private logPerformance(initialMetrics: InitialMetrics, perKeyMetrics: PerKeyMetrics) {
        console.info("** Performance Metrics for getMultiple **", {
            flushWrites: initialMetrics.flushWrites.toFixed(2) + "ms",
            metadataRetrieval: initialMetrics.metadataRetrieval.toFixed(2) + "ms",
            perKeyMetrics: {
                findMetadata: perKeyMetrics.findMetadata.toFixed(2) + "ms total",
                createBuffer: perKeyMetrics.createBuffer.toFixed(2) + "ms total",
                copyBuffer: perKeyMetrics.copyBuffer.toFixed(2) + "ms total",
                mapBuffer: perKeyMetrics.mapBuffer.toFixed(2) + "ms total",
                mapBufferSubsections: {
                    mapAsync: perKeyMetrics.mapBufferSubsections.mapAsync.toFixed(2) + "ms total",
                    getMappedRange: perKeyMetrics.mapBufferSubsections.getMappedRange.toFixed(2) + "ms total",
                    copyToUint8Array: perKeyMetrics.mapBufferSubsections.copyToUint8Array.toFixed(2) + "ms total",
                    unmap: perKeyMetrics.mapBufferSubsections.unmap.toFixed(2) + "ms total",
                },
                deserialize: perKeyMetrics.deserialize.toFixed(2) + "ms total",
            },
        });
    }

    /**
     * Flushes all pending writes to the GPU and then returns the store metadata and key map.
     *
     * @private
     * @param {string} storeName - The name of the store.
     * @returns {Promise<{ storeMeta: StoreMetadata; keyMap: Map<string, number> }>}
     *    An object containing the store's metadata and key map.
     */
    private async flushAndGetMetadata(storeName: string): Promise<{
        storeMeta: StoreMetadata;
        keyMap: Map<string, any>;
        metrics: InitialMetrics;
    }> {
        const performanceMetrics: InitialMetrics = {
            flushWrites: 0,
            metadataRetrieval: 0,
        };

        const flushStart = performance.now();
        await this.flushWrites();
        performanceMetrics.flushWrites = performance.now() - flushStart;

        const metadataStart = performance.now();
        const storeMeta = this.getStoreMetadata(storeName) as StoreMetadata;
        const keyMap = this.getKeyMap(storeName) as Map<string, any>;
        performanceMetrics.metadataRetrieval = performance.now() - metadataStart;

        return { storeMeta, keyMap, metrics: performanceMetrics };
    }

    /**
     * Converts a SQL Server–style LIKE pattern into a JavaScript regular expression.
     * - `%` becomes `.*`
     * - `_` becomes `.`
     * - Special regex characters are escaped except for bracket expressions.
     *
     * @private
     * @param {string} pattern - The SQL-style LIKE pattern.
     * @returns {RegExp} A JavaScript RegExp object equivalent to the LIKE pattern.
     */
    private likeToRegex(pattern: string): RegExp {
        let regexPattern = pattern
            .replace(/\\/g, "\\\\")
            .replace(/[.+^${}()|[\]\\]/g, (char) => `\\${char}`)
            .replace(/%/g, ".*")
            .replace(/_/g, ".");

        // revert bracket expressions
        regexPattern = regexPattern.replace(/\\\[(.*?)]/g, "[$1]");

        return new RegExp(`^${regexPattern}$`, "u");
    }

    /**
     * Expands a single SQL-style wildcard key (possibly containing `%`, `_`, `[`, etc.)
     * into all matching keys from the given key map.
     *
     * @private
     * @param {string} key - The (potentially) wildcard pattern.
     * @param {Map<string, any>} keyMap - A map of all available keys in the store.
     * @returns {string[]} An array of matched keys.
     */
    private expandWildcard(key: string, keyMap: Map<string, any>): string[] {
        if (!/[%_\[\]]/.test(key)) {
            return [key];
        }
        const regex = this.likeToRegex(key);
        const allStoreKeys = Array.from(keyMap.keys());
        return allStoreKeys.filter((k) => regex.test(k));
    }

    /**
     * Applies `expandWildcard` to each key in the given array, then flattens
     * the results into a single array of resolved keys.
     *
     * @private
     * @param {string[]} keys - An array of (possibly) wildcard patterns.
     * @param {Map<string, any>} keyMap - A map of all available keys in the store.
     * @returns {string[]} A flattened array of all expanded keys.
     */
    private expandAllWildcards(keys: string[], keyMap: Map<string, any>): string[] {
        return keys.flatMap((key) => this.expandWildcard(key, keyMap));
    }

    /**
     * Reads row data for a list of keys in two steps:
     *  1) Copy from the store's GPU buffers into a single "big read buffer" (`bigReadBuffer`).
     *  2) Copy from `bigReadBuffer` into a staging buffer that is mapped to CPU memory for reading.
     *
     * @private
     * @param {string} storeName - The name of the store from which to read.
     * @param {StoreMetadata} storeMeta - The metadata of the store being read.
     * @param {Map<string, any>} keyMap - The key-to-row-index map for the store.
     * @param {string[]} keys - The list of keys to read.
     * @returns {Promise<{ results: (any | null)[]; perKeyMetrics: PerKeyMetrics }>}
     *   A promise resolving to an object containing:
     *   - `results`: an array of deserialized values (or null if not found).
     *   - `perKeyMetrics`: timing info for various stages of the read operation.
     */
    private async readAllRows(
        storeName: string,
        storeMeta: StoreMetadata,
        keyMap: Map<string, any>,
        keys: string[]
    ): Promise<{ results: (any | null)[]; perKeyMetrics: PerKeyMetrics }> {
        // Prepare the results array (initialized to null)
        const results = new Array<(any | null)>(keys.length).fill(null);

        // Metrics structure
        const perKeyMetrics: PerKeyMetrics = this.initializeMetrics();

        // Collect row metadata
        const { rowInfos, totalBytes } = this.collectRowInfos(
            keyMap,
            storeMeta,
            keys,
            results,
            perKeyMetrics
        );

        // Early exit if nothing to read
        if (rowInfos.length === 0) {
            return { results, perKeyMetrics };
        }

        // CHANGED: create "big read buffer" with COPY_SRC | COPY_DST (not MAP_READ).
        const bigReadBuffer = this.createBigReadBuffer(totalBytes, perKeyMetrics);

        // Step 1) copy data from each row’s GPU buffer into bigReadBuffer
        this.copyRowsIntoBigBuffer(rowInfos, storeMeta, bigReadBuffer, perKeyMetrics);

        // Step 2) copy from bigReadBuffer into a staging buffer that we map
        const bigCopiedData = await this.copyFromBigBufferToStaging(bigReadBuffer, totalBytes, perKeyMetrics);

        // Deserialize each row
        this.deserializeRows(rowInfos, storeMeta, bigCopiedData, results, perKeyMetrics);

        // Cleanup the bigReadBuffer
        bigReadBuffer.destroy();

        return { results, perKeyMetrics };
    }

    /**
     * Gathers metadata (rowInfos) for each key to be read. Determines offsets and total
     * byte length required to hold all requested rows in a single buffer.
     *
     * @private
     * @param {Map<string, any>} keyMap - The key-to-row map for the store.
     * @param {StoreMetadata} storeMeta - The store metadata containing row info.
     * @param {string[]} keys - The list of keys to read.
     * @param {(any | null)[]} results - An array to store the resulting deserialized data.
     * @param {PerKeyMetrics} perKeyMetrics - Metrics used for performance measurement.
     * @returns {{ rowInfos: RowInfo[], totalBytes: number }} 
     *   An object containing:
     *   - `rowInfos`: a list of row metadata including offsets and lengths.
     *   - `totalBytes`: the total number of bytes needed for all rows.
     */
    private collectRowInfos(
        keyMap: Map<string, any>,
        storeMeta: StoreMetadata,
        keys: string[],
        results: (any | null)[],
        perKeyMetrics: PerKeyMetrics
    ): { rowInfos: RowInfo[]; totalBytes: number } {
        const findMetadataStart = performance.now();

        const rowInfos: RowInfo[] = [];
        let totalBytes = 0;

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const rowMetadata = this.findActiveRowMetadata(keyMap, key, storeMeta.rows);
            if (!rowMetadata) {
                continue;
            }
            rowInfos.push({
                rowMetadata,
                rowIndex: i,
                offsetInFinalBuffer: totalBytes,
                length: rowMetadata.length,
            });
            totalBytes += rowMetadata.length;
        }

        perKeyMetrics.findMetadata = performance.now() - findMetadataStart;

        return { rowInfos, totalBytes };
    }

    /**
     * Creates a GPU buffer (bigReadBuffer) large enough to hold a specified total size,
     * used to consolidate row data before mapping.
     *
     * @private
     * @param {number} totalBytes - The total number of bytes needed.
     * @param {PerKeyMetrics} perKeyMetrics - Metrics used for performance measurement.
     * @returns {GPUBuffer} The newly created GPU buffer.
     */
    private createBigReadBuffer(
        totalBytes: number,
        perKeyMetrics: PerKeyMetrics
    ): GPUBuffer {
        const createBufferStart = performance.now();

        const bigReadBuffer = this.device.createBuffer({
            size: totalBytes,
            usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST, // CHANGED
        });

        perKeyMetrics.createBuffer = performance.now() - createBufferStart;
        return bigReadBuffer;
    }

    /**
     * Copies data for each row from its source GPU buffer to the bigReadBuffer.
     * This consolidates multiple row reads into a single buffer for more efficient mapping.
     *
     * @private
     * @param {RowInfo[]} rowInfos - An array of row metadata (source offset, length, etc.).
     * @param {StoreMetadata} storeMeta - The store metadata containing all buffers.
     * @param {GPUBuffer} bigReadBuffer - The destination buffer into which all rows are copied.
     * @param {PerKeyMetrics} perKeyMetrics - Metrics used for performance measurement.
     * @returns {void}
     */
    private copyRowsIntoBigBuffer(
        rowInfos: RowInfo[],
        storeMeta: StoreMetadata,
        bigReadBuffer: GPUBuffer,
        perKeyMetrics: PerKeyMetrics
    ): void {
        const copyBufferStart = performance.now();

        const commandEncoder = this.device.createCommandEncoder();

        for (const rowInfo of rowInfos) {
            const srcBuffer = this.getBufferByIndex(storeMeta, rowInfo.rowMetadata.bufferIndex);
            commandEncoder.copyBufferToBuffer(
                srcBuffer,
                rowInfo.rowMetadata.offset,
                bigReadBuffer,
                rowInfo.offsetInFinalBuffer,
                rowInfo.length
            );
        }

        this.device.queue.submit([commandEncoder.finish()]);

        perKeyMetrics.copyBuffer = performance.now() - copyBufferStart;
    }

    /**
     * Performs a copy from the bigReadBuffer into a staging buffer (with MAP_READ usage),
     * then maps the staging buffer for CPU access and returns the combined byte data.
     *
     * @private
     * @param {GPUBuffer} bigReadBuffer - The consolidated read buffer.
     * @param {number} totalBytes - The total number of bytes to copy.
     * @param {PerKeyMetrics} perKeyMetrics - Metrics used for performance measurement.
     * @returns {Promise<Uint8Array>} A promise that resolves to a Uint8Array containing all copied data.
     */
    private async copyFromBigBufferToStaging(
        bigReadBuffer: GPUBuffer,
        totalBytes: number,
        perKeyMetrics: PerKeyMetrics
    ): Promise<Uint8Array> {
        const mapBufferStart = performance.now();

        // 1) Create a staging buffer with COPY_DST | MAP_READ
        const stagingBuffer = this.device.createBuffer({
            size: totalBytes,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
        });

        // 2) Copy from bigReadBuffer → stagingBuffer
        const commandEncoder = this.device.createCommandEncoder();
        commandEncoder.copyBufferToBuffer(bigReadBuffer, 0, stagingBuffer, 0, totalBytes);
        this.device.queue.submit([commandEncoder.finish()]);

        // Wait for GPU to finish so we can map the staging buffer
        await this.device.queue.onSubmittedWorkDone();

        // Now map the staging buffer for reading
        const mapAsyncStart = performance.now();
        await stagingBuffer.mapAsync(GPUMapMode.READ);
        perKeyMetrics.mapBufferSubsections.mapAsync = performance.now() - mapAsyncStart;

        // getMappedRange
        const getMappedRangeStart = performance.now();
        const fullMappedRange = stagingBuffer.getMappedRange();
        perKeyMetrics.mapBufferSubsections.getMappedRange = performance.now() - getMappedRangeStart;

        // copyToUint8Array
        const copyToUint8ArrayStart = performance.now();
        const bigCopiedData = new Uint8Array(fullMappedRange.slice(0));
        perKeyMetrics.mapBufferSubsections.copyToUint8Array = performance.now() - copyToUint8ArrayStart;

        // unmap
        const unmapStart = performance.now();
        stagingBuffer.unmap();
        perKeyMetrics.mapBufferSubsections.unmap = performance.now() - unmapStart;

        stagingBuffer.destroy(); // We no longer need it

        perKeyMetrics.mapBuffer = performance.now() - mapBufferStart;

        return bigCopiedData;
    }

    /**
     * Deserializes each row from the combined `bigCopiedData` buffer into its original form,
     * placing the result into the corresponding index of the `results` array.
     *
     * @private
     * @param {RowInfo[]} rowInfos - An array of row metadata (offsets, lengths, etc.).
     * @param {StoreMetadata} storeMeta - The store metadata (data types, etc.).
     * @param {Uint8Array} bigCopiedData - The combined data holding all row bytes.
     * @param {(any | null)[]} results - The result array to store deserialized values.
     * @param {PerKeyMetrics} perKeyMetrics - Metrics used for performance measurement.
     * @returns {void}
     */
    private deserializeRows(
        rowInfos: RowInfo[],
        storeMeta: StoreMetadata,
        bigCopiedData: Uint8Array,
        results: (any | null)[],
        perKeyMetrics: PerKeyMetrics
    ): void {
        const deserializeStart = performance.now();

        for (const rowInfo of rowInfos) {
            const rowSlice = bigCopiedData.subarray(
                rowInfo.offsetInFinalBuffer,
                rowInfo.offsetInFinalBuffer + rowInfo.length
            );

            // Convert bytes to an object using `deserializeData`
            results[rowInfo.rowIndex] = this.deserializeData(storeMeta, rowSlice);
        }

        perKeyMetrics.deserialize = performance.now() - deserializeStart;
    }

    /**
     * Creates and returns a fresh PerKeyMetrics object with all timing values initialized to 0.
     *
     * @private
     * @returns {PerKeyMetrics} A fresh metrics object.
     */
    private initializeMetrics(): PerKeyMetrics {
        return {
            findMetadata: 0,
            createBuffer: 0,
            copyBuffer: 0,
            mapBuffer: 0,
            deserialize: 0,
            mapBufferSubsections: {
                mapAsync: 0,
                getMappedRange: 0,
                copyToUint8Array: 0,
                unmap: 0,
            },
        };
    }

    /**
     * Waits until the VideoDB is ready, i.e., all pending operations have settled
     * and the internal ready state is resolved.
     *
     * @private
     * @returns {Promise<void>} A promise that resolves once VideoDB is ready.
     */
    public waitUntilReady(): Promise<void> {
        // If already ready, just return immediately
        if (this.isReady) return Promise.resolve();

        // If a wait promise is *already* in progress, return the same one
        if (this.waitUntilReadyPromise) return this.waitUntilReadyPromise;

        // Otherwise, create a fresh promise and store its resolver
        this.waitUntilReadyPromise = new Promise<void>((resolve) => {
            this.readyResolver = resolve;
        });

        return this.waitUntilReadyPromise;
    }

    /**
     * Reads records for a given store using skip/take pagination.
     *
     * @private
     * @param {string} storeName - The name of the store.
     * @param {string[]} allKeys - An array of all keys in the store.
     * @param {number} skip - The number of records to skip.
     * @param {number} take - The number of records to return after skipping.
     * @returns {Promise<{ results: (any | null)[] }>}
     *    A promise resolving with an object that contains a `results` array.
     */
    private async readRowsWithPagination(
        storeName: string,
        allKeys: any,
        skip: number,
        take: number
    ): Promise<{ results: (any | null)[]; perKeyMetrics: any }> {
        // Slice the keys array to get the paginated keys
        const paginatedKeys = allKeys.slice(skip, skip + take);

        // Use getMultipleByKeys to fetch the data
        const { results, perKeyMetrics } = await this.getMultipleByKeys(storeName, paginatedKeys);

        return { results, perKeyMetrics };
    }

    /**
     * Retrieves multiple records by an array of keys from the specified store.
     * Used internally by the overloaded `getMultiple` method.
     *
     * @private
     * @param {string} storeName - The name of the store.
     * @param {string[]} keys - The array of keys to fetch.
     * @returns {Promise<{ results: (any | null)[] }>} 
     *    A promise resolving with an object that contains a `results` array.
     */
    private async getMultipleByKeys(storeName: string, keys: string[]): Promise<{ results: (any | null)[]; perKeyMetrics: any }> {
        // Flush & retrieve store metadata
        const { storeMeta, keyMap, metrics } = await this.flushAndGetMetadata(storeName);

        // Expand any wildcard patterns
        const expandedKeys = this.expandAllWildcards(keys, keyMap);

        // Read all rows based on expanded keys
        const { results, perKeyMetrics } = await this.readAllRows(
            storeName,
            storeMeta,
            keyMap,
            expandedKeys
        );

        // Log or accumulate performance
        // this.logPerformance(metrics, perKeyMetrics);

        return { results, perKeyMetrics };
    }

    /**
     * Handles the main store write (row metadata, buffer, etc.).
     * Re-used by both `add` and `put`.
     *
     * @private
     * @param {StoreMetadata} storeMeta - The metadata of the store to write into.
     * @param {string} key - The unique key for the row.
     * @param {any} value - The data to serialize and write.
     * @param {"add"|"put"} operationType - Whether this is an "add" or a "put" operation.
     * @returns {Promise<void>} Resolves when the metadata has been updated and the write is queued.
     */
    private async writeRecordToStore(
        storeMeta: StoreMetadata,
        key: string,
        value: any,
        operationType: "add" | "put"
    ): Promise<void> {
        // Look up the key-to-rowId mapping (assumed to be a Map)
        const keyMap = this.storeKeyMap.get(storeMeta.storeName)!;

        // Serialize and pad the value as appropriate.
        const arrayBuffer = this.serializeValueForStore(storeMeta, value);

        // Find (or create) the metadata for the row.
        const rowMetadata = await this.findOrCreateRowMetadata(
            storeMeta,
            keyMap,
            key,
            arrayBuffer,
            operationType
        );

        // Get the GPU buffer (by buffer index).
        const gpuBuffer = this.getBufferByIndex(storeMeta, rowMetadata.bufferIndex);

        // Queue the write (this object literal could later be reused from a pool if needed)
        this.pendingWrites.push({
            storeMeta,
            rowMetadata,
            arrayBuffer,
            gpuBuffer,
            operationType,
        });
    }

    /**
     * Finds existing row metadata for a given key or creates a new row entry if one does not exist.
     *
     * @private
     * @param {StoreMetadata} storeMeta - The metadata of the store.
     * @param {Map<string, number>} keyMap - A mapping of keys to row indices.
     * @param {string} key - The unique key identifying the row.
     * @param {ArrayBuffer} arrayBuffer - The data to be associated with this row.
     * @param {"add"|"put"} operationType - The operation type (whether we're adding or putting).
     * @returns {Promise<RowMetadata>} A promise that resolves with the row metadata.
     */
    private async findOrCreateRowMetadata(
        storeMeta: StoreMetadata,
        keyMap: Map<string, number>,
        key: string,
        arrayBuffer: ArrayBuffer,
        mode: "add" | "put"
    ): Promise<RowMetadata> {
        // Instead of using .find, assume that if keyMap.get(key) returns a rowId,
        // then the metadata is stored at index rowId - 1.
        const rowId = keyMap.get(key);
        let rowMetadata: RowMetadata | null =
            rowId == null ? null : (storeMeta.rows[rowId - 1] ?? null);

        // If in "add" mode and a non-flagged (active) row exists, then error.
        if (
            mode === "add" &&
            rowMetadata &&
            !((rowMetadata.flags ?? 0) & 0x1)
        ) {
            throw new Error(
                `Record with key "${key}" already exists in store and overwriting is not allowed (add mode).`
            );
        }

        // Allocate space in a GPU buffer (this call is assumed to be fast)
        const { bufferIndex, offset } = this.findOrCreateSpace(
            storeMeta,
            arrayBuffer.byteLength
        );

        // If there is no row metadata or the row is “inactive” (flag set), create a new entry.
        if (!rowMetadata || ((rowMetadata.flags ?? 0) & 0x1)) {
            const newRowId = storeMeta.rows.length + 1;
            rowMetadata = {
                rowId: newRowId,
                bufferIndex,
                offset,
                length: arrayBuffer.byteLength,
            };
            storeMeta.rows.push(rowMetadata);
            keyMap.set(key, newRowId);
        }
        // Otherwise, in "put" mode, update the existing row.
        else if (mode === "put") {
            rowMetadata = await this.updateRowOnOverwrite(
                storeMeta,
                rowMetadata,
                arrayBuffer,
                keyMap,
                key
            );
        }

        return rowMetadata;
    }

    /**
     * Retrieves the GPU buffer instance corresponding to a specific buffer index.
     *
     * @private
     * @param {StoreMetadata} storeMeta - The metadata of the store.
     * @param {number} bufferIndex - The index of the buffer to retrieve.
     * @returns {GPUBuffer} The GPU buffer at the specified index.
     */
    private getBufferByIndex(
        storeMeta: StoreMetadata,
        bufferIndex: number
    ): GPUBuffer {
        const bufMeta = storeMeta.buffers[bufferIndex];
        if (!bufMeta || !bufMeta.gpuBuffer) {
            throw new Error(`Buffer index ${bufferIndex} not found or uninitialized.`);
        }
        return bufMeta.gpuBuffer;
    }

    /**
     * Serializes a value (JSON, TypedArray, ArrayBuffer, etc.) into an ArrayBuffer
     * suitable for writing to the GPU buffer.
     *
     * @private
     * @param {StoreMetadata} storeMeta - The metadata of the store being written to.
     * @param {any} value - The original value to serialize.
     * @returns {ArrayBuffer} The serialized value as an ArrayBuffer.
     */
    private serializeValueForStore(
        storeMeta: StoreMetadata,
        value: any
    ): ArrayBuffer {
        switch (storeMeta.dataType) {
            case "JSON": {
                // Stringify the value.
                const jsonString = JSON.stringify(value);
                // Encode once using the cached encoder.
                const encoded = this.textEncoder.encode(jsonString);
                // Use bitwise & 3 to compute the remainder.
                const mod = encoded.byteLength & 3;
                if (mod === 0) {
                    return encoded.buffer as ArrayBuffer;
                }
                const needed = 4 - mod;
                // Allocate a new Uint8Array with extra room for padding.
                const padded = new Uint8Array(encoded.byteLength + needed);
                padded.set(encoded);
                // Pad with ASCII space (0x20) so that the encoded JSON string’s length becomes a multiple of 4.
                padded.fill(0x20, encoded.byteLength);
                return padded.buffer;
            }

            case "TypedArray": {
                if (!storeMeta.typedArrayType) {
                    throw new Error(
                        `typedArrayType is missing for store "${storeMeta.storeName}".`
                    );
                }
                // Use a cached constructor rather than globalThis lookup.
                const TypedArrayConstructor = VideoDB.typedArrayConstructors[storeMeta.typedArrayType];

                if (!TypedArrayConstructor) {
                    throw new Error(
                        `Unknown typedArrayType "${storeMeta.typedArrayType}" for store "${storeMeta.storeName}".`
                    );
                }
                if (!(value instanceof TypedArrayConstructor)) {
                    throw new Error(
                        `Value must be an instance of ${storeMeta.typedArrayType} for store "${storeMeta.storeName}".`
                    );
                }
                const ab = (value as { buffer: ArrayBuffer }).buffer;
                return this.padTo4Bytes(ab);
            }

            case "ArrayBuffer": {
                if (!(value instanceof ArrayBuffer)) {
                    throw new Error(
                        `Value must be an ArrayBuffer for store "${storeMeta.storeName}".`
                    );
                }
                return this.padTo4Bytes(value);
            }

            default:
                throw new Error(`Unknown dataType "${storeMeta.dataType}".`);
        }
    }

    /**
     * Ensures the length of the UTF-8 representation of `jsonString` is a multiple of 4
     * by appending spaces as needed.
     *
     * @param {string} jsonString - The original JSON string to pad.
     * @returns {string} The padded JSON string, whose UTF-8 length is a multiple of 4.
     */
    private padTo4Bytes(ab: ArrayBuffer): ArrayBuffer {
        // Use bitwise math rather than modulo (both are fast, but bitwise can be slightly faster)
        const mod = ab.byteLength & 3;
        if (mod === 0) {
            return ab;
        }
        const needed = 4 - mod;
        const padded = new Uint8Array(ab.byteLength + needed);
        padded.set(new Uint8Array(ab), 0);
        return padded.buffer;
    }

    /**
     * Rounds the given value up to the nearest multiple of `align`.
     *
     * @param {number} value - The original value.
     * @param {number} align - The alignment boundary.
     * @returns {number} The smallest integer ≥ `value` that is a multiple of `align`.
     */
    private roundUp(value: number, align: number): number {
        return Math.ceil(value / align) * align;
    }
}