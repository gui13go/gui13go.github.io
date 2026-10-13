const fs = require("fs");
const path = require("path");

const rawList = [
  {
    name: "PostgreSQL",
    title: "PostgreSQL",
    year: 1996,
    paradigm: "Relational / ORDBMS",
    category: "relational",
    license: "PostgreSQL License (BSD-like)",
    storageEngine: "Heap Files (append-only MVCC) + Buffer Pool",
    storageModel: "Row-Oriented",
    queryLang: "SQL (ANSI compliant) + PL/pgSQL",
    concurrency: "MVCC (Snapshot Isolation & SSI)",
    creator: "Michael Stonebraker & PostgreSQL Global Development Group",
    website: "https://www.postgresql.org",
    symbol: "PG",
    description: "PostgreSQL is an enterprise-class, open-source object-relational database system with more than 35 years of active development. Known as the 'Linux of Databases', Postgres is famed for rock-solid data integrity, extensibility (foreign data wrappers, custom data types, PostGIS, pgvector), and full ACID compliance. It handles complex analytical queries, transactional workloads, and JSON document structures with equal mastery.",
    highlights: [
      "MVCC Architecture: Multi-Version Concurrency Control prevents read-write blocking by retaining row versions during transactions.",
      "Unmatched Extensibility: Pluggable procedural languages, custom index types (B-Tree, Hash, GiST, SP-GiST, GIN, BRIN), and extensions like PostGIS and pgvector.",
      "Reliable Write-Ahead Logging (WAL): Guarantees zero data loss with point-in-time recovery (PITR) and synchronous/asynchronous streaming replication.",
      "Native Hybrid Semi-Structured Data: Fast binary JSON processing via JSONB with GIN indexing for document queries."
    ]
  },
  {
    name: "SQLite",
    title: "SQLite",
    year: 2000,
    paradigm: "Embedded Relational (OLTP)",
    category: "embedded",
    license: "Public Domain",
    storageEngine: "B-Tree on Flat File / Pager Architecture",
    storageModel: "Row-Oriented",
    queryLang: "SQL",
    concurrency: "Single-Writer / Multiple-Readers (WAL mode)",
    creator: "D. Richard Hipp",
    website: "https://www.sqlite.org",
    symbol: "SL",
    description: "SQLite is a C-language library that implements a small, fast, self-contained, high-reliability, full-featured SQL database engine. Unlike client-server databases, SQLite does not run as a standalone background process; instead, it compiles directly into host applications and stores the entire database in a single cross-platform disk file. It is the most widely deployed database engine on Earth, running on billions of smartphones, browsers, IoT devices, and operating systems.",
    highlights: [
      "Zero-Configuration & Serverless: No server process to install, configure, manage, or restart. Simply open a file path and query.",
      "Single-File Portability: The entire database (schema, data, tables, indexes) is stored in a single standard cross-platform binary file.",
      "WAL Mode Performance: Write-Ahead Logging allows concurrent readers to operate without blocking writes and vice versa.",
      "100% Branch Test Coverage: One of the most rigorously tested software libraries in computing history."
    ]
  },
  {
    name: "DuckDB",
    title: "DuckDB",
    year: 2019,
    paradigm: "Embedded Analytical (OLAP)",
    category: "olap",
    license: "MIT License",
    storageEngine: "Columnar Vectorized Execution Engine",
    storageModel: "Columnar",
    queryLang: "SQL (PostgreSQL-dialect extensions)",
    concurrency: "Multi-Version Concurrency Control (MVCC)",
    creator: "Hannes Mühleisen & Mark Raasveldt (CWI Amsterdam)",
    website: "https://duckdb.org",
    symbol: "DK",
    description: "DuckDB is an in-process SQL OLAP database management system often dubbed 'the SQLite for Analytics'. Designed for analytical query processing, DuckDB processes tabular data column by column using state-of-the-art vectorized SIMD query execution. It embeds seamlessly into Python, R, Node.js, and WASM runtimes, querying gigabytes of Parquet, CSV, and Arrow files with lightning speed without requiring a remote database server.",
    highlights: [
      "Vectorized SIMD Execution Engine: Executes query kernels in CPU cache on vector arrays of data, unlocking blistering analytical throughput.",
      "Direct Zero-Copy File Querying: Directly queries remote or local Parquet, Arrow, CSV, and JSON files without prior ingestion.",
      "Zero External Dependencies: Clean C++11 single-file amalgamations that embed anywhere from a Lambda function to a browser tab via WebAssembly.",
      "Advanced Analytic SQL: Supports ASOF joins, window functions, regex, recursive CTEs, and automatic query parallelization across CPU cores."
    ]
  },
  {
    name: "IndexedDB",
    title: "IndexedDB",
    year: 2015,
    paradigm: "Browser Client-Side NoSQL",
    category: "embedded",
    license: "W3C Web Standard",
    storageEngine: "Browser Host Native (LevelDB / SQLite under the hood)",
    storageModel: "Object Store Key-Path",
    queryLang: "JavaScript Event-Driven Asynchronous API",
    concurrency: "Transaction-Based (Read-Only / Read-Write locks)",
    creator: "W3C Web Applications Working Group (Nikunj Mehta et al.)",
    website: "https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API",
    symbol: "IDB",
    description: "IndexedDB is a low-level browser API for client-side storage of significant amounts of structured data, including files and blobs. Unlike localStorage (which is synchronous, string-only, and capped at ~5MB), IndexedDB operates asynchronously, provides ACID transactional guarantees, allows indexes for high-performance searches, and can store gigabytes of offline application state right inside Chrome, Firefox, Safari, and Edge.",
    highlights: [
      "Structured Object Stores: Stores native JavaScript objects, Blobs, ArrayBuffers, and JSON records without serialization overhead.",
      "Asynchronous & Non-Blocking: DOM rendering and UI threads are never blocked during intensive disk I/O.",
      "Compound Secondary Indexes: Index multiple object properties to enable range queries, cursors, and exact-match searches.",
      "Offline-First Web Foundation: Essential architectural backbone for Progressive Web Apps (PWAs), offline caching, and local-first software."
    ]
  },
  {
    name: "Redis",
    title: "Redis",
    year: 2009,
    paradigm: "In-Memory Key-Value / Data Structures",
    category: "nosql",
    license: "Source-Available / RSALv2 / SSPLv1",
    storageEngine: "In-Memory Hash Table + SkipLists + Radix Trees",
    storageModel: "RAM-first In-Memory",
    queryLang: "Command Protocol (RESP) + Lua Scripts",
    concurrency: "Single-Threaded Event Loop (Multiplexed I/O)",
    creator: "Salvatore Sanfilippo (antirez)",
    website: "https://redis.io",
    symbol: "RD",
    description: "Redis (Remote Dictionary Server) is an open-source, in-memory data store used by millions of developers as a cache, message broker, streaming engine, and database. By keeping all primary data in RAM and executing operations on native data structures (Strings, Hashes, Lists, Sets, Sorted Sets, Bitmaps, HyperLogLogs, Geospatial indexes), Redis routinely serves millions of requests per second with sub-millisecond latencies.",
    highlights: [
      "Sub-Millisecond In-Memory Speed: Direct RAM lookups execute without disk seek penalties, serving P99 latencies under 1 millisecond.",
      "Rich Native Data Structures: Manipulate complex arrays, sorted rankings, sets, and geospatial coordinates atomically.",
      "Configurable Persistence: Balances speed and durability via point-in-time snapshots (RDB) and append-only write logs (AOF).",
      "Pub/Sub & Streams: Real-time message broadcasting, consumer groups, and high-throughput event sourcing pipelines."
    ]
  },
  {
    name: "ClickHouse",
    title: "ClickHouse",
    year: 2016,
    paradigm: "Columnar OLAP Data Warehouse",
    category: "olap",
    license: "Apache License 2.0",
    storageEngine: "MergeTree Engine Family (Sparse Indexes)",
    storageModel: "Columnar Compressed",
    queryLang: "SQL (Extended ClickHouse SQL)",
    concurrency: "Massive Parallel Processing (MPP) / Vectorized",
    creator: "Alexey Milovidov & Yandex",
    website: "https://clickhouse.com",
    symbol: "CH",
    description: "ClickHouse is a fast, open-source column-oriented database management system that allows generating analytical data reports in real time using SQL queries. Designed to ingest trillions of rows and petabytes of data, ClickHouse stores columns contiguously on disk with heavy compression, reading only the exact bytes requested by queries and delivering answers up to 100-1000x faster than traditional row-oriented databases.",
    highlights: [
      "Blistering Analytical Performance: Vectorized query evaluation combined with SIMD instructions delivers billions of processed rows per second per server.",
      "MergeTree Engine Architecture: Appends data in sorted parts and merges them in the background, utilizing primary key sparse indexes.",
      "Extreme Data Compression: Specialized columnar codecs (DoubleDelta, Gorilla, T64, ZSTD, LZ4) shrink storage footprints by 70-90%.",
      "Linear Distributed Scalability: Shards and replicates tables across thousands of nodes for petabyte-scale real-time telemetry and ad-tech analytics."
    ]
  },
  {
    name: "MongoDB",
    title: "MongoDB",
    year: 2009,
    paradigm: "Document Store (NoSQL)",
    category: "nosql",
    license: "Server Side Public License (SSPL)",
    storageEngine: "WiredTiger (B-Tree & Cache-First)",
    storageModel: "BSON (Binary JSON) Documents",
    queryLang: "MQL (MongoDB Query Language) & Aggregation Pipeline",
    concurrency: "WiredTiger Document-Level Concurrency",
    creator: "Dwight Merriman, Eliot Horowitz, Kevin Ryan (10gen)",
    website: "https://www.mongodb.com",
    symbol: "MG",
    description: "MongoDB is a leading non-relational document database designed for modern application development. By replacing fixed tabular rows with flexible, nested BSON documents, MongoDB allows developers to model real-world hierarchical entities naturally without tedious relational join tables. It features horizontal scale-out via automatic sharding, multi-document ACID transactions, and expressive aggregation pipelines.",
    highlights: [
      "Dynamic Polymorphic Schema: Documents within the same collection can have divergent fields, adapting gracefully to rapid agile iterations.",
      "Rich Aggregation Framework: Multi-stage data processing pipeline for filtering, grouping, reshaping, unwinding, and statistical transformations.",
      "Automatic Sharding & High Availability: Replica sets provide automated failover, while sharded clusters distribute reads/writes across geographic clusters.",
      "Multi-Document ACID Transactions: Guarantees consistency across multiple collections and shards without sacrificing document ergonomics."
    ]
  },
  {
    name: "Apache Cassandra",
    title: "Apache Cassandra",
    year: 2008,
    paradigm: "Distributed Wide-Column / Multi-Master",
    category: "nosql",
    license: "Apache License 2.0",
    storageEngine: "LSM-Tree (Log-Structured Merge-Tree) on SSTables",
    storageModel: "Wide-Column Family / Key-Partitioned",
    queryLang: "CQL (Cassandra Query Language)",
    concurrency: "Tunable Eventual Consistency (CAP AP model)",
    creator: "Avinash Lakshman & Prashant Malik (Facebook)",
    website: "https://cassandra.apache.org",
    symbol: "CS",
    description: "Apache Cassandra is a distributed, wide-column store designed to handle large amounts of data across many commodity servers, providing high availability with no single point of failure. Born at Facebook to power inbox search, Cassandra blends Amazon Dynamo's peer-to-peer ring architecture with Google Bigtable's column-family data model to achieve linear write scalability across multi-datacenter clusters.",
    highlights: [
      "Masterless Peer-to-Peer Ring: Every node is identical; there is no master node, eliminating single points of failure and bottleneck routers.",
      "LSM-Tree Write Performance: Writes are appended sequentially to commit logs and in-memory Memtables, offering unbelievable write throughput.",
      "Tunable Consistency: Developers select exact consistency levels (ONE, QUORUM, LOCAL_QUORUM, ALL) per individual read or write operation.",
      "Active-Active Multi-Datacenter Replication: Replicates data synchronously or asynchronously across geographic cloud regions without downtime."
    ]
  },
  {
    name: "MySQL",
    title: "MySQL",
    year: 1995,
    paradigm: "Relational DBMS (OLTP)",
    category: "relational",
    license: "GPL v2 / Commercial (Oracle)",
    storageEngine: "InnoDB (Pluggable: MyISAM, Memory, RocksDB)",
    storageModel: "Row-Oriented (Clustered B+Tree Index)",
    queryLang: "SQL",
    concurrency: "Row-Level Locking & Two-Phase Locking (2PL)",
    creator: "Michael Monty Widenius, David Axmark, Allan Larsson",
    website: "https://www.mysql.com",
    symbol: "MY",
    description: "MySQL is the world's most popular open-source relational database management system, serving as the critical persistence layer for LAMP stacks, WordPress, Facebook, Twitter, and Netflix. Anchored by the InnoDB storage engine, MySQL provides ACID transactions, foreign keys, row-level locking, and proven durability under massive web concurrency.",
    highlights: [
      "InnoDB Clustered Index: Table rows are physically organized according to the primary key, providing ultra-fast primary key index lookups.",
      "Pluggable Storage Engine Architecture: Swap storage engines (InnoDB for transactions, Memory for caches, MyRocks for compression) per table.",
      "Binary Log (Binlog) Replication: High-throughput asynchronous and semi-synchronous replication powering read-replica farms worldwide.",
      "Ubiquitous Web Ecosystem: Supported by every web framework, ORM, cloud provider, and hosting infrastructure in existence."
    ]
  },
  {
    name: "CockroachDB",
    title: "CockroachDB",
    year: 2015,
    paradigm: "Distributed SQL (NewSQL)",
    category: "relational",
    license: "Business Source License (BSL)",
    storageEngine: "Pebble (LSM-Tree Key-Value Engine in Go)",
    storageModel: "Ordered Key-Value to Relational Tables",
    queryLang: "PostgreSQL-Compatible SQL",
    concurrency: "Serializable Multi-Version Concurrency Control (MVCC) via Raft",
    creator: "Spencer Kimball, Peter Mattis, Ben Darnell",
    website: "https://www.cockroachlabs.com",
    symbol: "CR",
    description: "CockroachDB is a cloud-native, distributed SQL database engineered to withstand hardware failures without human intervention—just like its namesake insect. Inspired by Google Spanner, CockroachDB offers standard PostgreSQL wire compatibility, horizontal auto-scaling, and strictly serializable ACID transactions across multi-region clusters by coordinating transactional ranges via the Raft consensus algorithm.",
    highlights: [
      "Survives Node & Datacenter Outages: If a node dies, the cluster automatically rebalances and repairs data ranges without losing transactions.",
      "Multi-Region Data Locality: Pin user data to specific continents/regions to comply with GDPR data sovereignty and ensure low-latency reads.",
      "Raft Consensus Grouping: Data is divided into 64MB contiguous ranges, each replicated across nodes via independent Raft groups.",
      "Standard PostgreSQL Wire Protocol: Works seamlessly with existing Postgres drivers, ORMs, and administrative tooling."
    ]
  },
  {
    name: "Neo4j",
    title: "Neo4j",
    year: 2007,
    paradigm: "Graph Database (LPG)",
    category: "nosql",
    license: "GPL v3 / Commercial",
    storageEngine: "Native Graph Storage & Index-Free Adjacency",
    storageModel: "Labeled Property Graph (Nodes, Relationships, Properties)",
    queryLang: "Cypher Query Language (declarative graph SQL)",
    concurrency: "ACID Compliant (Native Graph Transaction Manager)",
    creator: "Emil Eifrem, Johan Svensson, Peter Neubauer",
    website: "https://neo4j.com",
    symbol: "N4",
    description: "Neo4j is the world's leading native graph database, designed from the storage layer up to leverage data relationships. While relational databases suffer exponential performance degradation when traversing recursive many-to-many joins, Neo4j uses 'index-free adjacency'—where each node holds direct physical memory pointers to its neighbors—allowing complex network paths and friend-of-friend lookups to execute in constant time.",
    highlights: [
      "Index-Free Adjacency: Traversing relationships avoids expensive index lookups; navigating graphs requires only following direct memory pointers.",
      "Cypher Graph Query Language: Visual, ASCII-art-inspired query syntax that represents relationships as (a)-[:KNOWS]->(b).",
      "Native Graph Processing: Eliminates JOIN overhead for fraud detection, identity access management, recommendation engines, and knowledge graphs.",
      "Graph Data Science (GDS): Built-in library of graph algorithms (PageRank, Louvain community detection, Dijkstra shortest path)."
    ]
  },
  {
    name: "Qdrant",
    title: "Qdrant",
    year: 2021,
    paradigm: "Vector Database (AI / Similarity Search)",
    category: "vector",
    license: "Apache License 2.0",
    storageEngine: "HNSW (Hierarchical Navigable Small World) + Payload Index",
    storageModel: "High-Dimensional Vector Embeddings + Metadata",
    queryLang: "gRPC & REST Vector Search API",
    concurrency: "Rust-Engineered Lock-Free Concurrency",
    creator: "Andre Zayarni & Andrey Vasnetsov",
    website: "https://qdrant.tech",
    symbol: "QD",
    description: "Qdrant is an open-source vector database and vector search engine written in Rust. Tailored for production machine learning and generative AI applications, Qdrant stores high-dimensional dense embeddings produced by transformers and neural networks, allowing semantic similarity searches (k-NN) with combined scalar payload filtering at millisecond latencies.",
    highlights: [
      "Written in Rust for Reliability: Zero-cost abstractions, predictable memory footprint, and rock-solid memory safety under heavy load.",
      "Integrated Payload Filtering: Filter search results simultaneously by business metadata (tags, user IDs, price ranges) during vector graph traversal.",
      "Optimized Quantization: Supports scalar and product quantization to compress vector sizes by up to 4x while maintaining high recall accuracy.",
      "RAG & Semantic Retrieval Ready: Built directly for Retrieval-Augmented Generation (RAG) with OpenAI, Cohere, LangChain, and LlamaIndex."
    ]
  },
  {
    name: "Meilisearch",
    title: "Meilisearch",
    year: 2018,
    paradigm: "Search Engine / Full-Text Database",
    category: "vector",
    license: "MIT License",
    storageEngine: "LMDB (Lightning Memory-Mapped Database)",
    storageModel: "Inverted Index + Prefix Tree",
    queryLang: "RESTful HTTP Search API",
    concurrency: "Multi-Threaded Read-Optimized Engine",
    creator: "Quentin de Quelen, Clément Renault, Thomas Payet",
    website: "https://www.meilisearch.com",
    symbol: "MS",
    description: "Meilisearch is a lightning-fast, open-source search engine written in Rust that delivers an instant search-as-you-type experience out of the box. Engineered as a nimble, developer-friendly alternative to heavy Elasticsearch clusters, Meilisearch provides typo tolerance, smart relevancy ranking, faceted filtering, and sub-50ms query responses without complex tuning.",
    highlights: [
      "Sub-50ms Search-As-You-Type: Instant responses on every keystroke create effortless search interfaces for e-commerce and documentation.",
      "Typo Tolerance by Default: Intelligently understands spelling mistakes, phonetic slips, and partial words out of the box.",
      "Built on Rust & LMDB: Zero garbage collection pauses, minimal RAM requirements, and rock-solid memory stability.",
      "Configurable Ranking Rules: Tune relevancy deterministically using intuitive ranking rules (typo, words, proximity, attribute, exactness)."
    ]
  },
  {
    name: "RocksDB",
    title: "RocksDB",
    year: 2012,
    paradigm: "Embedded Key-Value Storage Engine",
    category: "embedded",
    license: "Apache License 2.0 / BSD 3-Clause",
    storageEngine: "Log-Structured Merge-Tree (LSM-Tree)",
    storageModel: "Byte-Array Key-Value Store",
    queryLang: "C++ Programmatic API (Get / Put / Delete / Iterator)",
    concurrency: "Multi-Threaded Compaction & Lock-Free Reads",
    creator: "Facebook Database Engineering (Forked from Google LevelDB)",
    website: "https://rocksdb.org",
    symbol: "RK",
    description: "RocksDB is a high-performance, embedded database for key-value data developed by Meta. Forked from Google's LevelDB, RocksDB is heavily optimized for fast flash storage, NVMe SSDs, and multicore processors. Rather than serving end users directly, RocksDB acts as the foundational internal storage engine powering databases like CockroachDB, TiDB, Kafka Streams, and Apache Flink.",
    highlights: [
      "Optimized for High-Throughput SSDs: Transforms random write workloads into sequential disk operations via Log-Structured Merge-Trees.",
      "Universal Database Engine: Serves as the bedrock storage engine for distributed databases, streaming pipelines, and state stores.",
      "Tunable LSM Compaction: Offers Leveled, Universal, and FIFO compaction strategies to balance write amplification, space, and read latency.",
      "Column Families & Bloom Filters: Organizes data into isolated key spaces and leverages Bloom filters to avoid unnecessary disk probes."
    ]
  },
  {
    name: "TimescaleDB",
    title: "TimescaleDB",
    year: 2017,
    paradigm: "Time-Series Relational DBMS",
    category: "relational",
    license: "Timescale License / Apache 2.0",
    storageEngine: "PostgreSQL Engine + Partitioned Hypertables",
    storageModel: "Chunk-Partitioned Hybrid Row/Columnar",
    queryLang: "SQL (Native PostgreSQL + Time-Series Functions)",
    concurrency: "PostgreSQL ACID Concurrency",
    creator: "Ajay Kulkarni & Michael Freedman",
    website: "https://www.timescale.com",
    symbol: "TS",
    description: "TimescaleDB is an open-source time-series database engineered as an extension to PostgreSQL. It provides the reliability, full SQL power, and extensive tooling of Postgres, while delivering the massive write throughput, compression (up to 95%), and automated chunking required to manage millions of metrics, IoT sensor readings, and financial market ticks per second.",
    highlights: [
      "Hypertables Abstraction: Appears to users as a standard SQL table but partitions transparently into smaller time/space chunks behind the scenes.",
      "Hybrid Compression: Automatically converts older historical row chunks into columnar storage formats, cutting disk footprints by 90-95%.",
      "Native Time-Series SQL Functions: Built-in time_bucket(), locf(), gap-filling, and rolling window analytical functions.",
      "Full PostgreSQL Compatibility: Join time-series telemetry directly with business relational metadata, user profiles, and spatial GIS tables."
    ]
  },
  {
    name: "TiDB",
    title: "TiDB",
    year: 2015,
    paradigm: "Distributed HTAP (Hybrid Transactional & Analytical)",
    category: "relational",
    license: "Apache License 2.0",
    storageEngine: "TiKV (Row/Raft) + TiFlash (Columnar/Raft)",
    storageModel: "Dual Row & Columnar Storage",
    queryLang: "MySQL-Compatible SQL",
    concurrency: "Multi-Raft Distributed Percolator Transactions",
    creator: "PingCAP (Max Liu, Ed Huang, Dongxu Huang)",
    website: "https://www.pingcap.com/tidb",
    symbol: "TI",
    description: "TiDB (Titanium DB) is an open-source distributed NewSQL database that supports Hybrid Transactional and Analytical Processing (HTAP). Designed with a decoupled architecture separating stateless SQL compute from stateful storage, TiDB provides MySQL syntax compatibility, horizontal scalability, and real-time business intelligence without separate ETL pipelines.",
    highlights: [
      "True HTAP Architecture: Replicates transactional row data in TiKV into columnar TiFlash storage asynchronously via Raft learner nodes.",
      "Decoupled Compute & Storage: Stateless TiDB compute nodes scale independently from TiKV storage layers to handle fluctuating traffic spikes.",
      "MySQL Protocol Compatibility: Drop-in replacement for MySQL clusters, eliminating manual sharding with Vitess or ProxySQL.",
      "Global ACID Transactions: Distributed transactions implemented via an enhanced Google Percolator model with snapshot isolation."
    ]
  },
  {
    name: "ScyllaDB",
    title: "ScyllaDB",
    year: 2015,
    paradigm: "High-Throughput Wide-Column NoSQL",
    category: "nosql",
    license: "AGPL v3 / Commercial",
    storageEngine: "Seastar Shared-Nothing Asynchronous C++ Engine",
    storageModel: "Wide-Column Family / SSTables",
    queryLang: "CQL (Cassandra) & Amazon DynamoDB API",
    concurrency: "Thread-per-Core Shared-Nothing Asynchronous Architecture",
    creator: "Avi Kivity & Dor Laor",
    website: "https://www.scylladb.com",
    symbol: "SC",
    description: "ScyllaDB is a distributed, high-performance NoSQL database designed as a drop-in C++ replacement for Apache Cassandra and Amazon DynamoDB. By utilizing the Seastar asynchronous C++ framework and a thread-per-core shared-nothing architecture, ScyllaDB eliminates JVM garbage collection pauses, delivering 10x higher throughput and consistent sub-millisecond P99 latencies.",
    highlights: [
      "Shared-Nothing Thread-Per-Core: Pinning threads to CPU cores eliminates lock contention, inter-thread context switching, and memory barriers.",
      "No JVM Garbage Collection: Rewritten entirely in modern C++ to eliminate unpredictable stop-the-world Java GC latency spikes.",
      "Dual Protocol Support: Native support for both Cassandra Query Language (CQL) and Amazon DynamoDB REST endpoints (Alternator).",
      "Autonomous Resource Balancing: Dynamically balances CPU, RAM, and disk I/O between background compactions and foreground queries."
    ]
  },
  {
    name: "Milvus",
    title: "Milvus",
    year: 2019,
    paradigm: "Distributed Vector Database",
    category: "vector",
    license: "Apache License 2.0",
    storageEngine: "Knowhere Vector Core (HNSW, IVF-PQ, DiskANN, GPU)",
    storageModel: "Vector Embeddings + Scalar Fields",
    queryLang: "Milvus SDKs / REST / gRPC",
    concurrency: "Cloud-Native Microservices Disaggregated Architecture",
    creator: "Zilliz",
    website: "https://milvus.io",
    symbol: "MV",
    description: "Milvus is an open-source, distributed vector database engineered to store, index, and query billions of high-dimensional vector embeddings. Designed from inception as a cloud-native disaggregated system, Milvus separates storage from computing and supports GPU acceleration, DiskANN SSD indexes, and hybrid similarity search for massive AI workloads.",
    highlights: [
      "Billion-Scale Vector Capacity: Scales to tens of billions of vectors through cloud-native sharding and distributed query nodes.",
      "Hardware Acceleration (GPU/SIMD): Harnesses NVIDIA GPUs and CPU SIMD (AVX-512) for ultra-fast vector index construction and search.",
      "Pluggable Indexing Algorithms: Supports comprehensive vector indexing strategies including HNSW, IVF_FLAT, IVF_SQ8, IVF_PQ, and DiskANN.",
      "Storage & Compute Disaggregation: Built on top of cloud object storage (S3/MinIO) and message logs (Kafka/Pulsar) for elasticity."
    ]
  },
  {
    name: "ChromaDB",
    title: "ChromaDB",
    year: 2022,
    paradigm: "AI-Native Embedding Database",
    category: "vector",
    license: "Apache License 2.0",
    storageEngine: "HNSWlib + ClickHouse/SQLite Backend",
    storageModel: "Embedding Vector + Document Text + Metadata",
    queryLang: "Python & TypeScript Native APIs",
    concurrency: "Single-Process / Client-Server Async",
    creator: "Jeff Huber & Anton Troynikov",
    website: "https://www.trychroma.com",
    symbol: "CR",
    description: "Chroma is an open-source, AI-native embedding database designed to simplify the development of LLM applications. Focused on ergonomics and simplicity, Chroma allows developers to plug embeddings, document text, and metadata directly into memory or local storage, forming the default knowledge layer for conversational agents, LangChain apps, and personal AI tools.",
    highlights: [
      "Developer-First Ergonomics: Get started in 4 lines of Python or TypeScript code without running complex cluster infrastructure.",
      "Integrated Embedding Functions: Automatically converts input raw text strings into vector embeddings using Hugging Face or OpenAI models.",
      "Document & Metadata Bundling: Stores the source text document, metadata dictionary, and vector coordinate together in a single queryable entity.",
      "Rapid Prototyping to Production: Seamlessly transition from an in-memory test database to a persistent client-server deployment."
    ]
  },
  {
    name: "LMDB",
    title: "LMDB",
    year: 2011,
    paradigm: "Micro Embedded Key-Value Store",
    category: "embedded",
    license: "OpenLDAP Public License",
    storageEngine: "Memory-Mapped B+Tree (mmap)",
    storageModel: "Ordered Byte-Array Keys and Values",
    queryLang: "C Native Library API",
    concurrency: "Lock-Free Single-Writer / Infinite Concurrent Readers",
    creator: "Howard Chu (Symas / OpenLDAP)",
    website: "https://www.symas.com/lmdb",
    symbol: "LM",
    description: "Lightning Memory-Mapped Database (LMDB) is an ultra-fast, compact embedded key-value data store developed for the OpenLDAP project. By mapping the database file directly into the application's virtual memory space via mmap, LMDB eliminates internal caches, buffer copying, and thread locking for readers, delivering millions of read operations per second per CPU core.",
    highlights: [
      "Zero-Copy Memory Mapping: Reads return direct pointers into the operating system's page cache, achieving near-hardware speed.",
      "Crash-Proof Copy-On-Write B+Tree: Never overwrites live pages; atomic root pointer swaps guarantee integrity without recovery logs.",
      "Tiny Code Footprint: The entire engine consists of under 10,000 lines of pristine, dependency-free C code in a single header and C file.",
      "Lock-Free Concurrent Readers: Readers never block writers and writers never block readers, scaling linearly with available CPU cores."
    ]
  },
  {
    name: "PGlite",
    title: "PGlite",
    year: 2024,
    paradigm: "WASM In-Process PostgreSQL",
    category: "embedded",
    license: "PostgreSQL License (BSD-like)",
    storageEngine: "Compiled PostgreSQL Engine (Emscripten WebAssembly)",
    storageModel: "PostgreSQL Heap & Indexes in Memory / IndexedDB",
    queryLang: "Full PostgreSQL SQL",
    concurrency: "Single-Threaded WASM Sandbox",
    creator: "ElectricSQL Team",
    website: "https://pglite.dev",
    symbol: "PGL",
    description: "PGlite is a lightweight WebAssembly build of full PostgreSQL packaged into a tiny JavaScript/TypeScript client library (~3MB gzipped). It allows running a real, compliant Postgres database inside web browsers, Node.js, Bun, and Deno runtimes, persisting data directly to browser IndexedDB or running ephemerally in RAM.",
    highlights: [
      "Real Postgres in WebAssembly: Not an emulator or dialect; runs official PostgreSQL source code compiled to WASM.",
      "Browser & Edge Persistence: Persist data seamlessly to browser IndexedDB or the local filesystem with zero external server dependencies.",
      "Extension Support: Includes support for essential extensions like pgvector for client-side semantic AI search right inside the user's browser.",
      "Ultra-Fast Test Execution: Spawns ephemeral PostgreSQL instances for unit tests in tens of milliseconds without Docker containers."
    ]
  },
  {
    name: "Apache Druid",
    title: "Apache Druid",
    year: 2011,
    paradigm: "Real-Time Distributed OLAP",
    category: "olap",
    license: "Apache License 2.0",
    storageEngine: "Columnar Storage with Bitmap Inverted Indexes",
    storageModel: "Segment-Based Columnar / Time-Partitioned",
    queryLang: "Druid SQL & Native JSON Query Language",
    concurrency: "Disaggregated Multi-Node Distributed Cluster",
    creator: "Fangjin Yang, Eric Tschetter, Gian Merlino (Metamarkets)",
    website: "https://druid.apache.org",
    symbol: "AD",
    description: "Apache Druid is a high-performance, real-time analytics database designed for sub-second queries on streaming and batch data. Designed to power interactive user-facing dashboards and operational event streams, Druid combines column-oriented storage, inverted bitmap indexes, and automatic data rollups to deliver sub-second queries on multi-billion-row datasets.",
    highlights: [
      "Sub-Second Response Times: Engineered specifically for interactive OLAP slice-and-dice exploratory user interfaces at scale.",
      "Real-Time Stream Ingestion: Ingests directly from Apache Kafka and AWS Kinesis with immediate event queryability without batch delays.",
      "Roaring Bitmap Inverted Indexes: Extremely fast multi-column filtering and boolean evaluations on high-cardinality event streams.",
      "Automatic Ingestion Rollups: Summarizes and pre-aggregates raw telemetry during ingestion, drastically reducing required cluster storage."
    ]
  },
  {
    name: "Apache Pinot",
    title: "Apache Pinot",
    year: 2015,
    paradigm: "User-Facing Real-Time OLAP",
    category: "olap",
    license: "Apache License 2.0",
    storageEngine: "Star-Tree & Columnar Segment Engine",
    storageModel: "Distributed Segment Columnar",
    queryLang: "PQL / Standard SQL",
    concurrency: "High Concurrency (Thousands of Queries Per Second)",
    creator: "LinkedIn Engineering (Kishore Gopalakrishna et al.)",
    website: "https://pinot.apache.org",
    symbol: "AP",
    description: "Apache Pinot is a real-time distributed OLAP datastore designed to deliver low-latency analytics at extreme query throughput. Created at LinkedIn to power user-facing products like 'Who Viewed My Profile' and newsfeed analytics, Pinot can execute complex aggregation queries over billions of records with P99 latencies under 50 milliseconds while serving hundreds of thousands of concurrent users.",
    highlights: [
      "High QPS for User-Facing Analytics: Unlike internal data warehouses, Pinot is built to serve thousands of concurrent external end users.",
      "Star-Tree Indexing: Pre-aggregates multidimensional data across key dimensions, bypassing costly table scans at query time.",
      "Pluggable Index Architecture: Leverages Forward, Inverted, Range, Text, JSON, Timestamp, and Bloom indexes per column.",
      "Real-Time Kafka/Pulsar Ingestion: Guarantees immediate consistency between streaming event brokers and queryable segments."
    ]
  },
  {
    name: "Elasticsearch",
    title: "Elasticsearch",
    year: 2010,
    paradigm: "Distributed Search & Analytics",
    category: "vector",
    license: "Elastic License v2 / SSPL",
    storageEngine: "Apache Lucene (Inverted Index, BKD Trees, DocValues)",
    storageModel: "JSON Document Store",
    queryLang: "Query DSL (JSON-based) & ES|QL",
    concurrency: "Cluster Sharding & Optimistic Concurrency Control",
    creator: "Shay Banon",
    website: "https://www.elastic.co/elasticsearch",
    symbol: "ES",
    description: "Elasticsearch is a distributed, RESTful search and analytics engine built on Apache Lucene. Renowned as the core of the Elastic Stack (ELK), it powers enterprise search engines, security operations centers (SIEM), and observability pipelines by indexing semi-structured JSON documents across distributed shards.",
    highlights: [
      "Apache Lucene Foundation: State-of-the-art inverted index algorithms deliver linguistic stemming, tokenization, and fuzzy term matching.",
      "Distributed Sharded Architecture: Automatically balances indices across cluster nodes for high availability and fault tolerance.",
      "Doc Values for Aggregations: Columnar on-disk data structures allow real-time statistical aggregations and histogram analysis.",
      "Enterprise Observability & SIEM: The global backbone for IT log management, threat hunting, application telemetry, and monitoring."
    ]
  },
  {
    name: "Apache CouchDB",
    title: "Apache CouchDB",
    year: 2005,
    paradigm: "Document Store with Offline Sync",
    category: "nosql",
    license: "Apache License 2.0",
    storageEngine: "Append-Only B-Tree (CouchStore)",
    storageModel: "JSON Documents with Binary Attachments",
    queryLang: "Mango Query (JSON) & MapReduce Views",
    concurrency: "MVCC (Multi-Version Concurrency Control) with Revisions",
    creator: "Damien Katz",
    website: "https://couchdb.apache.org",
    symbol: "CD",
    description: "Apache CouchDB is an open-source document database built for distributed web architectures and unreliable networks. Implemented in Erlang for fault tolerance, CouchDB treats HTTP and REST as first-class citizens and is famous for its master-master replication protocol, allowing nodes and offline mobile clients (via PouchDB) to synchronize bidirectionally whenever a network connection is available.",
    highlights: [
      "CouchDB Replication Protocol: Industry standard for bidirectional multi-master synchronization, handling conflict resolution gracefully.",
      "PouchDB Browser Sync: Pair with in-browser PouchDB for seamless offline-first web apps that sync when internet connectivity restores.",
      "Pure HTTP/JSON REST Interface: Query, insert, update, and manage databases using standard HTTP methods (GET, PUT, POST, DELETE).",
      "Crash-Resilient Append-Only Storage: File corruption is nearly impossible because writes are appended sequentially without in-place edits."
    ]
  },
  {
    name: "SurrealDB",
    title: "SurrealDB",
    year: 2021,
    paradigm: "Multi-Model (Document, Graph, Temporal, Vector)",
    category: "nosql",
    license: "Business Source License (BSL)",
    storageEngine: "Pluggable (TiKV, RocksDB, Memory, IndexedDB)",
    storageModel: "Multi-Model Schemafull / Schemaless",
    queryLang: "SurrealQL (SQL-like language with graph relations)",
    concurrency: "ACID Transactional Engine (Rust-based)",
    creator: "Toby Eyre & Jaime Eyre",
    website: "https://surrealdb.com",
    symbol: "SR",
    description: "SurrealDB is an end-to-end cloud-native multi-model database developed in Rust. Combining the capabilities of a relational database, document store, graph database, and vector index into a single unified engine, SurrealDB allows developers to query nested documents, traverse graph relationships with pointer syntax, and enforce row-level security directly from web clients without a traditional backend server.",
    highlights: [
      "Unified Multi-Model Vision: Query tables as documents, link entities with directional graph edges, and perform vector similarity in one system.",
      "SurrealQL Expressiveness: Intuitive syntax combining SQL declarative power with graph traversal: SELECT ->purchased->product.name FROM user.",
      "Built-in Permissions & Auth: Fine-grained row-level access control (RBAC) allows frontend clients to query the database directly.",
      "Runs Everywhere: Operates in-memory, embedded in WebAssembly, on local SSDs via RocksDB, or distributed at scale over TiKV."
    ]
  },
  {
    name: "Memcached",
    title: "Memcached",
    year: 2003,
    paradigm: "Distributed In-Memory Key-Value Cache",
    category: "nosql",
    license: "Revised BSD License",
    storageEngine: "Slab Allocator in RAM (LRU Eviction)",
    storageModel: "Flat String/Byte-Array Key-Value",
    queryLang: "Text & Binary Protocol (get / set / delete)",
    concurrency: "Multi-Threaded Event-Driven (libevent)",
    creator: "Brad Fitzpatrick (LiveJournal / Danga Interactive)",
    website: "https://memcached.org",
    symbol: "MC",
    description: "Memcached is an open-source, high-performance, distributed memory object caching system designed to speed up dynamic database-driven websites by alleviating database load. With a minimalist design focused strictly on key-value string/byte caching, Memcached utilizes a slab allocator to avoid RAM fragmentation and serves millions of cached pages per second.",
    highlights: [
      "Minimalist High-Throughput Design: Doing one thing exceptionally well: volatile key-value caching with microsecond lookups.",
      "Multi-Threaded Architecture: Scales efficiently across modern multi-core server processors with thread-safe locking.",
      "Slab Allocation Memory Model: Pre-allocates fixed-size memory slabs to completely avoid OS memory fragmentation under high turnover.",
      "LRU Cache Eviction: Automatically purges least-recently-used records when configured memory limits are reached."
    ]
  },
  {
    name: "Memgraph",
    title: "Memgraph",
    year: 2016,
    paradigm: "In-Memory Graph Database",
    category: "nosql",
    license: "Apache License 2.0 (Core Engine)",
    storageEngine: "In-Memory C++ Native Graph Storage",
    storageModel: "Labeled Property Graph (LPG) in RAM",
    queryLang: "openCypher Query Language",
    concurrency: "ACID Compliant (Multi-Version Concurrency Control)",
    creator: "Dominik Tomicevic & Marko Budiselic",
    website: "https://memgraph.com",
    symbol: "MG",
    description: "Memgraph is an open-source, in-memory graph database built in C++ for real-time streaming analytics. Engineered as a high-performance alternative to Neo4j, Memgraph connects directly to streaming platforms like Apache Kafka and Redpanda, running complex Cypher graph pattern matching, network analysis, and fraud detection algorithms in sub-milliseconds on live event data.",
    highlights: [
      "In-Memory Performance in C++: Delivers microsecond query latencies and up to 100x faster graph traversals than disk-bound alternatives.",
      "openCypher Compatibility: Fully compatible with openCypher query syntax, enabling seamless migration from Neo4j applications.",
      "Native Kafka/Redpanda Streams: Attaches directly to streaming message brokers to execute graph algorithms on in-flight data.",
      "MAGE Graph Algorithms: Memgraph Advanced Graph Extensions library provides real-time community detection, PageRank, and link prediction."
    ]
  },
  {
    name: "InfluxDB",
    title: "InfluxDB",
    year: 2013,
    paradigm: "Time-Series Database (TSDB)",
    category: "olap",
    license: "MIT License / Apache 2.0",
    storageEngine: "Apache Arrow DataFusion + Parquet (InfluxDB 3.0 Engine)",
    storageModel: "Columnar Time-Series (Arrow / Parquet)",
    queryLang: "SQL & InfluxQL",
    concurrency: "Multi-Threaded Vectorized Execution",
    creator: "Paul Dix & InfluxData",
    website: "https://www.influxdata.com",
    symbol: "IX",
    description: "InfluxDB is an open-source time-series database optimized for storing and querying timestamped data, such as DevOps monitoring metrics, IoT sensor data, and application telemetry. Re-architected in version 3.0 on top of the Apache Arrow ecosystem and Rust DataFusion, InfluxDB offers limitless series cardinality, native SQL querying, and compact Parquet disk storage.",
    highlights: [
      "Apache Arrow & Parquet Foundation: InfluxDB 3.0 leverages Apache Arrow in-memory tables and Parquet files for industry-standard columnar speed.",
      "Unlimited High-Cardinality Metrics: Overcomes historical cardinality limitations, handling millions of unique tag combinations effortlessly.",
      "Standard SQL Interface: Query time-series telemetry using familiar SQL dialect, eliminating proprietary query language learning curves.",
      "DevOps & IoT Telemetry Standard: Integrates seamlessly with Grafana, Telegraf agents, Prometheus, and OpenTelemetry instrumentation."
    ]
  },
  {
    name: "MariaDB",
    title: "MariaDB",
    year: 2009,
    paradigm: "Relational DBMS (OLTP / Hybrid)",
    category: "relational",
    license: "GPL v2",
    storageEngine: "InnoDB, Aria, ColumnStore, Spider, MyRocks",
    storageModel: "Row-Oriented & Columnar (Multi-Engine)",
    queryLang: "SQL",
    concurrency: "Row-Level Locking & Thread Pool",
    creator: "Michael Monty Widenius & MariaDB Foundation",
    website: "https://mariadb.org",
    symbol: "MA",
    description: "MariaDB is a community-developed, commercially supported fork of MySQL, created by MySQL's original lead developer after Sun Microsystems was acquired by Oracle. Built to ensure a perpetual open-source future for the MySQL ecosystem, MariaDB introduces advanced storage engines like ColumnStore for analytics, the crash-safe Aria engine, temporal tables, and high-performance thread pooling.",
    highlights: [
      "Guaranteed Open-Source Freedom: Governed by the non-profit MariaDB Foundation to ensure true community stewardship.",
      "ColumnStore for Big Data: Plug-in columnar storage engine transforms standard MariaDB servers into distributed analytical platforms.",
      "High-Performance Thread Pool: Handles tens of thousands of concurrent client connections without connection starvation.",
      "Drop-in MySQL Compatibility: Matches MySQL wire protocols, configuration flags, client drivers, and schema semantics."
    ]
  }
];

const databaseDetails = require("./database_details.cjs");

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const databaseGalleryData = rawList.map((db, index) => {
  const slug = db.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const imgPath = `/images/databases/db_${slug}.svg`;
  const extra = databaseDetails[db.name] || {};

  const latency = extra.latency || "Sub-millisecond to low millisecond range";
  const acidModel = extra.acidModel || "Standard consistency and isolation guarantees";
  const replication = extra.replication || "Configurable cluster / distributed replication";
  const primaryUseCase = extra.primaryUseCase || db.description;
  const pros = extra.pros || [];
  const cons = extra.cons || [];
  const snippetLang = extra.snippetLang || "sql";
  const snippetTitle = extra.snippetTitle || "Query / Architecture Example";
  const snippetCode = extra.snippetCode || "-- Query snippet not available";

  const prosListHtml = pros.map(p => `<li><span class="pro-tag">+</span> ${escapeHtml(p)}</li>`).join("");
  const consListHtml = cons.map(c => `<li><span class="con-tag">-</span> ${escapeHtml(c)}</li>`).join("");

  return {
    id: `database-${index + 1}`,
    name: db.name.toLowerCase(),
    title: db.name,
    year: db.year,
    sortYear: db.year,
    sortName: db.name.toLowerCase(),
    category: db.category,
    description: db.description.toLowerCase(),
    image: imgPath,
    zoomSrc: imgPath,
    zoomTitle: db.name,
    zoomMeta: `Year: ${db.year} • Type: ${db.paradigm}`,
    zoomCaption: db.description,
    latency,
    acidModel,
    replication,
    primaryUseCase,
    pros,
    cons,
    snippetCode,
    snippetLang,
    snippetTitle,
    dataset: {
      "data-name": db.name.toLowerCase(),
      "data-year": String(db.year),
      "data-paradigm": db.paradigm.toLowerCase(),
      "data-category": db.category,
      "data-engine": db.storageEngine.toLowerCase(),
      "data-license": db.license.toLowerCase(),
      "data-storage-model": db.storageModel.toLowerCase(),
      "data-query-lang": db.queryLang.toLowerCase(),
      "data-concurrency": db.concurrency.toLowerCase(),
      "data-creator": db.creator.toLowerCase(),
      "data-summary": db.description.toLowerCase(),
      "data-latency": latency.toLowerCase(),
      "data-acid": acidModel.toLowerCase(),
      "data-use-case": primaryUseCase.toLowerCase(),
      "data-highlights": db.highlights.join(" ").toLowerCase()
    },
    classes: ["db-card"],
    html: `
      <div class="db-img-wrapper gallery-zoomable" data-zoom-caption="${escapeHtml(db.description)}" data-zoom-meta="Year: ${db.year} • Type: ${escapeHtml(db.paradigm)}" data-zoom-src="${imgPath}" data-zoom-title="${escapeHtml(db.name)}" title="Click to inspect architectural blueprint">
        <img alt="${escapeHtml(db.name)} architecture blueprint" loading="lazy" onerror="this.onerror=null,this.parentElement.style.display='none'" src="${imgPath}"/>
        <div class="db-type-badge">${escapeHtml(db.paradigm)}</div>
        <div class="db-img-overlay">
          <svg class="zoom-indicator-icon" fill="none" height="22" stroke="currentColor" stroke-width="2" viewbox="0 0 24 24" width="22">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
            <line x1="11" x2="11" y1="8" y2="14"></line>
            <line x1="8" x2="14" y1="11" y2="11"></line>
          </svg>
        </div>
      </div>
      <div class="db-card-content">
        <div class="db-header-row">
          <h2 class="db-name">${escapeHtml(db.name)}</h2>
          <div class="db-badges-row">
            <span class="db-year-badge">${db.year}</span>
          </div>
        </div>
        <div class="db-creator">Pioneered by: <strong>${escapeHtml(db.creator)}</strong></div>
        <p class="db-desc">${escapeHtml(db.description)}</p>

        <div class="db-specs-grid">
          <div class="db-spec-item"><span class="spec-label">Storage Engine:</span><span class="spec-value">${escapeHtml(db.storageEngine)}</span></div>
          <div class="db-spec-item"><span class="spec-label">Storage Model:</span><span class="spec-value">${escapeHtml(db.storageModel)}</span></div>
          <div class="db-spec-item"><span class="spec-label">Query Interface:</span><span class="spec-value">${escapeHtml(db.queryLang)}</span></div>
          <div class="db-spec-item"><span class="spec-label">Concurrency:</span><span class="spec-value">${escapeHtml(db.concurrency)}</span></div>
          <div class="db-spec-item"><span class="spec-label">ACID &amp; Consistency:</span><span class="spec-value">${escapeHtml(acidModel)}</span></div>
          <div class="db-spec-item"><span class="spec-label">P99 Latency Profile:</span><span class="spec-value">${escapeHtml(latency)}</span></div>
        </div>

        <div class="db-features-box">
          <span class="db-section-label">Architectural Highlights &amp; Internals:</span>
          <ul class="db-features-list">
            ${db.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join("")}
          </ul>
        </div>

        <!-- Interactive Architecture & Code Snippet Box -->
        <div class="db-code-accordion">
          <button class="db-code-toggle-btn" type="button" aria-expanded="false" onclick="this.parentElement.classList.toggle('open'); this.setAttribute('aria-expanded', this.parentElement.classList.contains('open'))">
            <span class="db-toggle-icon">
              <svg fill="none" height="14" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="14"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </span>
            <span class="db-toggle-title">Interactive Query &amp; Architecture Example</span>
            <span class="db-toggle-badge">${escapeHtml(snippetLang.toUpperCase())}</span>
          </button>
          <div class="db-code-body">
            <div class="db-code-header">
              <span class="db-code-desc">${escapeHtml(snippetTitle)}</span>
              <button class="db-copy-code-btn" type="button" onclick="navigator.clipboard.writeText(this.closest('.db-code-body').querySelector('code').textContent).then(()=>{this.textContent='Copied!';setTimeout(()=>this.textContent='Copy',1600)})">Copy</button>
            </div>
            <pre class="db-code-block"><code class="language-${escapeHtml(snippetLang)}">${escapeHtml(snippetCode)}</code></pre>
          </div>
        </div>

        <!-- Architectural Trade-offs & Deep Dive Accordion -->
        <div class="db-tradeoffs-accordion">
          <button class="db-tradeoffs-toggle-btn" type="button" aria-expanded="false" onclick="this.parentElement.classList.toggle('open'); this.setAttribute('aria-expanded', this.parentElement.classList.contains('open'))">
            <span class="db-toggle-icon">
              <svg fill="none" height="14" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="14"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </span>
            <span class="db-toggle-title">Architectural Trade-Offs &amp; Sweet Spots</span>
          </button>
          <div class="db-tradeoffs-body">
            <div class="db-sweet-spot">
              <strong>Sweet Spot:</strong> ${escapeHtml(primaryUseCase)}
            </div>
            <div class="db-pros-cons-grid">
              <div class="db-pros-col">
                <span class="pro-header">Superpowers:</span>
                <ul class="pros-list">${prosListHtml}</ul>
              </div>
              <div class="db-cons-col">
                <span class="con-header">Architectural Constraints:</span>
                <ul class="cons-list">${consListHtml}</ul>
              </div>
            </div>
          </div>
        </div>

        <div class="db-footer-action">
          <a class="db-link-btn" href="${escapeHtml(db.website)}" rel="noopener noreferrer" target="_blank">
            <span>Official Docs &amp; Spec</span>
            <svg fill="none" height="14" stroke="currentColor" stroke-width="2" viewbox="0 0 24 24" width="14">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" x2="21" y1="14" y2="3"></line>
            </svg>
          </a>
        </div>
      </div>
    `
  };
});

fs.writeFileSync("/home/guigo/Documents/05-ghpages-gui13go/frontend/public/data/databases.json", JSON.stringify(databaseGalleryData, null, 2));
console.log("Successfully generated /data/databases.json with " + databaseGalleryData.length + " entries!");

