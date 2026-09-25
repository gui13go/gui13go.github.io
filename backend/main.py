"""
FastAPI Local AI Gateway & Status Service
Designed for self-hosted execution on Linux Mini PC behind Cloudflare Tunnel.
Connects to local Ollama (OpenAI-compatible endpoints) and streams SSE responses.
"""

import os
import time
import json
import logging
from typing import List, Optional
import httpx
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel, Field
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("backend-gateway")

# Environment & Settings
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434")
DEFAULT_MODEL = os.getenv("DEFAULT_MODEL", "llama3.2:latest")
ALLOWED_ORIGINS_RAW = os.getenv(
    "ALLOWED_ORIGINS",
    "https://gui13go.github.io,http://localhost:5173,http://127.0.0.1:5173"
)
ALLOWED_ORIGINS = [orig.strip() for orig in ALLOWED_ORIGINS_RAW.split(",") if orig.strip()]

# In-Memory Rate Limiting
limiter = Limiter(key_func=get_remote_address, default_limits=["120/minute"])

app = FastAPI(
    title="Gui13go Local AI Gateway",
    description="Edge-facing self-hosted gateway connecting GitHub Pages to Mini PC Ollama node.",
    version="1.0.0"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"https://.*\.github\.io",
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


class ChatMessage(BaseModel):
    role: str = Field(..., description="'system', 'user', or 'assistant'")
    content: str = Field(..., description="Message text content")


class ChatRequest(BaseModel):
    model: Optional[str] = Field(default=None, description="Ollama model identifier")
    messages: List[ChatMessage]
    temperature: Optional[float] = Field(default=0.7, ge=0.0, le=2.0)
    stream: Optional[bool] = Field(default=True)


@app.get("/health", tags=["System"])
@limiter.limit("60/minute")
async def health_check(request: Request):
    """
    Fast, lightweight, non-blocking health check.
    Probes local Ollama connectivity to report inference engine state.
    """
    ollama_ready = False
    models_available = []

    try:
        async with httpx.AsyncClient(timeout=2.0) as client:
            resp = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            if resp.status_code == 200:
                ollama_ready = True
                data = resp.json()
                models_available = [m.get("name") for m in data.get("models", [])]
    except Exception as exc:
        logger.warning(f"Ollama health probe warning: {exc}")
        ollama_ready = False

    return {
        "status": "ok",
        "service": "gui13go-mini-pc-gateway",
        "gpu": True,
        "ollama_connected": ollama_ready,
        "models": models_available,
        "timestamp": time.time()
    }


async def stream_ollama_generator(request_payload: dict, selected_model: str):
    """
    Streams OpenAI-compatible chat chunks from Ollama via SSE.
    Handles network errors and Ollama cold-starts gracefully.
    """
    target_url = f"{OLLAMA_BASE_URL}/v1/chat/completions"

    payload = {
        "model": selected_model,
        "messages": request_payload["messages"],
        "temperature": request_payload.get("temperature", 0.7),
        "stream": True
    }

    try:
        # 120s timeout allows for model weights loading into GPU memory on cold starts
        async with httpx.AsyncClient(timeout=httpx.Timeout(connect=10.0, read=120.0, write=10.0, pool=10.0)) as client:
            async with client.stream("POST", target_url, json=payload, headers={"Content-Type": "application/json"}) as response:
                if response.status_code != 200:
                    err_body = await response.aread()
                    error_msg = f"Ollama error ({response.status_code}): {err_body.decode('utf-8', errors='ignore')}"
                    logger.error(error_msg)
                    yield f"event: error\ndata: {json.dumps({'error': error_msg})}\n\n"
                    return

                async for chunk in response.aiter_lines():
                    if not chunk:
                        continue
                    # Ollama streaming returns 'data: {...}'
                    if chunk.startswith("data:"):
                        yield f"{chunk}\n\n"
                        if "[DONE]" in chunk:
                            break
                    else:
                        yield f"data: {chunk}\n\n"

    except httpx.ConnectError:
        err_msg = "Could not connect to Ollama on http://127.0.0.1:11434. Is Ollama daemon running on your Mini PC?"
        logger.error(err_msg)
        yield f"event: error\ndata: {json.dumps({'error': err_msg})}\n\n"
    except httpx.ReadTimeout:
        err_msg = "Inference timed out. The local model might still be loading into GPU/VRAM."
        logger.error(err_msg)
        yield f"event: error\ndata: {json.dumps({'error': err_msg})}\n\n"
    except Exception as e:
        err_msg = f"Unexpected gateway streaming failure: {str(e)}"
        logger.exception(err_msg)
        yield f"event: error\ndata: {json.dumps({'error': err_msg})}\n\n"


@app.post("/api/chat", tags=["Inference"])
@limiter.limit("20/minute")
async def chat_endpoint(chat_req: ChatRequest, request: Request):
    """
    Accepts conversation history and streams LLM output using Server-Sent Events (SSE).
    """
    selected_model = chat_req.model or DEFAULT_MODEL
    logger.info(f"Incoming chat request for model '{selected_model}' with {len(chat_req.messages)} messages.")

    return StreamingResponse(
        stream_ollama_generator(chat_req.model_dump(), selected_model),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
