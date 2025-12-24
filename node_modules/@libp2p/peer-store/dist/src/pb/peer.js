/* eslint-disable complexity */
import { decodeMessage, encodeMessage, MaxLengthError, MaxSizeError, message } from 'protons-runtime';
import { alloc as uint8ArrayAlloc } from 'uint8arrays/alloc';
export var Peer;
(function (Peer) {
    let Peer$metadataEntry;
    (function (Peer$metadataEntry) {
        let _codec;
        Peer$metadataEntry.codec = () => {
            if (_codec == null) {
                _codec = message((obj, w, opts = {}) => {
                    if (opts.lengthDelimited !== false) {
                        w.fork();
                    }
                    if ((obj.key != null && obj.key !== '')) {
                        w.uint32(10);
                        w.string(obj.key);
                    }
                    if ((obj.value != null && obj.value.byteLength > 0)) {
                        w.uint32(18);
                        w.bytes(obj.value);
                    }
                    if (opts.lengthDelimited !== false) {
                        w.ldelim();
                    }
                }, (reader, length, opts = {}) => {
                    const obj = {
                        key: '',
                        value: uint8ArrayAlloc(0)
                    };
                    const end = length == null ? reader.len : reader.pos + length;
                    while (reader.pos < end) {
                        const tag = reader.uint32();
                        switch (tag >>> 3) {
                            case 1: {
                                obj.key = reader.string();
                                break;
                            }
                            case 2: {
                                obj.value = reader.bytes();
                                break;
                            }
                            default: {
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                    }
                    return obj;
                });
            }
            return _codec;
        };
        Peer$metadataEntry.encode = (obj) => {
            return encodeMessage(obj, Peer$metadataEntry.codec());
        };
        Peer$metadataEntry.decode = (buf, opts) => {
            return decodeMessage(buf, Peer$metadataEntry.codec(), opts);
        };
    })(Peer$metadataEntry = Peer.Peer$metadataEntry || (Peer.Peer$metadataEntry = {}));
    let Peer$tagsEntry;
    (function (Peer$tagsEntry) {
        let _codec;
        Peer$tagsEntry.codec = () => {
            if (_codec == null) {
                _codec = message((obj, w, opts = {}) => {
                    if (opts.lengthDelimited !== false) {
                        w.fork();
                    }
                    if ((obj.key != null && obj.key !== '')) {
                        w.uint32(10);
                        w.string(obj.key);
                    }
                    if (obj.value != null) {
                        w.uint32(18);
                        Tag.codec().encode(obj.value, w);
                    }
                    if (opts.lengthDelimited !== false) {
                        w.ldelim();
                    }
                }, (reader, length, opts = {}) => {
                    const obj = {
                        key: ''
                    };
                    const end = length == null ? reader.len : reader.pos + length;
                    while (reader.pos < end) {
                        const tag = reader.uint32();
                        switch (tag >>> 3) {
                            case 1: {
                                obj.key = reader.string();
                                break;
                            }
                            case 2: {
                                obj.value = Tag.codec().decode(reader, reader.uint32(), {
                                    limits: opts.limits?.value
                                });
                                break;
                            }
                            default: {
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                    }
                    return obj;
                });
            }
            return _codec;
        };
        Peer$tagsEntry.encode = (obj) => {
            return encodeMessage(obj, Peer$tagsEntry.codec());
        };
        Peer$tagsEntry.decode = (buf, opts) => {
            return decodeMessage(buf, Peer$tagsEntry.codec(), opts);
        };
    })(Peer$tagsEntry = Peer.Peer$tagsEntry || (Peer.Peer$tagsEntry = {}));
    let _codec;
    Peer.codec = () => {
        if (_codec == null) {
            _codec = message((obj, w, opts = {}) => {
                if (opts.lengthDelimited !== false) {
                    w.fork();
                }
                if (obj.addresses != null) {
                    for (const value of obj.addresses) {
                        w.uint32(10);
                        Address.codec().encode(value, w);
                    }
                }
                if (obj.protocols != null) {
                    for (const value of obj.protocols) {
                        w.uint32(18);
                        w.string(value);
                    }
                }
                if (obj.publicKey != null) {
                    w.uint32(34);
                    w.bytes(obj.publicKey);
                }
                if (obj.peerRecordEnvelope != null) {
                    w.uint32(42);
                    w.bytes(obj.peerRecordEnvelope);
                }
                if (obj.metadata != null && obj.metadata.size !== 0) {
                    for (const [key, value] of obj.metadata.entries()) {
                        w.uint32(50);
                        Peer.Peer$metadataEntry.codec().encode({ key, value }, w);
                    }
                }
                if (obj.tags != null && obj.tags.size !== 0) {
                    for (const [key, value] of obj.tags.entries()) {
                        w.uint32(58);
                        Peer.Peer$tagsEntry.codec().encode({ key, value }, w);
                    }
                }
                if (obj.updated != null) {
                    w.uint32(64);
                    w.uint64Number(obj.updated);
                }
                if (opts.lengthDelimited !== false) {
                    w.ldelim();
                }
            }, (reader, length, opts = {}) => {
                const obj = {
                    addresses: [],
                    protocols: [],
                    metadata: new Map(),
                    tags: new Map()
                };
                const end = length == null ? reader.len : reader.pos + length;
                while (reader.pos < end) {
                    const tag = reader.uint32();
                    switch (tag >>> 3) {
                        case 1: {
                            if (opts.limits?.addresses != null && obj.addresses.length === opts.limits.addresses) {
                                throw new MaxLengthError('Decode error - map field "addresses" had too many elements');
                            }
                            obj.addresses.push(Address.codec().decode(reader, reader.uint32(), {
                                limits: opts.limits?.addresses$
                            }));
                            break;
                        }
                        case 2: {
                            if (opts.limits?.protocols != null && obj.protocols.length === opts.limits.protocols) {
                                throw new MaxLengthError('Decode error - map field "protocols" had too many elements');
                            }
                            obj.protocols.push(reader.string());
                            break;
                        }
                        case 4: {
                            obj.publicKey = reader.bytes();
                            break;
                        }
                        case 5: {
                            obj.peerRecordEnvelope = reader.bytes();
                            break;
                        }
                        case 6: {
                            if (opts.limits?.metadata != null && obj.metadata.size === opts.limits.metadata) {
                                throw new MaxSizeError('Decode error - map field "metadata" had too many elements');
                            }
                            const entry = Peer.Peer$metadataEntry.codec().decode(reader, reader.uint32());
                            obj.metadata.set(entry.key, entry.value);
                            break;
                        }
                        case 7: {
                            if (opts.limits?.tags != null && obj.tags.size === opts.limits.tags) {
                                throw new MaxSizeError('Decode error - map field "tags" had too many elements');
                            }
                            const entry = Peer.Peer$tagsEntry.codec().decode(reader, reader.uint32(), {
                                limits: {
                                    value: opts.limits?.tags$value
                                }
                            });
                            obj.tags.set(entry.key, entry.value);
                            break;
                        }
                        case 8: {
                            obj.updated = reader.uint64Number();
                            break;
                        }
                        default: {
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                }
                return obj;
            });
        }
        return _codec;
    };
    Peer.encode = (obj) => {
        return encodeMessage(obj, Peer.codec());
    };
    Peer.decode = (buf, opts) => {
        return decodeMessage(buf, Peer.codec(), opts);
    };
})(Peer || (Peer = {}));
export var Address;
(function (Address) {
    let _codec;
    Address.codec = () => {
        if (_codec == null) {
            _codec = message((obj, w, opts = {}) => {
                if (opts.lengthDelimited !== false) {
                    w.fork();
                }
                if ((obj.multiaddr != null && obj.multiaddr.byteLength > 0)) {
                    w.uint32(10);
                    w.bytes(obj.multiaddr);
                }
                if (obj.isCertified != null) {
                    w.uint32(16);
                    w.bool(obj.isCertified);
                }
                if (obj.observed != null) {
                    w.uint32(24);
                    w.uint64Number(obj.observed);
                }
                if (opts.lengthDelimited !== false) {
                    w.ldelim();
                }
            }, (reader, length, opts = {}) => {
                const obj = {
                    multiaddr: uint8ArrayAlloc(0)
                };
                const end = length == null ? reader.len : reader.pos + length;
                while (reader.pos < end) {
                    const tag = reader.uint32();
                    switch (tag >>> 3) {
                        case 1: {
                            obj.multiaddr = reader.bytes();
                            break;
                        }
                        case 2: {
                            obj.isCertified = reader.bool();
                            break;
                        }
                        case 3: {
                            obj.observed = reader.uint64Number();
                            break;
                        }
                        default: {
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                }
                return obj;
            });
        }
        return _codec;
    };
    Address.encode = (obj) => {
        return encodeMessage(obj, Address.codec());
    };
    Address.decode = (buf, opts) => {
        return decodeMessage(buf, Address.codec(), opts);
    };
})(Address || (Address = {}));
export var Tag;
(function (Tag) {
    let _codec;
    Tag.codec = () => {
        if (_codec == null) {
            _codec = message((obj, w, opts = {}) => {
                if (opts.lengthDelimited !== false) {
                    w.fork();
                }
                if ((obj.value != null && obj.value !== 0)) {
                    w.uint32(8);
                    w.uint32(obj.value);
                }
                if (obj.expiry != null) {
                    w.uint32(16);
                    w.uint64(obj.expiry);
                }
                if (opts.lengthDelimited !== false) {
                    w.ldelim();
                }
            }, (reader, length, opts = {}) => {
                const obj = {
                    value: 0
                };
                const end = length == null ? reader.len : reader.pos + length;
                while (reader.pos < end) {
                    const tag = reader.uint32();
                    switch (tag >>> 3) {
                        case 1: {
                            obj.value = reader.uint32();
                            break;
                        }
                        case 2: {
                            obj.expiry = reader.uint64();
                            break;
                        }
                        default: {
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                }
                return obj;
            });
        }
        return _codec;
    };
    Tag.encode = (obj) => {
        return encodeMessage(obj, Tag.codec());
    };
    Tag.decode = (buf, opts) => {
        return decodeMessage(buf, Tag.codec(), opts);
    };
})(Tag || (Tag = {}));
//# sourceMappingURL=peer.js.map