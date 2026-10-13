const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('/home/guigo/Documents/05-ghpages-gui13go/frontend/public/data/data-formats.json', 'utf8'));

function escapeAttr(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Render cards
const cardsHtml = data.map(item => {
  return `<div class="fmt-card ${item.classes ? item.classes.join(' ') : ''}" id="${item.id}"
    data-name="${escapeAttr(item.dataset['data-name'])}"
    data-year="${escapeAttr(item.dataset['data-year'])}"
    data-category="${escapeAttr(item.dataset['data-category'])}"
    data-paradigm="${escapeAttr(item.dataset['data-paradigm'])}"
    data-extension="${escapeAttr(item.dataset['data-extension'])}"
    data-mime="${escapeAttr(item.dataset['data-mime'])}"
    data-creator="${escapeAttr(item.dataset['data-creator'])}"
    data-summary="${escapeAttr(item.dataset['data-summary'])}"
    data-schema="${escapeAttr(item.dataset['data-schema'])}"
    data-use-case="${escapeAttr(item.dataset['data-use-case'])}"
    data-highlights="${escapeAttr(item.dataset['data-highlights'])}"
  >
    ${item.html}
  </div>`;
}).join('\n');

// Category counts
const catCounts = {};
data.forEach(d => {
  catCounts[d.category] = (catCounts[d.category] || 0) + 1;
});

const matrixHtml = `
  <div class="fmt-matrix-section">
    <div class="matrix-header-box">
      <div class="matrix-badge">Architecture Matrix</div>
      <h2 class="matrix-title">Serialization &amp; Wire Protocol Taxonomy</h2>
      <p class="matrix-desc">Comprehensive structural comparison of memory alignments, storage layouts, performance profiles, and access models across modern computer systems.</p>
    </div>

    <div class="matrix-table-wrap">
      <table class="fmt-table">
        <thead>
          <tr>
            <th>Paradigm Category</th>
            <th>Primary Storage Model</th>
            <th>Parsing Complexity</th>
            <th>Zero-Copy mmap</th>
            <th>Schema Enforcement</th>
            <th>Ideal Scale Target</th>
            <th>Exemplar Formats</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="cat-pill cat-tabular">Tabular &amp; Delimited</span></td>
            <td>Contiguous ASCII / UTF-8 Row lines</td>
            <td>Low (String split)</td>
            <td><span class="pill-no">No</span></td>
            <td>Optional / Ad-hoc Header</td>
            <td>Small to Medium Datasets</td>
            <td><code>CSV</code>, <code>TSV</code>, <code>SQLite Single-File</code></td>
          </tr>
          <tr>
            <td><span class="cat-pill cat-serialization">Hierarchical Serialization</span></td>
            <td>Recursive Nested Object Trees</td>
            <td>Medium (Tokenizer &amp; AST)</td>
            <td><span class="pill-no">No</span></td>
            <td>Self-Describing / JSON Schema</td>
            <td>Web APIs, App State, Config</td>
            <td><code>JSON</code>, <code>JSONL</code>, <code>YAML</code>, <code>TOML</code>, <code>XML</code></td>
          </tr>
          <tr>
            <td><span class="cat-pill cat-binary">Binary RPC &amp; Wire</span></td>
            <td>Varint / Tagged Binary Framing</td>
            <td>Very Low to Medium</td>
            <td><span class="pill-yes">Yes (FlatBuffers / Cap'n Proto)</span></td>
            <td>Strict Compiled Schemas / IDL</td>
            <td>Microservices, IoT, Kernel IPC</td>
            <td><code>Protobuf</code>, <code>FlatBuffers</code>, <code>CBOR</code>, <code>BSON</code>, <code>Cap'n Proto</code>, <code>Avro</code></td>
          </tr>
          <tr>
            <td><span class="cat-pill cat-bigdata">Columnar OLAP &amp; Lakehouse</span></td>
            <td>Column Chunks, Dictionary &amp; Run-Length</td>
            <td>High (SIMD Decompression)</td>
            <td><span class="pill-yes">Yes (Arrow / Feather)</span></td>
            <td>Strict Embedded Metadata Schema</td>
            <td>Petabyte Data Warehouses &amp; Lakehouses</td>
            <td><code>Parquet</code>, <code>ORC</code>, <code>Feather / Arrow</code>, <code>Apache Iceberg</code>, <code>Delta Lake</code></td>
          </tr>
          <tr>
            <td><span class="cat-pill cat-scientific">Scientific &amp; Multidimensional</span></td>
            <td>N-Dimensional Chunks &amp; Tensors</td>
            <td>Medium to High</td>
            <td><span class="pill-yes">Yes (Direct Chunk Seek)</span></td>
            <td>Strong Typed Array Metashape</td>
            <td>Genomics, Climate, HPC, Astrophysics</td>
            <td><code>HDF5</code>, <code>NetCDF</code>, <code>Zarr</code>, <code>FITS</code>, <code>BAM / VCF</code></td>
          </tr>
          <tr>
            <td><span class="cat-pill cat-geospatial">Geospatial &amp; Navigation</span></td>
            <td>WKB Binary Geometries / Cloud Tiling</td>
            <td>Medium</td>
            <td><span class="pill-yes">Yes (COG / GeoParquet)</span></td>
            <td>GeoJSON Spec / OGC Geopackage</td>
            <td>Satellite Rasters, GIS Vectors, GPS</td>
            <td><code>GeoJSON</code>, <code>GeoParquet</code>, <code>COG</code>, <code>GeoPackage</code>, <code>GPX / KML</code></td>
          </tr>
          <tr>
            <td><span class="cat-pill cat-3d">3D &amp; Spatial Computing</span></td>
            <td>Direct GPU Vertex Buffers &amp; Scenegraphs</td>
            <td>Medium (Direct GPU Buffer upload)</td>
            <td><span class="pill-yes">Yes (GLB / USDC Crate)</span></td>
            <td>Strict Typed Accessors &amp; PBR</td>
            <td>WebGL, Vision Pro, Hollywood VFX</td>
            <td><code>glTF / GLB</code>, <code>OpenUSD (USDA/USDC/USDZ)</code></td>
          </tr>
          <tr>
            <td><span class="cat-pill cat-ai">AI &amp; Machine Learning</span></td>
            <td>Contiguous Tensor Buffers &amp; Quantized Blocks</td>
            <td>Ultra-Low (Direct mmap to GPU)</td>
            <td><span class="pill-yes">Yes (Pure Zero-Copy)</span></td>
            <td>Explicit DType + Shape Key-Value</td>
            <td>Foundation Models &amp; Local Edge LLMs</td>
            <td><code>SafeTensors</code>, <code>GGUF</code></td>
          </tr>
          <tr>
            <td><span class="cat-pill cat-archive">Archive &amp; Document Packaging</span></td>
            <td>Sequential TAR Blocks / Central Directory ZIP</td>
            <td>Low to Medium</td>
            <td><span class="pill-yes">Yes (ZIP tail seek)</span></td>
            <td>POSIX Headers / OPF Manifest</td>
            <td>Software Distribution, DOCX, APK, E-Books</td>
            <td><code>TAR / ZIP / 7z</code>, <code>EPUB</code>, <code>PDF</code></td>
          </tr>
          <tr>
            <td><span class="cat-pill cat-media">Visual Media, Video &amp; Clinical</span></td>
            <td>DCT Frequencies, Wavelets, Interframe GOPs</td>
            <td>Very High (Hardware Codec)</td>
            <td><span class="pill-no">Stream Buffer</span></td>
            <td>Container Atoms / Chunk Metadata</td>
            <td>Web Streaming, Broadcast, Radiology</td>
            <td><code>JPEG</code>, <code>PNG</code>, <code>WebP</code>, <code>AVIF</code>, <code>MP4</code>, <code>FLAC</code>, <code>DICOM</code></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
`;

const conceptsHtml = `
  <section class="fmt-concepts-section">
    <div class="concepts-header-box">
      <div class="matrix-badge">Core Concepts</div>
      <h2 class="matrix-title">Essential Data Serialization &amp; Wire Format Primitives</h2>
      <p class="matrix-desc">Master the fundamental computer science mechanisms that govern how modern software systems serialize, compress, and query information.</p>
    </div>
    <div class="fmt-concepts-grid">
      <div class="concept-card">
        <div class="concept-icon">
          <svg fill="none" height="24" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="24"><line x1="8" x2="21" y1="6" y2="6"></line><line x1="8" x2="21" y1="12" y2="12"></line><line x1="8" x2="21" y1="18" y2="18"></line><line x1="3" x2="3.01" y1="6" y2="6"></line><line x1="3" x2="3.01" y1="12" y2="12"></line><line x1="3" x2="3.01" y1="18" y2="18"></line></svg>
        </div>
        <h3 class="concept-title">Row-Store vs. Columnar</h3>
        <p class="concept-body"><strong>Row-oriented formats</strong> (CSV, JSON, Avro, SQLite) lay entire records contiguously. Great for write streams and single-record lookups. <strong>Columnar formats</strong> (Parquet, ORC) group all values of a column together, unlocking massive compression (Run-Length, Dictionary) and SIMD vectorized scans skipping unqueried columns.</p>
      </div>

      <div class="concept-card">
        <div class="concept-icon">
          <svg fill="none" height="24" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="24"><rect height="18" rx="2" ry="2" width="18" x="3" y="3"></rect><polyline points="10 9 9 9 8 9"></polyline><polyline points="14 9 15 9 16 9"></polyline><polyline points="10 15 9 15 8 15"></polyline><polyline points="14 15 15 15 16 15"></polyline></svg>
        </div>
        <h3 class="concept-title">Text vs. Binary Encoding</h3>
        <p class="concept-body"><strong>Text formats</strong> (JSON, CSV, YAML) are human-readable but suffer from string parsing overhead, floating-point rounding errors, and Base64 byte bloat. <strong>Binary formats</strong> (Protobuf, FlatBuffers, CBOR, Arrow) pack numbers directly into native CPU bytes or varints, yielding up to 10x smaller sizes and 50x faster deserialization.</p>
      </div>

      <div class="concept-card">
        <div class="concept-icon">
          <svg fill="none" height="24" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        </div>
        <h3 class="concept-title">Schema-First vs. Self-Describing</h3>
        <p class="concept-body"><strong>Schema-first systems</strong> (Protobuf, Avro, Cap'n Proto, ASN.1) enforce strict schemas (.proto, .avsc), transmitting field numbers instead of names for minimal payload size. <strong>Self-describing formats</strong> (JSON, MessagePack, BSON, HDF5) embed field keys directly with values, providing maximum agility at the cost of repetition.</p>
      </div>

      <div class="concept-card">
        <div class="concept-icon">
          <svg fill="none" height="24" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" x2="12" y1="22.08" y2="12"></line></svg>
        </div>
        <h3 class="concept-title">Zero-Copy Memory Mapping</h3>
        <p class="concept-body">Modern high-performance formats (SafeTensors, GGUF, FlatBuffers, Arrow) format data in memory-aligned blocks matching CPU registers. Software can <code>mmap()</code> files directly from NVMe SSDs into RAM and read fields with <strong>zero allocation, zero copying, and zero parsing</strong>.</p>
      </div>
    </div>
  </section>
`;

const pageHtml = `<main class="main"><div class="gallery-page-container"><header class="gallery-header"><div class="gallery-breadcrumbs"><a href="https://gui13go.github.io/">Home</a> <span>/</span> <a href="/gallery/">Gallery</a> <span>/</span> <span>Data Formats</span></div><h1 class="gallery-title">Data Formats &amp; Wire Protocols</h1><p class="gallery-subtitle">An architectural deep dive into serialization protocols, wire encodings, columnar engines, multidimensional arrays, 3D graphics, AI weights, and media formats.</p><nav aria-label="Gallery Sections" class="gallery-nav-pills"><a class="gallery-pill" href="/gallery/personalities/">Personalities</a>
<a class="gallery-pill" href="/gallery/quotes/">Quotes</a>
<a class="gallery-pill" href="/gallery/arts/">Arts</a>
<a class="gallery-pill" href="/gallery/books/">Books</a>
<a class="gallery-pill" href="/gallery/computer-languages/">Languages</a>
<a class="gallery-pill" href="/gallery/operating-systems/">Operating Systems</a>
<a class="gallery-pill" href="/gallery/network-protocols/">Protocols</a>
<a class="gallery-pill" href="/gallery/databases/">Databases</a>
<a class="gallery-pill active" href="/gallery/data-formats/">Data Formats</a>
<a class="gallery-pill" href="/gallery/facts/">Facts</a>
<a class="gallery-pill" href="/gallery/laws/">Laws</a>
<a class="gallery-pill" href="/gallery/jokes/">Jokes</a>
<a class="gallery-pill" href="/gallery/versus/">Versus</a>
<a class="gallery-pill" href="/gallery/dictionary/">Dictionary</a>
<a class="gallery-pill" href="/gallery/gadgets/">Gadgets</a></nav></header>

${conceptsHtml}

${matrixHtml}

<div class="fmt-filter-bar">
  <button class="fmt-filter-chip active" data-filter="all" type="button">All Formats (${data.length})</button>
  <button class="fmt-filter-chip" data-filter="tabular" type="button">Tabular (${catCounts.tabular || 0})</button>
  <button class="fmt-filter-chip" data-filter="serialization" type="button">Structured &amp; Hierarchical (${catCounts.serialization || 0})</button>
  <button class="fmt-filter-chip" data-filter="binary" type="button">Binary Serialization &amp; RPC (${catCounts.binary || 0})</button>
  <button class="fmt-filter-chip" data-filter="bigdata" type="button">Columnar &amp; Lakehouse (${catCounts.bigdata || 0})</button>
  <button class="fmt-filter-chip" data-filter="scientific" type="button">Scientific &amp; Genomic (${catCounts.scientific || 0})</button>
  <button class="fmt-filter-chip" data-filter="geospatial" type="button">Geospatial &amp; GPS (${catCounts.geospatial || 0})</button>
  <button class="fmt-filter-chip" data-filter="3d" type="button">3D &amp; Spatial (${catCounts['3d'] || 0})</button>
  <button class="fmt-filter-chip" data-filter="ai" type="button">AI &amp; Neural Weights (${catCounts.ai || 0})</button>
  <button class="fmt-filter-chip" data-filter="archive" type="button">Archive &amp; Documents (${catCounts.archive || 0})</button>
  <button class="fmt-filter-chip" data-filter="media" type="button">Media &amp; Medical (${catCounts.media || 0})</button>
</div>

<div class="gallery-toolbar">
  <div class="gallery-search-box">
    <svg class="search-icon" fill="none" height="18" stroke="currentColor" stroke-width="2" viewbox="0 0 24 24" width="18"><circle cx="11" cy="11" r="8"></circle><line x1="21" x2="16.65" y1="21" y2="16.65"></line></svg>
    <input autocomplete="off" id="fmtSearch" placeholder="Search 50 data formats by name, extension (.safetensors, .gguf, .gltf), MIME, paradigm, schema, or internals..." type="text"/>
    <button aria-label="Clear search" class="clear-search-btn" id="clearFmtSearch" style="display:none" type="button">×</button>
  </div>
  <div class="gallery-sort-box">
    <label class="gallery-sort-label" for="fmtSort">
      <svg fill="none" height="15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="15">
        <line x1="12" x2="12" y1="5" y2="19"></line>
        <polyline points="19 12 12 19 5 12"></polyline>
      </svg>
      <span>Sort:</span>
    </label>
    <select aria-label="Sort formats" class="gallery-sort-select" id="fmtSort">
      <option selected="" value="date-desc">Newest to Oldest</option>
      <option value="date-asc">Oldest to Newest</option>
      <option value="name-asc">Name (A → Z)</option>
      <option value="name-desc">Name (Z → A)</option>
    </select>
  </div>
  <div class="gallery-count-badge">Showing <span id="visibleCount">${data.length}</span> of ${data.length} data formats</div>
</div>

<div class="data-formats-grid fmt-grid" id="dataFormatsGrid">
  ${cardsHtml}
</div>

<div class="gallery-empty-state" id="noResultsMsg" style="display:none">
  <p>No data formats matched your search or filter query.</p>
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
  /* High-Contrast, Maximum Readability, Premium Dark Aesthetic */
  :root {
    --fmt-bg-card: #0F172A;
    --fmt-border-card: rgba(255, 255, 255, 0.12);
    --fmt-text-primary: #F8FAFC;
    --fmt-text-secondary: #CBD5E1;
    --fmt-text-muted: #94A3B8;
  }

  .fmt-concepts-section {
    margin-bottom: 2.5rem;
    padding: 2rem;
    background: #0B1120;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 1rem;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
  }

  .concepts-header-box, .matrix-header-box {
    margin-bottom: 1.5rem;
  }

  .matrix-badge {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #38BDF8;
    background: rgba(56, 189, 248, 0.15);
    border: 1px solid rgba(56, 189, 248, 0.35);
    padding: 0.2rem 0.65rem;
    border-radius: 9999px;
    margin-bottom: 0.5rem;
  }

  .matrix-title {
    font-size: 1.5rem;
    font-weight: 800;
    color: #F8FAFC;
    margin: 0 0 0.5rem 0;
  }

  .matrix-desc {
    color: #CBD5E1;
    font-size: 0.95rem;
    max-width: 850px;
    line-height: 1.5;
    margin: 0;
  }

  .fmt-concepts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.25rem;
  }

  .concept-card {
    background: #111C33;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 0.75rem;
    padding: 1.25rem;
    transition: transform 0.2s, border-color 0.2s;
  }
  .concept-card:hover {
    border-color: #38BDF8;
    transform: translateY(-2px);
  }

  .concept-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: rgba(56, 189, 248, 0.15);
    color: #38BDF8;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    border: 1px solid rgba(56, 189, 248, 0.3);
  }

  .concept-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #F8FAFC;
    margin: 0 0 0.5rem 0;
  }

  .concept-body {
    font-size: 0.875rem;
    color: #CBD5E1;
    line-height: 1.55;
    margin: 0;
  }
  .concept-body strong {
    color: #F1F5F9;
  }

  /* Matrix Table */
  .fmt-matrix-section {
    margin-bottom: 2.5rem;
    padding: 2rem;
    background: #0B1120;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 1rem;
  }

  .matrix-table-wrap {
    overflow-x: auto;
    border-radius: 0.65rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .fmt-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
    text-align: left;
    background: #0F172A;
  }

  .fmt-table th {
    background: #1E293B;
    color: #F8FAFC;
    font-weight: 700;
    padding: 0.85rem 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    white-space: nowrap;
  }

  .fmt-table td {
    padding: 0.85rem 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    color: #CBD5E1;
  }

  .fmt-table tr:hover td {
    background: rgba(255, 255, 255, 0.03);
  }

  .cat-pill {
    display: inline-block;
    padding: 0.2rem 0.55rem;
    border-radius: 6px;
    font-size: 0.725rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .cat-tabular { background: rgba(56, 189, 248, 0.18); color: #38BDF8; border: 1px solid #38BDF8; }
  .cat-serialization { background: rgba(251, 191, 36, 0.18); color: #FBBF24; border: 1px solid #FBBF24; }
  .cat-binary { background: rgba(129, 140, 248, 0.18); color: #818CF8; border: 1px solid #818CF8; }
  .cat-bigdata { background: rgba(52, 211, 153, 0.18); color: #34D399; border: 1px solid #34D399; }
  .cat-scientific { background: rgba(45, 212, 191, 0.18); color: #2DD4BF; border: 1px solid #2DD4BF; }
  .cat-geospatial { background: rgba(74, 222, 128, 0.18); color: #4ADE80; border: 1px solid #4ADE80; }
  .cat-3d { background: rgba(192, 132, 252, 0.18); color: #C084FC; border: 1px solid #C084FC; }
  .cat-ai { background: rgba(251, 113, 133, 0.18); color: #FB7185; border: 1px solid #FB7185; }
  .cat-archive { background: rgba(245, 158, 11, 0.18); color: #F59E0B; border: 1px solid #F59E0B; }
  .cat-media { background: rgba(244, 114, 182, 0.18); color: #F472B6; border: 1px solid #F472B6; }

  .pill-yes { color: #34D399; font-weight: 700; }
  .pill-no { color: #94A3B8; }

  /* Filters */
  .fmt-filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .fmt-filter-chip {
    background: #111827;
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #CBD5E1;
    padding: 0.45rem 0.9rem;
    border-radius: 9999px;
    font-size: 0.825rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  .fmt-filter-chip:hover {
    background: #1F2937;
    color: #F8FAFC;
    border-color: rgba(255, 255, 255, 0.3);
  }
  .fmt-filter-chip.active {
    background: #38BDF8;
    color: #030712;
    border-color: #38BDF8;
    font-weight: 700;
    box-shadow: 0 0 14px rgba(56, 189, 248, 0.4);
  }

  /* Grid & Cards */
  .fmt-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
    gap: 1.75rem;
  }
  @media (max-width: 768px) {
    .fmt-grid { grid-template-columns: 1fr; }
  }

  .fmt-card {
    background: #0B1120;
    border: 1.5px solid rgba(255, 255, 255, 0.13);
    border-radius: 1rem;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  }
  .fmt-card:hover {
    transform: translateY(-3px);
    border-color: rgba(56, 189, 248, 0.6);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6);
  }

  .fmt-card-inner {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.15rem;
    height: 100%;
  }

  .fmt-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .fmt-badge-group {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .fmt-category-pill {
    font-size: 0.7rem;
    font-weight: 800;
    padding: 0.25rem 0.55rem;
    border-radius: 6px;
    letter-spacing: 0.05em;
  }

  .fmt-year-pill {
    font-size: 0.75rem;
    font-weight: 700;
    color: #94A3B8;
    background: rgba(255, 255, 255, 0.08);
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    font-family: monospace;
  }

  .fmt-ext-badge {
    font-family: monospace;
    font-size: 0.85rem;
    font-weight: 700;
    color: #F8FAFC;
    background: #1E293B;
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 0.25rem 0.65rem;
    border-radius: 6px;
  }

  .fmt-title {
    font-size: 1.35rem;
    font-weight: 800;
    color: #F8FAFC;
    margin: 0;
    line-height: 1.3;
    letter-spacing: -0.01em;
  }

  .fmt-description {
    font-size: 0.9rem;
    color: #CBD5E1;
    line-height: 1.55;
    margin: 0;
  }

  /* Blueprint image box */
  .fmt-preview-box {
    position: relative;
    border-radius: 0.75rem;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: #030712;
    aspect-ratio: 800 / 480;
    cursor: pointer;
  }

  .fmt-preview-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.25s ease;
  }
  .fmt-preview-box:hover .fmt-preview-img {
    transform: scale(1.02);
  }

  .fmt-preview-overlay {
    position: absolute;
    bottom: 0.75rem;
    right: 0.75rem;
    pointer-events: none;
  }

  .fmt-inspect-btn {
    background: rgba(15, 23, 42, 0.9);
    backdrop-filter: blur(8px);
    color: #F8FAFC;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.35rem 0.65rem;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  /* Metadata Grid */
  .fmt-meta-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.65rem;
    background: #111C33;
    padding: 0.9rem;
    border-radius: 0.65rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .fmt-meta-item {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .fmt-meta-label {
    font-size: 0.675rem;
    font-weight: 700;
    color: #94A3B8;
    letter-spacing: 0.05em;
  }

  .fmt-meta-val {
    font-size: 0.8rem;
    font-weight: 600;
    color: #F1F5F9;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .fmt-meta-val.font-mono {
    font-family: monospace;
    font-size: 0.775rem;
    color: #38BDF8;
  }

  /* Highlights */
  .fmt-subheading {
    font-size: 0.825rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #CBD5E1;
    margin: 0 0 0.5rem 0;
  }

  .fmt-highlights-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .fmt-highlights-list li {
    font-size: 0.84rem;
    color: #CBD5E1;
    line-height: 1.45;
  }

  .fmt-bullet {
    color: #38BDF8;
    font-weight: 900;
    margin-right: 0.25rem;
  }

  /* Tradeoffs */
  .fmt-tradeoffs-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }
  @media (max-width: 480px) {
    .fmt-tradeoffs-grid { grid-template-columns: 1fr; }
  }

  .fmt-tradeoff-box {
    padding: 0.85rem;
    border-radius: 0.6rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .fmt-pros-box {
    background: rgba(16, 185, 129, 0.08);
    border: 1px solid rgba(16, 185, 129, 0.3);
  }
  .fmt-cons-box {
    background: rgba(244, 63, 94, 0.08);
    border: 1px solid rgba(244, 63, 94, 0.3);
  }

  .fmt-tradeoff-title {
    font-size: 0.78rem;
    font-weight: 800;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }
  .fmt-pros-box .fmt-tradeoff-title { color: #34D399; }
  .fmt-cons-box .fmt-tradeoff-title { color: #FB7185; }

  .fmt-tradeoff-box ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .fmt-tradeoff-box li {
    font-size: 0.78rem;
    line-height: 1.35;
    color: #CBD5E1;
  }

  /* Accordion Code */
  .fmt-details {
    background: #080D1A;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 0.65rem;
    overflow: hidden;
  }

  .fmt-summary {
    padding: 0.65rem 0.9rem;
    font-size: 0.8rem;
    font-weight: 700;
    color: #94A3B8;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    transition: color 0.2s, background 0.2s;
  }
  .fmt-summary:hover {
    color: #F8FAFC;
    background: rgba(255, 255, 255, 0.03);
  }

  .fmt-chevron {
    transition: transform 0.2s;
  }
  .fmt-details[open] .fmt-chevron {
    transform: rotate(180deg);
  }

  .fmt-code-wrapper {
    background: #030712;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .fmt-code-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.4rem 0.75rem;
    background: #111827;
    font-size: 0.7rem;
    font-weight: 700;
    color: #94A3B8;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .fmt-copy-btn {
    background: rgba(255, 255, 255, 0.1);
    color: #CBD5E1;
    border: none;
    padding: 0.2rem 0.45rem;
    border-radius: 4px;
    font-size: 0.65rem;
    font-weight: 700;
    cursor: pointer;
  }
  .fmt-copy-btn:hover {
    background: #38BDF8;
    color: #030712;
  }

  .fmt-pre {
    margin: 0;
    padding: 0.85rem;
    overflow-x: auto;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.78rem;
    line-height: 1.45;
    color: #E2E8F0;
  }

  /* Card Footer */
  .fmt-card-footer {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    margin-top: auto;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .fmt-usecase-tag {
    font-size: 0.8rem;
    color: #CBD5E1;
    line-height: 1.4;
  }
  .fmt-target-label {
    font-weight: 800;
    font-size: 0.675rem;
    color: #38BDF8;
    display: block;
    margin-bottom: 0.15rem;
  }

  .fmt-spec-link {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.775rem;
    font-weight: 700;
    color: #94A3B8;
    text-decoration: none;
    transition: color 0.2s;
  }
  .fmt-spec-link:hover {
    color: #38BDF8;
  }
</style>

<script>
(function() {
  const searchInput = document.getElementById('fmtSearch');
  const clearBtn = document.getElementById('clearFmtSearch');
  const sortSelect = document.getElementById('fmtSort');
  const filterChips = document.querySelectorAll('.fmt-filter-chip');
  const cards = Array.from(document.querySelectorAll('.fmt-card'));
  const grid = document.getElementById('dataFormatsGrid');
  const visibleCount = document.getElementById('visibleCount');
  const noResultsMsg = document.getElementById('noResultsMsg');

  let currentCategory = 'all';
  let currentSearch = '';

  function applyFiltersAndSort() {
    let visible = [];

    cards.forEach(card => {
      const cat = card.dataset.category;
      const searchMatch = !currentSearch || (
        card.dataset.name.includes(currentSearch) ||
        card.dataset.extension.includes(currentSearch) ||
        card.dataset.mime.includes(currentSearch) ||
        card.dataset.paradigm.includes(currentSearch) ||
        card.dataset.creator.includes(currentSearch) ||
        card.dataset.summary.includes(currentSearch) ||
        card.dataset.schema.includes(currentSearch) ||
        card.dataset.useCase.includes(currentSearch) ||
        card.dataset.highlights.includes(currentSearch)
      );

      const catMatch = (currentCategory === 'all') || (cat === currentCategory);

      if (searchMatch && catMatch) {
        card.style.display = '';
        visible.push(card);
      } else {
        card.style.display = 'none';
      }
    });

    // Sort visible
    const sortVal = sortSelect.value;
    visible.sort((a, b) => {
      if (sortVal === 'date-desc') return parseInt(b.dataset.year) - parseInt(a.dataset.year);
      if (sortVal === 'date-asc') return parseInt(a.dataset.year) - parseInt(b.dataset.year);
      if (sortVal === 'name-asc') return a.dataset.name.localeCompare(b.dataset.name);
      if (sortVal === 'name-desc') return b.dataset.name.localeCompare(a.dataset.name);
      return 0;
    });

    visible.forEach(card => grid.appendChild(card));

    if (visibleCount) visibleCount.innerText = visible.length;
    if (noResultsMsg) noResultsMsg.style.display = visible.length === 0 ? 'block' : 'none';
  }

  // Filter chips click
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentCategory = chip.dataset.filter;
      applyFiltersAndSort();
    });
  });

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.toLowerCase().trim();
      if (clearBtn) clearBtn.style.display = currentSearch ? 'block' : 'none';
      applyFiltersAndSort();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      currentSearch = '';
      clearBtn.style.display = 'none';
      applyFiltersAndSort();
      searchInput.focus();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', applyFiltersAndSort);
  }

  // Lightbox Modal Support
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxMeta = document.getElementById('lightboxMeta');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.querySelector('.lightbox-close');
  const backdrop = document.querySelector('.lightbox-backdrop');

  function openLightbox(el) {
    if (!lightbox || !el) return;
    const src = el.getAttribute('data-zoom-src') || el.src || (el.querySelector && el.querySelector('img') && el.querySelector('img').src);
    if (!src) return;
    lightboxImg.src = src;
    lightboxTitle.innerText = el.getAttribute('data-zoom-title') || '';
    lightboxMeta.innerText = el.getAttribute('data-zoom-meta') || '';
    lightboxCaption.innerText = el.getAttribute('data-zoom-caption') || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.gallery-zoomable').forEach(el => {
    el.addEventListener('click', (e) => openLightbox(e.currentTarget));
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });

})();
</script>
</main>`;

fs.writeFileSync('/home/guigo/Documents/05-ghpages-gui13go/frontend/public/rendered_gallery/data-formats.html', pageHtml);
console.log('Successfully generated complete data-formats.html with all 50 formats!');
