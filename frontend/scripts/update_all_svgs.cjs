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
  },
  '3d': {
    accent: '#C084FC',       // Purple / Violet
    bgMid: '#9333EA',
    tagBg: 'rgba(192, 132, 252, 0.15)',
    symbolBorder: '#C084FC'
  },
  ai: {
    accent: '#FB7185',       // Rose / Coral
    bgMid: '#E11D48',
    tagBg: 'rgba(251, 113, 133, 0.15)',
    symbolBorder: '#FB7185'
  },
  archive: {
    accent: '#F59E0B',       // Amber / Gold
    bgMid: '#B45309',
    tagBg: 'rgba(245, 158, 11, 0.15)',
    symbolBorder: '#F59E0B'
  }
};

// Map each format ID to blueprint metadata
function getVisualConfig(item) {
  const c = item.category;
  const name = item.name;
  const ext = item.extension.split(' ')[0].toUpperCase();

  // Custom diagram generators
  return {
    symbol: ext.replace(/[^A-Z0-9]/g, '').slice(0, 4) || 'SPEC',
    tag: `${item.category.toUpperCase()} SPECIFICATION`,
    spec1: item.key_features[0] ? item.key_features[0].slice(0, 38).toUpperCase() : 'STRUCTURAL SPECIFICATION',
    spec2: item.key_features[1] ? item.key_features[1].slice(0, 38).toUpperCase() : 'OPTIMIZED PARSING ENGINE',
    spec3: (item.endianness ? `ENDIAN: ${item.endianness}` : 'UTF-8 STREAM').slice(0, 38).toUpperCase(),
    spec4: (item.compression ? `COMPRESSION: ${item.compression}` : 'ZERO-COPY BUFFER').slice(0, 38).toUpperCase(),
    layout: (color) => `
    <g transform="translate(460, 90)">
      <rect x="0" y="0" width="300" height="300" rx="14" fill="#0A0F1D" stroke="${color}" stroke-width="1.8"/>
      <rect x="15" y="15" width="270" height="35" rx="6" fill="#111827" stroke="rgba(255,255,255,0.1)"/>
      <text x="150" y="38" fill="#F8FAFC" font-family="monospace" font-size="12" font-weight="700" text-anchor="middle">${item.name} ARCHITECTURE</text>
      
      <rect x="25" y="65" width="250" height="50" rx="6" fill="#1E293B" stroke="${color}" stroke-width="1"/>
      <text x="35" y="88" fill="${color}" font-family="monospace" font-size="11" font-weight="700">1. HEADER / METADATA</text>
      <text x="35" y="104" fill="#94A3B8" font-family="monospace" font-size="10">${item.rfc_or_spec.slice(0, 35)}</text>

      <rect x="25" y="125" width="250" height="65" rx="6" fill="#1E293B" stroke="${color}" stroke-width="1"/>
      <text x="35" y="148" fill="${color}" font-family="monospace" font-size="11" font-weight="700">2. CORE PAYLOAD &amp; ENCODING</text>
      <text x="35" y="165" fill="#CBD5E1" font-family="monospace" font-size="10">${(item.compression || 'Raw Contiguous Stream').slice(0, 35)}</text>
      <text x="35" y="180" fill="#94A3B8" font-family="monospace" font-size="9">Zero-Copy Direct Access Pipeline</text>

      <rect x="25" y="200" width="250" height="50" rx="6" fill="#1E293B" stroke="${color}" stroke-width="1"/>
      <text x="35" y="222" fill="${color}" font-family="monospace" font-size="11" font-weight="700">3. DESERIALIZATION TARGET</text>
      <text x="35" y="238" fill="#94A3B8" font-family="monospace" font-size="10">${item.ideal_use_case.slice(0, 35)}</text>

      <!-- Bottom Status Indicators -->
      <g transform="translate(25, 265)">
        <circle cx="5" cy="5" r="4" fill="${color}"/>
        <text x="16" y="9" fill="#F8FAFC" font-family="monospace" font-size="10" font-weight="700">YEAR: ${item.released}</text>
        <circle cx="130" cy="5" r="4" fill="${color}"/>
        <text x="142" y="9" fill="#F8FAFC" font-family="monospace" font-size="10" font-weight="700">READ: ${item.speed_read}/10</text>
      </g>
    </g>`
  };
}

data.forEach(item => {
  const catColor = categoryColorMap[item.category] || categoryColorMap.binary;
  const vis = getVisualConfig(item);

  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" width="100%" height="100%">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad_${item.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#050814"/>
      <stop offset="50%" stop-color="#0B132B"/>
      <stop offset="100%" stop-color="#030712"/>
    </linearGradient>

    <!-- Mesh Grid Glow -->
    <radialGradient id="mesh_${item.id}" cx="75%" cy="30%" r="65%">
      <stop offset="0%" stop-color="${catColor.accent}" stop-opacity="0.18"/>
      <stop offset="60%" stop-color="${catColor.bgMid}" stop-opacity="0.04"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>

    <pattern id="gridPattern_${item.id}" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255, 255, 255, 0.04)" stroke-width="1"/>
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
    <text x="28" y="36" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="16" text-anchor="middle">${vis.symbol}</text>

    <!-- Subtitle Category Badge -->
    <rect x="68" y="4" width="280" height="26" rx="6" fill="#0F172A" stroke="rgba(255,255,255,0.15)"/>
    <circle cx="82" cy="17" r="4.5" fill="${catColor.accent}"/>
    <text x="96" y="21" fill="${catColor.accent}" font-family="monospace" font-size="11" font-weight="700" letter-spacing="0.05em">${vis.tag}</text>
  </g>

  <!-- Format Title -->
  <text x="48" y="165" fill="#F8FAFC" font-family="system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-weight="900" font-size="38" letter-spacing="-0.03em">${item.name}</text>

  <!-- Architectural Internals Specification List -->
  <g transform="translate(48, 205)">
    <rect x="0" y="0" width="390" height="180" rx="12" fill="#0F172A" stroke="rgba(255,255,255,0.12)" stroke-width="1.4"/>
    <text x="18" y="28" fill="${catColor.accent}" font-family="monospace" font-size="11" font-weight="700" letter-spacing="0.06em">PHYSICAL ARCHITECTURE &amp; WIRE SPEC</text>
    <line x1="18" y1="38" x2="372" y2="38" stroke="rgba(255,255,255,0.1)"/>

    <g transform="translate(18, 58)">
      <circle cx="5" cy="5" r="4" fill="${catColor.accent}"/>
      <text x="18" y="9" fill="#F1F5F9" font-family="monospace" font-size="11" font-weight="600">${vis.spec1}</text>
    </g>
    <g transform="translate(18, 86)">
      <circle cx="5" cy="5" r="4" fill="${catColor.accent}"/>
      <text x="18" y="9" fill="#F1F5F9" font-family="monospace" font-size="11" font-weight="600">${vis.spec2}</text>
    </g>
    <g transform="translate(18, 114)">
      <circle cx="5" cy="5" r="4" fill="${catColor.accent}"/>
      <text x="18" y="9" fill="#F1F5F9" font-family="monospace" font-size="11" font-weight="600">${vis.spec3}</text>
    </g>
    <g transform="translate(18, 142)">
      <circle cx="5" cy="5" r="4" fill="${catColor.accent}"/>
      <text x="18" y="9" fill="#F1F5F9" font-family="monospace" font-size="11" font-weight="600">${vis.spec4}</text>
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

console.log(`Generated ${data.length} clean, ultra-readable SVG blueprints in ${outDir}!`);
