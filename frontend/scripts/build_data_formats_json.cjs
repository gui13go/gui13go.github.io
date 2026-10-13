const fs = require("fs");
const path = require("path");

const dataFormats = [
  // 1. Text & Delimited
  {
    id: "format-csv",
    name: "CSV",
    title: "CSV (Comma-Separated Values)",
    extension: ".csv",
    mime: "text/csv",
    magicBytes: "None (Plain Text)",
    year: 1972,
    category: "tabular",
    paradigm: "Delimited Plaintext",
    creator: "Pre-RFC / formalized in RFC 4180 (2005)",
    standard: "RFC 4180 / IETF",
    encoding: "Plain text (UTF-8 / ASCII / Latin-1)",
    structure: "Tabular (Rows & Columns)",
    schemaType: "Schema-less (Header optional, implicit)",
    compression: "External (gzip, zstd)",
    website: "https://datatracker.ietf.org/doc/html/rfc4180",
    description: "Comma-Separated Values (CSV) is the universal lingua franca of tabular datasets across computing. Dating back to punch cards and mainframe Fortran compilers before being standardized by RFC 4180, CSV stores rectangular tables where each record is a line break and each field is separated by a comma (or semicolon/tab in regional locales). Despite lacking intrinsic types, formal schema constraints, or unified quoting conventions, CSV's human readability and universal support across spreadsheets, dataframes, and databases make it the most exchanged tabular format in history.",
    highlights: [
      "Zero Overhead Overhead: Clean plain text with minimum syntactic punctuation, accessible by standard Unix utilities like awk, sed, and cut.",
      "Universal Interoperability: Native out-of-the-box import/export in every SQL engine, Python pandas, R, Excel, Google Sheets, and BI platform.",
      "Streaming Friendly: Single-pass linear streamability allows parsing gigabyte files line-by-line with bounded memory usage.",
      "Simplicity & Fragility: Lacks native types (strings vs numbers vs dates), nullable representations, or embedded schema metadata."
    ],
    primaryUseCase: "Tabular data export, business spreadsheet exchange, simple database dumps, and quick analytics pipelines.",
    pros: [
      "Human-readable, trivially editable in any text editor",
      "Universal support across all programming languages, tools, and platforms",
      "Zero proprietary dependencies or binary decoding libraries required"
    ],
    cons: [
      "No type system (numbers, booleans, dates all stringified, leading to silent precision loss)",
      "Quoting, delimiter collision, and multi-line field escaping can be brittle across dialects",
      "Large disk footprint without compression; no columnar projection (must read all columns)"
    ],
    snippetTitle: "RFC 4180 Escaped Record Example",
    snippetLang: "csv",
    snippetCode: `id,product_name,category,price,description,is_active
101,"Studio Monitor 8\\"","Audio",299.99,"High-precision nearfield
active bi-amp monitor",true
102,"USB-C Audio Hub","Hardware",89.50,"Supports 24-bit/192kHz audio",true
103,"Dynamic Mic, XLR","Audio",120.00,"Cardioid broadcast vocal mic",false`,
    diagramType: "tabular",
    color: "#10b981"
  },
  {
    id: "format-tsv",
    name: "TSV",
    title: "TSV (Tab-Separated Values)",
    extension: ".tsv",
    mime: "text/tab-separated-values",
    magicBytes: "None (Plain Text)",
    year: 1972,
    category: "tabular",
    paradigm: "Delimited Plaintext",
    creator: "Unix / Bioinformatics Standards",
    standard: "IANA MIME / POSIX conventions",
    encoding: "Plain text (UTF-8 / ASCII)",
    structure: "Tabular (Tab delimited)",
    schemaType: "Schema-less",
    compression: "External (gzip, bgzip)",
    website: "https://en.wikipedia.org/wiki/Tab-separated_values",
    description: "Tab-Separated Values (TSV) uses horizontal tab characters (ASCII 0x09) as delimiters between fields. Heavily favored in bioinformatics, scientific computing, and Unix CLI pipelines, TSV avoids CSV's notorious comma-collision pitfalls in natural language text and geographic addresses, drastically reducing the need for quotes and escape characters.",
    highlights: [
      "Clean Delimitation: Commas and quotation marks occur frequently in textual prose, but tabs rarely do, making TSV parsing faster and less ambiguous.",
      "Bioinformatics Gold Standard: Foundational to genomic BED, GFF, and SAM formats across genomics pipelines.",
      "Unix Command-Line Native: Works seamlessly with bash tools (cut -f, sort -t$'\\t', awk -F'\\t').",
      "Strict Tab Preservation: Accidental editor space conversion (tab-to-spaces) can corrupt file parsing."
    ],
    primaryUseCase: "Bioinformatics datasets, machine learning training text, NLP datasets, and high-throughput Unix pipeline batch processing.",
    pros: [
      "Rarely conflicts with text containing commas, numbers, or quotes",
      "Faster and cleaner parsing logic than CSV due to simpler escaping semantics",
      "Native compatibility with Unix command line tools without regex splits"
    ],
    cons: [
      "Invisible whitespace delimiter makes manual editing prone to space vs tab errors",
      "Still lacks native data types and columnar projection",
      "Less universally assumed by non-technical business desktop tools than CSV"
    ],
    snippetTitle: "Genomic Annotation TSV Record",
    snippetLang: "text",
    snippetCode: `chrom	chromStart	chromEnd	name	score	strand	thickStart	thickEnd
chr7	127471196	127472363	Pos1	0	+	127471196	127472363
chr7	127472363	127473530	Pos2	0	+	127472363	127473530
chr7	127473530	127474697	Pos3	0	+	127473530	127474697`,
    diagramType: "tabular",
    color: "#06b6d4"
  },
  // 2. Structured & Hierarchical (Serialization)
  {
    id: "format-json",
    name: "JSON",
    title: "JSON (JavaScript Object Notation)",
    extension: ".json",
    mime: "application/json",
    magicBytes: "None ({ or [ text)",
    year: 2001,
    category: "serialization",
    paradigm: "Hierarchical Document / Key-Value",
    creator: "Douglas Crockford",
    standard: "ECMA-404 / RFC 8259",
    encoding: "UTF-8 (RFC 8259 mandatory)",
    structure: "Key-Value Objects, Arrays, Primitives",
    schemaType: "Schema-optional (JSON Schema validator)",
    compression: "External (Brotli, Gzip, Zstandard)",
    website: "https://www.json.org",
    description: "JavaScript Object Notation (JSON) revolutionized modern web computing, supplanting cumbersome XML as the dominant format for REST APIs, configuration files, and NoSQL databases. Specified by Douglas Crockford in 2001, JSON defines six core data types: objects (key-value maps), arrays (ordered lists), strings, numbers (IEEE 754 float), booleans, and null. Its simplicity, human readability, and ubiquitous native language runtimes make it the definitive data serialization standard of the Internet.",
    highlights: [
      "Zero Boilerplate Syntax: Clean curly braces, square brackets, and colons map 1:1 to hash maps and lists in virtually every language.",
      "Universal Web Standard: Supported natively in browser JavaScript (JSON.parse / JSON.stringify) and web frameworks.",
      "Strict Standard Specification: RFC 8259 strictly requires UTF-8 and double quotes, minimizing cross-runtime divergence.",
      "Type Limits: No native support for dates, integers vs floats distinction, NaN/Infinity, comments, or binary byte arrays."
    ],
    primaryUseCase: "Web REST APIs, browser-to-server communication, configuration files, and document database storage (MongoDB, PostgreSQL JSONB).",
    pros: [
      "Intuitive, lightweight, and human-readable with universal programming language support",
      "Direct 1:1 conceptual mapping to in-memory dictionary and list structures",
      "Huge ecosystem: JSON Schema, jq, jsonpath, JSON-LD, OpenAPI"
    ],
    cons: [
      "Inefficient for binary payloads (requires Base64 encoding with 33% bloat)",
      "No support for comments in standard RFC specification (solved by JSONC)",
      "Verbose repeated keys across large collections of homogenous records"
    ],
    snippetTitle: "Structured JSON Document",
    snippetLang: "json",
    snippetCode: `{
  "protocol": "HTTPS",
  "version": 3,
  "endpoints": [
    {
      "path": "/api/v1/metrics",
      "rateLimit": 1000,
      "authRequired": true,
      "payload": {
        "format": "json",
        "compression": ["zstd", "br"]
      }
    }
  ],
  "active": true
}`,
    diagramType: "hierarchical",
    color: "#f59e0b"
  },
  {
    id: "format-jsonl",
    name: "JSONL / NDJSON",
    title: "JSON Lines / Newline-Delimited JSON",
    extension: ".jsonl / .ndjson",
    mime: "application/x-ndjson",
    magicBytes: "None (One JSON object per line)",
    year: 2013,
    category: "serialization",
    paradigm: "Streamable Record-Oriented JSON",
    creator: "Open Source Community",
    standard: "JSON Lines specification",
    encoding: "UTF-8",
    structure: "Line-delimited JSON objects",
    schemaType: "Schema-optional",
    compression: "External (gzip / zstd line streams)",
    website: "https://jsonlines.org",
    description: "JSON Lines (JSONL), or Newline-Delimited JSON (NDJSON), addresses the greatest limitation of standard JSON for big data: parsing massive arrays requires loading the entire file into memory before closing brackets can be matched. JSONL structures files such that each single line is a valid, independent JSON object separated by a newline (\\n). This unlocks infinite streaming, parallel chunking, and append-only operations without file corruption.",
    highlights: [
      "Streamable & Append-Friendly: You can write new records to the end of a multi-terabyte file without opening or validating previous records.",
      "Parallel Processing & MapReduce: Workers can seek to arbitrary byte offsets and scan to the nearest newline, chunking terabytes across cluster nodes.",
      "Fault Tolerant: A corrupted line in a log stream does not prevent parsing subsequent lines.",
      "AI & LLM Training Format: The de-facto standard for storing billions of token prompts, completions, and datasets for pre-training large models."
    ],
    primaryUseCase: "LLM fine-tuning datasets, logging pipelines (Elasticsearch, OpenSearch), event streams, and big data ETL dumps.",
    pros: [
      "O(1) memory streaming parsing line-by-line",
      "Append-only write efficiency without rewrites",
      "Splittable by standard Unix CLI tools (split, head, tail, grep)"
    ],
    cons: [
      "Values cannot contain literal unescaped newlines within their string bodies",
      "Slightly higher storage footprint than binary formats like Avro or Parquet",
      "Not formatted for pleasant multi-line human reading without formatting tools"
    ],
    snippetTitle: "LLM Chat Fine-Tuning JSONL Stream",
    snippetLang: "json",
    snippetCode: `{"id": "conv-001", "role": "system", "content": "You are a database optimizer."}
{"id": "conv-002", "role": "user", "content": "Explain LSM compaction strategies."}
{"id": "conv-003", "role": "assistant", "content": "Size-tiered vs leveled compaction optimize write vs read amplification."}`,
    diagramType: "stream",
    color: "#eab308"
  },
  {
    id: "format-xml",
    name: "XML",
    title: "XML (Extensible Markup Language)",
    extension: ".xml",
    mime: "application/xml",
    magicBytes: "<?xml (ASCII 3C 3F 78 6D 6C)",
    year: 1996,
    category: "serialization",
    paradigm: "Hierarchical Tag-Based Markup",
    creator: "W3C (Tim Bray, Jean Paoli, C. M. Sperberg-McQueen)",
    standard: "W3C Recommendation XML 1.0",
    encoding: "UTF-8 / UTF-16 (BOM supported)",
    structure: "Hierarchical Tree (Elements, Attributes, Namespaces)",
    schemaType: "Strongly Schema-Enforced (XSD, DTD, RelaxNG)",
    compression: "External (Gzip) / Binary XML (Fast Infoset)",
    website: "https://www.w3.org/XML/",
    description: "Extensible Markup Language (XML) is a W3C standard designed for transmitting structured data and document formatting with rigorous semantic metadata. With support for tag attributes, namespaces (avoiding name collisions), comments, CDATA blocks, and robust schema validation via XSD (XML Schema Definition), XML powered enterprise computing, SOAP web services, SVG graphics, Office documents (DOCX, XLSX), and publishing pipelines for decades.",
    highlights: [
      "Enterprise Rigor & XSD Validation: Unmatched schema formalization with data types, regex patterns, enumerations, and structural constraints.",
      "Namespaces & Composable Vocabularies: Multiple schemas can coexist within a single document without tag collision.",
      "Rich Query & Transformation Tooling: Supported by XPath (querying), XQuery (data manipulation), and XSLT (declarative tree transformations).",
      "Syntax Verbosity: Closing tags, namespace declarations, and verbose angle brackets make payloads significantly larger than JSON."
    ],
    primaryUseCase: "Enterprise integrations, financial messaging (ISO 20022), document markup (DocBook, Office Open XML, SVG), and legacy SOAP web services.",
    pros: [
      "Deep semantic precision with attribute + element distinction and namespaces",
      "Exceptional schema validation capabilities via formal XSD",
      "Mature ecosystem of transformations (XSLT) and declarative querying (XPath)"
    ],
    cons: [
      "Extreme verbosity and token bloat compared to JSON and YAML",
      "Susceptible to security vulnerabilities if parsers are unhardened (XXE attacks, Billion Laughs)",
      "High parsing complexity and CPU overhead"
    ],
    snippetTitle: "Validated Financial XML Transaction",
    snippetLang: "xml",
    snippetCode: `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03">
  <CstmrCdtTrfInitn>
    <GrpHdr>
      <MsgId>TX-2026-9042</MsgId>
      <CreDtTm>2026-10-10T12:00:00Z</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
    </GrpHdr>
    <PmtInf>
      <Amt Ccy="USD">4500.00</Amt>
      <Cdtr><Nm>High-Performance Corp</Nm></Cdtr>
    </PmtInf>
  </CstmrCdtTrfInitn>
</Document>`,
    diagramType: "hierarchical",
    color: "#ea580c"
  },
  {
    id: "format-yaml",
    name: "YAML",
    title: "YAML (YAML Ain't Markup Language)",
    extension: ".yaml / .yml",
    mime: "application/yaml",
    magicBytes: "--- (Optional document separator)",
    year: 2001,
    category: "serialization",
    paradigm: "Indentation-Based Human-Centric",
    creator: "Clark Evans, Ingy döt Net, Oren Ben-Kiki",
    standard: "YAML 1.2 Specification",
    encoding: "UTF-8 / UTF-16",
    structure: "Hierarchical Key-Value, Lists, Scalars",
    schemaType: "Schema-optional (JSON Schema compatible in 1.2)",
    compression: "External",
    website: "https://yaml.org",
    description: "YAML is a human-friendly data serialization language meticulously designed for readability and maintainability. Using Python-style whitespace indentation instead of brackets and braces, YAML is the undisputed standard for cloud configuration files, CI/CD pipelines (GitHub Actions, GitLab CI), container orchestration (Kubernetes manifests), and Docker Compose. YAML 1.2 is a strict superset of JSON, meaning any valid JSON document is also valid YAML.",
    highlights: [
      "Human Ergonomics: Clean syntax free of quotation noise, curly braces, and trailing comma bugs.",
      "Native Comments: Full support for inline comments (#), making it ideal for documentation-rich configuration files.",
      "Advanced Anchors & Aliases: DRY (Don't Repeat Yourself) data reuse using pointers (&anchor) and references (*alias).",
      "Whitespace Sensitivity: Tab vs space indentation errors and implicit type conversions (the infamous Norway 'NO' country code parsed as false) can surprise engineers."
    ],
    primaryUseCase: "Kubernetes manifests, Docker Compose, CI/CD workflows, Ansible playbooks, and application config files.",
    pros: [
      "Supreme human readability and native comment support",
      "Clean multi-line string handling (| and > literal blocks)",
      "Supports anchors, aliases, and document concatenation in a single stream (---)"
    ],
    cons: [
      "Indentation mistakes can silently alter data hierarchy",
      "Complex specification with edge cases in type coercion (Norway problem)",
      "Significantly slower parsing speed compared to JSON"
    ],
    snippetTitle: "Kubernetes Deployment & Anchors Manifest",
    snippetLang: "yaml",
    snippetCode: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: storage-gateway
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: app
          image: telemetry/storage:v2.4
          resources: &standard_resources
            limits:
              cpu: "2"
              memory: 4Gi
            requests:
              cpu: "500m"
              memory: 1Gi`,
    diagramType: "hierarchical",
    color: "#ef4444"
  },
  {
    id: "format-toml",
    name: "TOML",
    title: "TOML (Tom's Obvious, Minimal Language)",
    extension: ".toml",
    mime: "application/toml",
    magicBytes: "None (Text format)",
    year: 2013,
    category: "serialization",
    paradigm: "INI-style Semantic Configuration",
    creator: "Tom Preston-Werner (GitHub co-founder)",
    standard: "TOML v1.0.0 Specification",
    encoding: "UTF-8",
    structure: "Hash Table / Sections ([table]), Key-Value Pairs",
    schemaType: "Schema-less (Strict unambiguous scalar types)",
    compression: "External",
    website: "https://toml.io",
    description: "Created by GitHub co-founder Tom Preston-Werner, TOML aims to be a minimal configuration file format that is easy to read due to obvious semantics. Designed to map unambiguously to a hash table, TOML solves the human friction of YAML's significant indentation bugs and JSON's lack of comments. It is the dominant configuration standard in the Rust (Cargo.toml), Python (pyproject.toml), and Go ecosystems.",
    highlights: [
      "Explicit Section Headers: Organizes data into clear INI-style bracketed tables ([server.database]) without indentation ambiguity.",
      "Strict Unambiguous Types: Native support for ISO 8601 Datetimes, Floats, Integers, Booleans, Arrays, and Inline Tables.",
      "No Syntax Surprises: Whitespace is insignificant, comments are supported (#), and strings have unambiguous escaping rules.",
      "Rust & Python Standard: Adopted by PEP 518/621 (pyproject.toml) and Rust Cargo as the premier modern packaging config format."
    ],
    primaryUseCase: "Project configuration files (Cargo.toml, pyproject.toml), systems software configuration, static site generators (Hugo).",
    pros: [
      "Extremely intuitive with zero whitespace indentation pitfalls",
      "Native first-class datetime data types",
      "Supports comments and strict type safety"
    ],
    cons: [
      "Deeply nested hierarchical structures can become awkward with repetitive table headers",
      "Not designed for massive data transport or streaming arrays",
      "Smaller ecosystem outside developer tool configurations"
    ],
    snippetTitle: "Cargo / PyProject Configuration File",
    snippetLang: "toml",
    snippetCode: `[package]
name = "vector-core"
version = "0.4.2"
edition = "2024"
authors = ["Data Infrastructure Team <infra@example.com>"]

[dependencies]
tokio = { version = "1.38", features = ["full"] }
arrow = "52.0"
parquet = "52.0"

[database.connection]
host = "10.0.0.12"
port = 5432
timeout_seconds = 30.5
ssl_required = true`,
    diagramType: "hierarchical",
    color: "#a855f7"
  },
  // 3. High-Performance Binary Serialization
  {
    id: "format-protobuf",
    name: "Protocol Buffers",
    title: "Protobuf (Google Protocol Buffers)",
    extension: ".proto / .pb / .bin",
    mime: "application/x-protobuf",
    magicBytes: "Varint field tags (binary encoding)",
    year: 2008,
    category: "binary",
    paradigm: "Compiled Binary RPC Serialization",
    creator: "Google (Jeff Dean, Sanjay Ghemawat)",
    standard: "Protocol Buffers v3 / Google Open Source",
    encoding: "Binary (Varint, fixed length, length-delimited)",
    structure: "Field-numbered typed messages",
    schemaType: "Strongly Schema-First (.proto IDL compilation)",
    compression: "Compact native variable-byte encoding",
    website: "https://protobuf.dev",
    description: "Protocol Buffers (Protobuf) is Google's language-neutral, platform-neutral, extensible mechanism for serializing structured data. Developers write a schema in an Interface Definition Language (.proto), which a compiler (`protoc`) compiles into optimized native code across 15+ programming languages. Protobuf strips all field names from the binary payload, encoding fields as compact integer tags using variable-length zigzag integers (Varints). It is the backbone of gRPC, inter-microservice communication, and high-frequency systems across Google and enterprise architectures.",
    highlights: [
      "Tag-Based Binary Encoding: Field names are not transmitted over the wire; only integer field keys (e.g., tag 1, tag 2) are encoded, minimizing payload size.",
      "Backward & Forward Compatibility: New fields can be added and deprecated without breaking legacy clients by managing tag numbers.",
      "Code Generation & Zero Parsing Errors: Strong compiler type-checks eliminate manual JSON deserialization and runtime type errors.",
      "Not Human-Readable: Binary wire format requires the original `.proto` schema file to decode or inspect."
    ],
    primaryUseCase: "gRPC microservice communication, high-frequency low-latency RPC, distributed service meshes, and mobile-to-cloud efficiency.",
    pros: [
      "Massive reduction in payload size (often 3-10x smaller than JSON)",
      "Blazing fast serialization and deserialization speeds",
      "Rigorous contract enforcement and forward/backward compatibility"
    ],
    cons: [
      "Requires compilation step via protoc before use",
      "Binary format cannot be directly inspected or edited with text editors",
      "Not suitable for ad-hoc, dynamic, or un-schematized data"
    ],
    snippetTitle: "Protobuf IDL Definition (.proto)",
    snippetLang: "protobuf",
    snippetCode: `syntax = "proto3";

package analytics.v1;

message TelemetryEvent {
  string event_id = 1;
  uint64 timestamp_ns = 2;
  
  enum EventSeverity {
    INFO = 0;
    WARNING = 1;
    CRITICAL = 2;
  }
  
  EventSeverity severity = 3;
  map<string, string> metadata = 4;
  bytes raw_payload = 5;
}`,
    diagramType: "binary",
    color: "#3b82f6"
  },
  {
    id: "format-flatbuffers",
    name: "FlatBuffers",
    title: "FlatBuffers (Zero-Copy Serialization)",
    extension: ".fbs / .bin",
    mime: "application/x-flatbuffers",
    magicBytes: "Internal vtable offsets",
    year: 2014,
    category: "binary",
    paradigm: "Zero-Copy Memory-Mapped Binary",
    creator: "Wouter van Oortmerssen (Google)",
    standard: "Google Open Source",
    encoding: "Binary (Aligned memory offsets + vtables)",
    structure: "Hierarchical tables & vectors with vtable lookup",
    schemaType: "Strongly Schema-First (.fbs IDL compilation)",
    compression: "Internal alignment; low CPU unpack",
    website: "https://flatbuffers.dev",
    description: "Created by Google for performance-critical applications like game engines, Android graphics pipelines, and edge machine learning (TensorFlow Lite), FlatBuffers takes binary serialization to the extreme: zero-copy deserialization. Instead of allocating memory to unpack and parse bytes into language objects, FlatBuffers formats binary data on disk so that software can read fields directly out of raw memory or mmap() buffers via internal virtual table (vtable) offsets with zero allocation and zero parsing time.",
    highlights: [
      "Zero Deserialization Overhead: Access data directly in memory buffers without allocating objects or copying bytes.",
      "Memory-Mapped File Friendly: Instant startup time—mmap a multi-gigabyte asset package and read fields immediately.",
      "Strict Memory Alignment: Fields are aligned to natural CPU machine word boundaries (2, 4, 8 bytes) for direct hardware reads.",
      "Write Complexity: Constructing buffers requires forward-looking offset management, making writes slightly more involved than Protobuf."
    ],
    primaryUseCase: "Game engines, TensorFlow Lite models, real-time audio/graphics pipelines, and embedded low-latency devices.",
    pros: [
      "True zero-copy reads: fastest data access possible in computing",
      "Minimal memory allocation footprint prevents garbage collection pauses",
      "Forward and backward schema evolution support"
    ],
    cons: [
      "Buffer mutations and writes are more complex and rigid",
      "Slightly larger binary footprint than Protobuf due to internal alignment padding",
      "Strict schema compilation requirement"
    ],
    snippetTitle: "FlatBuffers Schema Definition (.fbs)",
    snippetLang: "protobuf",
    snippetCode: `namespace Rendering;

enum Color:byte { Red = 0, Green, Blue }

table Vec3 {
  x:float;
  y:float;
  z:float;
}

table Monster {
  pos:Vec3;
  mana:short = 150;
  hp:short = 100;
  name:string;
  inventory:[ubyte];
  color:Color = Blue;
}

root_type Monster;`,
    diagramType: "binary",
    color: "#6366f1"
  },
  {
    id: "format-msgpack",
    name: "MessagePack",
    title: "MessagePack (Binary JSON)",
    extension: ".msgpack / .mpac",
    mime: "application/x-msgpack",
    magicBytes: "Type prefix headers (e.g., 0x80-0x8f fixmap)",
    year: 2008,
    category: "binary",
    paradigm: "Schema-less Dynamic Binary Serialization",
    creator: "Sadayuki Furuhashi",
    standard: "MessagePack specification",
    encoding: "Binary (Type-prefixed byte tags)",
    structure: "Binary Maps, Arrays, Scalars, Ext types",
    schemaType: "Schema-less (Self-describing like JSON)",
    compression: "Compact variable byte representation",
    website: "https://msgpack.org",
    description: "MessagePack is an efficient binary serialization format that operates 'like JSON, but fast and small'. Unlike Protobuf and FlatBuffers, MessagePack does not require a prior schema file or compilation step; it is self-describing. By encoding JSON data structures into compact 1-byte headers (packing small integers into 1 byte and tagging short strings with minimum overhead), MessagePack provides a drop-in 2x to 5x performance and size improvement over JSON.",
    highlights: [
      "No Schema Required: Drop-in replacement for JSON; serialize any dynamic map or object on the fly.",
      "Compact Byte Prefixes: Integers from -32 to 127 are packed into a single byte; small maps and arrays use single-byte headers.",
      "Native Binary Support: Serializes raw binary byte buffers natively without requiring expensive Base64 ASCII encoding.",
      "Extension Types: Allows defining custom serialization extensions (like timestamps or UUIDs)."
    ],
    primaryUseCase: "Redis internal modules, Tarantool database, IPC messaging, high-throughput web sockets, and gaming backends.",
    pros: [
      "Zero schema compilation needed—dynamic and agile",
      "Drastically smaller and faster to serialize/deserialize than JSON",
      "Native byte array support eliminates Base64 bloat"
    ],
    cons: [
      "Repeats key names in arrays of maps (unlike schema-first columnar formats)",
      "Cannot be directly inspected in a text editor without hex/decoder tools",
      "Does not offer zero-copy reads like FlatBuffers"
    ],
    snippetTitle: "MessagePack Byte Serialization Conceptual Flow",
    snippetLang: "json",
    snippetCode: `// JSON (27 bytes):
{"compact":true,"schema":0}

// MessagePack Hex (18 bytes):
// 82 (fixmap 2 items)
//   a7 63 6f 6d 70 61 63 74 (fixstr "compact")
//   c3 (true)
//   a6 73 63 68 65 6d 61 (fixstr "schema")
//   00 (fixint 0)`,
    diagramType: "binary",
    color: "#8b5cf6"
  },
  {
    id: "format-avro",
    name: "Apache Avro",
    title: "Apache Avro",
    extension: ".avro",
    mime: "avro/binary",
    magicBytes: "Obj\\x01 (4F 62 6A 01)",
    year: 2009,
    category: "bigdata",
    paradigm: "Row-Oriented Big Data Serialization",
    creator: "Doug Cutting (Apache Hadoop)",
    standard: "Apache Software Foundation",
    encoding: "Binary with embedded JSON schema header",
    structure: "Row-oriented binary records",
    schemaType: "Strong Schema (JSON-defined schema stored in file)",
    compression: "Block-level (Snappy, Deflate, Zstandard)",
    website: "https://avro.apache.org",
    description: "Developed by Hadoop co-founder Doug Cutting, Apache Avro is the premier row-oriented binary serialization system for large-scale data streaming and distributed processing. Avro stores the complete JSON schema directly inside the file header of every container file, meaning files are completely self-describing while data records remain ultra-compact without repeating field names or types. It is the gold standard for Apache Kafka message streams and Kafka Schema Registry.",
    highlights: [
      "Schema Embedded in Header: Data files contain the schema definition in the container header, ensuring files never lose their schema context.",
      "Schema Evolution & Compatibility: Superior support for schema drift (full, backward, forward) with default values, resolving discrepancies between reader and writer schemas.",
      "Splittable Sync Markers: Container files feature 16-byte sync markers between data blocks, allowing Hadoop/Spark to split files across parallel workers.",
      "Kafka Standard: The dominant serialization format in enterprise event streaming architectures."
    ],
    primaryUseCase: "Apache Kafka event streaming, Hadoop raw data ingestion, Schema Registry pipelines, and transactional event logs.",
    pros: [
      "Self-contained container files with embedded JSON schema",
      "Industry-leading schema evolution rules for streaming data",
      "Splittable blocks enable massive parallel processing across clusters"
    ],
    cons: [
      "Row-oriented: poor performance for analytical queries scanning a few columns across billions of rows",
      "Requires schema registry coordination for real-time Kafka streams",
      "Complex toolchain compared to plain text"
    ],
    snippetTitle: "Avro JSON Schema Definition (.avsc)",
    snippetLang: "json",
    snippetCode: `{
  "type": "record",
  "name": "FinancialAuditRecord",
  "namespace": "com.bank.audit",
  "fields": [
    { "name": "tx_id", "type": "string" },
    { "name": "timestamp_epoch_ms", "type": "long" },
    { "name": "account_number", "type": "string" },
    { "name": "amount_cents", "type": "long" },
    { "name": "currency", "type": "string", "default": "USD" },
    { "name": "risk_score", "type": ["null", "float"], "default": null }
  ]
}`,
    diagramType: "bigdata",
    color: "#d946ef"
  },
  // 4. Columnar & Big Data Analytical
  {
    id: "format-parquet",
    name: "Apache Parquet",
    title: "Apache Parquet (Columnar Storage)",
    extension: ".parquet",
    mime: "application/vnd.apache.parquet",
    magicBytes: "PAR1 (ASCII 50 41 52 31 at head & tail)",
    year: 2013,
    category: "bigdata",
    paradigm: "Columnar Analytical Storage",
    creator: "Twitter & Cloudera (Dremel paper)",
    standard: "Apache Software Foundation",
    encoding: "Columnar (Run-Length, Dictionary, Delta, Bit-packing)",
    structure: "Row Groups -> Column Chunks -> Data Pages",
    schemaType: "Strong Schema (Metadata footer with Thrift)",
    compression: "Page-level (Snappy, ZSTD, Gzip, LZ4)",
    website: "https://parquet.apache.org",
    description: "Apache Parquet is the undisputed king of modern analytical data formats. Born from Google's seminal 2010 Dremel paper and open-sourced jointly by Twitter and Cloudera, Parquet organizes tabular data by columns rather than rows. Instead of storing entire records contiguously, Parquet stores all values of column A together, then column B. This enables massive compression ratios (dictionary encoding, run-length encoding), projection pushdown (only reading queried columns), and predicate pushdown (skipping entire row groups using min/max statistics in the file footer). It powers modern data lakes, DuckDB, ClickHouse, Snowflake, Databricks, and Apache Spark.",
    highlights: [
      "Columnar Layout: Queries like `SELECT avg(price) FROM sales` only read the price column from disk, skipping 95% of I/O compared to CSV.",
      "Advanced Encoding Algorithms: Uses Dictionary encoding, Run-Length Encoding (RLE), and Bit-Packing to compress identical values into negligible bits.",
      "Footer Metadata & Predicate Pushdown: File footer contains row-group min/max statistics; queries with `WHERE date > 2026` skip non-matching chunks without decompression.",
      "Dremel Nested Data Model: Perfectly preserves complex nested record structures (lists, structs, maps) using definition and repetition levels."
    ],
    primaryUseCase: "Data lakehouses (Iceberg, Delta Lake), DuckDB analytics, Apache Spark, Snowflake external tables, and cloud data warehouses.",
    pros: [
      "10x to 100x query speedup over row-oriented formats for analytical workloads",
      "Exceptional compression ratios (often 70-90% smaller than raw CSV)",
      "Universal support in modern data science (pandas, polars, duckdb, arrow)"
    ],
    cons: [
      "Immutable write pattern: modifying a single row requires rewriting the row group or partition",
      "High CPU overhead when writing compared to raw append logs",
      "Unsuited for high-concurrency single-record OLTP CRUD mutations"
    ],
    snippetTitle: "Parquet Internal Physical File Layout",
    snippetLang: "text",
    snippetCode: `[Magic: 'PAR1']
┌──────────────────────────────────────────────────────────┐
│ ROW GROUP 1 (e.g. 500,000 rows)                          │
│   ├── Column 'user_id'    [Dict Encoded, Snappy]         │
│   ├── Column 'timestamp'  [Delta Encoded, Bit-Packed]    │
│   └── Column 'amount'     [Plain Float, ZSTD]            │
├──────────────────────────────────────────────────────────┤
│ ROW GROUP 2 (e.g. 500,000 rows)                          │
│   └── ...                                                │
└──────────────────────────────────────────────────────────┘
[File Metadata Footer: Schemas, Col Stats (Min/Max), Offsets]
[Footer Length: 4 bytes]
[Magic: 'PAR1']`,
    diagramType: "columnar",
    color: "#0284c7"
  },
  {
    id: "format-orc",
    name: "Apache ORC",
    title: "Apache ORC (Optimized Row Columnar)",
    extension: ".orc",
    mime: "application/orc",
    magicBytes: "ORC (ASCII 4F 52 43)",
    year: 2013,
    category: "bigdata",
    paradigm: "Columnar Storage",
    creator: "Hortonworks & Facebook (Apache Hive)",
    standard: "Apache Software Foundation",
    encoding: "Columnar (RLE, Dictionary, Bit-packing)",
    structure: "Stripes (Default 64-256MB) -> Row Groups -> Column Streams",
    schemaType: "Strong Schema (Protocol Buffers metadata)",
    compression: "Stripe-level (ZLIB, Snappy, ZSTD)",
    website: "https://orc.apache.org",
    description: "Optimized Row Columnar (ORC) is a high-performance columnar storage format conceived by Hortonworks and Apache Hive to maximize query speed and compression in Hadoop environments. Dividing files into self-contained 'Stripes' with integrated lightweight indexes (block-level Bloom filters and row group statistics every 10,000 rows), ORC is heavily optimized for Facebook Presto, Trino, and Apache Hive analytical engines.",
    highlights: [
      "Built-in Stripe Indexes: Every stripe contains its own index data, allowing skip-scanning every 10,000 rows without loading data into memory.",
      "Integrated Bloom Filters: Enables instant exclusion of stripes when querying specific IDs, bypassing irrelevant disk blocks.",
      "ACID Support in Hive: Built to natively support Hive ACID transactions, delta files, and merges.",
      "High Compression Efficiency: Often matches or marginally outperforms Parquet on string-heavy Hive benchmarks."
    ],
    primaryUseCase: "Apache Hive warehousing, Presto/Trino analytics clusters, and large enterprise Hadoop data marts.",
    pros: [
      "Built-in Bloom filters enable hyper-selective row-group skipping",
      "Stripe architecture provides clean block-level boundaries",
      "Full ACID transaction support in Apache Hive"
    ],
    cons: [
      "Less universal adoption in modern Python/Rust tools (Polars, DuckDB) than Parquet",
      "Slower reading when used outside Java/JVM-centric engines",
      "Immutable write constraints similar to Parquet"
    ],
    snippetTitle: "Apache ORC Physical Stripe Architecture",
    snippetLang: "text",
    snippetCode: `┌──────────────────────────────────────────────────────────┐
│ STRIPE 1 (Default 64MB - 256MB)                          │
│   ├── Index Data: Min/Max stats + Bloom filters (per 10k)│
│   ├── Row Data: Columnar bit streams (compressed)        │
│   └── Stripe Footer: Encoding types, stream locations    │
├──────────────────────────────────────────────────────────┤
│ STRIPE 2 ...                                             │
├──────────────────────────────────────────────────────────┤
│ FILE FOOTER: Schema metadata, stripe statistics          │
│ POSTSCRIPT: Cache sizes, compression parameters, 'ORC'   │
└──────────────────────────────────────────────────────────┘`,
    diagramType: "columnar",
    color: "#0891b2"
  },
  {
    id: "format-feather",
    name: "Arrow / Feather",
    title: "Apache Arrow / Feather (IPC / Memory)",
    extension: ".arrow / .feather",
    mime: "application/vnd.apache.arrow.file",
    magicBytes: "ARROW1 (ASCII 41 52 52 4F 57 31)",
    year: 2016,
    category: "bigdata",
    paradigm: "In-Memory / Zero-Copy Columnar Format",
    creator: "Wes McKinney (pandas) & Apache Arrow Community",
    standard: "Apache Software Foundation",
    encoding: "Binary (Exact Arrow In-Memory Memory Buffers)",
    structure: "RecordBatches with memory-aligned buffer arrays",
    schemaType: "Strong Schema (Embedded Arrow Schema)",
    compression: "Optional (LZ4_FRAME, ZSTD)",
    website: "https://arrow.apache.org",
    description: "Apache Arrow Feather (now the official Arrow IPC file format) solves the data interchange bottleneck between modern data tools. In traditional computing, transferring data between Python (pandas), R, Rust (Polars), and C++ requires expensive serialization and deserialization. Arrow defines a standardized, language-independent columnar in-memory representation. The Feather format simply flushes this exact in-memory layout to disk. When read back, it can be mmap()'d into RAM instantly with zero copy and zero CPU parsing overhead.",
    highlights: [
      "Zero-Copy Interoperability: Flash data directly between Python, C++, Rust, Go, Java, and JavaScript runtimes without data conversion.",
      "SIMD Vector Acceleration: Memory buffers are aligned to 64-byte CPU cache lines, unlocking modern AVX-512 hardware SIMD vector operations.",
      "Blazing Fast I/O: Reading a Feather file is limited only by disk read bandwidth (NVMe speeds up to several GB/sec).",
      "Not Designed for Cold Archival: Prioritizes instant CPU consumption over maximum compression (use Parquet for long-term cold storage)."
    ],
    primaryUseCase: "IPC between Python and Rust/C++, Polars dataframe caching, fast machine learning pipeline feature interchange, and GPU (CUDA) data transfer.",
    pros: [
      "Instant zero-copy reading via memory mapping (mmap)",
      "Direct SIMD hardware execution compatibility",
      "Universal cross-language data frame interoperability"
    ],
    cons: [
      "Larger file size on disk compared to heavily encoded Parquet",
      "Optimized for memory interchange rather than complex cold archival queries",
      "Schema must be strictly defined before writing"
    ],
    snippetTitle: "Arrow In-Memory Memory Buffer Layout",
    snippetLang: "text",
    snippetCode: `/* 64-byte aligned SIMD in-memory chunk */
Length: 5 | Null Count: 1
Validity Bitmap: [1, 1, 0, 1, 1] (bit 2 is null)
Value Array:     [14, 28,  0, 42, 56] (int32 aligned)

Offsets Buffer:  [0, 4, 9, 14, 18, 24] (for variable strings)
Values Buffer:   "apple""grape""lemon""peach"
-> CPU reads directly with zero deserialization overhead!`,
    diagramType: "columnar",
    color: "#2563eb"
  },
  // 5. Scientific & Multidimensional
  {
    id: "format-hdf5",
    name: "HDF5",
    title: "HDF5 (Hierarchical Data Format 5)",
    extension: ".h5 / .hdf5",
    mime: "application/x-hdf5",
    magicBytes: "\\x89HDF\\r\\n\\x1a\\n (89 48 44 46 0D 0A 1A 0A)",
    year: 1998,
    category: "scientific",
    paradigm: "Hierarchical Multidimensional Array Storage",
    creator: "National Center for Supercomputing Applications (NCSA)",
    standard: "The HDF Group",
    encoding: "Binary self-describing tree",
    structure: "File-system inside a file (Groups, Datasets, Attributes)",
    schemaType: "Self-describing strongly-typed multidimensional tensors",
    compression: "Chunk-level (Gzip, SZIP, Blosc filters)",
    website: "https://www.hdfgroup.org",
    description: "Hierarchical Data Format 5 (HDF5) is designed to store and organize colossal quantities of numerical and scientific data. Think of HDF5 as an entire operating system file-system bundled into a single file: it contains 'Groups' (directories) and 'Datasets' (multidimensional N-dimensional arrays like tensors and matrices) with metadata attributes. Engineered for supercomputing, particle physics (CERN), climate modeling (NASA EarthData), and deep learning (early Keras weights), HDF5 handles petabyte datasets with hyperslab slicing.",
    highlights: [
      "File-system within a File: Organizes datasets into nested hierarchies (/sensors/temperature/raw) inside a single disk file.",
      "Hyperslab Slicing: Extract a 2D slice from an enormous 5D tensor without reading or decompressing the rest of the file.",
      "Parallel I/O (MPI-IO): Supports concurrent reads and writes across thousands of supercomputer nodes.",
      "Monolithic C Library: The reference implementation is a massive, complex C library with internal global locking, making multithreading tricky."
    ],
    primaryUseCase: "Climate simulation models, radio astronomy, particle physics (CERN), biomedical imaging, and neuroimaging (NWB).",
    pros: [
      "Superb for multi-terabyte N-dimensional numerical matrices",
      "Selective partial hyperslab reading without full file load",
      "Battle-tested in high-performance scientific supercomputing"
    ],
    cons: [
      "Monolithic C library dependency with historical threading lock issues",
      "File corruption risk if a write process crashes unexpectedly before closing",
      "Not cloud-native: poor compatibility with object storage (S3 / GCS) chunking"
    ],
    snippetTitle: "HDF5 Internal Group Hierarchy & Slicing",
    snippetLang: "python",
    snippetCode: `import h5py
import numpy as np

# Create an HDF5 scientific container
with h5py.File("simulation_run.h5", "w") as f:
    # Groups behave like directories
    grp = f.create_group("atmospheric_model/2026")
    
    # Chunked, compressed 4D tensor (Time, Lat, Lon, Altitude)
    data = np.random.randn(365, 180, 360, 50)
    dset = grp.create_dataset(
        "pressure_tensor", 
        data=data, 
        chunks=(1, 180, 360, 10), 
        compression="gzip"
    )

# Selective hyperslab reading: Only 1 day, 1 altitude layer!
with h5py.File("simulation_run.h5", "r") as f:
    slice_day0 = f["atmospheric_model/2026/pressure_tensor"][0, :, :, 0]`,
    diagramType: "scientific",
    color: "#059669"
  },
  {
    id: "format-netcdf",
    name: "NetCDF",
    title: "NetCDF (Network Common Data Form)",
    extension: ".nc / .nc4",
    mime: "application/x-netcdf",
    magicBytes: "CDF\\x01 / \\x89HDF (NetCDF-4 uses HDF5)",
    year: 1989,
    category: "scientific",
    paradigm: "Array-Oriented Geospatial & Earth Science",
    creator: "Unidata (UCAR)",
    standard: "OGC Standard / Unidata",
    encoding: "Binary self-describing",
    structure: "Dimensions, Variables, and Attributes",
    schemaType: "Strong metadata (Climate and Forecast CF Conventions)",
    compression: "Internal (via HDF5 layer in NetCDF-4)",
    website: "https://www.unidata.ucar.edu/software/netcdf/",
    description: "Network Common Data Form (NetCDF) is the foundational data format for meteorology, oceanography, climatology, and Earth observation data. NetCDF provides self-describing, machine-independent array structures enriched with standard scientific metadata conventions (the Climate and Forecast / CF metadata conventions). Modern NetCDF-4 is built on top of HDF5, combining HDF5's high-speed chunked compression with standardized Earth science dimensions like latitude, longitude, and time.",
    highlights: [
      "Standardized Earth Science Dimensions: Variables share explicit named dimensions (e.g., time, lat, lon) with coordinate units.",
      "CF Metadata Conventions: Strict standard tags for units, coordinate reference systems (CRS), and missing value flags (-9999).",
      "Open Geospatial Consortium (OGC) Standard: The mandated format for global IPCC climate reports and satellite weather feeds (NOAA, ECMWF).",
      "Seamless Python Xarray Integration: Directly loads into python xarray datasets for multidimensional climate analytics."
    ],
    primaryUseCase: "Weather forecasts (NOAA, ECMWF), climate change modeling (IPCC), satellite radar remote sensing, and oceanographic buoys.",
    pros: [
      "Standardized conventions eliminate ambiguity in physical scientific units",
      "Seamless integration with GIS and spatial analysis software",
      "Self-describing coordinates facilitate multidimensional mathematical operations"
    ],
    cons: [
      "Legacy NetCDF-3 lacks compression and groups (NetCDF-4 required)",
      "Steep learning curve for understanding coordinate variables vs data variables",
      "Requires domain-specific libraries (netCDF4, xarray, GDAL)"
    ],
    snippetTitle: "NetCDF CDL (Common Data Language) Dump",
    snippetLang: "text",
    snippetCode: `netcdf global_sea_surface_temp {
dimensions:
    time = UNLIMITED ; // (365 currently)
    lat = 720 ;
    lon = 1440 ;
variables:
    float lat(lat) ;
        lat:units = "degrees_north" ;
    float lon(lon) ;
        lon:units = "degrees_east" ;
    double time(time) ;
        time:units = "days since 2026-01-01 00:00:00" ;
    float sst(time, lat, lon) ;
        sst:units = "kelvin" ;
        sst:_FillValue = -9999.0f ;
        sst:long_name = "Sea Surface Temperature" ;
}`,
    diagramType: "scientific",
    color: "#14b8a6"
  },
  {
    id: "format-zarr",
    name: "Zarr",
    title: "Zarr (Cloud-Native N-D Arrays)",
    extension: ".zarr",
    mime: "application/x-zarr",
    magicBytes: "Directory / Key-Value chunks (JSON metadata)",
    year: 2016,
    category: "scientific",
    paradigm: "Cloud-Native Multidimensional Chunks",
    creator: "Alistair Miles",
    standard: "Zarr Community / NumFOCUS",
    encoding: "Binary chunks (Blosc, Zstandard, Gzip) + JSON metadata",
    structure: "Object-store hierarchy of chunked array keys",
    schemaType: "Strongly typed via .zarray metadata JSON",
    compression: "Pluggable chunk-level (Blosc, ZSTD, LZ4)",
    website: "https://zarr.dev",
    description: "Zarr represents the modern, cloud-native evolution of scientific array formats like HDF5 and NetCDF. While HDF5 relies on a single monolithic file with complex internal byte offsets that break over cloud object storage (S3 / GCS), Zarr splits massive multidimensional arrays into independent, compressed chunk files stored under predictable key-value paths (e.g., `/data/0.0.1`). Combined with lightweight JSON metadata, Zarr enables massively parallel reads and writes across thousands of serverless cloud functions without file locks.",
    highlights: [
      "Cloud-Native Object Storage Native: Stored cleanly in AWS S3, Google Cloud Storage, or Azure Blob without POSIX filesystem requirements.",
      "Lock-Free Parallel Writing: Separate workers can write different chunks in parallel without coordinator locks.",
      "Pluggable Modern Codecs: Out-of-the-box support for Blosc, Zstandard, and quantizing bit-filters for lightning compression.",
      "Bioimaging & OME-Zarr: Rapidly becoming the global standard for high-resolution 3D microscopy and genomics."
    ],
    primaryUseCase: "Cloud-native climate analytics (Pangeo), petabyte-scale 3D bioimaging (OME-Zarr), and tensor array storage in AWS S3.",
    pros: [
      "Zero global file locks: perfect for distributed cloud clusters",
      "Simple, robust architecture: easy to implement in any language (Python, Rust, JS)",
      "Direct integration with Dask, Xarray, and TensorStore"
    ],
    cons: [
      "Generates thousands to millions of tiny files/keys on disk if not zipped",
      "Higher latency per chunk on high-latency cloud storage if chunks are too small",
      "Younger ecosystem compared to 30-year-old HDF5"
    ],
    snippetTitle: "Zarr S3 Key Layout & JSON Metadata",
    snippetLang: "json",
    snippetCode: `// Key layout in Cloud Bucket:
// my-tensor.zarr/.zgroup
// my-tensor.zarr/.zattrs
// my-tensor.zarr/temperature/.zarray
// my-tensor.zarr/temperature/0.0.0  <- Binary compressed chunk
// my-tensor.zarr/temperature/0.0.1  <- Binary compressed chunk

// Contents of temperature/.zarray:
{
  "zarr_format": 2,
  "shape": [1000, 2048, 2048],
  "chunks": [100, 256, 256],
  "dtype": "<f4",
  "compressor": {
    "id": "blosc",
    "cname": "zstd",
    "clevel": 5
  }
}`,
    diagramType: "scientific",
    color: "#10b981"
  },
  // 6. Geospatial
  {
    id: "format-geojson",
    name: "GeoJSON",
    title: "GeoJSON (Geographic JSON)",
    extension: ".geojson / .json",
    mime: "application/geo+json",
    magicBytes: "None (Valid JSON with 'type': 'FeatureCollection')",
    year: 2008,
    category: "geospatial",
    paradigm: "Text-Based Geographic Feature Encoding",
    creator: "Howard Butler, Martin Daly, Allan Doyle, Sean Gillies",
    standard: "RFC 7946 / IETF",
    encoding: "UTF-8",
    structure: "FeatureCollection, Feature, Geometry (Points, Lines, Polygons)",
    schemaType: "Schema-optional (RFC 7946 compliant)",
    compression: "External",
    website: "https://geojson.org",
    description: "GeoJSON is an open standard format designed for representing simple geographical features along with their non-spatial attributes. Based on JSON, it natively supports points, lines, polygons, and multi-part geometries using the World Geodetic System 1984 (WGS 84 / EPSG:4326) coordinate reference system. GeoJSON is supported natively by web mapping libraries like Leaflet, Mapbox GL, and OpenLayers, making it the easiest way to display geographic data in web browsers.",
    highlights: [
      "Web Native: Renders out-of-the-box in browser Leaflet and Mapbox canvases with straightforward JavaScript iterations.",
      "Strict WGS 84 Coordinate Standard: Enforces longitude first, latitude second ([lon, lat]) decimal degrees coordinates.",
      "Flexible Attribute Properties: Each feature contains a `properties` dictionary for arbitrary business metadata.",
      "File Bloat for Massive Geometries: Large coordinate arrays with excessive decimal precision create huge file sizes and slow DOM parsing."
    ],
    primaryUseCase: "Web maps (Leaflet, Mapbox), municipal open data portals, territorial boundaries, and spatial API payloads.",
    pros: [
      "Human-readable, web-native, and effortlessly manipulated in JavaScript",
      "Direct integration with GitHub (renders interactive maps natively)",
      "Standardized WGS 84 coordinate reference system"
    ],
    cons: [
      "Large file size due to verbose ASCII coordinates",
      "Lacks spatial indexing: must parse entire file to query a bounding box",
      "Single-threaded CPU parsing bottleneck in web browsers for >10MB files"
    ],
    snippetTitle: "RFC 7946 GeoJSON Feature Record",
    snippetLang: "json",
    snippetCode: `{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "id": "boundary-curitiba",
      "properties": {
        "city": "Curitiba",
        "state": "Parana",
        "population": 1773733,
        "parks": 33
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [-49.2733, -25.4284],
            [-49.2600, -25.4300],
            [-49.2550, -25.4500],
            [-49.2800, -25.4450],
            [-49.2733, -25.4284]
          ]
        ]
      }
    }
  ]
}`,
    diagramType: "geospatial",
    color: "#16a34a"
  },
  {
    id: "format-geoparquet",
    name: "GeoParquet",
    title: "GeoParquet (Cloud-Native Vector Geospatial)",
    extension: ".parquet",
    mime: "application/vnd.apache.parquet",
    magicBytes: "PAR1 (Apache Parquet container)",
    year: 2022,
    category: "geospatial",
    paradigm: "Columnar Cloud-Native Spatial Vector",
    creator: "Open Geospatial Consortium (OGC)",
    standard: "OGC Community Standard",
    encoding: "WKB (Well-Known Binary) in Parquet columns",
    structure: "Parquet Row Groups + Bounding Box Metadata",
    schemaType: "Strong Parquet Schema + Spatial Metadata",
    compression: "Page-level (ZSTD, Snappy)",
    website: "https://geoparquet.org",
    description: "GeoParquet brings the revolutionary columnar analytics power of Apache Parquet to geospatial vector data. Replacing legacy Shapefiles and bloated GeoJSON files, GeoParquet encodes geometries in Well-Known Binary (WKB) columns while storing spatial bounding boxes (bbox) in Parquet column statistics. This enables spatial predicate pushdown: analytical engines like DuckDB, Sedona, and BigQuery can query billions of geographic polygons and skip 99% of non-intersecting regions without reading them.",
    highlights: [
      "Cloud-Native Spatial Analytics: Query petabyte geospatial datasets directly from Amazon S3 or Google Cloud Storage using SQL.",
      "Spatial Bounding Box Pushdown: Column statistics store min/max X, Y coordinates, allowing instant spatial pruning.",
      "Compression Superpowers: Typically 5x to 10x smaller than GeoJSON and 2x smaller than zipped Shapefiles.",
      "Interoperable Standard: Supported natively by DuckDB Spatial, GDAL, QGIS, Kepler.gl, and BigQuery."
    ],
    primaryUseCase: "Global satellite building footprints (Overture Maps), transport road networks, territorial census data, and cloud GIS.",
    pros: [
      "Unmatched analytical performance on massive spatial vector datasets",
      "Spatial range filtering skips non-intersecting row groups directly from object storage",
      "Solves the 2GB file limit and attribute truncations of 1990s Shapefiles"
    ],
    cons: [
      "Binary format: cannot be inspected in a standard plain text editor",
      "Requires modern GIS libraries with GeoParquet/Arrow drivers",
      "Writing spatially partitioned datasets requires spatial Hilbert/Morton curve sorting"
    ],
    snippetTitle: "Querying GeoParquet in DuckDB Spatial",
    snippetLang: "sql",
    snippetCode: `INSTALL spatial;
LOAD spatial;

-- Query 50 million buildings directly from cloud S3!
SELECT 
    id, 
    names.primary AS building_name,
    ST_Area(geometry) AS footprint_sq_meters
FROM read_parquet('s3://overturemaps-us-west-2/release/2026/buildings.parquet')
WHERE bbox.xmin >= -49.30 AND bbox.xmax <= -49.20
  AND bbox.ymin >= -25.50 AND bbox.ymax <= -25.40
LIMIT 10;`,
    diagramType: "geospatial",
    color: "#22c55e"
  },
  {
    id: "format-cog",
    name: "Cloud-Optimized GeoTIFF",
    title: "COG (Cloud-Optimized GeoTIFF)",
    extension: ".tif / .tiff",
    mime: "image/tiff; application=geotiff",
    magicBytes: "II*\\x00 (Little-endian TIFF 49 49 2A 00)",
    year: 2017,
    category: "geospatial",
    paradigm: "Cloud-Native Raster Tile Storage",
    creator: "Open Source Geospatial Community",
    standard: "OGC Community Standard",
    encoding: "Tiled TIFF with Internal Overviews",
    structure: "Internal Pyramidal Image Tiles (256x256 / 512x512)",
    schemaType: "GeoTIFF Projection & Coordinate Tags",
    compression: "Tile-level (Deflate, LZW, ZSTD, WebP, LERC)",
    website: "https://www.cogeo.org",
    description: "Cloud-Optimized GeoTIFF (COG) revolutionized satellite imagery and aerial photogrammetry by making raster files streaming-friendly over HTTP. Traditional TIFF files required downloading the entire multi-gigabyte file before rendering an overview. COG organizes pixels into internal tiles (e.g., 256x256 pixels) alongside pre-rendered multi-resolution pyramid overviews. Web clients and GIS servers use HTTP GET Range requests to stream only the exact pixels and zoom level needed for the current viewport.",
    highlights: [
      "HTTP Range Requests: Stream specific zoom tiles directly from cloud buckets without downloading the multi-gigabyte satellite file.",
      "Internal Pyramidal Overviews: Low-resolution zoom levels are pre-calculated and stored at the beginning of the file.",
      "Universal Satellite Standard: The default format for NASA Landsat, ESA Sentinel-2, and commercial satellite constellations.",
      "Full GeoTIFF Backward Compatibility: Standard legacy TIFF readers can still open COG files normally."
    ],
    primaryUseCase: "Satellite Earth observation (Sentinel, Landsat), digital elevation models (DEM), drone photogrammetry, and web tile servers.",
    pros: [
      "Enables on-the-fly web mapping directly from cloud object storage without custom tile servers",
      "Saves massive cloud egress bandwidth via HTTP Range reads",
      "Full backward compatibility with 30 years of GIS software"
    ],
    cons: [
      "Writing a COG requires re-tiling, computing overviews, and strict byte alignment",
      "Not suited for non-raster vector data",
      "Slightly larger file size than flat TIFF due to overviews"
    ],
    snippetTitle: "COG Internal Byte Layout & HTTP Range Streaming",
    snippetLang: "text",
    snippetCode: `┌──────────────────────────────────────────────────────────┐
│ TIFF Header & Offset Directory                           │
├──────────────────────────────────────────────────────────┤
│ OVERVIEW 16x (Thumbnail for global zoom)                │
│ OVERVIEW 4x  (Regional zoom tiles)                       │
│ FULL RESOLUTION (256x256 pixel tiles)                   │
│   ├── Tile (0,0)  |  Tile (0,1)  |  Tile (0,2)...        │
└──────────────────────────────────────────────────────────┘
Client performs:
GET /sentinel2_scene.tif HTTP/1.1
Range: bytes=4096-18432  --> Fetches ONLY the tile on screen!`,
    diagramType: "geospatial",
    color: "#65a30d"
  },
  // 7. Images & Media
  {
    id: "format-jpeg",
    name: "JPEG",
    title: "JPEG (Joint Photographic Experts Group)",
    extension: ".jpg / .jpeg",
    mime: "image/jpeg",
    magicBytes: "\\xFF\\xD8\\xFF (FF D8 FF)",
    year: 1992,
    category: "media",
    paradigm: "Lossy Transform Photographic Compression",
    creator: "Joint Photographic Experts Group (ISO/IEC)",
    standard: "ISO/IEC 10918-1 / ITU-T T.81",
    encoding: "Discrete Cosine Transform (DCT) + Huffman coding",
    structure: "JFIF / EXIF Segments & Marker Codes",
    schemaType: "EXIF / XMP Metadata",
    compression: "Lossy DCT Quantization",
    website: "https://jpeg.org",
    description: "JPEG is the most ubiquitous photographic image compression standard on Earth. Developed in 1992, JPEG leverages human visual psychoacoustics: the human eye is far more sensitive to brightness (luminance) than to fine color hue differences (chrominance). JPEG transforms 8x8 pixel blocks using the Discrete Cosine Transform (DCT), quantizes high-frequency details that the eye cannot see, and compresses the result using Huffman entropy coding. It enabled the explosion of digital photography and the early World Wide Web.",
    highlights: [
      "YUV Color Subsampling: Separates Luminance (Y) from Chrominance (Cb, Cr), discarding half or three-quarters of color data without noticeable quality loss.",
      "DCT Frequency Decomposition: Encodes 8x8 blocks as sums of cosine frequencies, allowing tunable lossy compression from 10:1 to 100:1.",
      "Universal Hardware Acceleration: Every smartphone sensor, browser, GPU, and television decodes baseline JPEG in hardware silicon.",
      "No Transparency & Generation Loss: Lacks an alpha channel, and repeatedly editing and re-saving JPEG images compounds ugly blocking artifacts."
    ],
    primaryUseCase: "Digital camera photographs, mobile photo albums, web image publishing, and legacy print archives.",
    pros: [
      "100% universal hardware and software compatibility across every device built in 30 years",
      "Exceptional compression for complex continuous-tone photographic scenes",
      "Standardized EXIF metadata for camera aperture, GPS, and timestamp storage"
    ],
    cons: [
      "No support for alpha channel transparency",
      "Produces ugly ringing and blocky artifacts on text, line art, and high-contrast UI graphics",
      "Strict 8-bit color depth in baseline profiles (causes banding in HDR gradients)"
    ],
    snippetTitle: "JPEG Compression Pipeline Architecture",
    snippetLang: "text",
    snippetCode: `[RGB Image] 
     │
     ▼
[RGB -> YCbCr Color Conversion]
     │
     ▼
[Chroma Subsampling (4:2:0 / 4:2:2)]
     │
     ▼
[8x8 Pixel Block Splitting]
     │
     ▼
[Discrete Cosine Transform (DCT)]
     │
     ▼
[Quantization (Lossy Step: drops high frequencies)]
     │
     ▼
[Zig-Zag Scan & Huffman / Arithmetic Entropy Coding]
     │
     ▼
[.JPEG File (FF D8 FF E0...)]`,
    diagramType: "media",
    color: "#f97316"
  },
  {
    id: "format-png",
    name: "PNG",
    title: "PNG (Portable Network Graphics)",
    extension: ".png",
    mime: "image/png",
    magicBytes: "\\x89PNG\\r\\n\\x1a\\n (89 50 4E 47 0D 0A 1A 0A)",
    year: 1996,
    category: "media",
    paradigm: "Lossless Filtered Bitmaps with Alpha",
    creator: "PNG Development Group (Thomas Boutell, et al.)",
    standard: "W3C Recommendation / ISO/IEC 15948",
    encoding: "2D Filtering (Sub, Up, Average, Paeth) + DEFLATE",
    structure: "Chunk-based (IHDR, PLTE, IDAT, IEND)",
    schemaType: "tEXt / zTXt / eXIf Metadata chunks",
    compression: "Lossless DEFLATE (LZ77 + Huffman)",
    website: "http://www.libpng.org/pub/png/",
    description: "Portable Network Graphics (PNG) was created in 1996 to replace the patented GIF format. PNG is an extensible chunk-based raster format providing bit-perfect lossless compression and full 8-bit / 16-bit alpha channel transparency (supporting 256 levels of smooth translucent anti-aliasing). By applying predictive 2D spatial filtering (Paeth, Sub, Up) before feeding scanlines to DEFLATE compression, PNG achieves high efficiency on screenshots, logos, diagrams, and digital graphics with sharp contrast.",
    highlights: [
      "Lossless Fidelity: Bit-for-bit identical reproduction—zero compression artifacts, blur, or data loss.",
      "Full Alpha Channel Transparency: Supports true 8-bit and 16-bit alpha transparency for drop shadows and smooth UI overlays.",
      "Predictive Row Filters: Analyzes neighboring pixels to minimize entropy before compression, making repeated colors compact.",
      "Massive Files for Photos: Losslessly storing continuous-tone photos results in files 5x to 10x larger than JPEG or WebP."
    ],
    primaryUseCase: "Screenshots, user interface graphics, transparent logos, medical imaging, and game sprite sheets.",
    pros: [
      "Lossless precision with zero degradation over multiple edits",
      "Full 8-bit translucent alpha blending",
      "Universal web browser and desktop tool support"
    ],
    cons: [
      "Excessively heavy file size for real-world photographic imagery",
      "No native multi-frame animation in standard PNG (APNG is an unofficial extension)",
      "Higher memory decoding footprint for massive canvases"
    ],
    snippetTitle: "PNG Chunk Architecture Spec",
    snippetLang: "text",
    snippetCode: `[Magic: 89 50 4E 47 0D 0A 1A 0A]
┌──────────────────────────────────────────────────────────┐
│ IHDR Chunk: Width, Height, Bit depth, Color type, Filter │
├──────────────────────────────────────────────────────────┤
│ pHYs Chunk: Physical pixel dimensions (DPI)              │
├──────────────────────────────────────────────────────────┤
│ IDAT Chunk 1: [DEFLATE-compressed scanlines]             │
│ IDAT Chunk 2: [DEFLATE-compressed scanlines]             │
├──────────────────────────────────────────────────────────┤
│ IEND Chunk: File termination trailer                     │
└──────────────────────────────────────────────────────────┘`,
    diagramType: "media",
    color: "#38bdf8"
  },
  {
    id: "format-webp",
    name: "WebP",
    title: "WebP (Modern Web Image Format)",
    extension: ".webp",
    mime: "image/webp",
    magicBytes: "RIFF....WEBP (ASCII 52 49 46 46 ... 57 45 42 50)",
    year: 2010,
    category: "media",
    paradigm: "Modern Hybrid Web Image Format",
    creator: "Google (On2 Technologies VP8 codec)",
    standard: "WebP specification / Google Open Source",
    encoding: "Lossy VP8 intra-frame / Lossless predictive transform",
    structure: "RIFF container (VP8 / VP8L / ANIM chunks)",
    schemaType: "EXIF / XMP / ICC profile chunks",
    compression: "Lossy (VP8 macroblocks) or Lossless (Entropy + color cache)",
    website: "https://developers.google.com/speed/webp",
    description: "Developed by Google using technologies derived from the VP8 video codec, WebP was created to supersede both JPEG and PNG for the modern web. WebP supports lossy compression (typically 25-34% smaller than comparable JPEG images), lossless compression (26% smaller than PNG), alpha channel transparency in both modes, and animated sequences in a fraction of GIF's file size. Today, WebP is supported across 98%+ of global web browsers.",
    highlights: [
      "Unifies JPEG, PNG, and GIF: A single format capable of lossy photos, lossless diagrams with transparency, and animations.",
      "VP8 Macroblock Prediction: Uses intra-frame predictive modeling to forecast pixel values from neighboring blocks before encoding errors.",
      "Drastic Bandwidth Savings: Reduces web page weight, boosting Google Core Web Vitals (LCP) and page load speed.",
      "Universal Web Support: Standardized across Chrome, Safari, Firefox, and Edge."
    ],
    primaryUseCase: "Web image delivery, e-commerce product catalogs, responsive hero banners, and mobile app assets.",
    pros: [
      "Significantly smaller file size than JPEG and PNG at equivalent visual fidelity",
      "Supports alpha channel transparency in both lossy and lossless modes",
      "Replaces inefficient GIF animations with 60-80% smaller payloads"
    ],
    cons: [
      "Slower encoding times on servers compared to baseline JPEG",
      "Historical lag in desktop image editors (older Photoshop versions require plugins)",
      "Newer codecs like AVIF achieve even higher compression at low bitrates"
    ],
    snippetTitle: "WebP RIFF Container Specification",
    snippetLang: "text",
    snippetCode: `0x00: 'RIFF' (4 bytes)
0x04: File Size (4 bytes)
0x08: 'WEBP' (4 bytes)
0x0C: Chunk Header:
      - 'VP8 ' (Lossy VP8 video frame) OR
      - 'VP8L' (Lossless compressed bitmap) OR
      - 'VP8X' (Extended: Alpha channel, Animation, EXIF, ICC)
0x14: Data payload with entropy-coded macroblocks`,
    diagramType: "media",
    color: "#0ea5e9"
  },
  {
    id: "format-avif",
    name: "AVIF",
    title: "AVIF (AV1 Image File Format)",
    extension: ".avif",
    mime: "image/avif",
    magicBytes: "....ftypavif (ASCII 66 74 79 70 61 76 69 66)",
    year: 2019,
    category: "media",
    paradigm: "Next-Gen Video-Derived Still Image Format",
    creator: "Alliance for Open Media (AOMedia: Google, Apple, Mozilla, Netflix)",
    standard: "ISO/IEC 23000-22 (HEIF container with AV1 bitstream)",
    encoding: "AV1 video codec intra-frame encoding",
    structure: "ISOBMFF / HEIF Box structure (ftyp, meta, mdat)",
    schemaType: "HDR metadata, ICC, Exif, XMP",
    compression: "Super-advanced AV1 transform & directional filter",
    website: "https://aomediacodec.github.io/av1-avif/",
    description: "The AV1 Image File Format (AVIF) represents the pinnacle of still-image compression. Standardized by the Alliance for Open Media (AOMedia), AVIF extracts the intra-frame encoding capabilities of the royalty-free AV1 video codec and wraps them in an ISO Base Media File Format (HEIF) container. AVIF achieves up to 50% smaller file sizes than JPEG and 20% smaller than WebP while introducing native 10-bit and 12-bit High Dynamic Range (HDR) color, wide color gamuts (BT.2020), and flawless alpha channels.",
    highlights: [
      "Extreme Compression Efficiency: Delivers clear, artifact-free photos at microscopic bitrates where JPEG degrades into pixel soup.",
      "Native HDR & Wide Gamut: First-class support for 10-bit and 12-bit color depth, Rec.2020, and HDR gain maps for mobile screens.",
      "Zero Blockiness: Modern deblocking and directional deringing filters prevent the harsh 8x8 block artifacts common to JPEG.",
      "Higher CPU Encoding Cost: Encoding AVIF images on servers consumes more CPU cycles than legacy formats."
    ],
    primaryUseCase: "Cutting-edge web delivery (HTML <picture> srcset), high-end mobile photography, and HDR wallpapers.",
    pros: [
      "Highest quality-per-byte ratio of any production image format today",
      "Native 10-bit / 12-bit HDR and wide color gamut support",
      "Backed by all major tech giants (Google, Apple, Microsoft, Netflix, Meta)"
    ],
    cons: [
      "Computationally heavy encoding (can be 10x slower to encode than JPEG)",
      "Incomplete support in older operating systems and legacy graphic utilities",
      "Can aggressively smooth very fine film-grain textures at aggressive compression"
    ],
    snippetTitle: "Modern Responsive Web Image Strategy",
    snippetLang: "html",
    snippetCode: `<!-- State-of-the-art web delivery tier -->
<picture>
  <!-- Next-gen tier: 50% smaller than JPEG -->
  <source srcset="/images/hero.avif" type="image/avif">
  
  <!-- Modern web tier: 30% smaller than JPEG -->
  <source srcset="/images/hero.webp" type="image/webp">
  
  <!-- Universal legacy fallback -->
  <img src="/images/hero.jpg" alt="Optimized visual asset" loading="lazy">
</picture>`,
    diagramType: "media",
    color: "#6366f1"
  },
  {
    id: "format-svg",
    name: "SVG",
    title: "SVG (Scalable Vector Graphics)",
    extension: ".svg",
    mime: "image/svg+xml",
    magicBytes: "<?xml or <svg (ASCII text)",
    year: 1999,
    category: "media",
    paradigm: "XML-Based Resolution-Independent Vector",
    creator: "W3C (World Wide Web Consortium)",
    standard: "W3C Recommendation SVG 1.1 / 2",
    encoding: "UTF-8 XML text",
    structure: "XML DOM Elements (<path>, <rect>, <circle>, <g>)",
    schemaType: "W3C SVG DTD / Schema",
    compression: "SVGZ (gzip) / minify",
    website: "https://www.w3.org/Graphics/SVG/",
    description: "Scalable Vector Graphics (SVG) is an XML-based markup format for describing two-dimensional vector graphics. Unlike raster bitmaps that store finite grids of pixels, SVG defines shapes mathematically using paths, Bézier curves, coordinates, and styling attributes. This means SVG graphics scale infinitely to any screen resolution, 8K monitor, or mobile display with crisp sharpness and zero pixelation. Because SVG is valid XML, it can be styled directly with CSS, animated with JavaScript, and manipulated inside the browser DOM.",
    highlights: [
      "Infinite Scalability: Sharp, crisp rendering at 16x16 icon size or on a 100-foot billboard without ever pixelating.",
      "DOM & CSS Scriptable: Can be embedded inline in HTML; inspect elements, style paths with CSS hover transitions, and animate with GSAP.",
      "Compact for Icons & Diagrams: Simple vector logos and diagrams often weigh only 2KB to 10KB.",
      "Not for Photographs: Attempting to represent real-world photographs with vector paths results in astronomical file sizes and frozen browser renderers."
    ],
    primaryUseCase: "Website logos, UI icon sets (Lucide, Feather, Heroicons), architectural blueprints, data visualizations (D3.js), and charts.",
    pros: [
      "Infinite resolution independence across all Retina / 4K displays",
      "Direct styling with CSS and interactivity with JavaScript",
      "Trivial to minify and gzip over HTTP"
    ],
    cons: [
      "Unsuited for photographic, continuous-tone imagery",
      "Complex vector paths with thousands of points can slow browser CPU rendering",
      "Security risk if rendering untrusted user SVGs (can execute embedded <script> tags: XSS)"
    ],
    snippetTitle: "Interactive SVG Vector Markup",
    snippetLang: "xml",
    snippetCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <style>
    .pulse-dot { fill: #10b981; animation: pulse 2s infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
  </style>
  <circle cx="12" cy="12" r="10" stroke="#3b82f6" stroke-width="2" fill="none"/>
  <circle cx="12" cy="12" r="4" class="pulse-dot"/>
  <path d="M 12 2 L 12 6 M 12 18 L 12 22" stroke="#3b82f6" stroke-width="2"/>
</svg>`,
    diagramType: "media",
    color: "#ec4899"
  }
];

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

// Generate the card HTML and JSON output
const galleryItems = dataFormats.map((fmt, idx) => {
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

fs.writeFileSync("/home/guigo/Documents/05-ghpages-gui13go/frontend/public/data/data-formats.json", JSON.stringify(galleryItems, null, 2));
console.log(`Successfully generated /data/data-formats.json with ${galleryItems.length} entries!`);
