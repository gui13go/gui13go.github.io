const fs = require('fs');
const path = require('path');

const jsonPath = '/home/guigo/Documents/05-ghpages-gui13go/frontend/public/data/data-formats.json';
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Format specification links mapping
const specLinks = {
  "csv": "https://datatracker.ietf.org/doc/html/rfc4180",
  "tsv": "https://www.iana.org/assignments/media-types/text/tab-separated-values",
  "json": "https://www.ecma-international.org/publications-and-standards/standards/ecma-404/",
  "jsonl": "https://jsonlines.org/",
  "xml": "https://www.w3.org/TR/xml/",
  "yaml": "https://yaml.org/spec/1.2.2/",
  "toml": "https://toml.io/en/",
  "protobuf": "https://protobuf.dev/",
  "flatbuffers": "https://flatbuffers.dev/",
  "msgpack": "https://msgpack.org/",
  "avro": "https://avro.apache.org/",
  "parquet": "https://parquet.apache.org/",
  "orc": "https://orc.apache.org/",
  "feather": "https://arrow.apache.org/",
  "hdf5": "https://www.hdfgroup.org/solutions/hdf5/",
  "netcdf": "https://www.unidata.ucar.edu/software/netcdf/",
  "zarr": "https://zarr.readthedocs.io/",
  "geojson": "https://datatracker.ietf.org/doc/html/rfc7946",
  "geoparquet": "https://geoparquet.org/",
  "cog": "https://www.cogeo.org/",
  "jpeg": "https://www.w3.org/Graphics/JPEG/",
  "png": "https://www.w3.org/TR/png-3/",
  "webp": "https://developers.google.com/speed/webp",
  "avif": "https://aomediacodec.github.io/av1-avif/",
  "svg": "https://www.w3.org/TR/SVG2/",
  "cbor": "https://cbor.io/",
  "bson": "https://bsonspec.org/",
  "capnproto": "https://capnproto.org/",
  "asn1": "https://www.itu.int/ITU-T/studygroups/com17/languages/X.680-0207.pdf",
  "iceberg": "https://iceberg.apache.org/",
  "deltalake": "https://delta.io/",
  "sqlite-file": "https://www.sqlite.org/fileformat2.html",
  "pdf": "https://www.pdfa.org/resource/iso-32000-2/",
  "mp4": "https://www.iso.org/standard/68960.html",
  "mp3": "https://www.iso.org/standard/22412.html",
  "flac": "https://xiph.org/flac/",
  "wasm": "https://webassembly.github.io/spec/core/",
  "geopackage": "https://www.geopackage.org/",
  "tiff": "https://www.adobe.io/open/standards/TIFF.html",
  "bmp": "https://docs.microsoft.com/en-us/windows/win32/gdi/bitmap-storage",
  "gltf": "https://www.khronos.org/gltf/",
  "usd": "https://openusd.org",
  "safetensors": "https://github.com/huggingface/safetensors",
  "gguf": "https://github.com/ggerganov/llama.cpp",
  "dicom": "https://www.dicomstandard.org",
  "fits": "https://fits.gsfc.nasa.gov",
  "bam-vcf": "https://samtools.github.io/hts-specs/",
  "gpx-kml": "https://www.topografix.com/gpx.asp",
  "tar-zip": "https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT",
  "epub": "https://www.w3.org/TR/epub-33/"
};

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildUnifiedCardHtml(item) {
  const imageSvgPath = `/images/data_formats/fmt_${item.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.svg`;
  const cleanKey = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const specUrl = specLinks[cleanKey] || specLinks[item.id.replace('format-', '')] || "https://en.wikipedia.org/wiki/" + encodeURIComponent(item.name);

  // Extract highlights array
  let highlights = [];
  if (item.highlights && Array.isArray(item.highlights)) {
    highlights = item.highlights;
  } else if (item.dataset && item.dataset["data-highlights"]) {
    highlights = item.dataset["data-highlights"].split('. ').map(s => s.trim()).filter(Boolean);
  }
  if (highlights.length === 0) {
    highlights = [
      `${item.paradigm || 'Standard Wire Encoding'}: Engineered for high throughput data exchange.`,
      `Schema Model: ${item.schemaType || 'Self-describing layout with strict parser guarantees.'}`,
      `Optimized Serialization: Byte-level compression and transmission efficiency.`
    ];
  }

  const pros = (item.pros && Array.isArray(item.pros)) ? item.pros : [
    "High performance processing and cross-platform compatibility",
    "Comprehensive ecosystem tooling and library adoption"
  ];

  const cons = (item.cons && Array.isArray(item.cons)) ? item.cons : [
    "Requires schema coordination or parser tooling",
    "Trade-off between human readability and wire compactness"
  ];

  const codeLang = (item.snippetLang || 'text').toUpperCase();
  const codeSnippet = item.snippetCode || `// Data format wire serialization: ${item.name}`;

  return `
    <div class="fmt-card-inner">
      <div class="fmt-card-header">
        <div class="fmt-badge-group">
          <span class="fmt-category-pill cat-${item.category}">${escapeHtml(item.category.toUpperCase())}</span>
          <span class="fmt-year-pill">${item.year}</span>
        </div>
        <div class="fmt-ext-badge">${escapeHtml(item.extension)}</div>
      </div>

      <div class="fmt-title-row">
        <h3 class="fmt-title">${escapeHtml(item.title)}</h3>
      </div>

      <p class="fmt-description">${escapeHtml(item.description)}</p>

      <div class="fmt-preview-box gallery-zoomable" data-zoom-src="${imageSvgPath}" data-zoom-title="${escapeHtml(item.title)}" data-zoom-meta="Year: ${item.year} • Extension: ${escapeHtml(item.extension)} • Category: ${escapeHtml(item.category.toUpperCase())}" data-zoom-caption="${escapeHtml(item.description)}">
        <img alt="${escapeHtml(item.title)} Architecture Blueprint" class="fmt-preview-img" loading="lazy" onerror="this.onerror=null,this.parentElement.style.display='none'" src="${imageSvgPath}"/>
        <div class="fmt-preview-overlay">
          <span class="fmt-inspect-btn">
            <svg fill="none" height="14" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="14">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" x2="16.65" y1="21" x2="16.65"></line>
              <line x1="11" x2="11" y1="8" y2="14"></line>
              <line x1="8" x2="14" y1="11" y2="11"></line>
            </svg>
            Click Blueprint to Enlarge
          </span>
        </div>
      </div>

      <div class="fmt-meta-grid">
        <div class="fmt-meta-item">
          <span class="fmt-meta-label">PARADIGM</span>
          <span class="fmt-meta-val">${escapeHtml(item.paradigm || 'Structured Encoding')}</span>
        </div>
        <div class="fmt-meta-item">
          <span class="fmt-meta-label">MIME TYPE</span>
          <span class="fmt-meta-val font-mono">${escapeHtml(item.mime || 'application/octet-stream')}</span>
        </div>
        <div class="fmt-meta-item">
          <span class="fmt-meta-label">MAGIC BYTES</span>
          <span class="fmt-meta-val font-mono">${escapeHtml(item.magicBytes || 'None')}</span>
        </div>
        <div class="fmt-meta-item">
          <span class="fmt-meta-label">SCHEMA MODEL</span>
          <span class="fmt-meta-val">${escapeHtml(item.schemaType || 'Self-Describing')}</span>
        </div>
      </div>

      <div class="fmt-highlights-section">
        <h4 class="fmt-subheading">Architectural Highlights</h4>
        <ul class="fmt-highlights-list">
          ${highlights.slice(0, 4).map(h => `<li><span class="fmt-bullet">›</span> ${escapeHtml(h)}</li>`).join('')}
        </ul>
      </div>

      <div class="fmt-tradeoffs-grid">
        <div class="fmt-tradeoff-box fmt-pros-box">
          <h5 class="fmt-tradeoff-title">
            <svg fill="none" height="14" stroke="#34D399" stroke-width="2.5" viewBox="0 0 24 24" width="14">
              <path d="M5 13l4 4L19 7"></path>
            </svg>
            Superpowers
          </h5>
          <ul>
            ${pros.map(p => `<li>${escapeHtml(p)}</li>`).join('')}
          </ul>
        </div>
        <div class="fmt-tradeoff-box fmt-cons-box">
          <h5 class="fmt-tradeoff-title">
            <svg fill="none" height="14" stroke="#FB7185" stroke-width="2.5" viewBox="0 0 24 24" width="14">
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Architectural Constraints
          </h5>
          <ul>
            ${cons.map(c => `<li>${escapeHtml(c)}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div class="fmt-accordion">
        <details class="fmt-details">
          <summary class="fmt-summary">
            <span>Inspect Wire / Syntax Representation</span>
            <svg class="fmt-chevron" fill="none" height="14" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="14">
              <path d="M19 9l-7 7-7-7"></path>
            </svg>
          </summary>
          <div class="fmt-code-wrapper">
            <div class="fmt-code-header">
              <span class="fmt-code-lang">${escapeHtml(codeLang)}</span>
              <button class="fmt-copy-btn" type="button" onclick="navigator.clipboard.writeText(this.closest('.fmt-code-wrapper').querySelector('code').innerText); this.innerText='COPIED!'; setTimeout(()=>this.innerText='COPY', 1500);">COPY</button>
            </div>
            <pre class="fmt-pre"><code>${escapeHtml(codeSnippet)}</code></pre>
          </div>
        </details>
      </div>

      <div class="fmt-card-footer">
        <div class="fmt-usecase-tag">
          <span class="fmt-target-label">PRIMARY USE CASE:</span>
          <span>${escapeHtml(item.primaryUseCase || 'General data storage and high-speed retrieval')}</span>
        </div>
        <a class="fmt-spec-link" href="${escapeHtml(specUrl)}" rel="noopener noreferrer" target="_blank">
          <span>Official Specification / RFC</span>
          <svg fill="none" height="14" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="14">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" x2="21" y1="14" y2="3"></line>
          </svg>
        </a>
      </div>
    </div>
  `;
}

// Transform all 50 items
data.forEach(item => {
  item.html = buildUnifiedCardHtml(item);
  item.classes = ["fmt-card"];
});

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
console.log(`Successfully unified and polished all ${data.length} card templates in data-formats.json!`);
