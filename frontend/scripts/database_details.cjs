/**
 * Comprehensive technical details, internals, trade-offs, and executable code snippets
 * for each of the 30 databases in the interactive database gallery.
 */

module.exports = {
  "PostgreSQL": {
    latency: "< 1ms OLTP point reads | 5-50ms analytical aggregate",
    acidModel: "Full ACID (Snapshot Isolation, Serializable SSI via SIREAD locks)",
    replication: "Streaming Replication (WAL physical), Logical Replication, Patroni HA",
    primaryUseCase: "System-of-record OLTP, complex relational joins, enterprise apps, hybrid JSON/vector workloads",
    pros: [
      "Battle-tested rock-solid data integrity with 35+ years of production hardening",
      "World-class extensibility (pgvector, PostGIS, TimescaleDB, Citus, custom data types)",
      "Native rich JSONB support with GIN index queries matching document DB speeds"
    ],
    cons: [
      "Process-per-connection model requires connection poolers (PgBouncer) for >1000 clients",
      "Table bloat requires active VACUUM tuning due to append-only MVCC dead-tuples"
    ],
    snippetLang: "sql",
    snippetTitle: "PGVector & JSONB Hybrid Query",
    snippetCode: `-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Query hybrid relational, JSONB, and semantic vector embeddings
SELECT 
    p.id, 
    p.metadata->>'title' AS article_title,
    1 - (p.embedding <=> '[0.021, -0.043, 0.812]'::vector) AS cosine_similarity
FROM documents p
WHERE p.metadata @> '{"status": "published"}'
ORDER BY p.embedding <=> '[0.021, -0.043, 0.812]'::vector
LIMIT 5;`
  },

  "SQLite": {
    latency: "< 50 microseconds in-process disk read | ~1 microsecond in-memory",
    acidModel: "Full ACID (Atomic commit via rollback journal or Write-Ahead Log)",
    replication: "Serverless local disk file; distributed via Litestream, LiteFS, or rqlite",
    primaryUseCase: "Mobile apps (iOS/Android), desktop software, IoT devices, local-first web apps, edge SQLite",
    pros: [
      "Zero administration, zero background daemon, embeds directly into binary",
      "Extremely small binary footprint (< 1MB) with 100% branch test coverage",
      "Cross-platform single-file container (usable as application file format)"
    ],
    cons: [
      "Single-writer concurrency limit (WAL mode allows concurrent readers, but only 1 writer)",
      "No client-server security model or user permission access controls"
    ],
    snippetLang: "sql",
    snippetTitle: "High-Performance WAL Mode & Pragmas",
    snippetCode: `-- Optimize SQLite for high-throughput concurrent reads and writes
PRAGMA journal_mode = WAL;          -- Enable Write-Ahead Logging
PRAGMA synchronous = NORMAL;        -- Safe durability with 10x write speedup
PRAGMA cache_size = -64000;         -- 64MB page cache in RAM
PRAGMA temp_store = MEMORY;         -- Store temp tables & indexes in RAM

-- Query with full window functions & CTEs
WITH RECURSIVE Fibonacci(n, a, b) AS (
    VALUES(1, 0, 1)
    UNION ALL
    SELECT n + 1, b, a + b FROM Fibonacci WHERE n < 10
)
SELECT n, a AS value FROM Fibonacci;`
  },

  "DuckDB": {
    latency: "< 5ms for aggregations across millions of rows",
    acidModel: "Full ACID (Multi-Version Concurrency Control with optimistic serializable)",
    replication: "In-process embedded analytical engine (read-only concurrency across threads)",
    primaryUseCase: "Data science, interactive BI dashboards, ad-hoc analytics, local Parquet/Arrow exploration",
    pros: [
      "SIMD-accelerated vectorized columnar execution on CPU L1/L2/L3 cache",
      "Queries remote or local Parquet, S3, Arrow, and CSV files with zero ingestion",
      "Seamless zero-copy integration with Python Polars, Pandas, and Apache Arrow"
    ],
    cons: [
      "Optimized strictly for batch OLAP analytics; not designed for heavy concurrent row writes (OLTP)",
      "Single-process write lock on DuckDB persistent storage file"
    ],
    snippetLang: "sql",
    snippetTitle: "Vectorized Parquet & S3 Analytics",
    snippetCode: `-- Directly query multi-gigabyte remote Parquet files with zero ingestion
SELECT 
    vendor_id,
    date_trunc('month', pickup_datetime) AS pickup_month,
    count(*) AS total_rides,
    quantile_cont(fare_amount, [0.5, 0.95, 0.99]) AS fare_percentiles
FROM 's3://yellow-taxi/year=2024/*.parquet'
WHERE passenger_count > 0
GROUP BY ALL
ORDER BY total_rides DESC
LIMIT 10;`
  },

  "IndexedDB": {
    latency: "1-10ms asynchronous transactional browser disk read/write",
    acidModel: "ACID transactional scopes (readwrite and readonly transaction modes)",
    replication: "Browser sandbox local storage (per-origin isolation)",
    primaryUseCase: "Offline-first web applications, Progressive Web Apps (PWAs), client-side state caching",
    pros: [
      "Native browser standard supported across 100% of modern desktop & mobile browsers",
      "Stores structured JS objects, Blobs, ArrayBuffers, and files without manual stringification",
      "Supports secondary compound indexes and bidirectional cursor iterations"
    ],
    cons: [
      "Low-level verbose event-driven callback API (typically wrapped with idb or Dexie.js)",
      "Browser storage quotas subject to user disk eviction under OS storage pressure"
    ],
    snippetLang: "javascript",
    snippetTitle: "Async Modern IndexedDB Transaction",
    snippetCode: `// Open database with typed object store and secondary index
const request = indexedDB.open('OfflineAppDB', 2);

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  const store = db.createObjectStore('documents', { keyPath: 'id' });
  store.createIndex('by_author', 'author', { unique: false });
  store.createIndex('by_created', 'createdAt', { unique: false });
};

request.onsuccess = (event) => {
  const db = event.target.result;
  const tx = db.transaction(['documents'], 'readwrite');
  const store = tx.objectStore('documents');
  
  store.put({ id: 'doc-404', author: 'guigo', title: 'DB Internals', createdAt: Date.now() });
  tx.oncomplete = () => console.log('Transaction committed safely to local disk!');
};`
  },

  "Redis": {
    latency: "< 500 microseconds sub-millisecond P99 in-memory latency",
    acidModel: "Transactions via MULTI/EXEC (atomic execution, no rollbacks on logic error)",
    replication: "Asynchronous Master-Replica with Redis Sentinel HA and Redis Cluster horizontal sharding",
    primaryUseCase: "Ultra-fast distributed caching, session store, pub/sub messaging, sorted leaderboards, rate limiting",
    pros: [
      "Blistering speed: serves >100,000 operations/sec per CPU core in memory",
      "Rich expressive data structures: Strings, Hashes, Lists, Sets, Sorted Sets, HyperLogLogs, Bitmaps",
      "Configurable persistence options: RDB snapshots and append-only file (AOF) logs"
    ],
    cons: [
      "Dataset size strictly limited by physical server RAM capacity",
      "In-memory primary model requires careful TTL evictions to avoid memory exhaustion"
    ],
    snippetLang: "bash",
    snippetTitle: "Redis Atomic Token Bucket Rate Limiter",
    snippetCode: `# Atomic token-bucket rate limiter via Redis script or pipeline
# Key: rate_limit:user:123 (Expires after 60 seconds)
MULTI
INCR rate_limit:user:123
EXPIRE rate_limit:user:123 60
EXEC

# Query high-scores leaderboard with O(log(N)) ranking
ZADD leaderboard:weekly 14850 "player_alpha" 19200 "player_beta"
ZREVRANGEBYSCORE leaderboard:weekly +inf -inf WITHSCORES LIMIT 0 5`
  },

  "ClickHouse": {
    latency: "10-50ms analytical queries across billions of rows",
    acidModel: "Eventual consistency across shards; atomic partition and block inserts",
    replication: "Asynchronous multi-master replication via ClickHouse Keeper / ZooKeeper",
    primaryUseCase: "Real-time web analytics, telemetry, clickstream logging, ad-tech, financial time-series",
    pros: [
      "World-class compression algorithms (LZ4, ZSTD, Delta, DoubleDelta, Gorilla, T64)",
      "Vectorized SIMD processing capable of scanning 100+ million rows/sec per CPU core",
      "Specialized MergeTree storage engines (SummingMergeTree, ReplacingMergeTree, AggregatingMergeTree)"
    ],
    cons: [
      "Does not support granular single-row UPDATE/DELETE transactions efficiently",
      "Requires batch inserts (1,000+ rows per block) to avoid small-part fragmentation"
    ],
    snippetLang: "sql",
    snippetTitle: "ClickHouse Real-Time Clickstream Aggregation",
    snippetCode: `-- High-performance MergeTree table with ZSTD compression
CREATE TABLE clickstream_events (
    timestamp DateTime64(3, 'UTC') CODEC(DoubleDelta, LZ4),
    user_id UUID,
    event_type LowCardinality(String),
    payload_bytes UInt32 CODEC(T64, ZSTD(3))
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (event_type, timestamp, user_id);

-- Sub-second query scanning 50,000,000 rows
SELECT 
    event_type, 
    count() AS total_events, 
    uniqExact(user_id) AS unique_visitors
FROM clickstream_events
WHERE timestamp >= now() - INTERVAL 1 HOUR
GROUP BY event_type;`
  },

  "MongoDB": {
    latency: "1-5ms point document reads and writes",
    acidModel: "ACID transactions (Single-document atomic; multi-document ACID transactions supported)",
    replication: "Replica Sets (Primary-Secondary election with automated failover) + Sharding",
    primaryUseCase: "Dynamic content catalogs, mobile backends, polymorphic document stores, rapid MVP prototyping",
    pros: [
      "Schema-flexible BSON document model allows seamless iteration without ALTER TABLE migrations",
      "Powerful Aggregation Pipeline framework for multifaceted data reshaping and joins ($lookup)",
      "Built-in horizontal sharding based on range or hashed shard keys"
    ],
    cons: [
      "High RAM and disk footprint compared to normalized relational engines",
      "Uncontrolled schema drift without strict JSON Schema validation rules"
    ],
    snippetLang: "javascript",
    snippetTitle: "Aggregation Pipeline with Facets",
    snippetCode: `// Multi-stage document aggregation pipeline
db.orders.aggregate([
  { $match: { status: "completed", orderDate: { $gte: ISODate("2026-01-01") } } },
  { $unwind: "$items" },
  { $group: {
      _id: "$items.category",
      totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
      averageQuantity: { $avg: "$items.quantity" },
      uniqueBuyers: { $addToSet: "$customerId" }
  }},
  { $project: {
      category: "$_id",
      totalRevenue: 1,
      buyerCount: { $size: "$uniqueBuyers" }
  }},
  { $sort: { totalRevenue: -1 } }
]);`
  },

  "Apache Cassandra": {
    latency: "1-5ms sub-millisecond writes at linear horizontal scale",
    acidModel: "BASE / Tunable Consistency (CAP Theorem AP: ONE, QUORUM, LOCAL_QUORUM, ALL)",
    replication: "Peer-to-peer ring topology with Consistent Hashing (Murmur3Partitioner)",
    primaryUseCase: "High-volume write-heavy workloads, IoT sensor streaming, messaging, global audit trails",
    pros: [
      "Masterless peer-to-peer architecture eliminates single points of failure (100% uptime)",
      "Append-only commit log and SSTable LSM-tree writes deliver virtually unlimited write throughput",
      "Tunable consistency allows tuning trade-offs between consistency and latency per query"
    ],
    cons: [
      "Data must be modeled strictly around query access patterns (no JOINs, no ad-hoc filtering)",
      "JVM garbage collection and tombstone purges require ongoing cluster maintenance"
    ],
    snippetLang: "sql",
    snippetTitle: "CQL Time-Series Schema with Clustering Keys",
    snippetCode: `-- Cassandra table partitioned across cluster nodes by sensor_id
CREATE TABLE sensor_telemetry (
    sensor_id uuid,
    bucket_date text,
    reading_time timestamp,
    temperature double,
    humidity double,
    PRIMARY KEY ((sensor_id, bucket_date), reading_time)
) WITH CLUSTERING ORDER BY (reading_time DESC);

-- Tunable consistency query across the distributed ring
SELECT reading_time, temperature, humidity 
FROM sensor_telemetry 
WHERE sensor_id = 7a8f9c10-3d84-4e31-8933-4df45e7e1634 
  AND bucket_date = '2026-10-10' 
  AND reading_time >= '2026-10-10 12:00:00'
ORDER BY reading_time DESC 
LIMIT 100;`
  },

  "MySQL": {
    latency: "1-3ms OLTP point read/write using clustered InnoDB primary keys",
    acidModel: "Full ACID (InnoDB with Redo/Undo logs and 2-Phase Commit)",
    replication: "Binlog replication (Asynchronous, Semi-Synchronous, MySQL Group Replication)",
    primaryUseCase: "Web application backends, e-commerce platforms (WordPress, Shopify, Meta, Booking.com)",
    pros: [
      "Ubiquitous ecosystem compatibility with virtually every programming language and ORM",
      "Clustered primary key indexing in InnoDB minimizes secondary lookups for primary key fetches",
      "Active enterprise-grade replication options including MySQL InnoDB Cluster and Vitess"
    ],
    cons: [
      "Less extensible than PostgreSQL (cannot easily define custom types, indexing operators)",
      "Historical quirks with SQL mode strictness and complex analytical query optimization"
    ],
    snippetLang: "sql",
    snippetTitle: "InnoDB Clustered Index & CTE Query",
    snippetCode: `-- Clustered index table layout for ultra-fast point queries
CREATE TABLE customer_orders (
    order_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    customer_id INT UNSIGNED NOT NULL,
    status ENUM('pending', 'paid', 'shipped') NOT NULL DEFAULT 'pending',
    order_total DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (order_id),
    KEY idx_customer_created (customer_id, created_at)
) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;

-- Recursive CTE for hierarchical catalog browsing
WITH RECURSIVE CategoryTree AS (
    SELECT id, name, parent_id, 0 AS depth
    FROM categories WHERE parent_id IS NULL
    UNION ALL
    SELECT c.id, c.name, c.parent_id, ct.depth + 1
    FROM categories c JOIN CategoryTree ct ON c.parent_id = ct.id
)
SELECT * FROM CategoryTree ORDER BY depth, name;`
  },

  "CockroachDB": {
    latency: "5-15ms globally distributed consensus transactions",
    acidModel: "Strict Serializable ACID across multi-region distributed nodes",
    replication: "Multi-Raft consensus algorithm per 64MB key range",
    primaryUseCase: "Mission-critical financial ledgers, multi-region cloud-native architectures, global resilient OLTP",
    pros: [
      "True horizontal scaling with automated range rebalancing and split triggers",
      "Survives availability zone and regional data center failures with zero human intervention",
      "PostgreSQL wire-protocol compatible (compatible with PG drivers and ORMs)"
    ],
    cons: [
      "Higher write latency than single-node Postgres due to Raft quorum network round-trips",
      "Requires substantial CPU/RAM resources to run multi-node Raft coordination smoothly"
    ],
    snippetLang: "sql",
    snippetTitle: "Multi-Region Distributed Table Locality",
    snippetCode: `-- Define global survival goal and regional data residency
ALTER DATABASE banking_app SET PRIMARY REGION "us-east1";
ALTER DATABASE banking_app ADD REGION "us-west1";
ALTER DATABASE banking_app ADD REGION "europe-west1";

-- Row-level data locality keeps EU accounts in Europe for GDPR compliance
CREATE TABLE user_accounts (
    account_id UUID NOT NULL DEFAULT gen_random_uuid(),
    region crdb_internal_region NOT NULL,
    balance DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    PRIMARY KEY (region, account_id)
) LOCALITY REGIONAL BY ROW;`
  },

  "Neo4j": {
    latency: "1-10ms index-free adjacency graph traversal regardless of total graph size",
    acidModel: "Full ACID transactions",
    replication: "Autonomous Clustering (Causal Clustering with Raft consensus core)",
    primaryUseCase: "Fraud rings detection, identity resolution, knowledge graphs, social networks, recommendation engines",
    pros: [
      "Index-free adjacency: nodes point directly to memory pointers of adjacent edges",
      "Intuitive Cypher query language with declarative ASCII-art pattern matching",
      "Extensive Graph Data Science (GDS) library with PageRank, Louvain, and similarity algorithms"
    ],
    cons: [
      "Poor choice for simple tabular aggregate reports and bulk columnar analytics",
      "Large-scale horizontal sharding of deeply interconnected graphs is inherently complex"
    ],
    snippetLang: "sql",
    snippetTitle: "Cypher Pattern Match for Fraud Detection",
    snippetCode: `// Detect circular money laundering cycles between bank accounts
MATCH path = (origin:Account)-[:TRANSFERRED_FUNDS*3..6]->(origin)
WHERE ALL(r IN relationships(path) WHERE r.amount > 10000)
RETURN [n IN nodes(path) | n.accountNumber] AS suspiciousCycle,
       length(path) AS cycleLength,
       reduce(total = 0, r IN relationships(path) | total + r.amount) AS totalAmountMoved
ORDER BY totalAmountMoved DESC
LIMIT 10;`
  },

  "Qdrant": {
    latency: "1-5ms sub-millisecond Approximate Nearest Neighbor (ANN) vector search",
    acidModel: "ACID write-ahead log on local segments; eventual consistency across cluster nodes",
    replication: "Distributed Raft consensus for collection metadata and segment replication",
    primaryUseCase: "Semantic AI search, Retrieval-Augmented Generation (RAG), multimodal image/audio similarity",
    pros: [
      "High-performance memory-safe Rust core with SIMD-accelerated distance metrics (Cosine, Dot, Euclid)",
      "Payload-based filter-aware HNSW: filters metadata during graph traversal, preventing recall degradation",
      "Quantization support (Scalar, Product, Binary) reducing RAM footprint by up to 95%"
    ],
    cons: [
      "Specialized for vector embeddings and metadata filtering; not a general-purpose transactional database",
      "Large vector dimensions (e.g., 3072 dims) require substantial RAM without aggressive quantization"
    ],
    snippetLang: "json",
    snippetTitle: "Filtered Vector Similarity Search API",
    snippetCode: `// POST /collections/documents/points/search
{
  "vector": [0.034, -0.012, 0.981, 0.442, -0.115],
  "limit": 5,
  "with_payload": true,
  "filter": {
    "must": [
      { "key": "category", "match": { "value": "database_internals" } },
      { "key": "published_year", "range": { "gte": 2024 } }
    ]
  },
  "params": {
    "hnsw_ef": 128,
    "exact": false
  }
}`
  },

  "Meilisearch": {
    latency: "< 10ms typo-tolerant full-text search with instant search-as-you-type",
    acidModel: "Transactional writes via LMDB key-value store",
    replication: "Single-leader snapshot replication (optimized primarily for fast search nodes)",
    primaryUseCase: "Search-as-you-type search bars, e-commerce storefront search, documentation site search",
    pros: [
      "Ultra-fast instant search designed specifically for frontend input search boxes",
      "Built-in advanced typo tolerance, synonym expansion, and prefix matching out of the box",
      "Zero-configuration ranking rules (Words, Typo, Proximity, Attribute, Sort, Exactness)"
    ],
    cons: [
      "Not designed for massive distributed petabyte log analytics (unlike Elasticsearch)",
      "Dataset must comfortably fit into disk memory-map (RAM/swap) for peak performance"
    ],
    snippetLang: "javascript",
    snippetTitle: "Instant Typo-Tolerant Search Query",
    snippetCode: `import { MeiliSearch } from 'meilisearch';

const client = new MeiliSearch({ host: 'http://localhost:7700', apiKey: 'masterKey' });
const index = client.index('products');

// Fast search-as-you-type query with typo-tolerance & facet filtering
const searchResults = await index.search('postgre sql', {
  limit: 10,
  attributesToHighlight: ['title', 'description'],
  filter: 'category = "databases" AND in_stock = true',
  sort: ['rating:desc', 'price:asc'],
  facets: ['brand', 'category']
});

console.log('Search latency:', searchResults.processingTimeMs, 'ms');`
  },

  "RocksDB": {
    latency: "< 100 microseconds fast key lookup | tens of thousands of writes/sec",
    acidModel: "Atomic writes via Write-Ahead Log (WAL) and WriteBatch; point-in-time snapshots",
    replication: "Embedded engine library (replication handled by higher-level systems like Kafka/TiKV)",
    primaryUseCase: "Underlying storage engine for CockroachDB, TiKV, Kafka Streams, Ceph, RocksJava",
    pros: [
      "Log-Structured Merge-tree (LSM-tree) delivers unmatched write performance on modern SSDs",
      "Highly customizable compaction algorithms (Leveled, Universal, FIFO) and memory tuning",
      "Zero network hops: compiles directly into C++, Rust, Go, and Java host binaries"
    ],
    cons: [
      "Raw C++ key-value engine with no SQL parser, query planner, or network layer",
      "Space and read amplification can degrade performance without proper compaction tuning"
    ],
    snippetLang: "cpp",
    snippetTitle: "C++ High-Performance WriteBatch",
    snippetCode: `#include <rocksdb/db.h>
#include <rocksdb/options.h>

rocksdb::DB* db;
rocksdb::Options options;
options.create_if_missing = true;
options.compression = rocksdb::kLZ4Compression;

rocksdb::Status status = rocksdb::DB::Open(options, "/data/rocks_store", &db);

// Atomic multi-operation WriteBatch
rocksdb::WriteBatch batch;
batch.Put("user:1001:profile", "{'name':'Guigo'}");
batch.Delete("user:1001:temp_token");
rocksdb::WriteOptions write_options;
write_options.sync = true; // Guarantees durable disk fsync

db->Write(write_options, &batch);`
  },

  "TimescaleDB": {
    latency: "1-5ms point time-series queries; 10x-100x analytical aggregation speedups",
    acidModel: "Full ACID (Inherits all PostgreSQL transactional guarantees)",
    replication: "PostgreSQL streaming replication, logical replication, high-availability clusters",
    primaryUseCase: "DevOps monitoring, financial tick data, smart grid sensor metrics, industrial IoT telemetry",
    pros: [
      "Automatic partitioning via Hypertables across both time intervals and space keys",
      "Columnar compression algorithms achieve 90%+ disk space reduction on historical data",
      "Full SQL compatibility: join real-time sensor metrics directly with business customer tables"
    ],
    cons: [
      "Inherits PostgreSQL process-model scaling constraints under massive concurrency",
      "Hypertable chunk creation must be tuned carefully to prevent too many small chunks in RAM"
    ],
    snippetLang: "sql",
    snippetTitle: "Hypertables & Automated Continuous Aggregates",
    snippetCode: `-- Convert standard table into an automated hypertable
SELECT create_hypertable('server_metrics', 'timestamp', chunk_time_interval => INTERVAL '1 day');

-- Create real-time continuous aggregate materialized view
CREATE MATERIALIZED VIEW hourly_cpu_summary
WITH (timescaledb.continuous) AS
SELECT 
    time_bucket('1 hour', timestamp) AS bucket,
    server_id,
    avg(cpu_percent) AS avg_cpu,
    max(cpu_percent) AS max_cpu
FROM server_metrics
GROUP BY bucket, server_id;

-- Enable automated 90% columnar compression on data older than 7 days
ALTER TABLE server_metrics SET (timescaledb.compress, timescaledb.compress_segmentby = 'server_id');
SELECT add_compression_policy('server_metrics', INTERVAL '7 days');`
  },

  "TiDB": {
    latency: "2-10ms distributed OLTP; sub-second HTAP real-time analytics",
    acidModel: "Strict Serializable ACID (Percolator distributed transaction model)",
    replication: "Multi-Raft consensus across distributed TiKV and TiFlash nodes",
    primaryUseCase: "Large-scale e-commerce, banking, real-time hybrid transactional/analytical processing (HTAP)",
    pros: [
      "True HTAP: combines row-based storage (TiKV) for OLTP with columnar storage (TiFlash) for OLAP",
      "Drop-in MySQL 5.7/8.0 wire protocol compatibility without changing application SQL",
      "Seamless online horizontal scaling: add nodes to expand storage and compute independently"
    ],
    cons: [
      "Complex multi-component operational topology (TiDB stateless servers, PD coordinators, TiKV, TiFlash)",
      "Noticeable baseline latency for trivial single-row queries compared to a local MySQL instance"
    ],
    snippetLang: "sql",
    snippetTitle: "Dual-Engine HTAP Cost-Based Routing",
    snippetCode: `-- Enable real-time columnar replica for an existing transactional table
ALTER TABLE ecommerce_orders SET TIFLASH REPLICA 1;

-- TiDB cost-based optimizer automatically routes transactional writes to TiKV 
-- and massive analytical aggregations to vectorized TiFlash columnar engine
SELECT 
    /*+ READ_FROM_STORAGE(TIFLASH[ecommerce_orders]) */
    category,
    sum(amount) AS total_sales,
    count(DISTINCT customer_id) AS active_buyers
FROM ecommerce_orders
WHERE order_date >= '2026-01-01'
GROUP BY category;`
  },

  "ScyllaDB": {
    latency: "< 1ms ultra-low P99 latency at millions of operations/sec",
    acidModel: "BASE / Tunable Consistency (AP system, compatible with Cassandra/DynamoDB)",
    replication: "Masterless peer-to-peer ring topology using consistent hashing and Seastar threads",
    primaryUseCase: "Extreme-throughput real-time ad serving, cybersecurity threat intelligence, game states",
    pros: [
      "Share-nothing asynchronous C++ Seastar engine delivers 10x throughput of Java Cassandra",
      "Eliminates JVM garbage collection pauses, delivering predictable sub-millisecond P99 latency",
      "100% protocol and driver compatible with Apache Cassandra and Amazon DynamoDB (Alternator)"
    ],
    cons: [
      "Rigid query patterns dictated by primary partition keys (no dynamic arbitrary JOINs)",
      "Requires dedicated hardware or high-performance NVMe cloud instances for maximum efficiency"
    ],
    snippetLang: "sql",
    snippetTitle: "High-Volume Telemetry Schema in CQL",
    snippetCode: `-- ScyllaDB table pinning partition key to CPU-core shards
CREATE KEYSPACE telemetry_feed WITH replication = {
    'class': 'NetworkTopologyStrategy', 
    'us-east': 3
};

CREATE TABLE telemetry_feed.ad_impressions (
    campaign_id uuid,
    ad_unit_id text,
    event_timestamp timestamp,
    user_fingerprint text,
    bid_price_micros bigint,
    PRIMARY KEY ((campaign_id, ad_unit_id), event_timestamp)
) WITH CLUSTERING ORDER BY (event_timestamp DESC);`
  },

  "Milvus": {
    latency: "1-10ms billion-scale Approximate Nearest Neighbor vector search",
    acidModel: "Eventual consistency with tunable bounded-staleness consistency levels",
    replication: "Cloud-native disaggregated compute and storage (MinIO/S3 + Pulsar/Kafka)",
    primaryUseCase: "Massive billion-scale enterprise vector search, multimodal image retrieval, LLM agents",
    pros: [
      "Disaggregated cloud-native architecture separates query nodes, data nodes, and index builders",
      "Supports extensive indexing algorithms (HNSW, IVF-FLAT, IVF-PQ, SCaNN, DiskANN)",
      "DiskANN allows searching billions of vector embeddings directly on SSDs with minimal RAM"
    ],
    cons: [
      "High operational complexity with dependencies on object storage, Kafka/Pulsar, and etcd",
      "Excessive overhead for small vector collections (< 100,000 vectors)"
    ],
    snippetLang: "python",
    snippetTitle: "Billion-Scale Milvus Vector Search",
    snippetCode: `from pymilvus import Collection

collection = Collection("knowledge_embeddings")

# Build HNSW index with M=16, efConstruction=200
index_params = {
    "metric_type": "COSINE",
    "index_type": "HNSW",
    "params": {"M": 16, "efConstruction": 200}
}
collection.create_index(field_name="vector", index_params=index_params)
collection.load()

# Execute fast k-NN vector search with scalar expression filter
results = collection.search(
    data=[[0.015, -0.045, 0.821, ...]], # query embedding
    anns_field="vector",
    param={"metric_type": "COSINE", "params": {"ef": 64}},
    limit=5,
    expr="year >= 2024 and category == 'ai_research'",
    output_fields=["title", "url"]
)`
  },

  "ChromaDB": {
    latency: "2-10ms embedded vector retrieval",
    acidModel: "Eventual consistency on embedded SQLite/ClickHouse + HNSW segments",
    replication: "Embedded single-process by default; distributed client-server mode available",
    primaryUseCase: "Local LLM development, LangChain/LlamaIndex RAG pipelines, AI agent memory",
    pros: [
      "Easiest setup in the AI ecosystem: zero Docker requirement, runs directly in Python/JS memory",
      "Built-in automatic text embedding functions (OpenAI, HuggingFace, sentence-transformers)",
      "Integrated metadata filtering combined with vector cosine/L2 distance search"
    ],
    cons: [
      "Not suited for large-scale distributed enterprise deployments exceeding tens of millions of vectors",
      "Single-writer concurrency limitations when using embedded SQLite persistence"
    ],
    snippetLang: "python",
    snippetTitle: "Embedded ChromaDB RAG Pipeline",
    snippetCode: `import chromadb
from chromadb.utils import embedding_functions

# Initialize persistent local embedded vector database
client = chromadb.PersistentClient(path="./chroma_data")
collection = client.get_or_create_collection(
    name="technical_docs",
    metadata={"hnsw:space": "cosine"}
)

# Insert documents with metadata
collection.add(
    documents=["DuckDB uses vectorized SIMD execution.", "PostgreSQL handles MVCC via heap files."],
    metadatas=[{"source": "duckdb_guide"}, {"source": "postgres_internals"}],
    ids=["doc1", "doc2"]
)

# Semantic retrieval for AI query
results = collection.query(
    query_texts=["How does vectorized column processing work?"],
    n_results=1,
    where={"source": "duckdb_guide"}
)`
  },

  "LMDB": {
    latency: "< 5 microseconds microsecond read latencies via direct mmap()",
    acidModel: "Full ACID (Copy-On-Write B+ Tree; single-writer with wait-free concurrent readers)",
    replication: "Embedded single-machine storage engine (local file)",
    primaryUseCase: "OpenLDAP directory service, machine learning training datasets (Caffe/PyTorch), high-speed key-value caches",
    pros: [
      "Zero-copy read performance: applications read directly from OS virtual memory page cache via mmap()",
      "Immune to database corruption: Copy-on-Write B+ tree ensures safe crash recovery without a WAL",
      "Ridiculously small footprint: ~32KB compiled C code with zero external library dependencies"
    ],
    cons: [
      "Single writer lock: only one write transaction can execute at a given moment",
      "Database file pre-allocates contiguous virtual address space, requiring a large mapsize upfront"
    ],
    snippetLang: "c",
    snippetTitle: "C LMDB Zero-Copy mmap() Transaction",
    snippetCode: `#include <lmdb.h>

MDB_env *env;
MDB_dbi dbi;
MDB_txn *txn;
MDB_val key, data;

mdb_env_create(&env);
mdb_env_set_mapsize(env, 10485760); // 10MB virtual address map
mdb_env_open(env, "./lmdb_store", 0, 0664);

// Zero-copy read transaction (runs concurrently with zero lock contention)
mdb_txn_begin(env, NULL, MDB_RDONLY, &txn);
mdb_dbi_open(txn, NULL, 0, &dbi);

key.mv_size = 4;
key.mv_data = "1001";
mdb_get(txn, dbi, &key, &data);

// data.mv_data points DIRECTLY into kernel page cache (zero copy)
printf("Record size: %zu bytes\\n", data.mv_size);
mdb_txn_abort(txn);`
  },

  "PGlite": {
    latency: "< 5ms in-memory WebAssembly SQL execution in browser tab or Node.js",
    acidModel: "Full ACID (Complete PostgreSQL transactional semantics in WASM)",
    replication: "Single-process embedded; syncable via ElectricSQL or IndexedDB persistence",
    primaryUseCase: "Local-first web apps, edge computing (Cloudflare Workers), offline-capable PWAs, browser tests",
    pros: [
      "Runs genuine PostgreSQL in WebAssembly with zero external dependencies and ~3MB gzip size",
      "Persists state directly into browser IndexedDB or runs completely in RAM",
      "Supports PostgreSQL extensions including pgvector right inside client-side JavaScript"
    ],
    cons: [
      "Subject to browser WebAssembly memory limits (typically 2GB-4GB address space)",
      "Single-user in-process model; not intended to replace multi-tenant server PostgreSQL"
    ],
    snippetLang: "javascript",
    snippetTitle: "PGlite In-Browser WebAssembly Query",
    snippetCode: `import { PGlite } from '@electric-sql/pglite';
import { vector } from '@electric-sql/pglite/vector';

// Initialize PGlite with persistent IndexedDB backing & pgvector
const db = new PGlite('idb://my-local-postgres', {
  extensions: { vector }
});

await db.exec('CREATE EXTENSION IF NOT EXISTS vector;');
await db.exec(\`
  CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    content TEXT,
    embedding vector(3)
  );
\`);

// Execute transactional query in browser tab
await db.query(
  'INSERT INTO notes (content, embedding) VALUES ($1, $2)',
  ['Offline-first AI memory', '[0.1, 0.2, 0.3]']
);

const res = await db.query('SELECT * FROM notes;');
console.log('PGlite rows in browser:', res.rows);`
  },

  "Apache Druid": {
    latency: "10-100ms sub-second slice-and-dice queries on streaming event streams",
    acidModel: "Atomic immutable segment publishing; eventual consistency across historical nodes",
    replication: "Segment replication across Historical nodes with deep storage durability (S3/HDFS)",
    primaryUseCase: "Interactive real-time user-facing analytics dashboards, ad-tech auction analysis, APM telemetry",
    pros: [
      "Sub-second interactive query latencies on multi-petabyte datasets via Roaring bitmap indexing",
      "Native Kafka and Kinesis streaming ingestion with zero-delay indexing into queryable segments",
      "Automatic data rollup during ingestion condenses raw streaming events by up to 90%"
    ],
    cons: [
      "Complex distributed topology (Brokers, Historicals, MiddleManagers, Overlords, ZooKeeper)",
      "Not designed for transactional single-record row mutations or frequent ad-hoc joins"
    ],
    snippetLang: "sql",
    snippetTitle: "Druid Sub-Second Streaming Timeseries",
    snippetCode: `-- Real-time slice-and-dice query using exact bitmap indexing
SELECT 
    TIME_FLOOR(__time, 'PT5M') AS time_interval,
    datacenter,
    country_code,
    COUNT(*) AS total_requests,
    APPROX_COUNT_DISTINCT_BUILTIN(user_id) AS approx_unique_users,
    APPROX_QUANTILE_DS(response_time_ms, 0.99) AS p99_latency_ms
FROM "telemetry_traffic"
WHERE __time >= CURRENT_TIMESTAMP - INTERVAL '1' HOUR
  AND status_code >= 500
GROUP BY 1, 2, 3
ORDER BY total_requests DESC;`
  },

  "Apache Pinot": {
    latency: "< 50ms distributed real-time OLAP on streaming Kafka events",
    acidModel: "Immutable columnar segments; atomic segment swaps and eventual consistency",
    replication: "Distributed segment replication managed via Apache Helix and ZooKeeper",
    primaryUseCase: "User-facing real-time analytics (LinkedIn 'Who Viewed My Profile', Uber Eats restaurant metrics)",
    pros: [
      "Engineered specifically for high-QPS user-facing analytics under thousands of concurrent queries",
      "Specialized indexing: Star-Tree, Inverted, Range, Bloom filter, Text, and Geospatial indexes",
      "Real-time streaming ingestion directly from Apache Kafka without intermediate micro-batching"
    ],
    cons: [
      "Requires Apache Helix, ZooKeeper, Controller, Broker, and Server cluster components",
      "Limited support for complex arbitrary multi-table JOIN operations"
    ],
    snippetLang: "sql",
    snippetTitle: "Pinot Ultra-Low Latency Star-Tree Query",
    snippetCode: `-- User-facing high-QPS query accelerated by Star-Tree index
SELECT 
    member_country,
    company_industry,
    COUNT(*) AS profile_views,
    DISTINCTCOUNT(viewer_member_id) AS unique_viewers
FROM profile_impressions
WHERE viewed_timestamp >= now() - 86400000
  AND target_member_id = 948291
GROUP BY member_country, company_industry
ORDER BY profile_views DESC
LIMIT 10;`
  },

  "Elasticsearch": {
    latency: "5-25ms distributed full-text search and analytical aggregations",
    acidModel: "Near Real-Time (NRT) eventual consistency (translog write buffer + Lucene segment flushes)",
    replication: "Primary-Replica shard model with Raft cluster coordination",
    primaryUseCase: "Enterprise full-text search, ELK stack log analysis, security SIEM intelligence, application monitoring",
    pros: [
      "World-class Lucene inverted index foundation with linguistic tokenizers and stemmers",
      "Massive distributed scalability handling petabytes of log data across hundreds of shards",
      "Rich aggregation framework allowing nested, bucket, and pipeline metrics queries"
    ],
    cons: [
      "High RAM and heap consumption (heavy JVM garbage collection tuning required)",
      "High storage amplification due to maintaining both inverted index, doc_values, and _source"
    ],
    snippetLang: "json",
    snippetTitle: "BM25 Search with Multi-Match & Highlighting",
    snippetCode: `// POST /logs-application/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "multi_match": {
            "query": "database transaction deadlock",
            "fields": ["title^3", "message", "stack_trace"]
          }
        }
      ],
      "filter": [
        { "term": { "environment": "production" } },
        { "range": { "@timestamp": { "gte": "now-24h" } } }
      ]
    }
  },
  "highlight": {
    "fields": { "message": {} }
  },
  "aggs": {
    "errors_by_service": {
      "terms": { "field": "service.name.keyword", "size": 5 }
    }
  }
}`
  },

  "Apache CouchDB": {
    latency: "2-10ms JSON document reads and atomic writes",
    acidModel: "Eventual consistency across distributed nodes (MVCC with document revisions _rev)",
    replication: "CouchDB Replication Protocol (Bi-directional multi-master sync over HTTP)",
    primaryUseCase: "Offline-first sync architectures, mobile field deployments, CouchDB-to-PouchDB browser sync",
    pros: [
      "Native HTTP RESTful JSON API requiring zero proprietary drivers or connection protocols",
      "Unmatched multi-master bidirectional sync: perfect for unreliable networks and edge nodes",
      "Seamless client pairing with PouchDB running inside browsers and mobile apps"
    ],
    cons: [
      "Append-only B-tree file requires periodic compaction to reclaim disk space from old revisions",
      "Conflict resolution requires application logic to handle diverging document revisions"
    ],
    snippetLang: "bash",
    snippetTitle: "CouchDB HTTP REST API & MapReduce View",
    snippetCode: `# Insert JSON document with revision control over standard HTTP
curl -X PUT http://admin:password@127.0.0.1:5984/inventory/item_884 \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Database Internals Book", "stock": 42, "category": "engineering"}'

# JavaScript MapReduce View definition
function(doc) {
  if (doc.category && doc.stock) {
    emit(doc.category, doc.stock);
  }
}
// Reduce function
_sum`
  },

  "SurrealDB": {
    latency: "1-5ms multi-model document, graph, and vector queries",
    acidModel: "Full ACID (Multi-table transactions supported natively)",
    replication: "Distributed consensus via Raft with pluggable storage backends (RocksDB, TiKV)",
    primaryUseCase: "Modern full-stack web applications, real-time live queries, unified graph and document backends",
    pros: [
      "Unified multi-model: use document, graph relations, time-series, and vector search in one engine",
      "SurrealQL syntax blends intuitive SQL with graph traversals and nested JSON pointers",
      "Real-time Live Queries stream database mutations directly to frontend WebSocket clients"
    ],
    cons: [
      "Younger ecosystem and toolchain compared to mature 20-year-old relational engines",
      "Rapid feature evolution may introduce breaking changes between major versions"
    ],
    snippetLang: "sql",
    snippetTitle: "SurrealQL Graph & Vector Hybrid Query",
    snippetCode: `-- Create graph relation between users and products
RELATE user:guigo->purchased->product:db_course 
SET purchased_at = time::now(), discount = 15;

-- Traverse graph relationships with arrow syntax in SurrealQL
SELECT 
    name, 
    ->purchased->product.title AS courses_bought,
    ->purchased->product<-purchased<-user.name AS also_bought_by
FROM user:guigo;

-- Subscribe to real-time database mutations via WebSocket
LIVE SELECT * FROM order WHERE status = 'pending';`
  },

  "Memcached": {
    latency: "< 200 microseconds ultra-low sub-millisecond memory cache lookup",
    acidModel: "No ACID guarantees (Volatile distributed in-memory cache)",
    replication: "Client-side consistent hashing across standalone server instances",
    primaryUseCase: "Alleviating database query load, volatile web page fragment caching, session caches",
    pros: [
      "Multi-threaded architecture scales cleanly across modern high-core CPU servers",
      "Slab allocator eliminates memory fragmentation under heavy volatile key churn",
      "Extremely simple, reliable protocol with zero bloat or operational complexity"
    ],
    cons: [
      "Does not support data structures beyond raw strings/bytes (unlike Redis)",
      "Zero disk persistence: data is completely wiped if the server restarts or crashes"
    ],
    snippetLang: "bash",
    snippetTitle: "Memcached Binary/Text Protocol Operations",
    snippetCode: `# High-throughput key set with 3600-second expiration
set session:user:4092 0 3600 24
{"role":"admin","v":1}
STORED

# Microsecond point retrieval
get session:user:4092
VALUE session:user:4092 0 24
{"role":"admin","v":1}
END

# Atomic increment (rate limiting / metrics counters)
incr api_hits:tenant_10 1`
  },

  "Memgraph": {
    latency: "< 1ms in-memory graph traversals in C++",
    acidModel: "Full ACID transactions (Snapshot Isolation and Serializable MVCC)",
    replication: "High-Availability clustering with Raft consensus; Kafka/Pulsar streaming ingestion",
    primaryUseCase: "Real-time fraud detection, live cybersecurity network intrusion detection, dynamic logistics routing",
    pros: [
      "Native C++ in-memory graph storage delivers up to 100x faster traversals than disk graphs",
      "Full openCypher language compatibility allows seamless drop-in replacement for Neo4j",
      "Built-in streaming connectors directly attach to Apache Kafka and Redpanda topics"
    ],
    cons: [
      "Entire active graph topology must fit comfortably within physical server RAM",
      "Higher RAM cost per gigabyte of data compared to disk-based graph stores"
    ],
    snippetLang: "sql",
    snippetTitle: "Real-Time Streaming Cypher Query",
    snippetCode: `-- Connect Memgraph directly to live Kafka fraud event stream
CREATE KAFKA STREAM financial_stream 
TOPICS transaction_events 
TRANSFORM fraud_detection_module;

-- Detect real-time suspicious fund transfers across network
MATCH (sender:Account)-[t:TRANSACTION]->(receiver:Account)
WHERE t.amount > 50000 AND sender.risk_score > 0.85
CREATE (sender)-[:FLAGGED_FOR_AUDIT {timestamp: localDateTime()}]->(receiver);`
  },

  "InfluxDB": {
    latency: "2-10ms high-throughput time-series queries and ingestion",
    acidModel: "Eventual consistency across Parquet files; atomic buffer writes",
    replication: "Storage tier replication via object store (S3/GCS) + Apache Arrow DataFusion compute",
    primaryUseCase: "IoT sensor telemetry, DevOps server metrics, real-time energy grid monitoring, Grafana dashboards",
    pros: [
      "Re-engineered InfluxDB 3.0 built on Apache Arrow DataFusion and Parquet for industry-standard speed",
      "Solves high-cardinality bottlenecks: handles millions of unique series tags without memory spikes",
      "Query telemetry using standard ANSI SQL instead of legacy proprietary query languages"
    ],
    cons: [
      "Historical migration differences between InfluxDB 1.x (Flux), 2.x, and 3.0 (Arrow/SQL)",
      "Not designed for transactional OLTP workloads or relational schema foreign keys"
    ],
    snippetLang: "sql",
    snippetTitle: "InfluxDB 3.0 Standard SQL Telemetry",
    snippetCode: `-- Query high-cardinality IoT sensor fleet using standard SQL
SELECT 
    date_bin(INTERVAL '15 minutes', time) AS time_window,
    device_model,
    location_id,
    AVG(voltage) AS avg_voltage,
    MAX(temperature) AS max_temp
FROM "iot_sensors"
WHERE time >= NOW() - INTERVAL '24 hours'
  AND firmware_version = 'v2.4.1'
GROUP BY time_window, device_model, location_id
ORDER BY time_window DESC;`
  },

  "MariaDB": {
    latency: "1-3ms OLTP point read/write using InnoDB or Aria",
    acidModel: "Full ACID (InnoDB & Aria engines with crash-safe transaction logs)",
    replication: "Galera Cluster (Synchronous Multi-Master) & MariaDB Replication",
    primaryUseCase: "Mission-critical LAMP stacks, enterprise ERP, high-availability WordPress/Drupal, distributed analytics",
    pros: [
      "True non-profit open-source stewardship ensuring independence from Oracle governance",
      "Multi-engine modularity: InnoDB for OLTP, ColumnStore for analytical big data, Aria for temporary tables",
      "Galera Cluster provides synchronous multi-master replication with automatic node provisioning"
    ],
    cons: [
      "Syntax diverges from latest MySQL 8.0 features (e.g., differences in JSON and GIS functions)",
      "Maintaining multiple storage engines within one cluster increases administrative complexity"
    ],
    snippetLang: "sql",
    snippetTitle: "MariaDB Temporal Tables & ColumnStore",
    snippetCode: `-- System-versioned temporal table tracks entire history automatically
CREATE TABLE employee_salaries (
    emp_id INT NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department VARCHAR(50) NOT NULL,
    PRIMARY KEY (emp_id)
) WITH SYSTEM VERSIONING;

-- Query employee salary as it was at a specific historical point in time
SELECT * FROM employee_salaries 
FOR SYSTEM_TIME AS OF '2025-01-01 00:00:00'
WHERE emp_id = 42;`
  }
};
