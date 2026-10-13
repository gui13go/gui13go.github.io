const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../public/data/data-formats.json');
const current = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const newFormats = [
  // 3D & Spatial Computing
  {
    id: "gltf",
    name: "glTF / GLB",
    extension: ".gltf / .glb",
    category: "3D & Spatial Computing",
    released: 2015,
    creator: "Khronos Group",
    rfc_or_spec: "Khronos glTF 2.0 Specification",
    mime_type: "model/gltf+json, model/gltf-binary",
    endianness: "Little-endian (GLB)",
    compression: "Draco, Meshopt, KTX2/Basis Universal texture payload compression",
    ideal_use_case: "Real-time 3D web rendering (Three.js, Babylon.js), WebXR, game assets, and AR Quick Look.",
    unsuited_use_case: "Complex CAD solid modeling with parametric NURBS curves or multi-layer offline VFX editing.",
    primary_flaw: "Lack of advanced procedural physics/animation rigs compared to USD.",
    speed_read: 10,
    speed_write: 8,
    space_efficiency: 9,
    human_readability: 4,
    complexity: 6,
    short_summary: "The 'JPEG of 3D': a transmission format for 3D scenes packed with PBR materials, skeletal animations, and zero-copy binary buffer geometry.",
    deep_dive: "glTF represents 3D scene hierarchy in JSON linked to binary buffers (`.bin` or packed into a single container `.glb`). It maps directly to GPU draw calls: vertex attributes (positions, normals, UVs) are stored in contiguous memory buffers ready for `glBufferData` or WebGPU `createBuffer`. With glTF 2.0, Metallic-Roughness Physically Based Rendering (PBR) became universal across engines.",
    key_features: [
      "Direct GPU memory mapping with bufferViews and accessors",
      "PBR material definitions standard across Blender, Unreal, and WebGL",
      "Draco and EXT_meshopt geometric compression extensions",
      "Single-file container packaging (.glb) with 12-byte binary header"
    ],
    superpowers: [
      "Loads directly into GPU VRAM with near-zero runtime CPU conversion cost",
      "Universal ecosystem standard adopted by Adobe, Apple, Meta, Google, and Khronos",
      "Self-contained textures and geometry in one binary file with .glb"
    ],
    constraints: [
      "Rigging is limited to joint-skin transforms; no parametric curve modeling",
      "JSON manifest parsing can be a bottleneck for scenes with hundreds of thousands of node nodes"
    ],
    syntax_example: `// GLB Container Structure:
// [4B Magic 'glTF'] [4B Version 2] [4B Total Length]
// [CHUNK 0: JSON Manifest (scene nodes, meshes, materials, accessors)]
// [CHUNK 1: BINARY Buffer (vertex coordinates, normal vectors, indices)]`
  },
  {
    id: "usd",
    name: "OpenUSD / USDA / USDC",
    extension: ".usd / .usda / .usdc / .usdz",
    category: "3D & Spatial Computing",
    released: 2016,
    creator: "Pixar Animation Studios & ASWF",
    rfc_or_spec: "Alliance for OpenUSD (AOUSD) / Pixar Universal Scene Description",
    mime_type: "model/vnd.usd, model/vnd.usdz+zip",
    endianness: "Little-endian (USDC crate)",
    compression: "LZ4 or Snappy on binary crate tables; ZIP for USDZ AR packages",
    ideal_use_case: "High-end VFX pipelines, feature animation, Apple Vision Pro AR experiences, and Omniverse digital twins.",
    unsuited_use_case: "Lightweight single-mesh web delivery where bandwidth and bundle sizes are strictly constrained.",
    primary_flaw: "Immense specification complexity; C++ reference library is hundreds of megabytes.",
    speed_read: 9,
    speed_write: 8,
    space_efficiency: 9,
    human_readability: 6,
    complexity: 10,
    short_summary: "Pixar's scene composition powerhouse: supports non-destructive layering, variants, overrides, and massive multi-studio collaboration.",
    deep_dive: "Universal Scene Description (OpenUSD) solves the collaborative authoring problem in modern computer graphics. Rather than a flat file of polygons, a USD stage is composed of non-destructive 'layers' using LIVRPS strength ordering (Local, Inherits, VariantSets, References, Payloads, Specializes). USDC is its ultra-fast memory-mapped binary crate format, while USDZ is an uncompressed ZIP container utilized natively by Apple iOS/visionOS.",
    key_features: [
      "Non-destructive layer composition with LIVRPS deterministic priority rules",
      "Binary 'Crate' format (.usdc) allows instant memory-mapped access to billion-polygon scenes",
      "Payload deferred loading allows artists to load only localized sections of gigantic worlds",
      "Native support for variant sets (e.g. switching character outfits or LODs with zero duplication)"
    ],
    superpowers: [
      "Hundreds of artists can simultaneously work on lighting, rigging, and layout on the same stage without file locking",
      "Industry standard backbone for Pixar, Disney, ILM, Apple, and NVIDIA Omniverse",
      "Extreme performance via memory-mapped C++ crate engine"
    ],
    constraints: [
      "Steep learning curve with intricate composition paradigms",
      "Reference C++ codebase is massive and difficult to compile for lightweight web/embedded targets"
    ],
    syntax_example: `#usda 1.0
(
    defaultPrim = "HeroMech"
    metersPerUnit = 0.01
    upAxis = "Y"
)

def Xform "HeroMech" (
    prepend references = @./mech_geometry.usdc@
)
{
    float3 xformOp:translate = (0, 150, 0)
    uniform token[] xformOpOrder = ["xformOp:translate"]
}`
  },
  {
    id: "dicom",
    name: "DICOM",
    extension: ".dcm / .dicom",
    category: "Medical & Imaging",
    released: 1985,
    creator: "ACR & NEMA (National Electrical Manufacturers Association)",
    rfc_or_spec: "NEMA PS3.1-PS3.22 (DICOM Standard)",
    mime_type: "application/dicom",
    endianness: "Explicit VR Little-endian (Standard) or Big-endian",
    compression: "RLE, JPEG Lossless, JPEG 2000, JPEG-LS, Deflate",
    ideal_use_case: "Hospital PACS archives, CT/MRI radiology workflows, ultrasound, radiation therapy planning, and clinical diagnostics.",
    unsuited_use_case: "General public consumer photo sharing or high-frequency web rendering.",
    primary_flaw: "Complex regulatory tags, legacy inconsistencies, and strict patient health information (PHI) compliance requirements.",
    speed_read: 7,
    speed_write: 6,
    space_efficiency: 7,
    human_readability: 2,
    complexity: 9,
    short_summary: "The global medical imaging standard: combines high-bit-depth multi-frame volumetric scans with comprehensive clinical and patient metadata.",
    deep_dive: "DICOM is both a file format and a networked clinical protocol (DIMSE). Every DICOM file begins with a 128-byte preamble followed by the 4-byte ASCII magic 'DICM'. Data elements are structured as Data Tags `(Group, Element)` paired with Value Representations (VR) like UI (Unique Identifier), PN (Person Name), and OW (Other Word). Image pixels are stored uncompressed (12-bit or 16-bit grayscale) or with lossless JPEG/JPEG-2000 transfer syntaxes.",
    key_features: [
      "128-byte preamble + 'DICM' magic bytes header",
      "Tagged dictionary structure: (0010,0010) Patient Name, (0028,0010) Rows, (7FE0,0010) Pixel Data",
      "Multi-frame support for 3D CT/MRI volumetric slices with exact slice spacing (mm)",
      "Strict clinical UID hierarchies (Study Instance UID -> Series UID -> SOP Instance UID)"
    ],
    superpowers: [
      "Preserves exact radiomic fidelity with 12/16-bit clinical sensor calibration values",
      "Universal interoperability across global hospital PACS systems, GE, Siemens, and Philips equipment",
      "Guarantees scan parameters and calibrated physical spatial orientation are bound directly to pixels"
    ],
    constraints: [
      "Accidental leakage of patient identity (PHI) in hundreds of private vendor tag groups",
      "Vast, baroque standard spanning thousands of pages with legacy 1980s quirks"
    ],
    syntax_example: `// DICOM Binary Stream:
// [128-byte Preamble] [4-byte 'DICM']
// Tag: (0010, 0010) VR: PN Length: 12 Value: "DOE^JOHN^^^"
// Tag: (0028, 0010) VR: US Length:  2 Value: 512 (Rows)
// Tag: (0028, 0011) VR: US Length:  2 Value: 512 (Columns)
// Tag: (0028, 0100) VR: US Length:  2 Value: 16  (Bits Allocated)
// Tag: (7FE0, 0010) VR: OW Length: 524288 Value: [Raw 16-bit Pixel Scan Words]`
  },
  {
    id: "fits",
    name: "FITS",
    extension: ".fits / .fit / .fts",
    category: "Scientific & Astronomical",
    released: 1981,
    creator: "IAU (International Astronomical Union) / NASA FITS Office",
    rfc_or_spec: "IAU FITS Standard Version 4.0",
    mime_type: "image/fits, application/fits",
    endianness: "Big-endian (Strict IEEE-754)",
    compression: "Tile compression with Rice, GZIP, Hcompress, or PLIO",
    ideal_use_case: "James Webb Space Telescope (JWST), Hubble data distribution, radio astronomy interferometry, and scientific spectroscopy.",
    unsuited_use_case: "Consumer desktop photography or mobile web graphics.",
    primary_flaw: "Fixed 2880-byte header block padding and 80-character card records from the punch-card era.",
    speed_read: 7,
    speed_write: 6,
    space_efficiency: 7,
    human_readability: 5,
    complexity: 7,
    short_summary: "The definitive astronomical data format: stores calibrated telescope CCD frames, radio data cubes, and spectra with astronomical coordinate metadata.",
    deep_dive: "FITS (Flexible Image Transport System) has guided astrophysics for over four decades under the motto 'Once FITS, Always FITS'. Files consist of one or more Header and Data Units (HDUs). Headers are composed of human-readable ASCII card images (80 columns wide, fixed in 2880-byte blocks) containing World Coordinate System (WCS) metadata like RA, Dec, and photometric calibrations. The binary data unit follows immediately, supporting multidimensional arrays of IEEE-754 floating point pixels or binary tables.",
    key_features: [
      "2880-byte record blocks preserved throughout header and binary payloads",
      "ASCII keyword cards: 8-character KEYWORD = VALUE / COMMENT format",
      "World Coordinate System (WCS) standard keywords (CRPIX, CRVAL, CDELT, CTYPE)",
      "Multi-extension FITS (MEF) allows multiple images, spectra, and tables in one file"
    ],
    superpowers: [
      "Unmatched 40+ year backwards compatibility; files written in 1981 open flawlessly today",
      "Scientific floating-point dynamic range (32-bit/64-bit IEEE) with exact physical unit flux tracking",
      "Official archival format used by NASA, ESA, ALMA, and ESO"
    ],
    constraints: [
      "Card image format inherits punch-card era restrictions (80-character line lengths)",
      "Enforces big-endian encoding, requiring byte swapping on modern x86/ARM little-endian processors"
    ],
    syntax_example: `SIMPLE  =                    T / file conforms to FITS standard
BITPIX  =                  -32 / 32-bit IEEE floating point pixels
NAXIS   =                    2 / 2-dimensional image
NAXIS1  =                 2048 / pixels along axis 1
NAXIS2  =                 2048 / pixels along axis 2
CRVAL1  =        180.423750000 / Reference right ascension (deg)
CRVAL2  =        -18.864320000 / Reference declination (deg)
TELESCOP= 'JWST                ' / James Webb Space Telescope
END
[... 2880-byte padded boundary followed by 2048x2048 IEEE 32-bit float array ...]`
  },
  {
    id: "bam-vcf",
    name: "BAM / CRAM / VCF",
    extension: ".bam / .cram / .vcf.gz",
    category: "Bioinformatics & Genomics",
    released: 2009,
    creator: "Heng Li, 1000 Genomes Project & GA4GH",
    rfc_or_spec: "SAM/BAM/CRAM/VCF Specification (Samtools / HTSlib)",
    mime_type: "application/octet-stream",
    endianness: "Little-endian",
    compression: "BGZF (Blocked GNU Zip Format) and reference-based entropy coding (CRAM)",
    ideal_use_case: "Next-Generation DNA/RNA Sequencing (NGS), whole-genome alignment storage, variant discovery, and clinical cancer genomics.",
    unsuited_use_case: "General unstructured data or non-sequence biological data.",
    primary_flaw: "Extreme computational overhead for decompressing billion-read datasets without specialized indexing (`.bai`/`.tbi`).",
    speed_read: 8,
    speed_write: 7,
    space_efficiency: 10,
    human_readability: 2,
    complexity: 9,
    short_summary: "The engine of genomic medicine: binary compressed alignment and variant tables queryable in sub-second intervals via indexed genomic coordinates.",
    deep_dive: "BAM is the binary compressed counterpart of Sequence Alignment/Map (SAM). It uses BGZF (Blocked GNU Zip), which divides streams into 64KB individually compressed zlib blocks. This enables coordinate index files (.bai or CSI index) to perform rapid random-access seeks into specific chromosomes and base pair intervals without decompressing the entire multi-gigabyte BAM file. CRAM pushes compression even further by saving only differences relative to a reference genome sequence.",
    key_features: [
      "BGZF 64-KB block compression allows virtual file offset indexing for constant-time seeks",
      "Compact binary encoding of CIGAR strings (alignments, insertions, deletions)",
      "Reference-based compression in CRAM reduces 100GB BAM files down to ~35GB",
      "VCF (Variant Call Format) captures SNPs, indels, and structural variants across populations"
    ],
    superpowers: [
      "Enables instant random-access queries into any chromosome coordinate out of 3 billion base pairs",
      "Industry standard across Illumina, PacBio, Oxford Nanopore, and the Broad Institute",
      "Saves petabytes of clinical sequencing storage globally"
    ],
    constraints: [
      "Requires companion index files (.bai, .crai, .tbi) for indexed queries",
      "BGZF decompression requires significant CPU cycles during high-throughput pipeline runs"
    ],
    syntax_example: `// VCF Tabular Stream (BGZF Compressed):
#CHROM  POS     ID        REF  ALT  QUAL  FILTER  INFO
chr1    14370   rs6054257 G    A    29    PASS    AF=0.5;DP=14
chr1    17330   .         T    A    3     q10     AF=0.017
// Binary BAM Read Record:
// [refID: 0][pos: 14370][bin_mq_nl: 0x4B][flag_nc: 0x63][l_seq: 150][CIGAR: 150M][SEQ: 4-bit encoded bases]`
  },
  {
    id: "gpx-kml",
    name: "GPX / KML",
    extension: ".gpx / .kml / .kmz",
    category: "Geospatial & Navigation",
    released: 2002,
    creator: "Topografix (GPX) / Keyhole Inc & Google / OGC (KML)",
    rfc_or_spec: "GPX 1.1 Schema / OGC KML 2.3 Standard",
    mime_type: "application/gpx+xml, application/vnd.google-earth.kml+xml",
    endianness: "N/A (Text-based UTF-8)",
    compression: "Uncompressed XML; KMZ is a standard Deflate ZIP archive",
    ideal_use_case: "Garmin/Strava GPS activity tracking, hiking waypoints, fitness routes, Google Earth 3D overlays, and drone flight paths.",
    unsuited_use_case: "Massive enterprise spatial analytics with millions of parcels or polygons (use GeoParquet or Shapefile).",
    primary_flaw: "Verbose XML overhead resulting in 10x-20x file inflation compared to binary alternatives.",
    speed_read: 5,
    speed_write: 5,
    space_efficiency: 4,
    human_readability: 9,
    complexity: 4,
    short_summary: "The outdoor and navigation standard: records geographic waypoints, GPS tracks, heart rates, elevation profiles, and Google Earth map overlays.",
    deep_dive: "GPX (GPS Exchange Format) provides an open schema tailored for GPS receiver devices. It structures GPS data into waypoints (`<wpt>`), routes (`<rte>`), and track points (`<trkpt>`) enriched with elevation (`<ele>`), timestamps, and vendor extensions (heart rate, cadence, power). KML (Keyhole Markup Language), maintained by OGC, focuses on rich visual styling for Google Earth and Google Maps, including camera pitch, placemark styling, and 3D polygon extrusion.",
    key_features: [
      "Human-readable XML schemas validated against standard XSD definitions",
      "Time-ordered trackpoints (<trkpt>) with ISO 8601 timestamps and WGS 84 GPS coordinates",
      "Extensible with Garmin TrackPointExtension for sports telemetry (watts, cadence, heart-rate)",
      "KMZ combines KML map geometry with custom pin icons and 3D models into a ZIP container"
    ],
    superpowers: [
      "100% interoperability across every GPS watch, bike computer, fitness app, and outdoor unit",
      "Direct visualization support in Google Earth, Google Maps, Apple Maps, and Strava",
      "Easily editable in any plain text editor"
    ],
    constraints: [
      "XML verbosity wastes substantial battery and network bandwidth on mobile GPS devices",
      "Lacks spatial indexing; searching for nearest track points requires a full file scan"
    ],
    syntax_example: `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Garmin Edge 1040">
  <trk>
    <name>Morning Alpine Ride</name>
    <trkseg>
      <trkpt lat="45.9237" lon="6.8694">
        <ele>1035.2</ele>
        <time>2026-06-15T06:30:00Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>142</gpxtpx:hr>
            <gpxtpx:cad>88</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
    </trkseg>
  </trk>
</gpx>`
  },
  {
    id: "tar-zip",
    name: "TAR / ZIP / 7z",
    extension: ".tar.gz / .zip / .7z",
    category: "Archive & Packaging",
    released: 1979,
    creator: "AT&T UNIX (TAR) / Phil Katz (PKZIP, 1989) / Igor Pavlov (7z, 1999)",
    rfc_or_spec: "POSIX tar (IEEE 1003.1) / PKWARE APPNOTE.TXT / 7z Spec",
    mime_type: "application/zip, application/x-tar, application/x-7z-compressed",
    endianness: "Little-endian (ZIP / 7z) / Octal ASCII (TAR)",
    compression: "Deflate, Bzip2, LZMA, LZMA2, Zstandard",
    ideal_use_case: "Software distribution, app stores (.apk/.ipa/JAR), OS packaging, backups, and file collection bundling.",
    unsuited_use_case: "Streaming linear video or querying tabular databases directly without indexing.",
    primary_flaw: "TAR has no central directory (requires sequential scan); traditional ZIP has 4GB limits without Zip64.",
    speed_read: 8,
    speed_write: 7,
    space_efficiency: 9,
    human_readability: 1,
    complexity: 6,
    short_summary: "The bedrock of file bundling and compression: powers everything from POSIX systems and software packages to DOCX, APK, and JAR containers.",
    deep_dive: "TAR (Tape Archive) concatenates files sequentially with 512-byte header blocks preserving POSIX file permissions, timestamps, and ownership, usually compressed with gzip or zstd (`.tar.gz`). In contrast, ZIP maintains a 'Central Directory' at the tail of the file. This allows extractors to read the file list and randomly decompress individual files in $O(1)$ time without scanning the preceding data. Modern application formats (DOCX, XLSX, APK, JAR) are internally standard ZIP files.",
    key_features: [
      "ZIP Central Directory located at file tail for constant-time random file extraction",
      "TAR 512-byte blocks preserve POSIX UID/GID, file modes, symlinks, and timestamps",
      "7z provides extreme LZMA/LZMA2 solid compression ratios with 256-bit AES encryption",
      "Zip64 extension breaks the legacy 4GB archive size and 65,535 entry barriers"
    ],
    superpowers: [
      "Underpins major file ecosystems: Java JAR, Android APK, Microsoft Office DOCX, and NPM tarballs",
      "ZIP enables random access extraction of single files over HTTP Range requests",
      "TAR cleanly preserves UNIX file ownership, symlinks, and permissions for system builds"
    ],
    constraints: [
      "TAR requires reading from byte 0 to find a file at the end of the archive",
      "ZIP files can be corrupted if the file download is truncated before the tail Central Directory finishes"
    ],
    syntax_example: `// ZIP Binary Structure:
// [Local File Header 1] [Compressed File Data 1]
// [Local File Header 2] [Compressed File Data 2]
// ...
// [Central Directory Header 1] (Relative offset: 0)
// [Central Directory Header 2] (Relative offset: 14205)
// [End of Central Directory Record (EOCD)]:
//   0x06054b50 Magic | 2B Total Entries | 4B Central Dir Size | 4B Central Dir Offset`
  },
  {
    id: "epub",
    name: "EPUB",
    extension: ".epub",
    category: "Documents & Publishing",
    released: 2007,
    creator: "IDPF (International Digital Publishing Forum) & W3C",
    rfc_or_spec: "W3C EPUB 3.3 Recommendation",
    mime_type: "application/epub+zip",
    endianness: "Little-endian (ZIP container)",
    compression: "Standard ZIP Deflate",
    ideal_use_case: "Digital books, e-readers (Kindle, Kobo, Apple Books), accessible textbooks, and reflowable typography.",
    unsuited_use_case: "Pixel-perfect engineering drawings, legal contracts requiring static printed pagination (use PDF).",
    primary_flaw: "Inconsistent rendering engines across different hardware e-readers and devices.",
    speed_read: 7,
    speed_write: 6,
    space_efficiency: 8,
    human_readability: 7,
    complexity: 6,
    short_summary: "The global digital book standard: a zipped website of semantic XHTML, CSS, and media designed for dynamic reflowable reading on e-readers.",
    deep_dive: "An EPUB is fundamentally a specialized ZIP archive containing a structured miniature website. The very first uncompressed file must be `mimetype` containing the exact string `application/epub+zip` at byte offset 38. The archive contains `META-INF/container.xml`, which points to the OPF (Open Packaging Format) package file. The OPF file defines metadata (author, ISBN), the manifest of all XHTML chapters, images, and fonts, and the spine specifying the reading order.",
    key_features: [
      "Reflowable layout adapts dynamically to any screen dimension, font size, or orientation",
      "Strict ZIP container layout with uncompressed 20-byte mimetype header at fixed offset",
      "Full web standards support: XHTML, CSS, MathML, SVG, audio overlays, and JavaScript",
      "W3C EPUB 3.3 accessibility metadata for screen readers and text-to-speech engines"
    ],
    superpowers: [
      "Dynamic typography reflows gracefully across smartphones, tablets, and e-ink displays",
      "Universal ecosystem support across Apple Books, Kobo, Google Play Books, and Amazon Kindle (via EPUB upload)",
      "Composed of pure open web technologies (HTML/CSS), making it easy to generate programmatically"
    ],
    constraints: [
      "Rendering consistency varies wildly between Apple Books and low-power e-ink devices",
      "Reflowable nature breaks strict printed page numbering required in legal and academic citations"
    ],
    syntax_example: `// EPUB Internal Archive Architecture:
// ├── mimetype (application/epub+zip - uncompressed)
// ├── META-INF/
// │   └── container.xml (Points to OEBPS/content.opf)
// └── OEBPS/
//     ├── content.opf   (Metadata, Manifest, Reading Spine)
//     ├── toc.ncx       (Table of contents navigation)
//     ├── styles/book.css
//     └── text/chapter01.xhtml`
  },
  {
    id: "safetensors",
    name: "SafeTensors",
    extension: ".safetensors",
    category: "AI & Machine Learning",
    released: 2022,
    creator: "Hugging Face",
    rfc_or_spec: "Hugging Face SafeTensors Specification",
    mime_type: "application/octet-stream",
    endianness: "Little-endian",
    compression: "Uncompressed (Optimized for zero-copy memory mapping)",
    ideal_use_case: "Deep learning model weights distribution (LLMs, Stable Diffusion, Whisper, Vision Transformers), PyTorch/JAX model loading.",
    unsuited_use_case: "Saving complex arbitrary Python runtime class states or object graphs.",
    primary_flaw: "Only stores pure numerical tensor data; cannot serialize custom Python logic or arbitrary objects.",
    speed_read: 10,
    speed_write: 9,
    space_efficiency: 9,
    human_readability: 3,
    complexity: 4,
    short_summary: "The secure successor to PyTorch `.pt`: provides zero-copy memory mapping for multi-billion parameter AI models with complete immunity to code injection.",
    deep_dive: "Legacy machine learning checkpoints used Python's `pickle` format, which allows arbitrary remote code execution (RCE) via `__reduce__` exploit payloads. Hugging Face developed SafeTensors to eliminate this vulnerability while accelerating model load speeds. SafeTensors stores an 8-byte little-endian header length, followed by a JSON header dictionary indexing tensor names, shapes, datatypes (F16, BF16, F32), and byte offsets. The remainder of the file is raw contiguous binary tensor buffers, enabling direct OS memory mapping (`mmap`).",
    key_features: [
      "Complete code execution security: pure data format with zero execution surface",
      "Instant zero-copy loading via OS memory mapping (`mmap`) directly to GPU VRAM",
      "8-byte header size prefix followed by UTF-8 JSON tensor metadata dictionary",
      "Supports all standard ML datatypes: F32, F16, BF16, I64, I32, I8, F8_E4M3, F8_E5M2"
    ],
    superpowers: [
      "Loads 70B parameter models in seconds by eliminating CPU deserialization overhead",
      "Protects AI developers and production infrastructure from malicious pickle exploit scripts",
      "De-facto default format across Hugging Face Hub, Ollama, vLLM, and Stable Diffusion"
    ],
    constraints: [
      "Cannot store optimizer state or custom Python classes; restricted purely to numeric weight tensors",
      "Header size is bounded to prevent denial-of-service JSON parsing attacks"
    ],
    syntax_example: `// SafeTensors Binary Layout:
// [8 Bytes uint64: Header Size N = 384]
// [N Bytes: JSON Header String]:
// {
//   "model.layers.0.weight": {"dtype": "BF16", "shape": [4096, 4096], "data_offsets": [0, 33554432]},
//   "model.layers.0.bias":   {"dtype": "BF16", "shape": [4096],       "data_offsets": [33554432, 33562624]}
// }
// [Raw Contiguous Tensor Data Buffer (zero-copy memory-mapped into GPU)]`
  },
  {
    id: "gguf",
    name: "GGUF",
    extension: ".gguf",
    category: "AI & Machine Learning",
    released: 2023,
    creator: "Georgi Gerganov & llama.cpp Community",
    rfc_or_spec: "llama.cpp GGUF Specification v3",
    mime_type: "application/octet-stream",
    endianness: "Little-endian (Standard) or Big-endian",
    compression: "K-quants, AWQ, GPTQ (Quantized 2-bit through 8-bit integer weights)",
    ideal_use_case: "Local AI inference on consumer laptops, Apple Silicon MacBooks, edge devices, and Ollama/llama.cpp.",
    unsuited_use_case: "Full-precision high-performance distributed cluster model training.",
    primary_flaw: "Primarily tailored for llama.cpp ecosystem; changing model architectures requires updating quantization scripts.",
    speed_read: 10,
    speed_write: 8,
    space_efficiency: 10,
    human_readability: 2,
    complexity: 7,
    short_summary: "The edge AI standard: packs quantized neural network weights (Q4_K_M, Q8_0), tokenizer vocabulary, and hyperparameter metadata into one runnable file.",
    deep_dive: "Before GGUF, local LLM execution was fragmented between GGML and GGJT formats, which broke whenever a new transformer architecture arrived. GGUF (GPT-Generated Unified Format) introduced an extensible key-value metadata system alongside raw tensor data. It stores everything needed to run an LLM—tokenizer vocabularies, context length limits, rope frequency scalings, and model architecture strings—within a single file. GGUF files are memory-mapped directly into unified RAM on Apple Silicon or system memory.",
    key_features: [
      "4-byte magic bytes 'GGUF' (0x46554747) followed by version integer",
      "Extensible key-value metadata dictionary for hyperparameters, tokenizers, and chat templates",
      "Integrated support for advanced k-quants (Q2_K through Q8_0) reducing 70B models from 140GB to 38GB",
      "Direct mmap support allows immediate token generation without loading delays"
    ],
    superpowers: [
      "Single file contains everything: model weights, prompt templates, and BPE tokenizer matrices",
      "Enables local execution of ChatGPT-grade models on ordinary consumer laptops with 16GB-32GB RAM",
      "The underlying backbone powering Ollama, LM Studio, Jan, and llama.cpp"
    ],
    constraints: [
      "Quantization can induce subtle perplexity/reasoning degradation compared to FP16 master weights",
      "Not designed for backpropagation training or distributed gradient updates"
    ],
    syntax_example: `// GGUF Binary Layout:
// [Magic: 'GGUF'] [Version: 3] [Tensor Count: 291] [Metadata KV Count: 28]
// Key-Value Pairs:
//   "general.architecture"        -> STRING: "llama"
//   "llama.context_length"        -> UINT32: 8192
//   "tokenizer.ggml.tokens"       -> ARRAY[STRING]: ["<unk>", "<s>", "</s>", "hello", ...]
// Tensor Info Headers (Names, dimensions, quantization type e.g. GGML_TYPE_Q4_K)
// Contiguous Memory-Mapped Quantized Weight Matrices`
  }
];

// Append non-duplicate formats
let addedCount = 0;
for (const fmt of newFormats) {
  if (!current.some(item => item.id === fmt.id)) {
    current.push(fmt);
    addedCount++;
  }
}

fs.writeFileSync(jsonPath, JSON.stringify(current, null, 2), 'utf8');
console.log(`Successfully added ${addedCount} new formats! Total formats now: ${current.length}`);
