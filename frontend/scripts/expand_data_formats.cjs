const fs = require('fs');

const additionalFormats = [
  // 1. Serialization & Config
  {
    id: "format-cbor",
    name: "CBOR",
    title: "CBOR (Concise Binary Object Representation)",
    extension: ".cbor",
    mime: "application/cbor",
    magicBytes: "0xd9d9f7 (CBOR Tag 55799 self-describe)",
    year: 2013,
    category: "binary",
    paradigm: "IETF Standard Binary Object Model",
    creator: "Carsten Bormann & Paul Hoffman",
    standard: "RFC 8949 (supersedes RFC 7049) / IETF",
    encoding: "Binary (Major Types 0..7 with 5-bit argument)",
    structure: "Binary Maps, Arrays, Tagged Semantic Extensions",
    schemaType: "Schema-less / CDDL (RFC 8610) Schema",
    compression: "Compact variable byte representation",
    website: "https://cbor.io",
    description: "Concise Binary Object Representation (CBOR) is an IETF-standard binary data format designed specifically for constrained IoT devices and low-bandwidth networks (CoAP). Inspired by MessagePack but standardized with mathematical rigor by the IETF, CBOR uses an elegant 3-bit Major Type system supporting arbitrary-precision integers, raw byte strings, floating-point numbers, and semantic tags (e.g. tagging byte arrays as UUIDs or ISO datetimes). It powers WebAuthn (FIDO2 passkeys) and hardware security tokens worldwide.",
    highlights: [
      "IETF Internet Standard: Fully specified by RFC 8949 with deterministic canonical encoding (dCBOR) for cryptographic signatures.",
      "Hardware & WebAuthn Backbone: The mandatory wire serialization for FIDO2 / WebAuthn browser passkeys and Apple Touch ID / Face ID hardware auth.",
      "Semantic Tagging System: Major Type 6 allows tagging data types with universal semantics (Unix timestamps, BigNums, URIs, CBOR Web Tokens).",
      "Constrained Device Ready: Implementable in tiny microcontroller RAM footprints with zero heap allocation."
    ],
    primaryUseCase: "WebAuthn / FIDO2 security keys, CoAP IoT wireless telemetry, Cardano blockchain transactions, and COSE cryptography.",
    pros: [
      "Official IETF RFC standard with rigorous deterministic canonical sorting",
      "Native byte string support eliminates Base64 bloat",
      "Universal semantic tag system enables custom domain types without breaking parsers"
    ],
    cons: [
      "Not human readable without hex dump or cbor-diag tools",
      "Less universal in mainstream web frontend tooling than JSON",
      "Slightly higher parsing complexity than flat arrays"
    ],
    snippetTitle: "CBOR Major Type Byte Layout",
    snippetLang: "text",
    snippetCode: `Major Type 0: Unsigned Integer (0x00..0x17 inline, 0x18..0x1b byte follow)
Major Type 1: Negative Integer
Major Type 2: Byte String (Raw Binary)
Major Type 3: Text String (UTF-8)
Major Type 4: Array of data items
Major Type 5: Map of pairs (keys & values)
Major Type 6: Semantic Tag (e.g., Tag 1 = Epoch timestamp)
Major Type 7: Float & Simple values (false, true, null)`,
    diagramType: "binary",
    color: "#6366f1"
  },
  {
    id: "format-bson",
    name: "BSON",
    title: "BSON (Binary JSON)",
    extension: ".bson",
    mime: "application/bson",
    magicBytes: "4-byte little-endian document length header",
    year: 2009,
    category: "binary",
    paradigm: "Document Database Binary Serialization",
    creator: "MongoDB Inc. (10gen)",
    standard: "BSON Specification v1.1",
    encoding: "Binary Little-Endian Typed Elements",
    structure: "Length-prefixed documents with embedded keys",
    schemaType: "Self-Describing (Embedded types and field keys)",
    compression: "Internal indexing / Snappy in WiredTiger",
    website: "https://bsonspec.org",
    description: "BSON (Binary JSON) is the binary storage and wire format powering MongoDB and document-oriented databases. Designed to be lightweight, traversable, and efficient, BSON extends JSON's limited type system by adding first-class support for 64-bit integers (int64), exact Decimals (Decimal128), Datetimes (UTC epoch ms), raw binary buffers, Regular Expressions, and 12-byte ObjectIDs. Its length-prefixed fields allow database query engines to skip unqueried subdocuments with pointer arithmetic without parsing their interior.",
    highlights: [
      "Fast Document Traversal: Length prefixes at the start of documents and strings allow parsers to skip unneeded fields with pointer seeks.",
      "Rich Type Ecosystem: Solves JSON's lack of 64-bit integers, timestamps, UUIDs, and exact financial Decimal128 types.",
      "MongoDB Native Storage: Stored directly on disk in MongoDB's WiredTiger storage engine and sent over the MongoDB wire protocol.",
      "Slightly Verbose: Retains full field names for each document, making it bulkier than schema-compiled formats like Protobuf."
    ],
    primaryUseCase: "MongoDB primary disk storage & network wire protocol, document caching, and high-precision document serialization.",
    pros: [
      "Native 64-bit integers and exact Decimal128 avoid JS float precision errors",
      "Length-prefixed fields enable high-speed sequential skipping",
      "Native ObjectId and Datetime representations"
    ],
    cons: [
      "Repeats key names across records (larger storage footprint than Parquet/Avro)",
      "Generally larger than JSON for purely textual data due to byte-alignment padding",
      "Tied primarily to the MongoDB and document DB ecosystem"
    ],
    snippetTitle: "BSON Document Binary Grammar",
    snippetLang: "text",
    snippetCode: `document ::= int32 e_list "\\x00"  // 4-byte total length + elements + null terminator
element  ::= "\\x01" e_name double           // 64-bit float
           | "\\x02" e_name string           // UTF-8 string
           | "\\x03" e_name document         // Embedded sub-document
           | "\\x04" e_name document         // Array (keys: "0", "1", "2")
           | "\\x05" e_name binary           // Raw binary bytes
           | "\\x07" e_name (byte*12)        // 12-byte ObjectID
           | "\\x09" e_name int64            // UTC Datetime (ms since epoch)
           | "\\x10" e_name int32            // 32-bit Integer`,
    diagramType: "binary",
    color: "#10b981"
  },
  {
    id: "format-capnproto",
    name: "Cap'n Proto",
    title: "Cap'n Proto (Insanely Fast Serialization)",
    extension: ".capnp",
    mime: "application/x-capnp",
    magicBytes: "Segment count table (binary framing)",
    year: 2013,
    category: "binary",
    paradigm: "Zero-Copy Memory-Mapped RPC System",
    creator: "Kenton Varda (primary author of Protobuf v2)",
    standard: "Cap'n Proto Open Source Specification",
    encoding: "Binary (Exact In-Memory Struct Offsets)",
    structure: "Pointer-based word-aligned segments",
    schemaType: "Strong Schema (.capnp IDL with 64-bit IDs)",
    compression: "Optional packing (byte-level zero-removal)",
    website: "https://capnproto.org",
    description: "Created by Kenton Varda (the primary author of Google's Protocol Buffers v2), Cap'n Proto is designed around a radical premise: 'Infinity times faster than Protocol Buffers'. Cap'n Proto eliminates the encode/decode step altogether. The bytes that software builds in memory are identical to the bytes written to disk or sent across the network. With word-aligned structs and direct pointer offsets, deserialization takes 0.0 seconds of CPU time. It also features a time-traveling RPC protocol based on Promise Pipelining.",
    highlights: [
      "True Zero-Copy: No decoding step; pointer offsets allow direct memory lookups from SSD mmap() buffers.",
      "Promise Pipelining RPC: Send calls on the future results of pending network queries in a single network round-trip.",
      "Cloudflare Workers Core: Powers Cloudflare's global edge network internal IPC and workerd runtime.",
      "Pointer Security Hardened: Includes strict bounds checks and recursion limits to prevent memory exhaustion and buffer overflows."
    ],
    primaryUseCase: "Edge runtime IPC (Cloudflare Workers), Sandstorm operating system, game networking, and ultra-low-latency financial microservices.",
    pros: [
      "0.0 microsecond deserialization time: fastest possible binary read speed",
      "Promise Pipelining eliminates distributed RPC round-trip network hops",
      "Strict memory safety and bounds enforcement"
    ],
    cons: [
      "Slightly larger message size than Protobuf without packing step",
      "Rigid memory layouts require careful forward schema planning",
      "Smaller developer community compared to Google Protobuf / gRPC"
    ],
    snippetTitle: "Cap'n Proto Schema Definition (.capnp)",
    snippetLang: "protobuf",
    snippetCode: `@0xdbb9ad1f14bf0b36;

struct NetworkPacket {
  id @0 :UInt64;
  timestamp @1 :Int64;
  srcIp @2 :Text;
  dstIp @3 :Text;
  
  payload :union {
    rawBytes @4 :Data;
    httpPayload @5 :HttpMetadata;
  }
}

struct HttpMetadata {
  method @0 :Text;
  statusCode @1 :UInt16;
  headers @2 :List(HeaderPair);
}

struct HeaderPair {
  key @0 :Text;
  value @1 :Text;
}`,
    diagramType: "binary",
    color: "#0ea5e9"
  },
  {
    id: "format-asn1",
    name: "ASN.1 / DER",
    title: "ASN.1 / DER (Abstract Syntax Notation One)",
    extension: ".asn / .der / .pem",
    mime: "application/pkix-cert / application/x-x509-ca-cert",
    magicBytes: "0x30 (DER Sequence tag in TLS certificates)",
    year: 1984,
    category: "binary",
    paradigm: "Formal Telecommunications & Cryptographic Standard",
    creator: "CCITT / ITU-T & ISO/IEC",
    standard: "ITU-T X.680 - X.693 / ISO 8824",
    encoding: "TLV (Tag-Length-Value) in BER / DER / PER",
    structure: "Strict Nested Tag-Length-Value Octets",
    schemaType: "Strong Mathematical Abstract Specification",
    compression: "Packed Encoding Rules (PER) bit-level packing",
    website: "https://www.itu.int/ITU-T/studygroups/com17/languages/X.680-X.693.html",
    description: "Abstract Syntax Notation One (ASN.1) is one of the most foundational and battle-tested data specification systems in computer history. Standardized in 1984 by international telecom bodies (ITU-T), ASN.1 separates data structure definitions from their physical byte encodings (DER, BER, PER). It is the indispensable cryptographic backbone of the global Internet: every single HTTPS TLS/SSL certificate, RSA public key, x509 credential, cellular 4G/5G radio signaling protocol, and air traffic control system is encoded in ASN.1 DER.",
    highlights: [
      "Global Internet Security Core: Powers every SSL/TLS x.509 certificate, SSH key, and cryptographic signature in modern browsers.",
      "Deterministic DER Encoding: Distinguished Encoding Rules (DER) guarantee that identical data produces identical byte sequences for cryptographic hashing.",
      "Cellular 4G LTE & 5G NR: Radio Resource Control (RRC) between smartphones and cellular towers is encoded via ASN.1 PER.",
      "Tag-Length-Value (TLV): Universal 3-tier grammar: Tag (type), Length (byte size), Value (raw bytes)."
    ],
    primaryUseCase: "TLS x.509 certificates, public key cryptography (RSA, ECDSA), PKCS standards, and 4G/5G mobile telecommunications.",
    pros: [
      "Deterministic encoding guarantees hash stability for digital signatures",
      "Battle-tested for 40+ years in critical telecommunication and banking infrastructure",
      "Packed Encoding Rules (PER) pack messages down to individual bits"
    ],
    cons: [
      "Complex and notoriously difficult specification to parse safely",
      "Historical vulnerability surface in legacy C parser implementations",
      "Strict and rigid compared to modern developer-friendly formats"
    ],
    snippetTitle: "ASN.1 Grammar & DER TLV Byte Stream",
    snippetLang: "text",
    snippetCode: `// ASN.1 Module Definition
Certificate ::= SEQUENCE {
    tbsCertificate       TBSCertificate,
    signatureAlgorithm   AlgorithmIdentifier,
    signatureValue       BIT STRING
}

// DER Hex Byte Breakdown:
// 30 82 04 2A -> Tag 0x30 (SEQUENCE), Length 0x042A (1066 bytes)
//   30 82 03 12 -> Sub-Sequence: TBSCertificate
//     A0 03 02 01 02 -> Context Tag 0, Version 3 (v3 certificate)
//     02 10 4F 3A... -> Tag 0x02 (INTEGER), Serial Number (16 bytes)`,
    diagramType: "binary",
    color: "#a855f7"
  },
  // 2. Big Data & Lakehouse Tables
  {
    id: "format-iceberg",
    name: "Apache Iceberg",
    title: "Apache Iceberg (Open Table Format)",
    extension: ".metadata.json / .parquet",
    mime: "application/json; application=iceberg",
    magicBytes: "JSON Metadata tree pointing to Avro & Parquet",
    year: 2018,
    category: "bigdata",
    paradigm: "Lakehouse Table Format & Metadata Tree",
    creator: "Ryan Blue & Dan Weeks (Netflix)",
    standard: "Apache Software Foundation",
    encoding: "Multilevel Metadata Tree (JSON + Avro Manifests + Parquet Data)",
    structure: "Table Metadata -> Snapshot -> Manifest List -> Manifest Files -> Data Files",
    schemaType: "Strict Schema with Full Evolution & Column ID tracking",
    compression: "Parquet/ORC file-level compression + Gzip metadata",
    website: "https://iceberg.apache.org",
    description: "Apache Iceberg is a high-performance open table format for huge analytic datasets. Conceived at Netflix to solve the concurrency and performance failures of legacy Hive metastores, Iceberg manages tables as an immutable snapshot tree. Instead of tracking directories on object storage, Iceberg tracks exact file lists via Avro manifest files. This unlocks full ACID transactions, atomic partition evolution without rewriting data, time-travel queries (querying data as it existed last week), and simultaneous multi-engine concurrency across Spark, Trino, Flink, and DuckDB.",
    highlights: [
      "True ACID on Object Storage: Guarantees serializable isolation and snapshot isolation directly on Amazon S3 and Google Cloud Storage.",
      "Hidden Partitioning & Evolution: Change partitioning from daily to hourly without rewriting historic terabytes or invalidating queries.",
      "Time Travel & Rollback: Query snapshots at historic timestamps (`VERSION AS OF`) for audit reproducibility and disaster recovery.",
      "Multi-Engine Universal Table: Simultaneously query the same dataset using Spark, Snowflake, DuckDB, Trino, and BigQuery without vendor lock-in."
    ],
    primaryUseCase: "Enterprise data lakehouses, streaming ingestion (Kafka to S3), financial audit tables, and multi-cloud data warehousing.",
    pros: [
      "Eliminates Hive metastore directory-listing bottlenecks on cloud S3",
      "Full ACID transactional guarantees and snapshot rollback",
      "Seamless schema evolution with unique column IDs (renaming never corrupts historical data)"
    ],
    cons: [
      "Requires automated catalog maintenance (compaction, snapshot expiration, orphan file cleanup)",
      "Multi-file metadata overhead can be complex to debug manually",
      "Not designed for millisecond single-row OLTP transactions"
    ],
    snippetTitle: "Iceberg Hierarchical Metadata Snapshot Architecture",
    snippetLang: "text",
    snippetCode: `table_location/
├── metadata/
│   ├── v3.metadata.json           <-- Current table state (schema, partition spec)
│   ├── snap-9041-manifest-list.avro <-- Points to all active manifests for Snapshot 9041
│   └── 4a8b-manifest.avro         <-- Lists active Parquet files + column min/max stats
└── data/
    ├── event_date=2026-10-10/
    │   ├── 00001-42-data.parquet  <-- Physical columnar records
    │   └── 00002-43-data.parquet`,
    diagramType: "bigdata",
    color: "#0284c7"
  },
  {
    id: "format-deltalake",
    name: "Delta Lake",
    title: "Delta Lake (ACID Lakehouse Format)",
    extension: "._delta_log / .parquet",
    mime: "application/json; application=delta-lake",
    magicBytes: "JSON Transaction Log (commit JSON files)",
    year: 2019,
    category: "bigdata",
    paradigm: "Transaction Log Table Format",
    creator: "Databricks (Armbrust, Zaharia, et al.)",
    standard: "Linux Foundation / Delta Lake OSS",
    encoding: "JSON Commit Logs + Parquet Data Files + Checkpoint Parquet",
    structure: "Append-only Transaction Log (_delta_log/) + Partitioned Parquet",
    schemaType: "Schema Enforcement & Schema Evolution",
    compression: "Page-level ZSTD/Snappy on Parquet",
    website: "https://delta.io",
    description: "Delta Lake is an open-source storage layer that brings ACID transactions and reliability to Apache Spark and big data workloads. Invented by Databricks, Delta Lake manages tables through an ordered, append-only JSON transaction log (`_delta_log/000000.json`). Every commit is an atomic write to the log. Periodically, log commits are compacted into Parquet checkpoint files. Delta Lake features schema enforcement (rejecting bad data writes), streaming and batch unification, and time travel.",
    highlights: [
      "Append-Only Transaction Log: Every table mutation is recorded as an immutable JSON transaction commit, guaranteeing ACID consistency.",
      "Schema Enforcement: Prevents data lake pollution by rejecting writes that do not match the table's registered schema.",
      "Checkpointed Metadata: Every 10 commits, Delta writes a Parquet checkpoint summarizing table state, keeping metadata reads fast.",
      "Z-Ordering & Liquid Clustering: Multi-dimensional data clustering to optimize query data skipping across multiple columns."
    ],
    primaryUseCase: "Databricks lakehouses, unified streaming and batch pipelines, enterprise ML feature stores, and corporate data warehouses.",
    pros: [
      "Seamless integration with Apache Spark ecosystem",
      "Full ACID compliance with optimistic concurrency control",
      "Integrated time-travel querying and automated vacuum cleanup"
    ],
    cons: [
      "Requires regular OPTIMIZE and VACUUM jobs to prevent small-file proliferation",
      "Tightly coupled to Spark conventions historically, though delta-rs is closing the gap",
      "Transaction log conflicts can cause write retries under high concurrent writes"
    ],
    snippetTitle: "Delta Lake Transaction Log Architecture",
    snippetLang: "json",
    snippetCode: `// Example: _delta_log/00000000000000000042.json
{
  "commitInfo": {
    "timestamp": 1791686400000,
    "operation": "WRITE",
    "operationParameters": { "mode": "Append" }
  }
}
{
  "add": {
    "path": "part-00001-c000.snappy.parquet",
    "size": 1845920,
    "modificationTime": 1791686400000,
    "dataChange": true,
    "stats": "{\\"numRecords\\": 50000, \\"minValues\\": {\\"id\\": 1}, \\"maxValues\\": {\\"id\\": 50000}}"
  }
}`,
    diagramType: "bigdata",
    color: "#3b82f6"
  },
  // 3. Document & Database Files
  {
    id: "format-sqlite-file",
    name: "SQLite Single-File",
    title: "SQLite Database File Format",
    extension: ".sqlite / .db / .sqlite3",
    mime: "application/vnd.sqlite3",
    magicBytes: "SQLite format 3\\x00 (ASCII 53 71 4C 69 74 65...)",
    year: 2000,
    category: "tabular",
    paradigm: "Cross-Platform Single-File B-Tree Database",
    creator: "D. Richard Hipp",
    standard: "SQLite Official File Format Specs (Library of Congress Recommended)",
    encoding: "Binary B-Tree Pages (512 to 65536 bytes, default 4096)",
    structure: "100-byte header -> Page 1 schema table -> B-Tree Interior & Leaf Pages",
    schemaType: "Strong Dynamic SQL Schema (stored in sqlite_schema table)",
    compression: "Page-level (SQLite Archive / zlib extensions)",
    website: "https://www.sqlite.org/fileformat.html",
    description: "The SQLite database file format is recognized by the US Library of Congress as a recommended storage format for the preservation of digital content. Far more than a simple file format, SQLite packs an entire ACID-compliant relational SQL engine into a single cross-platform disk file. Structured around fixed-size pages (default 4096 bytes) organized into B-Tree data structures with a Write-Ahead Log (WAL), SQLite files operate identically on big-endian and little-endian machines without data conversion.",
    highlights: [
      "Archival Gold Standard: Formally recommended by the US Library of Congress for permanent preservation of tabular digital data.",
      "100-Byte File Header: Contains critical database parameters including page size, file change counter, schema cookie, and text encoding.",
      "B-Tree Storage Engine: Table B-Trees store 64-bit integer keys mapping to variable-length record payloads; Index B-Trees store arbitrary sort keys.",
      "Write-Ahead Log (WAL): Enables concurrent non-blocking reads while a transaction writes to the separate `.wal` companion file."
    ],
    primaryUseCase: "Application local storage (iOS/Android), desktop apps, browser cookies/history, document file replacement, and data distribution.",
    pros: [
      "Single-file portability: share, copy, backup, or email entire relational databases trivially",
      "Full ACID compliance with transaction rollback safety",
      "Recognized international standard for permanent long-term digital preservation"
    ],
    cons: [
      "Single-writer concurrency limit per database file",
      "Network filesystem (NFS/SMB) file locking bugs can cause database corruption",
      "Not designed for massive distributed petabyte clusters"
    ],
    snippetTitle: "SQLite 100-Byte Header Architecture",
    snippetLang: "text",
    snippetCode: `Offset 0..15:  "SQLite format 3\\x00" (Magic Header String)
Offset 16..17: Database page size (e.g. 0x1000 = 4096 bytes)
Offset 18..19: File format write/read version (1 = rollback, 2 = WAL)
Offset 24..27: File change counter (increments on every commit)
Offset 40..43: Schema cookie (increments on DDL ALTER/CREATE)
Offset 56..59: Text encoding (1 = UTF-8, 2 = UTF-16le, 3 = UTF-16be)
Offset 100+:   Page 1 data begins (Root of sqlite_schema table)`,
    diagramType: "tabular",
    color: "#38bdf8"
  },
  {
    id: "format-pdf",
    name: "PDF",
    title: "PDF (Portable Document Format)",
    extension: ".pdf",
    mime: "application/pdf",
    magicBytes: "%PDF- (ASCII 25 50 44 46 2D)",
    year: 1993,
    category: "serialization",
    paradigm: "Fixed-Layout PostScript Document Model",
    creator: "Adobe Systems (John Warnock, Charles Geschke)",
    standard: "ISO 32000-2 (PDF 2.0)",
    encoding: "Binary / 7-bit ASCII Object Graph + Deflate Streams",
    structure: "Header -> Body Objects -> Cross-Reference Table (xref) -> Trailer",
    schemaType: "Strong PostScript / PDF DOM Object Hierarchy",
    compression: "FlateDecode (Deflate), JPEG, JBIG2, CCITT Fax",
    website: "https://www.adobe.com/acrobat/about-adobe-pdf.html",
    description: "The Portable Document Format (PDF) is the universal international standard (ISO 32000) for fixed-layout digital documents. Conceived by Adobe co-founder John Warnock's 'Camelot Project' in 1991, PDF preserves identical visual presentation, typography, vector drawings, raster imagery, and layout across any computer screen, printer, and operating system. Built upon PostScript's imaging model, PDF organizes text, fonts, and graphics into an indirect object graph indexed by a random-access cross-reference (`xref`) table at the end of the file.",
    highlights: [
      "Fixed-Layout Fidelity: Guaranteed exact visual reproduction across every display, mobile phone, and printing press on Earth.",
      "Random-Access xref Table: Reading software seeks directly to the trailer at the bottom of the file to jump to any page in milliseconds without parsing earlier pages.",
      "Rich Embedded Streams: Integrates embedded TrueType/OpenType fonts, vector curves, CMYK color profiles, digital signatures, and PDF/A archival compliance.",
      "Parsing Nightmare: Complex layout engines make programmatic text extraction notoriously difficult (text is rendered as visual coordinates, not semantic paragraphs)."
    ],
    primaryUseCase: "Digital contracts, legal agreements, academic research papers, formal invoicing, e-books, and commercial printing presses.",
    pros: [
      "Universal fixed visual appearance that cannot be distorted by missing fonts or client OS",
      "Cryptographic digital signature verification and tamper evidence",
      "ISO-standardized archival specifications (PDF/A) for permanent multi-century records"
    ],
    cons: [
      "Extremely difficult to extract clean structured data from (tables require computer vision/OCR)",
      "Vulnerable to complex PDF engine exploits (embedded JavaScript, font parsing bugs)",
      "Not responsive: fixed page geometry does not reflow naturally on small smartphone screens"
    ],
    snippetTitle: "Physical PDF File Structure",
    snippetLang: "text",
    snippetCode: `%PDF-1.7 (Header)
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >> endobj
4 0 obj << /Length 52 >>
stream
BT /F1 24 Tf 100 700 Td (Hello World, PDF!) Tj ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
trailer << /Size 5 /Root 1 0 R >>
startxref
280
%%EOF`,
    diagramType: "hierarchical",
    color: "#ef4444"
  },
  // 4. Audio & Video Multimedia Formats
  {
    id: "format-mp4",
    name: "MP4",
    title: "MP4 (MPEG-4 Part 14 Container)",
    extension: ".mp4 / .m4v",
    mime: "video/mp4",
    magicBytes: "....ftypisom / ....ftypmp42 (ISOBMFF Box)",
    year: 2001,
    category: "media",
    paradigm: "Object-Based Multimedia Container",
    creator: "Moving Picture Experts Group (ISO/IEC)",
    standard: "ISO/IEC 14496-14",
    encoding: "ISOBMFF Hierarchical Atom / Box Structure",
    structure: "Nested Boxes: ftyp, moov (metadata index), mdat (raw media tracks)",
    schemaType: "MPEG Track & Codec Metadata",
    compression: "Encapsulates H.264 (AVC), H.265 (HEVC), AV1, AAC, Opus",
    website: "https://www.iso.org/standard/38538.html",
    description: "MPEG-4 Part 14 (MP4) is the universal digital multimedia container format of the modern era. Derived directly from Apple's QuickTime file format (`.mov`), MP4 encapsulates multiple video, audio, subtitle, and chapter tracks into a structured hierarchy of 4-byte tagged 'atoms' or 'boxes'. It is supported natively by virtually every television, browser, smartphone, social media platform, and GPU hardware video decoder on the planet.",
    highlights: [
      "Universal Hardware Video Playback: Hardware-decoded by dedicated ASIC silicon in smartphones and GPUs (Nvidia NVDEC, Intel QuickSync, Apple Video Toolbox).",
      "Fast-Start Web Streaming: Placing the metadata index box (`moov`) before the media data (`mdat`) allows web browsers to stream videos instantly without downloading the entire file.",
      "Fragmented MP4 (fMP4): The core building block for HTTP Live Streaming (HLS) and Dynamic Adaptive Streaming over HTTP (DASH).",
      "Codec Agnostic: Can encapsulate legacy H.264, cutting-edge AV1, high-efficiency HEVC, and multi-channel Dolby Atmos audio."
    ],
    primaryUseCase: "Web video streaming (YouTube, Netflix), mobile camera recording, broadcast video distribution, and social media media uploads.",
    pros: [
      "100% universal hardware and software compatibility across all consumer devices",
      "Supports multi-track audio, timed subtitles, chapters, and rich metadata",
      "fMP4 enables seamless adaptive bitrate streaming across variable bandwidth"
    ],
    cons: [
      "Complex container atom hierarchy makes low-level stream inspection difficult",
      "If recording crashes before the `moov` box is finalized, the entire recording file can be unplayable",
      "Patent licensing complexities historically surrounding MPEG codecs"
    ],
    snippetTitle: "MP4 ISOBMFF Box Hierarchy",
    snippetLang: "text",
    snippetCode: `[ftyp] File Type Box (e.g. major_brand = 'isom')
[moov] Movie Metadata Container Box
  ├── [mvhd] Movie Header: duration, timescale, volume
  ├── [trak] Track 1: Video (H.264 / AV1)
  │     ├── [tkhd] Track Header
  │     └── [mdia] -> [minf] -> [stbl] (Sample Table: frame offsets, keyframes)
  └── [trak] Track 2: Audio (AAC / Opus)
[mdat] Media Data Box: Interleaved raw audio & video packets`,
    diagramType: "media",
    color: "#f59e0b"
  },
  {
    id: "format-mp3",
    name: "MP3",
    title: "MP3 (MPEG-1 Audio Layer III)",
    extension: ".mp3",
    mime: "audio/mpeg",
    magicBytes: "\\xFF\\xFB / \\xFF\\xF3 (Sync word) or ID3 tag (49 44 33)",
    year: 1993,
    category: "media",
    paradigm: "Perceptual Psychoacoustic Audio Compression",
    creator: "Fraunhofer Society (Karlheinz Brandenburg, et al.)",
    standard: "ISO/IEC 11172-3",
    encoding: "Polyphase Filterbank + MDCT + Psychoacoustic Masking",
    structure: "Framed bitstream (Sync Header + Bit Allocation + Huffman data) + ID3v2",
    schemaType: "ID3v1 / ID3v2 Metadata (Artist, Album, Cover Art)",
    compression: "Lossy Psychoacoustic Masking (Typically 10:1 to 12:1 reduction)",
    website: "https://www.iis.fraunhofer.de/en/ff/amm/consumer-electronics/mp3.html",
    description: "MPEG-1 Audio Layer III (MP3) revolutionized human culture and the global music industry by making digital audio portable over the Internet. Engineered by Germany's Fraunhofer Institute, MP3 exploits the psychoacoustics of human hearing: when a loud sound occurs, the human ear cannot detect quieter sounds at nearby frequencies (auditory masking). MP3 strips out these inaudible audio components and compresses the remaining frequencies using Modified Discrete Cosine Transform (MDCT) and Huffman coding, shrinking CD audio tracks by 90% with minimal perceived quality loss.",
    highlights: [
      "Psychoacoustic Masking: Discards sounds that the human ear cannot physically perceive due to auditory frequency and temporal masking.",
      "Cultural Revolution: Enabled the invention of the iPod, Napster, peer-to-peer file sharing, and the modern digital music streaming industry.",
      "Universal Hardware Decoding: Every car stereo, cheap microcontroller, smartphone, and browser decodes MP3 flawlessly in hardware.",
      "Superseded by Modern Codecs: Modern codecs like AAC and Opus deliver noticeably superior audio fidelity at lower bitrates."
    ],
    primaryUseCase: "Podcasts, legacy digital music libraries, audiobook distribution, and universal audio fallback.",
    pros: [
      "The most universally supported digital audio format on planet Earth",
      "Rich ID3v2 tag metadata support for album art, lyrics, and track info",
      "Zero royalty/patent restrictions (all patents expired in 2017)"
    ],
    cons: [
      "Strict cutoff of high frequencies (>16kHz) at standard bitrates (128kbps)",
      "Inferior audio quality-to-bitrate ratio compared to Opus and AAC",
      "No native support for lossless compression or multi-channel surround sound beyond stereo"
    ],
    snippetTitle: "MP3 Audio Frame Header Architecture",
    snippetLang: "text",
    snippetCode: `[ID3v2 Header: Metadata, Album Art, Artist]
[Audio Frame 1]
  ├── Frame Sync (11 bits: 11111111 111...)
  ├── MPEG Version: MPEG-1
  ├── Layer: Layer III
  ├── Bitrate: 320 kbps
  ├── Sampling Rate: 44.1 kHz (CD quality)
  └── Side Information & Huffman-coded subband samples
[Audio Frame 2] ...
[Audio Frame N] ...`,
    diagramType: "media",
    color: "#eab308"
  },
  {
    id: "format-flac",
    name: "FLAC",
    title: "FLAC (Free Lossless Audio Codec)",
    extension: ".flac",
    mime: "audio/flac",
    magicBytes: "fLaC (ASCII 66 4C 61 43)",
    year: 2001,
    category: "media",
    paradigm: "Lossless Linear Predictive Audio Codec",
    creator: "Josh Coalson (Xiph.Org Foundation)",
    standard: "IETF Proposed Standard / Xiph.Org",
    encoding: "Linear Predictive Coding (LPC) + Rice Entropy Coding",
    structure: "4-byte magic -> STREAMINFO metadata -> Audio Frames",
    schemaType: "Vorbis Comment Metadata (Extensible UTF-8 key-value)",
    compression: "Lossless Audio (Typically 50% to 60% of uncompressed PCM)",
    website: "https://xiph.org/flac/",
    description: "Free Lossless Audio Codec (FLAC) is the open-source gold standard for bit-perfect audio preservation. Unlike lossy formats (MP3, AAC) that permanently discard audio frequencies, FLAC compresses audio waveforms without losing a single bit of information: decompressing a FLAC file reproduces the original master studio WAV or CD audio track byte-for-byte identically. Using linear predictive coding to model continuous audio waveforms followed by Golomb-Rice entropy coding, FLAC reduces file sizes by roughly 50% while supporting high-resolution 24-bit / 192kHz studio master audio.",
    highlights: [
      "Bit-Perfect Lossless Fidelity: Zero audio degradation—decompressing a FLAC yields the identical mathematical waveform as the master studio recording.",
      "High-Resolution Studio Audio: Native support for up to 32-bit float samples, 655 kHz sampling rates, and up to 8 discrete surround audio channels.",
      "Fast Asymmetric Decoding: Slower to encode, but decoding is blazing fast and computationally lightweight on battery-powered mobile hardware.",
      "Vorbis Comment Tags: Supports clean, extensible, case-insensitive UTF-8 metadata tags and embedded high-resolution album artwork."
    ],
    primaryUseCase: "Audiophile music streaming (Tidal, Qobuz), master audio archiving, CD collection digitization, and audio production.",
    pros: [
      "Guaranteed 100% bit-perfect audio quality with zero generational loss",
      "Completely open source, patent-free, and royalty-free standard",
      "Universal playback support across all modern operating systems (iOS, Android, Windows, macOS, Linux)"
    ],
    cons: [
      "Significantly larger file sizes than lossy codecs (approx. 5x to 6x larger than 320kbps MP3)",
      "Not supported natively by legacy 1990s car stereos",
      "Excessive bandwidth for low-power mobile cellular streaming"
    ],
    snippetTitle: "FLAC Audio Frame & Metadata Layout",
    snippetLang: "text",
    snippetCode: `[Magic: 'fLaC']
[METADATA_BLOCK_STREAMINFO]
  ├── Min/Max Block Size (e.g. 4096 samples)
  ├── Sample Rate: 96,000 Hz (Hi-Res Audio)
  ├── Channels: 2 (Stereo)
  ├── Bits per Sample: 24 bits
  └── Total Samples & MD5 Audio Signature (for integrity verification)
[METADATA_BLOCK_VORBIS_COMMENT: ARTIST=..., ALBUM=...]
[METADATA_BLOCK_PICTURE: Hi-Res Cover Art]
[FRAME 1: Sync word -> LPC Subframes -> Rice encoded residual bytes]
[FRAME 2: ...]`,
    diagramType: "media",
    color: "#10b981"
  },
  {
    id: "format-wasm",
    name: "WebAssembly",
    title: "WASM (WebAssembly Binary Format)",
    extension: ".wasm",
    mime: "application/wasm",
    magicBytes: "\\x00asm (ASCII 00 61 73 6D)",
    year: 2017,
    category: "binary",
    paradigm: "Stack-Based Virtual Machine Bytecode",
    creator: "W3C WebAssembly Working Group",
    standard: "W3C Recommendation WebAssembly 2.0",
    encoding: "Compact Binary Bytecode with LEB128 Integers",
    structure: "Magic -> Version -> Numbered Sections (Type, Import, Function, Memory, Code)",
    schemaType: "Strong Static Type System (i32, i64, f32, f64, v128, externref)",
    compression: "Highly dense variable-length LEB128 integer encoding",
    website: "https://webassembly.org",
    description: "WebAssembly (WASM) is a binary code format and virtual machine designed to execute code at near-native speed inside web browsers and serverless runtimes. Compiling languages like C++, Rust, Go, and C# into a compact, structured binary representation, WASM allows complex database engines (SQLite in browser, DuckDB-WASM, PGlite), game engines (Unreal, Unity), and video processing pipelines (FFmpeg-WASM) to run securely inside the browser sandbox with isolated linear memory.",
    highlights: [
      "Near-Native Execution Speed: Pre-validated bytecode compiles ahead-of-time (AOT) or JIT directly into host CPU machine instructions.",
      "Sandboxed Linear Memory: WebAssembly code cannot access host memory arbitrarily; memory is represented as a single contiguous array of bytes.",
      "In-Browser Database Revolution: Enables running real client-side databases like SQLite (wa-sqlite), DuckDB, and PGlite directly on user devices.",
      "Server-Side Wasm (WASI): WebAssembly System Interface allows running ultra-lightweight, sub-millisecond serverless functions on edge CDNs."
    ],
    primaryUseCase: "Browser-based databases (DuckDB-WASM, PGlite), Figma graphic rendering engine, video processing (FFmpeg), and edge computing.",
    pros: [
      "Executes at 90-95% of native compiled C/Rust speed in the browser",
      "Memory-safe sandbox prevents buffer overflows from compromising host",
      "Universal runtime supported in all modern web browsers and edge engines"
    ],
    cons: [
      "Binary bytecode cannot be read or debugged without decompilation to WebAssembly Text (.wat)",
      "Data exchange across the JS-WASM boundary requires memory pointer copying for complex objects",
      "No direct DOM access without JavaScript glue code bindings"
    ],
    snippetTitle: "WebAssembly Binary Module Structure",
    snippetLang: "text",
    snippetCode: `0x00: 00 61 73 6d (Magic: \\0asm)
0x04: 01 00 00 00 (Version 1)
Section 1 (Type Section): Function signatures [i32, i32] -> [i32]
Section 2 (Import Section): Imports from host environment
Section 3 (Function Section): Function declarations
Section 5 (Memory Section): Linear memory limits (1 page = 64KB)
Section 7 (Export Section): Exported function names
Section 10 (Code Section): Function bodies (Stack instructions: local.get, i32.add)`,
    diagramType: "binary",
    color: "#6366f1"
  },
  // 5. Scientific, GIS & Spatial Formats
  {
    id: "format-geopackage",
    name: "GeoPackage",
    title: "GeoPackage (OGC Portable GIS Format)",
    extension: ".gpkg",
    mime: "application/geopackage+sqlite3",
    magicBytes: "SQLite format 3\\x00 with GPKG application_id",
    year: 2014,
    category: "geospatial",
    paradigm: "SQLite-Based Open Vector & Raster Container",
    creator: "Open Geospatial Consortium (OGC)",
    standard: "OGC 12-128r17",
    encoding: "SQLite 3 file with standard OGC metadata tables",
    structure: "Spatial SQLite Database: gpkg_spatial_ref_sys, gpkg_contents, gpkg_geometry_columns",
    schemaType: "Strict Relational SQL Schema + OGC Standard Geometry Blob",
    compression: "Lossless SQLite pages / PNG/JPEG tiles for rasters",
    website: "https://www.geopackage.org",
    description: "GeoPackage (GPKG) is the modern, open-standard replacement for the obsolete 1990s ESRI Shapefile. Standardized by the Open Geospatial Consortium (OGC), GeoPackage is built directly on top of an SQLite database file. It packages vector features (points, lines, polygons), raster map tile pyramids, non-spatial attribute tables, and Coordinate Reference Systems (CRS) into a single, compact, cross-platform file without the file-splitting bugs and 2GB limits of legacy GIS formats.",
    highlights: [
      "Replaces Legacy Shapefiles: Completely eliminates the fragile multi-file bundles (.shp, .shx, .dbf, .prj) and 10-character column name limits of 1990s Shapefiles.",
      "Unified Vector & Raster Storage: Store millions of vector boundary polygons and high-resolution raster tile pyramids inside the same file.",
      "SQL Queryable Everywhere: Any SQLite client or programming language can query attributes and geometries using standard SQL.",
      "Zero File Size Limitations: Breaks through legacy Shapefile 2GB limits, comfortably handling multi-gigabyte spatial projects."
    ],
    primaryUseCase: "QGIS spatial project files, mobile field data collection, municipal cadastral databases, and open spatial data distribution.",
    pros: [
      "Single-file convenience with full transactional integrity",
      "Universal GIS support across QGIS, ArcGIS, GDAL, and Python GeoPandas",
      "Unlimited column name lengths, UTF-8 strings, and spatial indexing (R*Tree)"
    ],
    cons: [
      "Slower than GeoParquet for massive cloud-native analytical queries",
      "Row-oriented SQLite storage engine is less optimized for column-scanning big data",
      "Not designed for direct HTTP byte-range parallel queries over cloud object storage"
    ],
    snippetTitle: "GeoPackage Internal SQLite Schema Architecture",
    snippetLang: "sql",
    snippetCode: `-- GeoPackage Core Metadata Tables (inside SQLite):
SELECT * FROM gpkg_spatial_ref_sys;  -- Defines Coordinate Systems (EPSG:4326, EPSG:3857)
SELECT * FROM gpkg_contents;         -- Catalogs all vector layers and tile matrices
SELECT * FROM gpkg_geometry_columns; -- Identifies geometry columns and spatial types

-- Query vector features directly with SQL:
SELECT 
    id, 
    municipality_name, 
    population, 
    geom 
FROM territorial_boundaries 
WHERE population > 100000;`,
    diagramType: "geospatial",
    color: "#22c55e"
  },
  {
    id: "format-tiff",
    name: "TIFF",
    title: "TIFF (Tagged Image File Format)",
    extension: ".tif / .tiff",
    mime: "image/tiff",
    magicBytes: "II*\\x00 (Little-endian) or MM\\x00* (Big-endian)",
    year: 1986,
    category: "media",
    paradigm: "Extensible Tagged Raster Image Container",
    creator: "Aldus Corporation (purchased by Adobe)",
    standard: "TIFF 6.0 Specification / Adobe",
    encoding: "Binary Tagged Image File Directories (IFD)",
    structure: "Header -> Image File Directory (IFD) -> Tags & Pointer Offsets -> Pixel Strips",
    schemaType: "Extensible Metadata Tags (Exif, GeoTIFF, TIFF/EP)",
    compression: "Uncompressed, LZW, Deflate, PackBits, JPEG, ZSTD",
    website: "https://www.adobe.io/open/standards/TIFF.html",
    description: "Tagged Image File Format (TIFF) is the granddaddy of professional raster formats. Created in 1986 by Aldus and Adobe for desktop publishing and scanners, TIFF is an extensible tagged container that can store uncompressed or losslessly compressed raster bitmaps with arbitrary bit depths (8, 16, 32-bit float per channel), multi-page image stacks, and multi-spectral satellite channels. It serves as the physical container for GeoTIFF and Cloud-Optimized GeoTIFF (COG).",
    highlights: [
      "Deep Color Depth & Precision: Natively supports 16-bit and 32-bit floating-point pixels per channel, vital for scientific microscopy and HDR photography.",
      "Multi-Page & Multi-Layer Stacks: A single TIFF file can store hundreds of image pages (fax documents) or multi-spectral satellite wavelength bands.",
      "Foundation of GeoTIFF: Extensible metadata tags (GeoKeys) turn standard TIFF files into geospatial cartography rasters.",
      "BigTIFF Evolution: Standard TIFF has a 4GB byte-offset limit, solved by BigTIFF (64-bit offsets) for terabyte-scale satellite panoramas."
    ],
    primaryUseCase: "Fine art photography archiving, medical radiology imaging (DICOM), satellite remote sensing (GeoTIFF), and printing presses.",
    pros: [
      "Exceptional dynamic range and precision for scientific pixels",
      "Lossless fidelity without compression degradation",
      "Highly extensible tag architecture supported for nearly 40 years"
    ],
    cons: [
      "Massive file sizes compared to modern web image formats",
      "No native support in modern web browsers (cannot be rendered in standard <img> tags)",
      "Dozens of incompatible compression dialect tags make universal parsing tricky"
    ],
    snippetTitle: "TIFF 8-Byte Header & IFD Tag Architecture",
    snippetLang: "text",
    snippetCode: `Offset 0..1: Byte Order ('II' = 0x4949 Little Endian, 'MM' = 0x4D4D Big Endian)
Offset 2..3: Magic number 42 (0x002A)
Offset 4..7: Offset to the first Image File Directory (IFD)

[Image File Directory (IFD)]
  ├── Tag 256 (0x0100): ImageWidth = 4096
  ├── Tag 257 (0x0101): ImageLength = 2160
  ├── Tag 258 (0x0102): BitsPerSample = 16, 16, 16 (48-bit RGB)
  ├── Tag 259 (0x0103): Compression = 5 (LZW)
  └── Tag 273 (0x0111): StripOffsets -> Pointers to raw pixel strips`,
    diagramType: "media",
    color: "#f97316"
  },
  {
    id: "format-bmp",
    name: "BMP",
    title: "BMP (Bitmap Image File)",
    extension: ".bmp / .dib",
    mime: "image/bmp",
    magicBytes: "BM (ASCII 42 4D)",
    year: 1985,
    category: "media",
    paradigm: "Device-Independent Bitmap Raster",
    creator: "Microsoft & IBM",
    standard: "Windows & OS/2 DIB Specification",
    encoding: "Raw uncompressed pixel scanlines (bottom-up)",
    structure: "BITMAPFILEHEADER (14 bytes) -> BITMAPINFOHEADER (40 bytes) -> Pixel Array",
    schemaType: "Header bit-depth & palette specifications",
    compression: "Generally Uncompressed (Optional RLE for 4/8-bit)",
    website: "https://en.wikipedia.org/wiki/BMP_file_format",
    description: "The Bitmap image format (BMP), or Device-Independent Bitmap (DIB), was introduced by Microsoft and IBM in early versions of Windows and OS/2. BMP stores raster images in the simplest, most primitive way possible: a brief header followed by raw, uncompressed pixel color values stored line by line (conventionally ordered from bottom to top). Because it performs virtually zero compression, BMP files are enormous, but require zero CPU horsepower to decode.",
    highlights: [
      "Simplicity Itself: Requires virtually zero decompression algorithms—read header, allocate buffer, and blit pixels directly to video RAM.",
      "Bottom-Up Scanline Ordering: Historically stored pixels starting from the bottom-left corner and reading upward to match CRT monitors.",
      "Universal Windows Legacy: The native raster graphics format of Windows 3.1, Windows 95, MS Paint, and desktop wallpapers.",
      "Astronomical File Sizes: A single 4K image in 24-bit uncompressed BMP weighs 25 Megabytes."
    ],
    primaryUseCase: "Legacy Windows software, raw framebuffer memory dumps, simple embedded display microcontrollers, and educational CS graphics.",
    pros: [
      "Trivial to parse and display in simple C code with zero external libraries",
      "Exact uncompressed bitmap preservation",
      "Instant loading time on low-power microcontrollers"
    ],
    cons: [
      "Gigantic file size due to total lack of compression",
      "Completely obsolete for modern web usage",
      "Lacks modern color profiles and HDR extensions"
    ],
    snippetTitle: "BMP File Header Binary Breakdown",
    snippetLang: "text",
    snippetCode: `[BITMAPFILEHEADER - 14 bytes]
  0x00: "BM" (0x42 0x4D - Magic signature)
  0x02: Total file size in bytes
  0x0A: Pixel data offset (typically 54 bytes)

[BITMAPINFOHEADER - 40 bytes]
  0x0E: Header size (40)
  0x12: Image Width (signed integer)
  0x16: Image Height (signed integer, positive = bottom-up)
  0x1A: Color Planes (1)
  0x1C: Bits per pixel (24 = RGB, 32 = RGBA)
  0x1E: Compression method (0 = BI_RGB uncompressed)

[Raw Pixel Array]
  Row 1 (Bottom line): B G R [pad to 4-byte boundary]
  Row 2: ...`,
    diagramType: "media",
    color: "#94a3b8"
  }
];

// Read existing JSON
const existingData = JSON.parse(fs.readFileSync('/home/guigo/Documents/05-ghpages-gui13go/frontend/public/data/data-formats.json', 'utf8'));

// Helper to escape HTML
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Convert additional formats to full gallery items
const newGalleryItems = additionalFormats.map(fmt => {
  const imageSvgPath = `/images/data_formats/fmt_${fmt.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}.svg`;

  const prosListHtml = fmt.pros.map(p => `<li><span class="pro-tag">+</span> ${escapeHtml(p)}</li>`).join("");
  const consListHtml = fmt.cons.map(c => `<li><span class="con-tag">-</span> ${escapeHtml(c)}</li>`).join("");
  const highlightsHtml = fmt.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join("");

  const cardHtml = `
    <div class="fmt-img-wrapper gallery-zoomable" data-zoom-caption="${escapeHtml(fmt.description)}" data-zoom-meta="Year: ${fmt.year} • Extension: ${escapeHtml(fmt.extension)} • MIME: ${escapeHtml(fmt.mime)}" data-zoom-src="${imageSvgPath}" data-zoom-title="${escapeHtml(fmt.title)}" title="Click to inspect format architectural blueprint">
      <img alt="${escapeHtml(fmt.title)} architectural blueprint" loading="lazy" onerror="this.onerror=null,this.parentElement.style.display='none'" src="${imageSvgPath}"/>
      <div class="fmt-type-badge">${escapeHtml(fmt.paradigm)}</div>
      <div class="fmt-ext-pill">${escapeHtml(fmt.extension)}</div>
      <div class="fmt-img-overlay">
        <svg class="zoom-indicator-icon" fill="none" height="22" stroke="currentColor" stroke-width="2" viewbox="0 0 24 24" width="22">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
          <line x1="11" x2="11" y1="8" y2="14"></line>
          <line x1="8" x2="14" y1="11" y2="11"></line>
        </svg>
      </div>
    </div>
    <div class="fmt-card-content">
      <div class="fmt-header-row">
        <div class="fmt-title-wrap">
          <h2 class="fmt-name">${escapeHtml(fmt.name)}</h2>
          <span class="fmt-full-title">${escapeHtml(fmt.title)}</span>
        </div>
        <div class="fmt-badges-row">
          <span class="fmt-year-badge">${fmt.year}</span>
        </div>
      </div>
      <div class="fmt-creator">Standardized by: <strong>${escapeHtml(fmt.creator)}</strong></div>
      <p class="fmt-desc">${escapeHtml(fmt.description)}</p>

      <div class="fmt-specs-grid">
        <div class="fmt-spec-item"><span class="spec-label">File Extension:</span><span class="spec-value"><code>${escapeHtml(fmt.extension)}</code></span></div>
        <div class="fmt-spec-item"><span class="spec-label">MIME Content-Type:</span><span class="spec-value"><code>${escapeHtml(fmt.mime)}</code></span></div>
        <div class="fmt-spec-item"><span class="spec-label">Magic Bytes / Signature:</span><span class="spec-value"><code>${escapeHtml(fmt.magicBytes)}</code></span></div>
        <div class="fmt-spec-item"><span class="spec-label">Data Paradigm:</span><span class="spec-value">${escapeHtml(fmt.paradigm)}</span></div>
        <div class="fmt-spec-item"><span class="spec-label">Schema Model:</span><span class="spec-value">${escapeHtml(fmt.schemaType)}</span></div>
        <div class="fmt-spec-item"><span class="spec-label">Compression Strategy:</span><span class="spec-value">${escapeHtml(fmt.compression)}</span></div>
      </div>

      <div class="fmt-features-box">
        <span class="fmt-section-label">Architectural Highlights &amp; Internals:</span>
        <ul class="fmt-features-list">
          ${highlightsHtml}
        </ul>
      </div>

      <!-- Interactive Code / Wire Layout Accordion -->
      <div class="fmt-code-accordion">
        <button class="fmt-code-toggle-btn" type="button" aria-expanded="false" onclick="this.parentElement.classList.toggle('open'); this.setAttribute('aria-expanded', this.parentElement.classList.contains('open'))">
          <span class="fmt-toggle-icon">
            <svg fill="none" height="14" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="14"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </span>
          <span class="fmt-toggle-title">Format Structure &amp; Physical Syntax Example</span>
          <span class="fmt-toggle-badge">${escapeHtml(fmt.snippetLang.toUpperCase())}</span>
        </button>
        <div class="fmt-code-body">
          <div class="fmt-code-header">
            <span class="fmt-code-desc">${escapeHtml(fmt.snippetTitle)}</span>
            <button class="fmt-copy-code-btn" type="button" onclick="navigator.clipboard.writeText(this.closest('.fmt-code-body').querySelector('code').textContent).then(()=>{this.textContent='Copied!';setTimeout(()=>this.textContent='Copy',1600)})">Copy</button>
          </div>
          <pre class="fmt-code-block"><code class="language-${escapeHtml(fmt.snippetLang)}">${escapeHtml(fmt.snippetCode)}</code></pre>
        </div>
      </div>

      <!-- Architectural Trade-offs & Deep Dive Accordion -->
      <div class="fmt-tradeoffs-accordion">
        <button class="fmt-tradeoffs-toggle-btn" type="button" aria-expanded="false" onclick="this.parentElement.classList.toggle('open'); this.setAttribute('aria-expanded', this.parentElement.classList.contains('open'))">
          <span class="fmt-toggle-icon">
            <svg fill="none" height="14" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="14"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </span>
          <span class="fmt-toggle-title">Architectural Trade-Offs &amp; Sweet Spots</span>
        </button>
        <div class="fmt-tradeoffs-body">
          <div class="fmt-sweet-spot">
            <strong>Optimal Sweet Spot:</strong> ${escapeHtml(fmt.primaryUseCase)}
          </div>
          <div class="fmt-pros-cons-grid">
            <div class="fmt-pros-col">
              <span class="pro-header">Superpowers:</span>
              <ul class="pros-list">${prosListHtml}</ul>
            </div>
            <div class="fmt-cons-col">
              <span class="con-header">Architectural Constraints:</span>
              <ul class="cons-list">${consListHtml}</ul>
            </div>
          </div>
        </div>
      </div>

      <div class="fmt-footer-action">
        <a class="fmt-link-btn" href="${escapeHtml(fmt.website)}" rel="noopener noreferrer" target="_blank">
          <span>Official Specification / RFC</span>
          <svg fill="none" height="14" stroke="currentColor" stroke-width="2" viewbox="0 0 24 24" width="14">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" x2="21" y1="14" y2="3"></line>
          </svg>
        </a>
      </div>
    </div>
  `;

  return {
    id: fmt.id,
    name: fmt.name.toLowerCase(),
    title: fmt.title,
    year: fmt.year,
    sortYear: fmt.year,
    sortName: fmt.name.toLowerCase(),
    category: fmt.category,
    description: fmt.description,
    image: imageSvgPath,
    zoomSrc: imageSvgPath,
    zoomTitle: fmt.title,
    zoomMeta: `Year: ${fmt.year} • Extension: ${fmt.extension} • Category: ${fmt.category}`,
    zoomCaption: fmt.description,
    extension: fmt.extension,
    mime: fmt.mime,
    magicBytes: fmt.magicBytes,
    paradigm: fmt.paradigm,
    schemaType: fmt.schemaType,
    primaryUseCase: fmt.primaryUseCase,
    pros: fmt.pros,
    cons: fmt.cons,
    snippetCode: fmt.snippetCode,
    snippetLang: fmt.snippetLang,
    snippetTitle: fmt.snippetTitle,
    dataset: {
      "data-name": fmt.name.toLowerCase(),
      "data-year": String(fmt.year),
      "data-category": fmt.category,
      "data-paradigm": fmt.paradigm.toLowerCase(),
      "data-extension": fmt.extension.toLowerCase(),
      "data-mime": fmt.mime.toLowerCase(),
      "data-creator": fmt.creator.toLowerCase(),
      "data-summary": fmt.description.toLowerCase(),
      "data-schema": fmt.schemaType.toLowerCase(),
      "data-use-case": fmt.primaryUseCase.toLowerCase(),
      "data-highlights": fmt.highlights.join(" ").toLowerCase()
    },
    classes: ["fmt-card"],
    html: cardHtml
  };
});

// Combine
const combinedList = [...existingData, ...newGalleryItems];
fs.writeFileSync('/home/guigo/Documents/05-ghpages-gui13go/frontend/public/data/data-formats.json', JSON.stringify(combinedList, null, 2));
console.log(`Successfully combined! Total formats: ${combinedList.length}`);
