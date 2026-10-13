const fs = require('fs');
const path = require('path');

const jsonPath = '/home/guigo/Documents/05-ghpages-gui13go/frontend/public/data/data-formats.json';
const existingList = JSON.parse(fs.readFileSync(jsonPath, 'utf8')).slice(0, 40); // Keep original 40

const new10Specs = [
  {
    id: "format-gltf",
    name: "glTF / GLB",
    title: "glTF 2.0 / GLB (Graphics Language Transmission Format)",
    extension: ".gltf / .glb",
    mime: "model/gltf+json, model/gltf-binary",
    magicBytes: "0x46546c67 ('glTF' Little-Endian in GLB container)",
    year: 2015,
    category: "3d",
    paradigm: "Real-Time 3D Transmission & GPU Memory-Mapped Geometry",
    creator: "Khronos Group 3D Formats Working Group",
    standard: "Khronos glTF 2.0 Specification / ISO/IEC 12113",
    encoding: "JSON Hierarchy + Raw IEEE 754 Binary Buffer Views",
    structure: "Scene Graph Nodes, Meshes, PBR Materials, Animations",
    schemaType: "Strict JSON Schema + Binary Accessor Offsets",
    compression: "Google Draco, EXT_meshopt, KTX2 / Basis Universal",
    website: "https://www.khronos.org/gltf/",
    description: "glTF (GL Transmission Format), heralded as the 'JPEG of 3D', is an open, royalty-free specification for real-time delivery of 3D models and scenes. Engineered specifically to minimize runtime processing on client devices, glTF combines a JSON scene graph with tightly-packed contiguous binary buffers (.bin or packed inside a binary .glb container). These buffers can be uploaded directly into GPU VRAM (via WebGL, WebGPU, Vulkan, or Metal) without CPU restructuring.",
    highlights: [
      "Zero-Copy GPU Buffer Mapping: Vertex positions, normals, tangents, and indices are stored in byte-aligned binary chunks directly ingestible by GPU draw calls.",
      "Universal PBR Standard: Metallic-Roughness Physically Based Rendering (PBR) equations standardized across Blender, Maya, Unreal Engine, Unity, and Three.js.",
      "GLB Binary Container: Bundles the JSON scene hierarchy, binary geometric buffers, and high-resolution textures into a single self-contained 12-byte header file.",
      "Production Compression Extensions: Supports Google Draco and meshopt geometric compression plus KTX2 Basis Universal GPU-compressed textures."
    ],
    primaryUseCase: "Real-time 3D web experiences (Three.js/Babylon.js), Apple/Android mobile AR Quick Look, and cross-platform game engine assets.",
    pros: [
      "Loads directly into GPU VRAM with negligible CPU deserialization delay",
      "Universal ecosystem backing from Apple, Google, Meta, Adobe, NVIDIA, and Khronos",
      "Comprehensive support for skeletal rigging, morph targets, and PBR shaders"
    ],
    cons: [
      "Not designed for parametric CAD solid modeling or NURBS surfaces",
      "Massive scenes with millions of discrete scene nodes can suffer JSON parser stalls"
    ],
    snippetTitle: "GLB 12-Byte Binary Container Header",
    snippetLang: "text",
    snippetCode: `[0x00..0x03]: 0x46546C67 (Magic bytes 'glTF')
[0x04..0x07]: 0x00000002 (Version: 2)
[0x08..0x0B]: Total File Length in Bytes (uint32)
--- Chunk 0: JSON Manifest (Nodes, Meshes, Materials) ---
[0x0C..0x0F]: Chunk Length
[0x10..0x13]: 0x4E4F534A ('JSON')
--- Chunk 1: Binary Buffer (Contiguous GPU Vertex Arrays) ---
[Chunk 1 Len]: 0x004E4942 ('BIN\\0')`,
    diagramType: "3d",
    color: "#c084fc"
  },
  {
    id: "format-usd",
    name: "OpenUSD",
    title: "OpenUSD / USDA / USDC (Universal Scene Description)",
    extension: ".usd / .usda / .usdc / .usdz",
    mime: "model/vnd.usd, model/vnd.usdz+zip",
    magicBytes: "0x50555344 ('PUSD' in binary Crate format) / 'PK\\x03\\x04' in USDZ",
    year: 2016,
    category: "3d",
    paradigm: "Non-Destructive Layered Scene Composition & VFX Pipeline",
    creator: "Pixar Animation Studios & Alliance for OpenUSD",
    standard: "Alliance for OpenUSD (AOUSD) / Pixar OpenUSD Core",
    encoding: "Human-Readable ASCII (.usda) & Binary Crate Engine (.usdc)",
    structure: "Hierarchical Prims, Non-Destructive LIVRPS Layers, Variants",
    schemaType: "Strong Typed Schemas (UsdGeom, UsdShade, UsdPhysics)",
    compression: "LZ4 / Snappy compressed tables in USDC; ZIP container in USDZ",
    website: "https://openusd.org",
    description: "Universal Scene Description (OpenUSD) is the collaborative backbone of modern Hollywood VFX, animated feature films, and industrial digital twins. Developed by Pixar and standardized through the Alliance for OpenUSD (Pixar, Apple, NVIDIA, Adobe, Autodesk), USD allows hundreds of artists to simultaneously collaborate on massive, complex virtual worlds using non-destructive LIVRPS composition rules (Local, Inherits, VariantSets, References, Payloads, Specializes).",
    highlights: [
      "Non-Destructive Layering (LIVRPS): Artists can override lighting, materials, and physics without mutating underlying master geometry files.",
      "High-Performance Binary 'Crate' Format: .usdc provides instant memory-mapped access into billion-polygon worlds with zero parsing overhead.",
      "Native Apple Vision Pro & AR Standard: USDZ packages 3D assets into a single uncompressed ZIP archive rendered natively across iOS, iPadOS, and visionOS.",
      "NVIDIA Omniverse Foundation: Powers industrial simulation, robotics training (Isaac Sim), and photo-real physics engines."
    ],
    primaryUseCase: "Feature film VFX (Pixar, ILM, Weta), Apple visionOS spatial computing apps, and NVIDIA Omniverse industrial digital twins.",
    pros: [
      "Enables frictionless multi-studio collaboration across modeling, rigging, layout, and lighting",
      "Scales effortlessly to gigantic worlds containing millions of unique assets",
      "First-class variants system allows instant switching of character costumes, props, or LODs"
    ],
    cons: [
      "Steep learning curve; requires understanding complex composition strength algorithms",
      "Massive C++ codebase footprint, making lightweight in-browser parsing challenging"
    ],
    snippetTitle: "USDA (Human-Readable ASCII USD Layer)",
    snippetLang: "text",
    snippetCode: `#usda 1.0
(
    defaultPrim = "HeroVehicle"
    metersPerUnit = 0.01
    upAxis = "Y"
)

def Xform "HeroVehicle" (
    prepend references = @./assets/vehicle_body.usdc@
)
{
    float3 xformOp:translate = (0, 150, 0)
    uniform token[] xformOpOrder = ["xformOp:translate"]
    
    over "Body" (
        prepend variantSets = "paintStyle"
    ) {
        variantSet "paintStyle" = {
            "MetallicRed" {
                color3f[] primvars:displayColor = [(0.9, 0.05, 0.05)]
            }
        }
    }
}`,
    diagramType: "3d",
    color: "#c084fc"
  },
  {
    id: "format-safetensors",
    name: "SafeTensors",
    extension: ".safetensors",
    title: "SafeTensors (Zero-Copy Secure AI Tensor Serialization)",
    mime: "application/octet-stream",
    magicBytes: "8-byte little-endian unsigned 64-bit integer header size prefix",
    year: 2022,
    category: "ai",
    paradigm: "Secure Memory-Mapped Neural Network Weight Storage",
    creator: "Nicolas Patry & Hugging Face",
    standard: "Hugging Face SafeTensors Open Specification",
    encoding: "UTF-8 JSON Header Dictionary + Contiguous IEEE Float Tensors",
    structure: "Indexed Tensor Key-Value Array with Byte Offsets and Data Types",
    schemaType: "Explicit DType (BF16, F16, F32, INT8) + Shape Tuple Definition",
    compression: "Uncompressed (Strictly optimized for direct OS mmap to GPU VRAM)",
    website: "https://github.com/huggingface/safetensors",
    description: "SafeTensors is the secure, high-performance successor to Python's pickle-based checkpoint formats (.pt, .bin, .ckpt). Created by Hugging Face, SafeTensors completely eliminates remote code execution (RCE) vulnerabilities by restricting the file to pure numeric tensor weights. It combines an 8-byte header size prefix and a JSON metadata table with contiguous binary buffers, enabling zero-copy OS memory mapping directly into GPU memory in milliseconds.",
    highlights: [
      "100% Code Injection Immune: Contains no executable code or arbitrary Python serialization routines, neutralizing malicious model poisoning attacks.",
      "Zero-Copy GPU Memory Mapping: Uses OS mmap to stream 70B parameter LLM weights into GPU VRAM in seconds with zero CPU deserialization bottleneck.",
      "Universal AI Ecosystem Standard: The default distribution format on Hugging Face Hub, Ollama, vLLM, and Stable Diffusion WebUI.",
      "Native Multi-Framework Support: First-class zero-overhead loading in PyTorch, JAX, TensorFlow, Rust Candle, and ONNX Runtime."
    ],
    primaryUseCase: "Distributing foundation model weights (Llama 3, Mistral, Stable Diffusion, DeepSeek, Whisper) across cloud and edge servers.",
    pros: [
      "Complete immunity to Arbitrary Code Execution (CVE-grade pickle exploits)",
      "Unmatched model loading speeds across distributed GPU clusters",
      "Explicit dtype and shape validation prevents silent data corruption during inference"
    ],
    cons: [
      "Strictly limited to numeric tensors; cannot store optimizer states or Python class graphs",
      "Uncompressed nature requires large raw disk storage footprints (e.g. 140GB for 70B FP16)"
    ],
    snippetTitle: "SafeTensors Physical Binary Architecture",
    snippetLang: "text",
    snippetCode: `[0x00..0x07]: uint64 Little-Endian (Header Size N, e.g. 0x0000000000000210 = 528 bytes)
[0x08..0x08+N]: UTF-8 JSON Header String:
{
  "__metadata__": {"format": "pt"},
  "transformer.layers.0.attn.q_proj.weight": {
    "dtype": "BF16",
    "shape": [4096, 4096],
    "data_offsets": [0, 33554432]
  }
}
[0x08+N..EOF]: Raw Contiguous Tensor Memory Buffer (Directly mmaped into GPU)`,
    diagramType: "ai",
    color: "#fb7185"
  },
  {
    id: "format-gguf",
    name: "GGUF",
    extension: ".gguf",
    title: "GGUF (GPT-Generated Unified Format)",
    mime: "application/octet-stream",
    magicBytes: "0x46554747 (ASCII 'GGUF' Little-Endian)",
    year: 2023,
    category: "ai",
    paradigm: "Self-Contained Edge AI Inference & Model Quantization",
    creator: "Georgi Gerganov & the llama.cpp Open Source Community",
    standard: "llama.cpp GGUF Specification v3",
    encoding: "Binary Key-Value Metadata Dictionary + Quantized Matrix Blocks",
    structure: "Extensible Metadata Header, Tokenizer Vocabularies, Quantized Tensors",
    schemaType: "Strong-Typed GGUF Metadata Types (UINT32, FLOAT32, STRING, ARRAY)",
    compression: "K-Quants (Q2_K, Q3_K, Q4_K_M, Q5_K_M, Q6_K, Q8_0) Integer Matrix Quantization",
    website: "https://github.com/ggerganov/llama.cpp",
    description: "GGUF (GPT-Generated Unified Format) is the universal file format powering local, private LLM execution on consumer laptops and edge devices. Engineered by the llama.cpp community, GGUF bundles everything required to run an LLM—quantized weights, hyperparameter limits, BPE tokenizer vocabularies, and chat prompt templates—into a single self-contained file. It revolutionized local AI by allowing 70-billion-parameter models to run on MacBook unified memory and consumer CPUs.",
    highlights: [
      "All-In-One Execution: Eliminates external tokenizer files, config.json, or python dependencies; a single .gguf file runs out of the box in Ollama or LM Studio.",
      "K-Quants Block Quantization: Compresses 16-bit floating point model weights down to 2, 4, or 5 bits per weight while maintaining remarkable perplexity and reasoning.",
      "Zero-Copy Direct mmap: Loads multi-gigabyte models into system RAM almost instantaneously.",
      "Native Apple Metal & Vulkan Acceleration: Engineered for seamless acceleration on Apple Silicon unified memory (M1/M2/M3/M4) and CPU vector instructions (AVX-512, ARM NEON)."
    ],
    primaryUseCase: "Running local AI models on personal computers, laptops, and edge hardware via Ollama, llama.cpp, Jan, and LM Studio.",
    pros: [
      "Permits running ChatGPT-grade models locally without GPU cloud costs or privacy leakage",
      "Single file simplicity makes downloading, sharing, and archiving AI models effortless",
      "Unmatched CPU and Apple Silicon memory bandwidth optimization"
    ],
    cons: [
      "Quantization causes slight degradation in nuanced mathematical and coding accuracy",
      "Primarily built for inference; not suited for backpropagation training or gradient updates"
    ],
    snippetTitle: "GGUF Binary Header & Metadata Format",
    snippetLang: "text",
    snippetCode: `[0x00..0x03]: 0x46554747 ('GGUF')
[0x04..0x07]: uint32 Version (3)
[0x08..0x0F]: uint64 Tensor Count (e.g. 291)
[0x10..0x17]: uint64 Metadata KV Count (e.g. 36)
--- Extensible Key-Value Metadata Entries ---
- "general.architecture"        -> STRING: "llama"
- "llama.context_length"        -> UINT32: 8192
- "tokenizer.ggml.tokens"       -> ARRAY[STRING]: ["<unk>", "<s>", "hello", ...]
--- Tensor Information Directory & Aligned Quantized Weights ---
- "blk.0.attn_q.weight"         -> GGML_TYPE_Q4_K_M [4096, 4096]`,
    diagramType: "ai",
    color: "#fb7185"
  },
  {
    id: "format-dicom",
    name: "DICOM",
    extension: ".dcm / .dicom",
    title: "DICOM (Digital Imaging and Communications in Medicine)",
    mime: "application/dicom",
    magicBytes: "0x4449434D ('DICM' ASCII at byte offset 128)",
    year: 1985,
    category: "media",
    paradigm: "Clinical Medical Imaging, Radiomics & Hospital PACS Archives",
    creator: "American College of Radiology (ACR) & NEMA",
    standard: "NEMA PS3.1-PS3.22 (DICOM Standard)",
    encoding: "Tagged Binary Elements with Explicit/Implicit Value Representations",
    structure: "128-byte Preamble + Tagged Elements + Multi-Frame Pixel Streams",
    schemaType: "Standard Tag Dictionary (Group, Element) + Transfer Syntaxes",
    compression: "Lossless JPEG, JPEG-LS, JPEG 2000, RLE, or Raw 16-bit Grayscale",
    website: "https://www.dicomstandard.org",
    description: "DICOM is the bedrock of modern medical diagnostics, deployed across every hospital, imaging clinic, and radiology department on Earth. Beyond merely storing images, DICOM is an all-encompassing information protocol binding high-bit-depth pixel data (CT, MRI, ultrasound, X-ray) with calibrated clinical metadata, physical 3D patient slice geometry, radiation dosage logs, and hospital administrative records.",
    highlights: [
      "Bound Clinical Context: Image pixels are inseparable from patient identifiers, scan protocols, and sensor calibration metrics, preventing medical misidentification.",
      "12-bit and 16-bit Clinical Bit Depth: Captures the full dynamic range of ionizing radiation and magnetic resonance sensors that standard 8-bit image formats crush.",
      "Volumetric 3D Stacks: Stores thousands of sequential CT/MRI slices with micrometer-level physical coordinate tags for 3D organ reconstruction and surgical planning.",
      "Universal PACS Interoperability: Seamlessly exchanges clinical scans across GE, Siemens, Philips, and open-source medical workstations (Horos, Orthanc)."
    ],
    primaryUseCase: "Diagnostic radiology (CT, MRI, PET scans), oncology radiation therapy planning, and clinical hospital PACS archives.",
    pros: [
      "Guarantees exact photometric and geometric calibration across heterogeneous medical scanners",
      "Universal adoption throughout worldwide healthcare infrastructure",
      "Native support for 16-bit raw pixel sensors and losslessly compressed volumetric series"
    ],
    cons: [
      "High risk of patient privacy (HIPAA) breaches if private vendor metadata tags are not scrubbed",
      "Baroque and massive specification (>5,000 pages) dating back to 1985"
    ],
    snippetTitle: "DICOM Binary Wire Header Structure",
    snippetLang: "text",
    snippetCode: `[0x00..0x7F]: 128-byte Preamble (Usually zero-filled)
[0x80..0x83]: 0x4449434D ('DICM' Magic Bytes)
--- Sequential Tagged Data Elements (Group, Element) ---
Tag (0010, 0010): VR=PN Len=14 Value="DOE^JOHN^^^^" (Patient Name)
Tag (0020, 000D): VR=UI Len=42 Value="1.2.840.113619.2.55..." (Study UID)
Tag (0028, 0010): VR=US Len=02 Value=512 (Rows)
Tag (0028, 0011): VR=US Len=02 Value=512 (Columns)
Tag (0028, 0100): VR=US Len=02 Value=16  (Bits Allocated = 16-bit Grayscale)
Tag (7FE0, 0010): VR=OW Len=524288 Value=[Raw CT Hounsfield Unit Sensor Pixels]`,
    diagramType: "media",
    color: "#f472b6"
  },
  {
    id: "format-fits",
    name: "FITS",
    extension: ".fits / .fit / .fts",
    title: "FITS (Flexible Image Transport System)",
    mime: "image/fits, application/fits",
    magicBytes: "ASCII string 'SIMPLE  = ' at byte offset 0",
    year: 1981,
    category: "scientific",
    paradigm: "Calibrated Astronomical Data, Radiotelescopy & Spectral Cubes",
    creator: "IAU (International Astronomical Union) & NASA FITS Office",
    standard: "IAU FITS Standard Version 4.0",
    encoding: "Human-Readable ASCII Header Cards (80 chars) + Big-Endian Arrays",
    structure: "Header & Data Units (HDUs) structured in fixed 2880-byte blocks",
    schemaType: "Standard Astronomical Keyword Cards (NAXIS, BITPIX, WCS)",
    compression: "Tiled image compression using Rice, GZIP, Hcompress, or PLIO",
    website: "https://fits.gsfc.nasa.gov",
    description: "FITS is the definitive data format of modern observational astronomy and astrophysics. Adopted under the legendary charter 'Once FITS, Always FITS', every major observatory—including the James Webb Space Telescope (JWST), Hubble Space Telescope, and ALMA radio array—archives its raw and processed observations in FITS. Files consist of 2880-byte blocks starting with human-readable ASCII keyword cards followed by raw multidimensional arrays of IEEE 754 floating point pixels.",
    highlights: [
      "40+ Years of Unbroken Compatibility: A FITS file written on magnetic tape in 1981 can still be opened and calibrated by modern astrophysics software today.",
      "World Coordinate System (WCS): Embeds celestial coordinates (Right Ascension, Declination) directly onto pixel grids with mathematical distortion models.",
      "True Scientific Dynamic Range: Stores uncompressed 32-bit and 64-bit IEEE floating-point flux measurements with zero quantization loss.",
      "Multi-Extension Support (MEF): Bundles calibrated science images, photometric error arrays, data quality masks, and spectral tables into a single file."
    ],
    primaryUseCase: "Archiving and analyzing deep space telescope imagery (JWST, Hubble), radio astronomy interferometry, and stellar spectroscopy.",
    pros: [
      "Standard archival format used by NASA, ESA, JAXA, and all global astrophysics institutions",
      "Native support for n-dimensional scientific hypercubes and calibrated coordinate systems",
      "ASCII headers can be inspected in standard terminal tools or text viewers"
    ],
    cons: [
      "Inherits punch-card era constraints (80-character card records and fixed 2880-byte padding)",
      "Strict big-endian requirement necessitates byte swapping on modern x86/ARM processors"
    ],
    snippetTitle: "FITS ASCII Header Card Block (JWST)",
    snippetLang: "text",
    snippetCode: `SIMPLE  =                    T / file conforms to FITS standard
BITPIX  =                  -32 / IEEE 32-bit floating point pixels
NAXIS   =                    2 / 2-dimensional image array
NAXIS1  =                 2048 / Fast axis pixel length
NAXIS2  =                 2048 / Slow axis pixel length
TELESCOP= 'JWST                ' / James Webb Space Telescope
INSTRUME= 'NIRCAM              ' / Near-Infrared Camera
CRVAL1  =        180.423750000 / Reference celestial RA (degrees)
CRVAL2  =        -18.864320000 / Reference celestial Dec (degrees)
BUNIT   = 'MJy/sr              ' / Physical flux units
END
[... 2880-byte padded boundary followed by 2048x2048 raw IEEE-754 floats ...]`,
    diagramType: "scientific",
    color: "#2dd4bf"
  },
  {
    id: "format-bam-vcf",
    name: "BAM / CRAM / VCF",
    extension: ".bam / .cram / .vcf.gz",
    title: "BAM / CRAM / VCF (Next-Gen Genomic Alignment & Variant Formats)",
    mime: "application/octet-stream",
    magicBytes: "0x1f8b (BGZF Gzip Block Header) / 'BAM\\1' Magic Bytes",
    year: 2009,
    category: "scientific",
    paradigm: "High-Throughput Next-Generation DNA Sequencing & Variant Genomics",
    creator: "Heng Li, 1000 Genomes Project & GA4GH Consortium",
    standard: "Global Alliance for Genomics and Health (GA4GH) Specification",
    encoding: "Binary BGZF (Blocked GNU Zip) Compressed Alignments & Variants",
    structure: "Coordinate-Sorted Alignment Records, CIGAR Strings, Phred Quality",
    schemaType: "Strong Tabular Alignment Spec + Coordinate Virtual Indexing",
    compression: "BGZF 64-KB Independent Blocks + Reference-Based Entropy Coding (CRAM)",
    website: "https://samtools.github.io/hts-specs/",
    description: "BAM (Binary Alignment Map), CRAM, and VCF (Variant Call Format) represent the technological computational backbone of modern genomics, precision medicine, and oncology. Rather than standard monolithic compression, genomic files utilize BGZF (Blocked GNU Zip), which splits streams into 64KB independently compressed blocks. Combined with companion index files (.bai or .tbi), bioinformaticians can query specific chromosome coordinates in milliseconds without reading multi-gigabyte files.",
    highlights: [
      "BGZF Virtual Offset Indexing: Enables constant-time indexed seeks into any gene or exon across 3 billion base pairs of human DNA.",
      "Reference-Based CRAM Compression: Replaces redundant reference genome sequences with differential delta calls, shrinking storage from 100GB down to 35GB.",
      "Standard Variant Call Format (VCF): Encodes single nucleotide polymorphisms (SNPs), insertions, deletions, and structural variants across entire human populations.",
      "CIGAR String Encoding: Compactly represents complex DNA alignments, insertions, deletions, and splicing junctions."
    ],
    primaryUseCase: "Whole genome sequencing (WGS), clinical cancer diagnostics, mRNA transcriptomics, and population genomics research.",
    pros: [
      "Enables interactive, sub-second genome browser navigation (IGV) over remote HTTP range requests",
      "Universal standard across Illumina, Oxford Nanopore, PacBio, and the Broad Institute",
      "Petabyte-scale compression efficiency with strict loss-less data integrity"
    ],
    cons: [
      "Requires generation and maintenance of separate index files (.bai, .tbi, .csi)",
      "BGZF decompression introduces substantial CPU overhead during bulk pipeline processing"
    ],
    snippetTitle: "VCF Record & Binary BAM Alignment",
    snippetLang: "text",
    snippetCode: `# VCF Variant Call Format (BGZF Compressed):
#CHROM  POS       ID          REF  ALT  QUAL  FILTER  INFO
chr1    14370     rs6054257   G    A    29    PASS    AF=0.5;DP=14;NS=3
chr1    17330     .           T    A    3     q10     AF=0.017;DP=11
# Binary BAM Sequence Alignment Record:
[refID: 0][pos: 14370][bin_mq_nl: 0x4B][flag_nc: 0x63][l_seq: 150]
[CIGAR String: 150M (150 Matches)]
[Sequence: 4-bit encoded nucleotide bases]
[Phred Quality Scores: ASCII offset 33]`,
    diagramType: "scientific",
    color: "#2dd4bf"
  },
  {
    id: "format-gpx-kml",
    name: "GPX / KML",
    extension: ".gpx / .kml / .kmz",
    title: "GPX & KML (GPS Exchange Format & Keyhole Markup Language)",
    mime: "application/gpx+xml, application/vnd.google-earth.kml+xml",
    magicBytes: "ASCII '<?xml' opening tag; 'PK\\x03\\x04' in KMZ zip containers",
    year: 2002,
    category: "geospatial",
    paradigm: "Consumer GPS Telemetry, Outdoor Tracking & 3D Earth Visualization",
    creator: "Topografix (GPX) / Keyhole Inc & Google / OGC (KML)",
    standard: "GPX 1.1 Schema / OGC KML 2.3 International Standard",
    encoding: "Human-Readable UTF-8 XML Markup (KMZ is a ZIP archive)",
    structure: "Waypoints, Track Segments, Time-Series Coordinate Vectors",
    schemaType: "Strict W3C XML Schema Definition (XSD)",
    compression: "Uncompressed XML for GPX/KML; Deflate ZIP archive for KMZ",
    website: "https://www.topografix.com/gpx.asp",
    description: "GPX and KML are the universal languages of personal navigation, fitness telemetry, and 3D globe visualization. GPX (GPS Exchange Format) is the global standard for GPS fitness watches, bike computers, and outdoor devices (Garmin, Strava, Apple Watch), recording time-ordered trackpoints with elevation and biometric sensors. KML (Keyhole Markup Language), originally developed for Keyhole and standardized by the Open Geospatial Consortium (OGC), specializes in rich 3D geographic styling, camera perspectives, and polygon rendering for Google Earth.",
    highlights: [
      "100% Outdoor Hardware Interoperability: Native export and import across Garmin, Wahoo, Suunto, Strava, Komoot, and AllTrails.",
      "Time-Stamped Sensor Telemetry: Captures latitude, longitude, and elevation alongside biometric sensor data (heart rate, cadence, wattage, temperature).",
      "Rich 3D Earth Overlays (KML/KMZ): Enables extruded 3D buildings, custom flight camera animations, and photographic map overlays in Google Earth.",
      "Pure Open Standards: Easily generated, parsed, and edited using standard XML parsers or simple Python scripts."
    ],
    primaryUseCase: "Garmin and Strava GPS outdoor tracks, drone flight mission logging, and interactive 3D spatial tours in Google Earth.",
    pros: [
      "Human-readable and universally supported across all consumer GPS devices and fitness apps",
      "Seamless integration with Google Earth, Google Maps, and Apple Maps",
      "KMZ bundles custom map icons, 3D collada models, and overlays into a single file"
    ],
    cons: [
      "XML verbosity results in 10x-20x file size bloat compared to binary formats like GeoPackage",
      "Lacks spatial indexing; finding nearby points requires full linear file scans"
    ],
    snippetTitle: "GPX GPS Telemetry Record (Garmin / Strava)",
    snippetLang: "xml",
    snippetCode: `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Garmin Edge 1040">
  <trk>
    <name>Chamonix Alpine Trail Climb</name>
    <trkseg>
      <trkpt lat="45.923700" lon="6.869400">
        <ele>1035.4</ele>
        <time>2026-06-15T06:30:00Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>145</gpxtpx:hr>
            <gpxtpx:cad>86</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
    </trkseg>
  </trk>
</gpx>`,
    diagramType: "geospatial",
    color: "#4ade80"
  },
  {
    id: "format-tar-zip",
    name: "TAR / ZIP / 7z",
    extension: ".tar.gz / .zip / .7z",
    title: "TAR / ZIP / 7z (POSIX Archive & Universal Compressed Containers)",
    mime: "application/zip, application/x-tar, application/x-7z-compressed",
    magicBytes: "0x504B0304 ('PK\\x03\\x04' in ZIP) / '7z\\xBC\\xAF\\x27\\x1C' in 7z",
    year: 1979,
    category: "archive",
    paradigm: "File Collection Bundling, Stream Archival & Container Packaging",
    creator: "AT&T UNIX (TAR, 1979) / Phil Katz (ZIP, 1989) / Igor Pavlov (7z, 1999)",
    standard: "POSIX tar (IEEE 1003.1) / PKWARE APPNOTE.TXT / 7z Spec",
    encoding: "Binary Header Structures with Deflate / LZMA / Zstandard Payloads",
    structure: "Sequential Blocks (TAR) vs Tail-Indexed Central Directory (ZIP)",
    schemaType: "Fixed Binary File Header Records & Attribute Masks",
    compression: "Deflate, Bzip2, LZMA, LZMA2, Zstandard",
    website: "https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT",
    description: "TAR and ZIP form the invisible foundation of computing, software deployment, and operating systems. TAR (Tape Archive) concatenates files sequentially into 512-byte blocks preserving POSIX file ownership and permissions, typically paired with gzip or zstd. ZIP revolutionized PC computing by placing a 'Central Directory' at the end of the archive, enabling random-access single-file extraction without decompressing the entire file. Modern application formats (DOCX, XLSX, APK, JAR) are internally standard ZIP files.",
    highlights: [
      "Universal Application Container: Underpins Java JARs, Android APKs, Google Chrome CRX extensions, and Microsoft Office .docx documents.",
      "Instant Random Extraction: ZIP's tail Central Directory allows extracting individual files over HTTP Range requests without reading earlier archive content.",
      "POSIX Metadata Preservation: TAR faithfully maintains UNIX UID, GID, symlinks, hardlinks, and file permissions across system deployments.",
      "7z Extreme Compression Ratios: Utilizes LZMA/LZMA2 solid compression and AES-256 encryption for maximum space reduction."
    ],
    primaryUseCase: "Software distribution (NPM, Debian .deb, Python wheels), OS backups, and document containers (DOCX, EPUB, APK).",
    pros: [
      "Ubiquitous operating system support across Windows, macOS, Linux, and embedded systems",
      "ZIP enables fast random access extraction of single files in $O(1)$ time",
      "TAR streams sequentially, making it ideal for pipe-based network backups"
    ],
    cons: [
      "TAR requires reading from byte 0 to find a file at the tail of the stream",
      "ZIP archive corruption occurs if a download terminates before the tail Central Directory finishes"
    ],
    snippetTitle: "ZIP Archive Physical Wire Layout",
    snippetLang: "text",
    snippetCode: `[0x00..Local File Header 1]: 0x04034B50 ('PK\\x03\\x04') [Compressed File Data 1]
[Offset..Local File Header 2]: 0x04034B50 ('PK\\x03\\x04') [Compressed File Data 2]
...
--- Central Directory (Located at Archive Tail) ---
[Central Directory Header 1]: 0x02014B50 -> Points to Local Header 1 offset
[Central Directory Header 2]: 0x02014B50 -> Points to Local Header 2 offset
--- End of Central Directory Record (EOCD) ---
[0x06054B50 ('PK\\x05\\x06')]
- uint16 Total Entries in Central Directory
- uint32 Size of Central Directory
- uint32 Offset of Central Directory starting position`,
    diagramType: "archive",
    color: "#f59e0b"
  },
  {
    id: "format-epub",
    name: "EPUB",
    extension: ".epub",
    title: "EPUB (Electronic Publication Reflowable Digital Book)",
    mime: "application/epub+zip",
    magicBytes: "0x504B0304 ('PK\\x03\\x04' ZIP magic) + 'mimetype' at offset 30",
    year: 2007,
    category: "archive",
    paradigm: "Semantic Reflowable Digital Typography & Structured E-Books",
    creator: "IDPF (International Digital Publishing Forum) & W3C",
    standard: "W3C EPUB 3.3 Recommendation",
    encoding: "Structured ZIP Container holding Semantic XHTML, CSS & MathML",
    structure: "mimetype header + META-INF container.xml + OPF Package Manifest",
    schemaType: "Strict Open Packaging Format (OPF) + W3C EPUB 3 Schemas",
    compression: "Standard ZIP Deflate (with uncompressed mimetype byte header)",
    website: "https://www.w3.org/TR/epub-33/",
    description: "EPUB is the universal open standard for digital e-books, adopted across Apple Books, Kobo, Google Play Books, and Amazon Kindle. Rather than imposing static paper pagination like PDF, EPUB packages an entire responsive, accessible website inside a ZIP archive. Text reflows dynamically across smartphone screens, e-ink displays, and desktop monitors according to user font size and screen geometry.",
    highlights: [
      "Dynamic Reflowable Typography: Text automatically adapts and reflows across screens of any size, resolution, or orientation.",
      "Pure Open Web Stack: Built entirely on semantic XHTML, CSS3, SVG, MathML, audio media overlays, and embedded OpenType fonts.",
      "Strict Container Specification: The very first file in the ZIP archive must be an uncompressed 'mimetype' file at fixed byte offset 38.",
      "Accessibility & Assistive Tech: First-class ARIA semantics, screen reader navigation landmarks, and synchronized text-to-speech audio overlays."
    ],
    primaryUseCase: "Commercial digital books, academic textbooks, screen-reader accessible literature, and digital comic books.",
    pros: [
      "Unmatched reading experience across e-ink readers, tablets, and phones",
      "Universal open ecosystem prevents publisher vendor lock-in",
      "Easily generated programmatically using standard HTML and CSS tooling"
    ],
    cons: [
      "CSS rendering support varies widely across low-powered e-ink devices",
      "Reflowable layout breaks static printed page number citations required in legal and academic contexts"
    ],
    snippetTitle: "EPUB Internal File System Architecture",
    snippetLang: "text",
    snippetCode: `book.epub (ZIP Container):
├── mimetype (Uncompressed: 'application/epub+zip' at offset 38)
├── META-INF/
│   └── container.xml (Points to root package document)
└── OEBPS/
    ├── content.opf   (Metadata, Manifest of items, Reading Spine order)
    ├── toc.xhtml     (Navigation Table of Contents)
    ├── styles/
    │   └── typography.css
    ├── text/
    │   ├── chapter01.xhtml
    │   └── chapter02.xhtml
    └── images/
        └── cover.jpg`,
    diagramType: "archive",
    color: "#f59e0b"
  }
];

// Helper to build card HTML
function buildCardHtml(fmt) {
  const imageSvgPath = `/images/data_formats/fmt_${fmt.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.svg`;
  return `
    <div class="fmt-card-inner">
      <div class="fmt-card-header">
        <div class="fmt-badge-group">
          <span class="fmt-category-pill cat-${fmt.category}">${fmt.category.toUpperCase()}</span>
          <span class="fmt-year-pill">${fmt.year}</span>
        </div>
        <div class="fmt-ext-badge">${fmt.extension}</div>
      </div>

      <div class="fmt-title-row">
        <h3 class="fmt-title">${fmt.title}</h3>
      </div>

      <p class="fmt-description">${fmt.description}</p>

      <div class="fmt-preview-box">
        <img alt="${fmt.title} Architecture Blueprint" class="fmt-preview-img gallery-zoomable" loading="lazy" src="${imageSvgPath}" data-zoom-src="${imageSvgPath}" data-zoom-title="${fmt.title}" data-zoom-meta="Year: ${fmt.year} • Extension: ${fmt.extension} • Category: ${fmt.category}" data-zoom-caption="${fmt.description}"/>
        <div class="fmt-preview-overlay">
          <span class="fmt-inspect-btn">
            <svg fill="none" height="14" stroke="currentColor" stroke-width="2" viewbox="0 0 24 24" width="14">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"></path>
            </svg>
            Click Blueprint to Enlarge
          </span>
        </div>
      </div>

      <div class="fmt-meta-grid">
        <div class="fmt-meta-item">
          <span class="fmt-meta-label">PARADIGM</span>
          <span class="fmt-meta-val">${fmt.paradigm}</span>
        </div>
        <div class="fmt-meta-item">
          <span class="fmt-meta-label">MIME TYPE</span>
          <span class="fmt-meta-val font-mono">${fmt.mime}</span>
        </div>
        <div class="fmt-meta-item">
          <span class="fmt-meta-label">MAGIC BYTES</span>
          <span class="fmt-meta-val font-mono">${fmt.magicBytes}</span>
        </div>
        <div class="fmt-meta-item">
          <span class="fmt-meta-label">SCHEMA MODEL</span>
          <span class="fmt-meta-val">${fmt.schemaType}</span>
        </div>
      </div>

      <div class="fmt-highlights-section">
        <h4 class="fmt-subheading">Architectural Highlights</h4>
        <ul class="fmt-highlights-list">
          ${fmt.highlights.map(h => `<li><span class="fmt-bullet">›</span> ${h}</li>`).join('')}
        </ul>
      </div>

      <div class="fmt-tradeoffs-grid">
        <div class="fmt-tradeoff-box fmt-pros-box">
          <h5 class="fmt-tradeoff-title">
            <svg fill="none" height="14" stroke="#10b981" stroke-width="2.5" viewbox="0 0 24 24" width="14">
              <path d="M5 13l4 4L19 7"></path>
            </svg>
            Superpowers
          </h5>
          <ul>
            ${fmt.pros.map(p => `<li>${p}</li>`).join('')}
          </ul>
        </div>
        <div class="fmt-tradeoff-box fmt-cons-box">
          <h5 class="fmt-tradeoff-title">
            <svg fill="none" height="14" stroke="#f43f5e" stroke-width="2.5" viewbox="0 0 24 24" width="14">
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Architectural Constraints
          </h5>
          <ul>
            ${fmt.cons.map(c => `<li>${c}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div class="fmt-accordion">
        <details class="fmt-details">
          <summary class="fmt-summary">
            <span>Inspect Wire / Syntax Representation</span>
            <svg class="fmt-chevron" fill="none" height="14" stroke="currentColor" stroke-width="2" viewbox="0 0 24 24" width="14">
              <path d="M19 9l-7 7-7-7"></path>
            </svg>
          </summary>
          <div class="fmt-code-wrapper">
            <div class="fmt-code-header">
              <span class="fmt-code-lang">${fmt.snippetLang.toUpperCase()}</span>
              <button class="fmt-copy-btn" onclick="navigator.clipboard.writeText(this.closest('.fmt-code-wrapper').querySelector('code').innerText); this.innerText='COPIED!'; setTimeout(()=>this.innerText='COPY', 1500);">COPY</button>
            </div>
            <pre class="fmt-pre"><code>${fmt.snippetCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
          </div>
        </details>
      </div>

      <div class="fmt-card-footer">
        <div class="fmt-usecase-tag">
          <span class="fmt-target-label">PRIMARY USE CASE:</span>
          <span>${fmt.primaryUseCase}</span>
        </div>
        <a class="fmt-spec-link" href="${fmt.website}" rel="noopener noreferrer" target="_blank">
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
}

// Convert new specs into full gallery item records
const newGalleryItems = new10Specs.map(fmt => {
  const imageSvgPath = `/images/data_formats/fmt_${fmt.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.svg`;
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
    html: buildCardHtml(fmt)
  };
});

const fullList = [...existingList, ...newGalleryItems];
fs.writeFileSync(jsonPath, JSON.stringify(fullList, null, 2), 'utf8');
console.log(`Successfully combined 50 uniform formats in ${jsonPath}!`);
