const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('/home/guigo/Documents/05-ghpages-gui13go/frontend/public/data/data-formats.json', 'utf8'));
const outDir = '/home/guigo/Documents/05-ghpages-gui13go/frontend/public/images/data_formats';

// Palette mappings carefully tuned for high-contrast dark themes
const categoryColorMap = {
  tabular: {
    accent: '#38BDF8',       // Sky blue
    bgMid: '#0284C7',
    tagBg: 'rgba(56, 189, 248, 0.15)',
    symbolBorder: '#38BDF8'
  },
  serialization: {
    accent: '#FBBF24',       // Warm amber / gold
    bgMid: '#D97706',
    tagBg: 'rgba(251, 191, 36, 0.15)',
    symbolBorder: '#FBBF24'
  },
  binary: {
    accent: '#818CF8',       // Indigo / lavender
    bgMid: '#4F46E5',
    tagBg: 'rgba(129, 140, 248, 0.15)',
    symbolBorder: '#818CF8'
  },
  bigdata: {
    accent: '#34D399',       // Emerald
    bgMid: '#059669',
    tagBg: 'rgba(52, 211, 153, 0.15)',
    symbolBorder: '#34D399'
  },
  scientific: {
    accent: '#2DD4BF',       // Teal
    bgMid: '#0D9488',
    tagBg: 'rgba(45, 212, 191, 0.15)',
    symbolBorder: '#2DD4BF'
  },
  geospatial: {
    accent: '#4ADE80',       // Mint green
    bgMid: '#16A34A',
    tagBg: 'rgba(74, 222, 128, 0.15)',
    symbolBorder: '#4ADE80'
  },
  media: {
    accent: '#F472B6',       // Vibrant pink
    bgMid: '#DB2777',
    tagBg: 'rgba(244, 114, 182, 0.15)',
    symbolBorder: '#F472B6'
  }
};

const formatVisuals = {
  csv: {
    symbol: 'CSV',
    tag: 'DELIMITED PLAINTEXT',
    spec1: 'ROW SCANLINES (\\n / \\r\\n)',
    spec2: 'COMMA DELIMITER (,)',
    spec3: 'RFC 4180 COMPLIANT',
    spec4: 'UNIVERSAL PANDAS & SQL',
    layout: (accent) => `
      <g transform="translate(470, 105)">
        <rect x="0" y="0" width="280" height="270" rx="14" fill="#0D1929" stroke="${accent}" stroke-width="1.8" opacity="0.95"/>
        <text x="18" y="28" fill="${accent}" font-family="monospace" font-size="11" font-weight="700">RECTANGULAR MATRIX</text>
        
        <rect x="18" y="44" width="244" height="34" rx="6" fill="#1E293B" stroke="rgba(255,255,255,0.15)"/>
        <text x="28" y="66" fill="#F8FAFC" font-family="monospace" font-size="11" font-weight="700">id , product , price , status</text>

        <rect x="18" y="86" width="244" height="30" rx="6" fill="#0F172A"/>
        <text x="28" y="106" fill="#CBD5E1" font-family="monospace" font-size="11">101, "Audio 8\\"", 299.9, active</text>

        <rect x="18" y="122" width="244" height="30" rx="6" fill="#0F172A"/>
        <text x="28" y="142" fill="#CBD5E1" font-family="monospace" font-size="11">102, "Hub USB-C", 89.50, active</text>

        <rect x="18" y="158" width="244" height="30" rx="6" fill="#0F172A"/>
        <text x="28" y="178" fill="#CBD5E1" font-family="monospace" font-size="11">103, "Mic, XLR" , 120.0, inactive</text>

        <rect x="18" y="196" width="244" height="58" rx="8" fill="rgba(56,189,248,0.08)" stroke="${accent}" stroke-dasharray="4,4"/>
        <text x="140" y="224" fill="${accent}" font-family="monospace" font-size="11" font-weight="700" text-anchor="middle">STREAMING LINE SCANNER</text>
        <text x="140" y="242" fill="#94A3B8" font-family="monospace" font-size="10" text-anchor="middle">O(1) memory per line parse</text>
      </g>
    `
  },
  tsv: {
    symbol: 'TSV',
    tag: 'TAB DELIMITED',
    spec1: 'DELIMITER ASCII 0x09',
    spec2: 'BIOINFORMATICS BED/GFF',
    spec3: 'UNIX CLI COMPATIBLE',
    spec4: 'ZERO QUOTE AMBIGUITY',
    layout: (accent) => `
      <g transform="translate(470, 105)">
        <rect x="0" y="0" width="280" height="270" rx="14" fill="#0D1929" stroke="${accent}" stroke-width="1.8" opacity="0.95"/>
        <text x="18" y="28" fill="${accent}" font-family="monospace" font-size="11" font-weight="700">TAB DELIMITED CHROMOSOMES</text>
        
        <rect x="18" y="44" width="244" height="34" rx="6" fill="#1E293B" stroke="rgba(255,255,255,0.15)"/>
        <text x="28" y="66" fill="#F8FAFC" font-family="monospace" font-size="11" font-weight="700">chrom	start	end	gene</text>

        <rect x="18" y="86" width="244" height="32" rx="6" fill="#0F172A"/>
        <text x="28" y="107" fill="#CBD5E1" font-family="monospace" font-size="11">chr7	127471	127472	Pos1	+</text>

        <rect x="18" y="124" width="244" height="32" rx="6" fill="#0F172A"/>
        <text x="28" y="145" fill="#CBD5E1" font-family="monospace" font-size="11">chr7	127472	127473	Pos2	+</text>

        <rect x="18" y="164" width="244" height="32" rx="6" fill="#0F172A"/>
        <text x="28" y="185" fill="#CBD5E1" font-family="monospace" font-size="11">chr7	127473	127474	Pos3	+</text>

        <rect x="18" y="204" width="244" height="50" rx="8" fill="rgba(56,189,248,0.08)" stroke="${accent}" stroke-dasharray="4,4"/>
        <text x="140" y="234" fill="${accent}" font-family="monospace" font-size="11" font-weight="700" text-anchor="middle">Unix cut / awk Friendly</text>
      </g>
    `
  },
  json: {
    symbol: '{ }',
    tag: 'KEY-VALUE OBJECTS',
    spec1: 'ECMA-404 / RFC 8259',
    spec2: '6 CORE DATA TYPES',
    spec3: 'NATIVE V8 JAVASCRIPT',
    spec4: 'REST &amp; WEB API STANDARD',
    layout: (accent) => `
      <g transform="translate(470, 105)">
        <rect x="0" y="0" width="280" height="270" rx="14" fill="#1C1808" stroke="${accent}" stroke-width="1.8" opacity="0.95"/>
        <text x="18" y="28" fill="${accent}" font-family="monospace" font-size="11" font-weight="700">JSON DOM OBJECT GRAPH</text>
        
        <rect x="18" y="44" width="244" height="42" rx="6" fill="#2E240C" stroke="rgba(255,255,255,0.15)"/>
        <text x="28" y="65" fill="#FDE68A" font-family="monospace" font-size="11">"server": { "status": 200 }</text>
        <text x="28" y="79" fill="#94A3B8" font-family="monospace" font-size="10">Object: root dict map</text>

        <rect x="30" y="94" width="232" height="42" rx="6" fill="#1E1B10" stroke="${accent}" stroke-width="1"/>
        <text x="40" y="115" fill="#FEF08A" font-family="monospace" font-size="11">"metrics": [ 42.5, 99.1 ]</text>
        <text x="40" y="129" fill="#94A3B8" font-family="monospace" font-size="10">Array: ordered primitives</text>

        <rect x="18" y="148" width="244" height="106" rx="8" fill="rgba(251,191,36,0.06)" stroke="${accent}" stroke-dasharray="4,4"/>
        <text x="140" y="184" fill="${accent}" font-family="monospace" font-size="12" font-weight="700" text-anchor="middle">JSON.parse() Native Runtime</text>
        <text x="140" y="206" fill="#F1F5F9" font-family="monospace" font-size="11" text-anchor="middle">Strict RFC 8259 UTF-8</text>
        <text x="140" y="226" fill="#94A3B8" font-family="monospace" font-size="10" text-anchor="middle">Universal in REST &amp; Document DBs</text>
      </g>
    `
  },
  jsonl: {
    symbol: 'J\\n',
    tag: 'NEWLINE STREAMING',
    spec1: 'ONE JSON PER LINE (\\n)',
    spec2: 'APPEND-ONLY EFFICIENCY',
    spec3: 'AI/LLM DATASET STANDARD',
    spec4: 'PARALLEL CLUSTER SPLIT',
    layout: (accent) => `
      <g transform="translate(470, 105)">
        <rect x="0" y="0" width="280" height="270" rx="14" fill="#1C1808" stroke="${accent}" stroke-width="1.8" opacity="0.95"/>
        <text x="18" y="28" fill="${accent}" font-family="monospace" font-size="11" font-weight="700">NDJSON STREAM CHUNKS</text>
        
        <rect x="18" y="44" width="244" height="34" rx="6" fill="#2E240C" stroke="rgba(255,255,255,0.15)"/>
        <text x="26" y="66" fill="#FEF08A" font-family="monospace" font-size="10">{"role": "sys", "content": "AI"}</text>

        <rect x="18" y="84" width="244" height="34" rx="6" fill="#161205"/>
        <text x="26" y="106" fill="#CBD5E1" font-family="monospace" font-size="10">{"role": "user", "content": "..."}</text>

        <rect x="18" y="124" width="244" height="34" rx="6" fill="#161205"/>
        <text x="26" y="146" fill="#CBD5E1" font-family="monospace" font-size="10">{"role": "asst", "content": "..."}</text>

        <rect x="18" y="168" width="244" height="86" rx="8" fill="rgba(251,191,36,0.06)" stroke="${accent}" stroke-dasharray="4,4"/>
        <text x="140" y="200" fill="${accent}" font-family="monospace" font-size="11" font-weight="700" text-anchor="middle">STREAMING BIG DATA &amp; AI</text>
        <text x="140" y="222" fill="#F1F5F9" font-family="monospace" font-size="10" text-anchor="middle">Workers seek to byte offset</text>
        <text x="140" y="238" fill="#94A3B8" font-family="monospace" font-size="10" text-anchor="middle">Scan to nearest \\n without parse lock</text>
      </g>
    `
  },
  parquet: {
    symbol: 'PAR',
    tag: 'COLUMNAR STORAGE',
    spec1: 'ROW GROUPS &amp; DATA PAGES',
    spec2: 'DICTIONARY + RLE ENCODING',
    spec3: 'PREDICATE PUSHDOWN',
    spec4: 'DATA LAKEHOUSE STANDARD',
    layout: (accent) => `
      <g transform="translate(470, 105)">
        <rect x="0" y="0" width="280" height="270" rx="14" fill="#0C1D18" stroke="${accent}" stroke-width="1.8" opacity="0.95"/>
        <text x="18" y="28" fill="${accent}" font-family="monospace" font-size="11" font-weight="700">PARQUET PHYSICAL LAYOUT</text>
        
        <rect x="18" y="44" width="72" height="145" rx="6" fill="#13362A" stroke="${accent}" stroke-width="1.2"/>
        <text x="54" y="66" fill="#A7F3D0" font-family="monospace" font-size="11" font-weight="700" text-anchor="middle">COL A</text>
        <text x="54" y="105" fill="#D1FAE5" font-family="monospace" font-size="9" text-anchor="middle">Dict + RLE</text>
        <text x="54" y="122" fill="#D1FAE5" font-family="monospace" font-size="9" text-anchor="middle">Snappy</text>
        <text x="54" y="155" fill="${accent}" font-family="monospace" font-size="9" font-weight="700" text-anchor="middle">READ I/O</text>

        <rect x="98" y="44" width="72" height="145" rx="6" fill="#0A1813" stroke="rgba(255,255,255,0.1)"/>
        <text x="134" y="66" fill="#64748B" font-family="monospace" font-size="11" font-weight="700" text-anchor="middle">COL B</text>
        <text x="134" y="105" fill="#64748B" font-family="monospace" font-size="9" text-anchor="middle">Skipped</text>
        <text x="134" y="122" fill="#64748B" font-family="monospace" font-size="9" text-anchor="middle">Column</text>
        <text x="134" y="155" fill="#EF4444" font-family="monospace" font-size="9" font-weight="700" text-anchor="middle">0 BYTES</text>

        <rect x="178" y="44" width="84" height="145" rx="6" fill="#13362A" stroke="${accent}" stroke-width="1.2"/>
        <text x="220" y="66" fill="#A7F3D0" font-family="monospace" font-size="11" font-weight="700" text-anchor="middle">COL C</text>
        <text x="220" y="105" fill="#D1FAE5" font-family="monospace" font-size="9" text-anchor="middle">Bit-Packed</text>
        <text x="220" y="122" fill="#D1FAE5" font-family="monospace" font-size="9" text-anchor="middle">ZSTD</text>
        <text x="220" y="155" fill="${accent}" font-family="monospace" font-size="9" font-weight="700" text-anchor="middle">READ I/O</text>

        <rect x="18" y="198" width="244" height="58" rx="6" fill="#06120D" stroke="${accent}"/>
        <text x="140" y="222" fill="#F1F5F9" font-family="monospace" font-size="11" font-weight="700" text-anchor="middle">FOOTER: Min/Max Statistics</text>
        <text x="140" y="240" fill="${accent}" font-family="monospace" font-size="10" text-anchor="middle">Magic bytes: PAR1</text>
      </g>
    `
  },
  feather: {
    symbol: 'IPC',
    tag: 'ARROW ZERO-COPY',
    spec1: '64-BYTE ALIGNED SIMD',
    spec2: 'MEM-MAP (MMAP) INSTANT',
    spec3: 'CROSS-LANGUAGE RECORD',
    spec4: 'PYTHON/RUST/C++ SPEED',
    layout: (accent) => `
      <g transform="translate(470, 105)">
        <rect x="0" y="0" width="280" height="270" rx="14" fill="#0C1D18" stroke="${accent}" stroke-width="1.8" opacity="0.95"/>
        <text x="18" y="28" fill="${accent}" font-family="monospace" font-size="11" font-weight="700">ARROW IN-MEMORY BUFFERS</text>
        
        <rect x="18" y="44" width="244" height="36" rx="6" fill="#13362A" stroke="rgba(255,255,255,0.15)"/>
        <text x="28" y="67" fill="#A7F3D0" font-family="monospace" font-size="11">Validity Bitmap: [1, 1, 0, 1]</text>

        <rect x="18" y="88" width="244" height="36" rx="6" fill="#13362A" stroke="rgba(255,255,255,0.15)"/>
        <text x="28" y="111" fill="#D1FAE5" font-family="monospace" font-size="11">Offsets: [0, 4, 9, 14, 20]</text>

        <rect x="18" y="132" width="244" height="36" rx="6" fill="#13362A" stroke="rgba(255,255,255,0.15)"/>
        <text x="28" y="155" fill="#6EE7B7" font-family="monospace" font-size="11">SIMD Cache: 64-byte aligned</text>

        <rect x="18" y="176" width="244" height="78" rx="8" fill="rgba(52,211,153,0.08)" stroke="${accent}" stroke-dasharray="4,4"/>
        <text x="140" y="208" fill="${accent}" font-family="monospace" font-size="12" font-weight="700" text-anchor="middle">Zero-Copy Memory Mapping</text>
        <text x="140" y="230" fill="#CBD5E1" font-family="monospace" font-size="10" text-anchor="middle">RAM is identical to disk byte format</text>
      </g>
    `
  },
  protobuf: {
    symbol: 'PBF',
    tag: 'BINARY RPC PROTOCOL',
    spec1: 'TAG-NUMBERED FIELDS',
    spec2: 'VARINT BYTE PACKING',
    spec3: 'gRPC WIRE PROTOCOL',
    spec4: 'FORWARD/BACKWARD COMPAT',
    layout: (accent) => `
      <g transform="translate(470, 105)">
        <rect x="0" y="0" width="280" height="270" rx="14" fill="#12142B" stroke="${accent}" stroke-width="1.8" opacity="0.95"/>
        <text x="18" y="28" fill="${accent}" font-family="monospace" font-size="11" font-weight="700">PROTOBUF VARINT WIRE</text>
        
        <rect x="18" y="44" width="244" height="36" rx="6" fill="#1E2356" stroke="rgba(255,255,255,0.15)"/>
        <text x="28" y="67" fill="#C7D2FE" font-family="monospace" font-size="11">Tag: (field_num &lt;&lt; 3) | wire</text>

        <rect x="18" y="88" width="244" height="36" rx="6" fill="#0E1024"/>
        <text x="28" y="111" fill="#A5B4FC" font-family="monospace" font-size="11">08 96 01  --> tag 1, int 150</text>

        <rect x="18" y="132" width="244" height="36" rx="6" fill="#0E1024"/>
        <text x="28" y="155" fill="#A5B4FC" font-family="monospace" font-size="11">12 07 ... --> string payload</text>

        <rect x="18" y="176" width="244" height="78" rx="8" fill="rgba(129,140,248,0.08)" stroke="${accent}" stroke-dasharray="4,4"/>
        <text x="140" y="208" fill="${accent}" font-family="monospace" font-size="12" font-weight="700" text-anchor="middle">Zero Name Wire Overhead</text>
        <text x="140" y="230" fill="#CBD5E1" font-family="monospace" font-size="10" text-anchor="middle">Requires .proto schema file</text>
      </g>
    `
  },
  jpeg: {
    symbol: 'JPG',
    tag: 'LOSSY PHOTOGRAPHIC',
    spec1: 'DISCRETE COSINE TRANSFORM',
    spec2: 'YUV CHROMA SUBSAMPLING',
    spec3: 'HUFFMAN QUANTIZATION',
    spec4: 'EXIF METADATA EMBEDDED',
    layout: (accent) => `
      <g transform="translate(470, 105)">
        <rect x="0" y="0" width="280" height="270" rx="14" fill="#240E1B" stroke="${accent}" stroke-width="1.8" opacity="0.95"/>
        <text x="18" y="28" fill="${accent}" font-family="monospace" font-size="11" font-weight="700">8x8 FREQUENCY QUANTIZATION</text>
        
        <rect x="18" y="44" width="112" height="110" rx="6" fill="#3D142C" stroke="${accent}"/>
        <text x="74" y="85" fill="#FCE7F3" font-family="monospace" font-size="11" font-weight="700" text-anchor="middle">Spatial Block</text>
        <text x="74" y="105" fill="#CBD5E1" font-family="monospace" font-size="10" text-anchor="middle">8x8 Pixels</text>
        <text x="74" y="125" fill="#F472B6" font-family="monospace" font-size="10" text-anchor="middle">YCbCr (4:2:0)</text>

        <path d="M 136 99 L 154 99" stroke="${accent}" stroke-width="2"/>

        <rect x="160" y="44" width="102" height="110" rx="6" fill="#180712" stroke="${accent}"/>
        <text x="211" y="85" fill="#FCE7F3" font-family="monospace" font-size="11" font-weight="700" text-anchor="middle">DCT Matrix</text>
        <text x="211" y="105" fill="#CBD5E1" font-family="monospace" font-size="10" text-anchor="middle">Cosine Coeffs</text>
        <text x="211" y="125" fill="#F472B6" font-family="monospace" font-size="10" text-anchor="middle">Quantized</text>

        <rect x="18" y="164" width="244" height="90" rx="8" fill="rgba(244,114,182,0.08)" stroke="${accent}" stroke-dasharray="4,4"/>
        <text x="140" y="198" fill="${accent}" font-family="monospace" font-size="12" font-weight="700" text-anchor="middle">Zig-Zag Entropy Coding</text>
        <text x="140" y="222" fill="#F1F5F9" font-family="monospace" font-size="10" text-anchor="middle">Discards high-frequency invisible data</text>
        <text x="140" y="238" fill="#94A3B8" font-family="monospace" font-size="10" text-anchor="middle">Magic bytes: FF D8 FF</text>
      </g>
    `
  },
  png: {
    symbol: 'PNG',
    tag: 'LOSSLESS WITH ALPHA',
    spec1: 'PREDICTIVE 2D FILTERS',
    spec2: 'DEFLATE COMPRESSION',
    spec3: '8/16-BIT ALPHA CHANNEL',
    spec4: 'ZERO ARTIFACT CRISPNESS',
    layout: (accent) => `
      <g transform="translate(470, 105)">
        <rect x="0" y="0" width="280" height="270" rx="14" fill="#240E1B" stroke="${accent}" stroke-width="1.8" opacity="0.95"/>
        <text x="18" y="28" fill="${accent}" font-family="monospace" font-size="11" font-weight="700">PNG CHUNKS &amp; ALPHA</text>
        
        <rect x="18" y="44" width="244" height="34" rx="6" fill="#3D142C" stroke="rgba(255,255,255,0.15)"/>
        <text x="28" y="66" fill="#FCE7F3" font-family="monospace" font-size="11">IHDR: 1920x1080 RGBA 8-bit</text>

        <rect x="18" y="86" width="244" height="34" rx="6" fill="#180712"/>
        <text x="28" y="108" fill="#CBD5E1" font-family="monospace" font-size="11">IDAT: Paeth Filter + DEFLATE</text>

        <rect x="18" y="128" width="244" height="34" rx="6" fill="#180712"/>
        <text x="28" y="150" fill="#CBD5E1" font-family="monospace" font-size="11">IEND: File Termination</text>

        <rect x="18" y="170" width="244" height="84" rx="8" fill="rgba(244,114,182,0.08)" stroke="${accent}" stroke-dasharray="4,4"/>
        <text x="140" y="202" fill="${accent}" font-family="monospace" font-size="12" font-weight="700" text-anchor="middle">Bit-Perfect UI &amp; Transparency</text>
        <text x="140" y="224" fill="#F1F5F9" font-family="monospace" font-size="10" text-anchor="middle">True 8-bit translucent alpha blending</text>
        <text x="140" y="240" fill="#94A3B8" font-family="monospace" font-size="10" text-anchor="middle">Magic bytes: 89 50 4E 47</text>
      </g>
    `
  },
  webp: {
    symbol: 'WEBP',
    tag: 'HYBRID WEB IMAGE',
    spec1: 'VP8 INTRA PREDICTION',
    spec2: 'LOSSY &amp; LOSSLESS MODES',
    spec3: 'ALPHA &amp; ANIMATION UNIFIED',
    spec4: '30% SMALLER THAN JPEG',
    layout: (accent) => `
      <g transform="translate(470, 105)">
        <rect x="0" y="0" width="280" height="270" rx="14" fill="#240E1B" stroke="${accent}" stroke-width="1.8" opacity="0.95"/>
        <text x="18" y="28" fill="${accent}" font-family="monospace" font-size="11" font-weight="700">RIFF VP8 / VP8L CONTAINER</text>
        
        <rect x="18" y="44" width="244" height="36" rx="6" fill="#3D142C" stroke="rgba(255,255,255,0.15)"/>
        <text x="28" y="67" fill="#FCE7F3" font-family="monospace" font-size="11">RIFF: WEBP VP8X Extension</text>

        <rect x="18" y="88" width="244" height="36" rx="6" fill="#180712"/>
        <text x="28" y="111" fill="#CBD5E1" font-family="monospace" font-size="11">VP8: Macroblock Transform</text>

        <rect x="18" y="132" width="244" height="36" rx="6" fill="#180712"/>
        <text x="28" y="155" fill="#CBD5E1" font-family="monospace" font-size="11">ALPH: Subsampled Alpha Tile</text>

        <rect x="18" y="176" width="244" height="78" rx="8" fill="rgba(244,114,182,0.08)" stroke="${accent}" stroke-dasharray="4,4"/>
        <text x="140" y="208" fill="${accent}" font-family="monospace" font-size="12" font-weight="700" text-anchor="middle">Replaces JPEG, PNG &amp; GIF</text>
        <text x="140" y="230" fill="#CBD5E1" font-family="monospace" font-size="10" text-anchor="middle">Standardized across 98%+ browsers</text>
      </g>
    `
  },
  avif: {
    symbol: 'AVIF',
    tag: 'NEXT-GEN AV1 CODEC',
    spec1: 'AV1 STILL INTRA-FRAME',
    spec2: '10/12-BIT HDR COLOR',
    spec3: 'WIDE COLOR BT.2020',
    spec4: '50% SMALLER THAN JPEG',
    layout: (accent) => `
      <g transform="translate(470, 105)">
        <rect x="0" y="0" width="280" height="270" rx="14" fill="#240E1B" stroke="${accent}" stroke-width="1.8" opacity="0.95"/>
        <text x="18" y="28" fill="${accent}" font-family="monospace" font-size="11" font-weight="700">ISOBMFF AV1 BITSTREAM</text>
        
        <rect x="18" y="44" width="244" height="36" rx="6" fill="#3D142C" stroke="rgba(255,255,255,0.15)"/>
        <text x="28" y="67" fill="#FCE7F3" font-family="monospace" font-size="11">ftyp: avif (ISO Base Media)</text>

        <rect x="18" y="88" width="244" height="36" rx="6" fill="#180712"/>
        <text x="28" y="111" fill="#CBD5E1" font-family="monospace" font-size="11">meta: 10-bit HDR Gain Map</text>

        <rect x="18" y="132" width="244" height="36" rx="6" fill="#180712"/>
        <text x="28" y="155" fill="#CBD5E1" font-family="monospace" font-size="11">mdat: AV1 Intra Bitstream</text>

        <rect x="18" y="176" width="244" height="78" rx="8" fill="rgba(244,114,182,0.08)" stroke="${accent}" stroke-dasharray="4,4"/>
        <text x="140" y="208" fill="${accent}" font-family="monospace" font-size="12" font-weight="700" text-anchor="middle">Peak Visual Quality Per Byte</text>
        <text x="140" y="230" fill="#CBD5E1" font-family="monospace" font-size="10" text-anchor="middle">Zero blocky 8x8 ringing artifacts</text>
      </g>
    `
  },
  svg: {
    symbol: '&lt;SVG&gt;',
    tag: 'INFINITE VECTOR XML',
    spec1: 'MATHEMATICAL CURVES',
    spec2: 'INFINITE RESOLUTION',
    spec3: 'CSS STYLED &amp; JS ANIMATED',
    spec4: 'INLINE HTML DOM EMBED',
    layout: (accent) => `
      <g transform="translate(470, 105)">
        <rect x="0" y="0" width="280" height="270" rx="14" fill="#240E1B" stroke="${accent}" stroke-width="1.8" opacity="0.95"/>
        <text x="18" y="28" fill="${accent}" font-family="monospace" font-size="11" font-weight="700">VECTOR BEZIER CURVES</text>
        
        <circle cx="85" cy="100" r="40" stroke="${accent}" stroke-width="2.2" fill="none"/>
        <rect x="150" y="60" width="80" height="80" rx="8" stroke="${accent}" stroke-width="2" fill="rgba(244,114,182,0.15)"/>
        <path d="M 60 160 Q 140 120 220 160" stroke="${accent}" stroke-width="3" fill="none"/>

        <rect x="18" y="180" width="244" height="74" rx="8" fill="rgba(244,114,182,0.08)" stroke="${accent}" stroke-dasharray="4,4"/>
        <text x="140" y="210" fill="${accent}" font-family="monospace" font-size="12" font-weight="700" text-anchor="middle">Infinite Crispness on 8K</text>
        <text x="140" y="232" fill="#CBD5E1" font-family="monospace" font-size="10" text-anchor="middle">CSS Transitions &amp; DOM Access</text>
      </g>
    `
  }
};

data.forEach(item => {
  const catColor = categoryColorMap[item.category] || {
    accent: '#38BDF8',
    bgMid: '#0284C7',
    tagBg: 'rgba(56, 189, 248, 0.15)',
    symbolBorder: '#38BDF8'
  };

  const key = item.name.toLowerCase();
  const vis = formatVisuals[key] || {
    symbol: item.name.toUpperCase().slice(0, 3),
    tag: item.paradigm.toUpperCase(),
    spec1: 'STRUCTURED ENCODING',
    spec2: 'STANDARDIZED FORMAT',
    spec3: 'OPTIMIZED WIRE DATA',
    spec4: 'OPEN INTEROPERABILITY',
    layout: (accent) => `
      <g transform="translate(470, 105)">
        <rect x="0" y="0" width="280" height="270" rx="14" fill="#0F172A" stroke="${accent}" stroke-width="1.8" opacity="0.95"/>
        <text x="18" y="28" fill="${accent}" font-family="monospace" font-size="11" font-weight="700">PHYSICAL WIRE SPEC</text>
        
        <rect x="18" y="44" width="244" height="38" rx="6" fill="#1E293B" stroke="rgba(255,255,255,0.15)"/>
        <text x="28" y="67" fill="#F8FAFC" font-family="monospace" font-size="11">Magic: ${item.magicBytes.replace(/</g, '&lt;').slice(0, 24)}</text>

        <rect x="18" y="90" width="244" height="38" rx="6" fill="#111827"/>
        <text x="28" y="113" fill="#CBD5E1" font-family="monospace" font-size="11">Category: ${item.category.toUpperCase()}</text>

        <rect x="18" y="136" width="244" height="38" rx="6" fill="#111827"/>
        <text x="28" y="159" fill="#CBD5E1" font-family="monospace" font-size="11">Ext: ${item.extension}</text>

        <rect x="18" y="182" width="244" height="72" rx="8" fill="rgba(255,255,255,0.04)" stroke="${accent}" stroke-dasharray="4,4"/>
        <text x="140" y="216" fill="${accent}" font-family="monospace" font-size="12" font-weight="700" text-anchor="middle">Standardized Specification</text>
        <text x="140" y="236" fill="#94A3B8" font-family="monospace" font-size="10" text-anchor="middle">Open Technical Taxonomy</text>
      </g>
    `
  };

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" width="800" height="480">
  <defs>
    <linearGradient id="bgGrad_${item.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B132B"/>
      <stop offset="45%" stop-color="${catColor.bgMid}" stop-opacity="0.32"/>
      <stop offset="100%" stop-color="#030712"/>
    </linearGradient>

    <radialGradient id="mesh_${item.id}" cx="20%" cy="15%" r="75%">
      <stop offset="0%" stop-color="${catColor.accent}" stop-opacity="0.35"/>
      <stop offset="60%" stop-color="#1E293B" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>

    <pattern id="gridPattern_${item.id}" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
      <circle cx="32" cy="32" r="1.2" fill="rgba(255,255,255,0.12)"/>
    </pattern>
  </defs>

  <!-- Background Base -->
  <rect width="100%" height="100%" fill="#030712"/>
  <rect width="100%" height="100%" fill="url(#bgGrad_${item.id})"/>
  <rect width="100%" height="100%" fill="url(#gridPattern_${item.id})"/>
  <rect width="100%" height="100%" fill="url(#mesh_${item.id})"/>

  <!-- Top Accent Banner Line -->
  <rect x="0" y="0" width="100%" height="4" fill="${catColor.accent}"/>

  <!-- Top Header Metadata Bar -->
  <g transform="translate(48, 44)">
    <!-- Symbol Shield -->
    <rect x="0" y="0" width="56" height="56" rx="12" fill="#0F172A" stroke="${catColor.accent}" stroke-width="2"/>
    <text x="28" y="36" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="18" text-anchor="middle">${vis.symbol}</text>

    <!-- Subtitle Category Badge -->
    <rect x="68" y="4" width="250" height="26" rx="6" fill="#0F172A" stroke="rgba(255,255,255,0.15)"/>
    <circle cx="82" cy="17" r="4.5" fill="${catColor.accent}"/>
    <text x="96" y="21" fill="${catColor.accent}" font-family="monospace" font-size="11" font-weight="700" letter-spacing="0.05em">${vis.tag}</text>
  </g>

  <!-- Format Title -->
  <text x="48" y="165" fill="#F8FAFC" font-family="system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-weight="900" font-size="44" letter-spacing="-0.03em">${item.title.split(' ')[0]}</text>

  <!-- Architectural Internals Specification List -->
  <g transform="translate(48, 205)">
    <rect x="0" y="0" width="390" height="180" rx="12" fill="#0F172A" stroke="rgba(255,255,255,0.12)" stroke-width="1.4"/>
    <text x="18" y="28" fill="${catColor.accent}" font-family="monospace" font-size="11" font-weight="700" letter-spacing="0.06em">PHYSICAL ARCHITECTURE &amp; WIRE SPEC</text>
    <line x1="18" y1="38" x2="372" y2="38" stroke="rgba(255,255,255,0.1)"/>

    <g transform="translate(18, 58)">
      <circle cx="5" cy="5" r="4" fill="${catColor.accent}"/>
      <text x="18" y="9" fill="#F1F5F9" font-family="monospace" font-size="12" font-weight="600">${vis.spec1}</text>
    </g>
    <g transform="translate(18, 86)">
      <circle cx="5" cy="5" r="4" fill="${catColor.accent}"/>
      <text x="18" y="9" fill="#F1F5F9" font-family="monospace" font-size="12" font-weight="600">${vis.spec2}</text>
    </g>
    <g transform="translate(18, 114)">
      <circle cx="5" cy="5" r="4" fill="${catColor.accent}"/>
      <text x="18" y="9" fill="#F1F5F9" font-family="monospace" font-size="12" font-weight="600">${vis.spec3}</text>
    </g>
    <g transform="translate(18, 142)">
      <circle cx="5" cy="5" r="4" fill="${catColor.accent}"/>
      <text x="18" y="9" fill="#F1F5F9" font-family="monospace" font-size="12" font-weight="600">${vis.spec4}</text>
    </g>
  </g>

  <!-- Right Side Interactive Blueprint Diagram -->
  ${vis.layout(catColor.accent)}

  <!-- Bottom Brand Signature -->
  <g transform="translate(48, 435)">
    <text x="0" y="0" fill="#94A3B8" font-family="monospace" font-size="11">FORMAT SPEC: ${item.extension.toUpperCase()} // OPEN TECHNICAL TAXONOMY</text>
    <text x="704" y="0" fill="${catColor.accent}" font-family="monospace" font-size="11" font-weight="700" text-anchor="end">Gui13go Data Formats Gallery &rarr;</text>
  </g>
</svg>`;

  const filename = `fmt_${item.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.svg`;
  fs.writeFileSync(path.join(outDir, filename), svgContent);
});

console.log(`Regenerated ${data.length} high-contrast SVGs in ${outDir}!`);
