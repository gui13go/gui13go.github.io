const fs = require('fs');

const data = JSON.parse(fs.readFileSync('/home/guigo/Documents/05-ghpages-gui13go/frontend/public/data/databases.json', 'utf8'));

const cardsHtml = data.map(item => {
  const ds = Object.entries(item.dataset).map(([k, v]) => `${k}="${v.replace(/"/g, '&quot;')}"`).join(' ');
  return `<article class="db-card" ${ds} data-sort-year="${item.sortYear}" data-sort-name="${item.sortName}">${item.html}</article>`;
}).join('\n');

const matrixRows = [
  {
    paradigm: "Relational (OLTP)",
    examples: "PostgreSQL, MySQL, MariaDB, CockroachDB",
    engine: "B-Tree / Heap Files / Buffer Pool",
    storageModel: "Row-Oriented (Slotted Page)",
    acid: "Full ACID (Serial / Snapshot)",
    concurrency: "MVCC / 2PL (Locks)",
    p99Latency: "Sub-millisecond to ~3ms",
    useCase: "Banking, e-commerce, user accounts, transactional core"
  },
  {
    paradigm: "Embedded Relational",
    examples: "SQLite, PGlite (WASM)",
    engine: "B-Tree Pager / Flat Single-File / WASM Heap",
    storageModel: "Row-Oriented",
    acid: "Full ACID (WAL / Rollback Journal)",
    concurrency: "Single-Writer / Multiple-Readers",
    p99Latency: "Microsecond (< 50µs)",
    useCase: "Mobile apps, IoT, desktop apps, local-first web applications"
  },
  {
    paradigm: "Columnar OLAP",
    examples: "DuckDB, ClickHouse, Apache Pinot, Apache Druid",
    engine: "Vectorized SIMD / MergeTree / Star-Tree",
    storageModel: "Column-Oriented (Compressed Chunks)",
    acid: "Optimistic / Immutable Segments",
    concurrency: "Multi-threaded Vectorized Pipelines",
    p99Latency: "10ms - 100ms on millions/billions of rows",
    useCase: "Ad-hoc BI, telemetry, Parquet analytics, clickstream, real-time dashboards"
  },
  {
    paradigm: "Key-Value / Memory",
    examples: "Redis, Memcached, RocksDB, LMDB",
    engine: "In-Memory Hash / SkipLists / LSM-tree / mmap() B+ Tree",
    storageModel: "Key-Value / Flat Byte Arrays / Slabs",
    acid: "Atomic ops / WAL / Copy-on-Write",
    concurrency: "Single-threaded event loop or lock-free reads",
    p99Latency: "Microsecond (5µs - 500µs)",
    useCase: "High-speed caching, rate limiting, session storage, storage engine primitives"
  },
  {
    paradigm: "Document & NoSQL",
    examples: "MongoDB, Apache CouchDB, SurrealDB",
    engine: "WiredTiger B-Tree / Append-only B-Tree / RocksDB",
    storageModel: "BSON / JSON Document Stores / Multi-Model",
    acid: "Document-level atomic to full Multi-Table ACID",
    concurrency: "Optimistic Concurrency / Lock-free MVCC",
    p99Latency: "1ms - 5ms",
    useCase: "Dynamic content schemas, mobile sync, polymorphic catalogs, edge sync"
  },
  {
    paradigm: "Distributed / Wide-Column",
    examples: "Apache Cassandra, ScyllaDB",
    engine: "LSM-Tree + MemTable + SSTables + CommitLog",
    storageModel: "Wide-Column / Partition + Clustering Keys",
    acid: "BASE / Tunable Consistency (AP)",
    concurrency: "Masterless Peer-to-Peer Ring (Consistent Hash)",
    p99Latency: "Sub-millisecond writes, linear scale",
    useCase: "High-volume writes, IoT time-series, global audit trails, ad tech"
  },
  {
    paradigm: "Graph Databases",
    examples: "Neo4j, Memgraph",
    engine: "Index-Free Adjacency / In-Memory C++ Pointers",
    storageModel: "Labeled Property Graph (Nodes + Edges + Props)",
    acid: "Full ACID (Snapshot Isolation)",
    concurrency: "Multi-version or pointer-safe concurrent locks",
    p99Latency: "1ms - 10ms for multi-hop path traversal",
    useCase: "Fraud detection rings, social networks, knowledge graphs, identity graph"
  },
  {
    paradigm: "Vector & Search",
    examples: "Qdrant, Milvus, ChromaDB, Elasticsearch, Meilisearch",
    engine: "HNSW Graphs / IVF-PQ / Lucene Inverted Index",
    storageModel: "High-Dimensional Vectors + Payloads / Inverted Index",
    acid: "WAL Segments / Eventual Consistency",
    concurrency: "Multi-threaded ANN search & Lucene readers",
    p99Latency: "1ms - 15ms ANN / BM25 search",
    useCase: "Semantic search, LLM RAG pipelines, multimodal AI, typo-tolerant search"
  }
];

const matrixTableHtml = `
  <div class="db-matrix-container">
    <div class="db-matrix-header-box">
      <div class="matrix-badge">Architecture Blueprint</div>
      <h2 class="matrix-title">Database Storage Paradigms &amp; Internals Matrix</h2>
      <p class="matrix-desc">Compare storage models, underlying data structures, concurrency guarantees, and P99 latency profiles across core database categories.</p>
    </div>
    <div class="db-matrix-table-wrapper">
      <table class="db-matrix-table">
        <thead>
          <tr>
            <th>Paradigm</th>
            <th>Representative Engines</th>
            <th>Internal Storage Engine</th>
            <th>Storage Model</th>
            <th>ACID / Consistency</th>
            <th>P99 Latency</th>
            <th>Primary Sweet Spot</th>
          </tr>
        </thead>
        <tbody>
          ${matrixRows.map(r => `
            <tr>
              <td class="col-paradigm"><strong>${r.paradigm}</strong></td>
              <td class="col-examples">${r.examples}</td>
              <td class="col-engine"><code>${r.engine}</code></td>
              <td class="col-model"><span class="table-pill">${r.storageModel}</span></td>
              <td class="col-acid">${r.acid}</td>
              <td class="col-latency"><span class="latency-pill">${r.p99Latency}</span></td>
              <td class="col-usecase">${r.useCase}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>
`;

const conceptsHtml = `
  <section class="db-concepts-section">
    <div class="concepts-header-box">
      <div class="matrix-badge">Core Concepts</div>
      <h2 class="matrix-title">Essential Database Internals Quick Guide</h2>
      <p class="matrix-desc">Master the fundamental computer science primitives that distinguish world-class storage engines.</p>
    </div>
    <div class="db-concepts-grid">
      <div class="concept-card">
        <div class="concept-icon">
          <svg fill="none" height="24" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="24"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
        </div>
        <h3 class="concept-title">B-Tree vs. LSM-Tree</h3>
        <p class="concept-body"><strong>B-Trees</strong> (Postgres, SQLite, InnoDB) update pages in-place on disk with O(log N) random read/write lookups. <strong>LSM-Trees</strong> (RocksDB, Cassandra, ScyllaDB) buffer writes in a sequential in-memory MemTable before flushing immutable SSTables to disk, trading read amplification for virtually unlimited sequential write speed.</p>
      </div>

      <div class="concept-card">
        <div class="concept-icon">
          <svg fill="none" height="24" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="24"><rect height="18" rx="2" ry="2" width="18" x="3" y="3"></rect><line x1="9" x2="9" y1="3" y2="21"></line><line x1="15" x2="15" y1="3" y2="21"></line></svg>
        </div>
        <h3 class="concept-title">Row-Store vs. Columnar</h3>
        <p class="concept-body"><strong>Row stores</strong> lay entire tuple attributes consecutively in 8KB disk blocks—ideal for single-row OLTP CRUD mutations. <strong>Columnar engines</strong> (DuckDB, ClickHouse) store contiguous arrays of single columns, allowing CPU SIMD vector processing to scan millions of values per cycle with extreme compression ratios (ZSTD/Gorilla).</p>
      </div>

      <div class="concept-card">
        <div class="concept-icon">
          <svg fill="none" height="24" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        </div>
        <h3 class="concept-title">WAL &amp; MVCC</h3>
        <p class="concept-body"><strong>Write-Ahead Logging (WAL)</strong> guarantees durability by writing transaction changes to an append-only log before modifying data pages. <strong>Multi-Version Concurrency Control (MVCC)</strong> tags tuples with creation and expiration transaction IDs, guaranteeing readers never block writers and writers never block readers.</p>
      </div>

      <div class="concept-card">
        <div class="concept-icon">
          <svg fill="none" height="24" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="24"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line></svg>
        </div>
        <h3 class="concept-title">HNSW &amp; Vector Indexing</h3>
        <p class="concept-body"><strong>Hierarchical Navigable Small World (HNSW)</strong> graphs construct multi-layer proximity networks reminiscent of skip lists. High-layer traversals jump across wide vector spaces before zooming into fine-grained local neighborhoods, executing k-Nearest Neighbor searches across millions of embeddings in single-digit milliseconds.</p>
      </div>
    </div>
  </section>
`;

const pageHtml = `<main class="main"><div class="gallery-page-container"><header class="gallery-header"><div class="gallery-breadcrumbs"><a href="https://gui13go.github.io/">Home</a> <span>/</span> <a href="/gallery/">Gallery</a> <span>/</span> <span>Databases</span></div><h1 class="gallery-title">Databases &amp; Storage Engines</h1><p class="gallery-subtitle">An architectural deep dive into database internals, storage engines, concurrency models, and distributed paradigms.</p><nav aria-label="Gallery Sections" class="gallery-nav-pills"><a class="gallery-pill" href="/gallery/personalities/">Personalities</a>
<a class="gallery-pill" href="/gallery/quotes/">Quotes</a>
<a class="gallery-pill" href="/gallery/arts/">Arts</a>
<a class="gallery-pill" href="/gallery/books/">Books</a>
<a class="gallery-pill" href="/gallery/computer-languages/">Languages</a>
<a class="gallery-pill" href="/gallery/operating-systems/">Operating Systems</a>
<a class="gallery-pill" href="/gallery/network-protocols/">Protocols</a>
<a class="gallery-pill active" href="/gallery/databases/">Databases</a>
<a class="gallery-pill" href="/gallery/facts/">Facts</a>
<a class="gallery-pill" href="/gallery/laws/">Laws</a>
<a class="gallery-pill" href="/gallery/jokes/">Jokes</a>
<a class="gallery-pill" href="/gallery/versus/">Versus</a>
<a class="gallery-pill" href="/gallery/dictionary/">Dictionary</a>
<a class="gallery-pill" href="/gallery/gadgets/">Gadgets</a></nav></header>

${conceptsHtml}

${matrixTableHtml}

<div class="gallery-filter-chips" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px">
  <button class="db-filter-chip active" data-filter="all" type="button">All Paradigms (30)</button>
  <button class="db-filter-chip" data-filter="relational" type="button">Relational &amp; NewSQL (6)</button>
  <button class="db-filter-chip" data-filter="embedded" type="button">Embedded &amp; Client-Side (5)</button>
  <button class="db-filter-chip" data-filter="olap" type="button">Analytical &amp; OLAP (5)</button>
  <button class="db-filter-chip" data-filter="nosql" type="button">NoSQL, KV &amp; Graph (8)</button>
  <button class="db-filter-chip" data-filter="vector" type="button">Vector &amp; Search (6)</button>
</div>

<div class="gallery-toolbar">
  <div class="gallery-search-box">
    <svg class="search-icon" fill="none" height="18" stroke="currentColor" stroke-width="2" viewbox="0 0 24 24" width="18"><circle cx="11" cy="11" r="8"></circle><line x1="21" x2="16.65" y1="21" y2="16.65"></line></svg>
    <input autocomplete="off" id="dbSearch" placeholder="Search databases by name, storage engine, model, paradigm, creator, or internals..." type="text"/>
    <button aria-label="Clear search" class="clear-search-btn" id="clearDbSearch" style="display:none" type="button">×</button>
  </div>
  <div class="gallery-sort-box">
    <label class="gallery-sort-label" for="dbSort">
      <svg fill="none" height="15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="15">
        <line x1="12" x2="12" y1="5" y2="19"></line>
        <polyline points="19 12 12 19 5 12"></polyline>
      </svg>
      <span>Sort:</span>
    </label>
    <select aria-label="Sort databases" class="gallery-sort-select" id="dbSort">
      <option selected="" value="date-desc">Newest to Oldest</option>
      <option value="date-asc">Oldest to Newest</option>
      <option value="name-asc">Name (A → Z)</option>
      <option value="name-desc">Name (Z → A)</option>
    </select>
  </div>
  <div class="gallery-count-badge">Showing <span id="visibleCount">${data.length}</span> of ${data.length} databases</div>
</div>

<div class="databases-grid db-grid" id="databasesGrid">
  ${cardsHtml}
</div>

<div class="gallery-empty-state" id="noResultsMsg" style="display:none">
  <p>No databases matched your search or filter query.</p>
</div>

</div>

<!-- Focused Blueprint Lightbox Modal -->
<div aria-hidden="true" class="gallery-lightbox" id="galleryLightbox" role="dialog">
  <div class="lightbox-backdrop"></div>
  <div class="lightbox-dialog">
    <button aria-label="Close focused view" class="lightbox-close" type="button">×</button>
    <div class="lightbox-image-container">
      <img alt="" id="lightboxImg" src=""/>
    </div>
    <div class="lightbox-details">
      <h3 id="lightboxTitle"></h3>
      <div class="lightbox-meta" id="lightboxMeta"></div>
      <p id="lightboxCaption"></p>
    </div>
  </div>
</div>

<style>
  /* ==========================================================================
     High-Contrast, Accessible Design System & Theme Styling for Databases
     ========================================================================== */

  /* --- Concept Guide Styles --- */
  .db-concepts-section {
    margin-bottom: 32px;
    background: var(--entry, #161b22);
    border: 1px solid var(--theme-border, #30363d);
    border-radius: var(--theme-card-radius, 16px);
    padding: 24px 28px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }
  .concepts-header-box, .db-matrix-header-box {
    margin-bottom: 22px;
  }
  .matrix-badge {
    display: inline-block;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    background: var(--theme-accent-glow, rgba(59, 130, 246, 0.15));
    color: var(--theme-accent, #3b82f6);
    border: 1px solid var(--theme-border, rgba(59, 130, 246, 0.3));
    padding: 4px 12px;
    border-radius: 999px;
    margin-bottom: 10px;
  }
  .matrix-title {
    font-size: 1.55rem;
    font-weight: 800;
    color: var(--primary, #f0f6fc);
    margin: 0 0 8px 0;
    letter-spacing: -0.02em;
  }
  .matrix-desc {
    font-size: 0.95rem;
    color: var(--secondary, #8b949e);
    margin: 0;
    line-height: 1.6;
  }
  .db-concepts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 18px;
  }
  .concept-card {
    background: var(--tertiary, #21262d);
    border: 1px solid var(--theme-border, #30363d);
    border-radius: 12px;
    padding: 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .concept-card:hover {
    transform: translateY(-2px);
    border-color: var(--theme-accent, #3b82f6);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
  .concept-icon {
    color: var(--theme-accent, #3b82f6);
    display: flex;
    align-items: center;
  }
  .concept-title {
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--primary, #f0f6fc);
    margin: 0;
    letter-spacing: -0.01em;
  }
  .concept-body {
    font-size: 0.88rem;
    line-height: 1.6;
    color: var(--content, #c9d1d9);
    margin: 0;
  }
  .concept-body strong {
    color: var(--primary, #f0f6fc);
  }

  /* --- Matrix Comparison Table Styles --- */
  .db-matrix-container {
    margin-bottom: 32px;
    background: var(--entry, #161b22);
    border: 1px solid var(--theme-border, #30363d);
    border-radius: var(--theme-card-radius, 16px);
    padding: 24px 28px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }
  .db-matrix-table-wrapper {
    overflow-x: auto;
    border-radius: 12px;
    border: 1px solid var(--theme-border, #30363d);
    background: var(--tertiary, #21262d);
  }
  .db-matrix-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.88rem;
    text-align: left;
    white-space: nowrap;
  }
  .db-matrix-table th {
    background: var(--code-bg, #161b22);
    color: var(--secondary, #8b949e);
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.74rem;
    letter-spacing: 0.06em;
    padding: 14px 18px;
    border-bottom: 1px solid var(--theme-border, #30363d);
  }
  .db-matrix-table td {
    padding: 14px 18px;
    border-bottom: 1px solid var(--theme-border, #30363d);
    color: var(--content, #c9d1d9);
  }
  .db-matrix-table tr:last-child td {
    border-bottom: none;
  }
  .db-matrix-table tr:hover td {
    background: var(--code-bg, rgba(255, 255, 255, 0.03));
  }
  .col-paradigm strong {
    color: var(--primary, #f0f6fc);
    font-weight: 700;
  }
  .col-examples {
    color: var(--primary, #f0f6fc);
    font-weight: 500;
  }
  .col-engine code {
    font-family: var(--code-font, ui-monospace, monospace);
    font-size: 0.8rem;
    background: var(--code-bg, rgba(0, 0, 0, 0.25));
    border: 1px solid var(--theme-border, rgba(255, 255, 255, 0.08));
    padding: 3px 8px;
    border-radius: 6px;
    color: var(--theme-accent, #3b82f6);
    font-weight: 600;
  }
  .table-pill {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 0.76rem;
    font-weight: 600;
    background: var(--code-bg, rgba(255, 255, 255, 0.08));
    border: 1px solid var(--theme-border, rgba(255, 255, 255, 0.1));
    color: var(--primary, #f0f6fc);
  }
  .latency-pill {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 0.76rem;
    font-weight: 700;
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.35);
  }
  [data-theme="light"] .latency-pill {
    background: #ecfdf5;
    color: #047857;
    border-color: #a7f3d0;
  }
  .col-acid {
    color: var(--content, #c9d1d9);
  }
  .col-usecase {
    white-space: normal;
    min-width: 240px;
    line-height: 1.5;
    color: var(--content, #c9d1d9);
  }

  /* --- Toolbar & Filter Chips --- */
  .gallery-filter-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
  }
  .db-filter-chip {
    background: var(--tertiary, #21262d);
    border: 1px solid var(--theme-border, #30363d);
    color: var(--secondary, #8b949e);
    padding: 8px 16px;
    border-radius: 999px;
    font-size: 0.88rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .db-filter-chip:hover {
    color: var(--primary, #f0f6fc);
    border-color: var(--theme-accent, #3b82f6);
    transform: translateY(-1px);
  }
  .db-filter-chip.active {
    background: var(--theme-accent, #3b82f6);
    border-color: var(--theme-accent, #3b82f6);
    color: #ffffff;
    box-shadow: 0 4px 14px var(--theme-accent-glow, rgba(59, 130, 246, 0.25));
  }

  /* --- Grid & Card Styles --- */
  .databases-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 24px;
    margin-top: 18px;
  }
  .db-card {
    background: var(--entry, #161b22);
    border: 1px solid var(--theme-border, #30363d);
    border-radius: var(--theme-card-radius, 16px);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }
  .db-card:hover {
    transform: translateY(-4px);
    border-color: var(--theme-accent, #3b82f6);
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.25);
  }
  .db-img-wrapper {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 10;
    overflow: hidden;
    background: #030712;
    cursor: zoom-in;
  }
  .db-img-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;
  }
  .db-card:hover .db-img-wrapper img {
    transform: scale(1.03);
  }
  .db-type-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    background: rgba(13, 17, 23, 0.88);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    color: #f0f6fc;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 5px 12px;
    border-radius: 999px;
    z-index: 2;
  }
  .db-img-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    opacity: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s ease;
    color: #ffffff;
  }
  .db-img-wrapper:hover .db-img-overlay {
    opacity: 1;
  }
  .db-card-content {
    padding: 24px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .db-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;
  }
  .db-name {
    font-size: 1.45rem;
    font-weight: 800;
    color: var(--primary, #f0f6fc);
    margin: 0;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }
  .db-year-badge {
    background: var(--theme-accent-glow, rgba(59, 130, 246, 0.15));
    color: var(--theme-accent, #3b82f6);
    border: 1px solid var(--theme-border, rgba(59, 130, 246, 0.3));
    padding: 3px 10px;
    border-radius: 8px;
    font-size: 0.78rem;
    font-weight: 700;
  }
  .db-creator {
    font-size: 0.86rem;
    color: var(--secondary, #8b949e);
    margin-bottom: 14px;
    line-height: 1.45;
  }
  .db-creator strong {
    color: var(--primary, #f0f6fc);
  }
  .db-desc {
    font-size: 0.92rem;
    line-height: 1.65;
    color: var(--content, #c9d1d9);
    margin: 0 0 18px 0;
  }

  /* Specification Grid - High Readability */
  .db-specs-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px 14px;
    background: var(--tertiary, #21262d);
    border: 1px solid var(--theme-border, #30363d);
    border-radius: 12px;
    padding: 14px 16px;
    margin-bottom: 18px;
  }
  .db-spec-item {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .spec-label {
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--secondary, #8b949e);
  }
  .spec-value {
    font-size: 0.86rem;
    font-weight: 600;
    color: var(--primary, #f0f6fc);
    word-break: break-word;
    line-height: 1.4;
  }

  .db-features-box {
    margin-bottom: 16px;
  }
  .db-section-label {
    display: block;
    font-size: 0.76rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--theme-accent, #3b82f6);
    margin-bottom: 10px;
  }
  .db-features-list {
    margin: 0;
    padding-left: 20px;
    font-size: 0.86rem;
    line-height: 1.6;
    color: var(--content, #c9d1d9);
  }
  .db-features-list li {
    margin-bottom: 8px;
  }

  /* --- Accordions for Code & Tradeoffs --- */
  .db-code-accordion, .db-tradeoffs-accordion {
    border: 1px solid var(--theme-border, #30363d);
    border-radius: 12px;
    margin-bottom: 14px;
    background: var(--tertiary, #21262d);
    overflow: hidden;
    transition: border-color 0.2s ease;
  }
  .db-code-accordion:hover, .db-tradeoffs-accordion:hover {
    border-color: var(--theme-accent, #3b82f6);
  }
  .db-code-toggle-btn, .db-tradeoffs-toggle-btn {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    background: none;
    border: none;
    color: var(--primary, #f0f6fc);
    font-size: 0.84rem;
    font-weight: 600;
    cursor: pointer;
    text-align: left;
    transition: background 0.2s ease;
  }
  .db-code-toggle-btn:hover, .db-tradeoffs-toggle-btn:hover {
    background: var(--code-bg, rgba(255, 255, 255, 0.04));
  }
  .db-toggle-icon {
    display: inline-flex;
    align-items: center;
    color: var(--theme-accent, #3b82f6);
    transition: transform 0.25s ease;
  }
  .open .db-toggle-icon {
    transform: rotate(180deg);
  }
  .db-toggle-title {
    flex: 1;
  }
  .db-toggle-badge {
    font-size: 0.7rem;
    font-weight: 700;
    padding: 3px 8px;
    background: var(--theme-accent-glow, rgba(59, 130, 246, 0.15));
    color: var(--theme-accent, #3b82f6);
    border: 1px solid var(--theme-border, rgba(59, 130, 246, 0.3));
    border-radius: 6px;
    letter-spacing: 0.06em;
  }
  .db-code-body, .db-tradeoffs-body {
    display: none;
    padding: 14px 16px;
    border-top: 1px solid var(--theme-border, #30363d);
    background: var(--code-bg, #161b22);
  }
  .open > .db-code-body, .open > .db-tradeoffs-body {
    display: block;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .db-code-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .db-code-desc {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--secondary, #8b949e);
  }
  .db-copy-code-btn {
    background: var(--tertiary, #21262d);
    border: 1px solid var(--theme-border, #30363d);
    color: var(--primary, #f0f6fc);
    font-size: 0.74rem;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .db-copy-code-btn:hover {
    background: var(--theme-accent, #3b82f6);
    color: #ffffff;
    border-color: var(--theme-accent, #3b82f6);
  }
  .db-code-block {
    margin: 0;
    padding: 12px 14px;
    background: #090d16;
    border: 1px solid #1e293b;
    border-radius: 8px;
    overflow-x: auto;
    font-family: var(--code-font, ui-monospace, monospace);
    font-size: 0.8rem;
    line-height: 1.5;
    color: #f1f5f9;
  }
  [data-theme="light"] .db-code-block {
    background: #0d1117;
    color: #e6edf3;
  }

  /* --- Tradeoffs Section --- */
  .db-sweet-spot {
    font-size: 0.86rem;
    line-height: 1.55;
    color: var(--content, #c9d1d9);
    margin-bottom: 14px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--theme-border, #30363d);
  }
  .db-sweet-spot strong {
    color: var(--theme-accent, #3b82f6);
    font-weight: 700;
  }
  .db-pros-cons-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .pro-header, .con-header {
    display: block;
    font-size: 0.74rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 8px;
  }
  .pro-header { color: #10b981; }
  .con-header { color: #f87171; }
  [data-theme="light"] .pro-header { color: #047857; }
  [data-theme="light"] .con-header { color: #b91c1c; }

  .pros-list, .cons-list {
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 0.84rem;
    line-height: 1.55;
    color: var(--content, #c9d1d9);
  }
  .pros-list li, .cons-list li {
    margin-bottom: 6px;
    display: flex;
    gap: 8px;
    align-items: baseline;
  }
  .pro-tag {
    color: #10b981;
    font-weight: 800;
    font-size: 1rem;
    line-height: 1;
    flex-shrink: 0;
  }
  .con-tag {
    color: #f87171;
    font-weight: 800;
    font-size: 1rem;
    line-height: 1;
    flex-shrink: 0;
  }
  [data-theme="light"] .pro-tag { color: #047857; }
  [data-theme="light"] .con-tag { color: #b91c1c; }

  /* --- Footer Links --- */
  .db-footer-action {
    margin-top: auto;
    padding-top: 16px;
    border-top: 1px solid var(--theme-border, #30363d);
  }
  .db-link-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.86rem;
    font-weight: 600;
    color: var(--theme-accent, #3b82f6);
    text-decoration: none;
    transition: color 0.15s ease, transform 0.15s ease;
  }
  .db-link-btn:hover {
    color: #60a5fa;
    transform: translateX(3px);
  }

  @media (max-width: 768px) {
    .databases-grid {
      grid-template-columns: 1fr;
    }
    .db-specs-grid {
      grid-template-columns: 1fr;
    }
    .db-concepts-grid {
      grid-template-columns: 1fr;
    }
    .matrix-title {
      font-size: 1.35rem;
    }
  }
</style>

<script>
(function() {
  function initDatabases() {
    const gridContainer = document.getElementById('databasesGrid');
    const searchInput = document.getElementById('dbSearch');
    const clearBtn = document.getElementById('clearDbSearch');
    const visibleCount = document.getElementById('visibleCount');
    const noResultsMsg = document.getElementById('noResultsMsg');
    const sortSelect = document.getElementById('dbSort');
    const filterChips = document.querySelectorAll('.db-filter-chip');

    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxMeta = document.getElementById('lightboxMeta');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeBtn = document.querySelector('.lightbox-close');
    const backdrop = document.querySelector('.lightbox-backdrop');

    if (!gridContainer) return;

    let dbData = [];
    let currentSort = localStorage.getItem('db-sort-order') || 'date-desc';
    let currentFilter = 'all';

    if (sortSelect) sortSelect.value = currentSort;

    function openLightbox(src, title, meta, caption) {
      if (!lightbox || !lightboxImg) return;
      lightboxImg.src = src;
      lightboxImg.alt = title;
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxMeta) lightboxMeta.textContent = meta || '';
      if (lightboxCaption) lightboxCaption.textContent = caption;
      lightbox.classList.add('active');
      document.body.classList.add('modal-open');
    }

    function closeLightbox() {
      if (!lightbox || !lightboxImg) return;
      lightbox.classList.remove('active');
      document.body.classList.remove('modal-open');
      setTimeout(() => { lightboxImg.src = ''; }, 250);
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (backdrop) backdrop.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });

    function createCardElement(item) {
      const card = document.createElement('article');
      card.className = 'db-card';
      if (item.dataset) {
        Object.entries(item.dataset).forEach(([k, v]) => card.setAttribute(k, v));
      }
      card.dataset.sortYear = item.sortYear != null ? item.sortYear : 0;
      card.dataset.sortName = (item.sortName || item.name || '').toLowerCase();
      card.innerHTML = item.html;

      const zoom = card.querySelector('.gallery-zoomable');
      if (zoom) {
        zoom.addEventListener('click', function() {
          openLightbox(this.dataset.zoomSrc, this.dataset.zoomTitle, this.dataset.zoomMeta, this.dataset.zoomCaption);
        });
      }
      return card;
    }

    function sortList(list, mode) {
      return list.slice().sort((a, b) => {
        const yearA = a.sortYear != null ? a.sortYear : 0;
        const yearB = b.sortYear != null ? b.sortYear : 0;
        const nameA = (a.sortName || a.name || '').toLowerCase();
        const nameB = (b.sortName || b.name || '').toLowerCase();

        switch (mode) {
          case 'date-desc':
            return (yearB - yearA) || nameA.localeCompare(nameB);
          case 'date-asc':
            return (yearA - yearB) || nameA.localeCompare(nameB);
          case 'name-asc':
            return nameA.localeCompare(nameB);
          case 'name-desc':
            return nameB.localeCompare(nameA);
          default:
            return (yearB - yearA) || nameA.localeCompare(nameB);
        }
      });
    }

    function renderCards(list) {
      gridContainer.innerHTML = '';
      const fragment = document.createDocumentFragment();
      list.forEach(item => fragment.appendChild(createCardElement(item)));
      gridContainer.appendChild(fragment);
      filterCards();
    }

    function filterCards() {
      const q = searchInput ? searchInput.value.trim().toLowerCase() : '';
      if (clearBtn) clearBtn.style.display = q.length > 0 ? 'block' : 'none';
      const allCards = gridContainer.querySelectorAll('.db-card');
      let count = 0;

      allCards.forEach(card => {
        const name = card.dataset.name || '';
        const paradigm = card.dataset.paradigm || '';
        const category = card.dataset.category || '';
        const engine = card.dataset.engine || '';
        const license = card.dataset.license || '';
        const storageModel = card.dataset.storageModel || '';
        const queryLang = card.dataset.queryLang || '';
        const creator = card.dataset.creator || '';
        const summary = card.dataset.summary || '';
        const latency = card.dataset.latency || '';
        const acid = card.dataset.acid || '';
        const useCase = card.dataset.useCase || '';
        const highlights = card.dataset.highlights || '';

        const categoryMatch = currentFilter === 'all' || category === currentFilter;
        const textMatch = !q ||
          name.includes(q) ||
          paradigm.includes(q) ||
          engine.includes(q) ||
          license.includes(q) ||
          storageModel.includes(q) ||
          queryLang.includes(q) ||
          creator.includes(q) ||
          summary.includes(q) ||
          latency.includes(q) ||
          acid.includes(q) ||
          useCase.includes(q) ||
          highlights.includes(q);

        if (categoryMatch && textMatch) {
          card.style.display = '';
          count++;
        } else {
          card.style.display = 'none';
        }
      });

      if (visibleCount) visibleCount.textContent = count;
      if (noResultsMsg) noResultsMsg.style.display = count === 0 ? 'block' : 'none';
    }

    filterChips.forEach(chip => {
      chip.addEventListener('click', function() {
        filterChips.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.dataset.filter;
        filterCards();
      });
    });

    if (searchInput) searchInput.addEventListener('input', filterCards);
    if (clearBtn) {
      clearBtn.addEventListener('click', function() {
        searchInput.value = '';
        filterCards();
        searchInput.focus();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', function() {
        currentSort = this.value;
        localStorage.setItem('db-sort-order', currentSort);
        renderCards(sortList(dbData, currentSort));
      });
    }

    // Attach initial zoom event handlers to pre-rendered cards
    gridContainer.querySelectorAll('.gallery-zoomable').forEach(zoom => {
      zoom.addEventListener('click', function() {
        openLightbox(this.dataset.zoomSrc, this.dataset.zoomTitle, this.dataset.zoomMeta, this.dataset.zoomCaption);
      });
    });

    fetch('/data/databases.json')
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(data => {
        dbData = data;
        renderCards(sortList(dbData, currentSort));
      })
      .catch(err => {
        console.warn('Could not fetch /data/databases.json, using pre-rendered fallback:', err);
        filterCards();
      });
  }

  if (document.readyState !== 'loading') {
    initDatabases();
  } else {
    document.addEventListener('DOMContentLoaded', initDatabases);
  }
})();
</script>
</main>`;

fs.writeFileSync('/home/guigo/Documents/05-ghpages-gui13go/frontend/public/rendered_gallery/databases.html', pageHtml);
console.log('Successfully created /rendered_gallery/databases.html with Matrix, Concepts & Code Snippets!');
