# Gui13go Monorepo: GitHub Pages Edge + Local Mini PC AI Gateway

A resilient, hybrid split-architecture portfolio & systems engineering platform:
1. **Frontend (`frontend/`)**: Static SPA built with **Vite 8 + React 19 + TypeScript**, deployed via **GitHub Pages**.
2. **Backend (`backend/`)**: Asynchronous gateway built with **FastAPI + SlowAPI + Ollama**, self-hosted on a private Linux Mini PC behind an encrypted **Cloudflare Tunnel**.

---

## Project Structure

```
05-ghpages-gui13go/
├── .github/
│   └── workflows/
│       └── deploy.yml              # Automated GitHub Pages CI/CD pipeline
├── backend/
│   ├── .env.example                # Tunnel token & Ollama settings
│   ├── Dockerfile                  # Containerized Python 3.11 runtime
│   ├── docker-compose.yml          # Orchestrates FastAPI & cloudflared
│   ├── main.py                     # FastAPI gateway, CORS, SSE streaming, rate limiting
│   └── requirements.txt            # Python dependencies
├── frontend/
│   ├── .env.development           # Local dev endpoint (http://localhost:8000)
│   ├── .env.production            # Cloudflare Tunnel endpoint (https://api.gui13go.dev)
│   ├── src/
│   │   ├── components/             # Header, Footer, Layout, OfflineBanner
│   │   ├── config/                 # Dynamic base URL and model constants
│   │   ├── hooks/                  # useBackendHealth (30s poll), useStreamingChat (SSE)
│   │   ├── pages/                  # HomePage, ChatPage, StatusPage, StaticPage, DynamicItemPage
│   │   ├── types/                  # API and messaging types
│   │   ├── App.tsx                 # Route registration & QueryClientProvider
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts              # Configured base path & styling plugins
├── CONTENT_GUIDE.md                # Content addition & Markdown guide
└── README.md
```

---

## 1. Local Mini PC Setup (Backend)

### Prerequisites
- Docker & Docker Compose
- [Ollama](https://ollama.ai) installed and running:
  ```bash
  ollama serve
  ollama pull llama3.2:latest
  ```

### Start the Gateway & Cloudflare Tunnel
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Copy environment template and configure your Cloudflare Tunnel Token:
   ```bash
   cp .env.example .env
   # Edit .env with your TUNNEL_TOKEN from Cloudflare Zero Trust
   ```
3. Start the containers:
   ```bash
   docker compose up -d
   ```
4. Verify health locally:
   ```bash
   curl http://localhost:8000/health
   ```

---

## 2. Frontend Development & Build

### Running Locally
```bash
cd frontend
npm install
npm run dev
```

### Building for GitHub Pages
```bash
npm run build
```

---

## 3. GitHub Pages Deployment

The automated pipeline at [.github/workflows/deploy.yml](.github/workflows/deploy.yml) automatically:
1. Builds the static React SPA on push to `main`.
2. Copies `dist/index.html` to `dist/404.html` for single-page client routing fallback.
3. Deploys using official GitHub Pages actions.
