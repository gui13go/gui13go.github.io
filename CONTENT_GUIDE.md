# Content Management & Local AI Integration Guide

This guide details how to add, manage, and extend content across your Vite + React + FastAPI monorepo (`/home/guigo/Documents/05-ghpages-gui13go`).

---

## 1. Client-Side Static Markdown Loading (Offline-First)

Because GitHub Pages hosts static assets, importing Markdown files directly into the frontend ensures your articles and tools remain readable even when your Mini PC is turned off.

### Structure the Content Folder
Create a `frontend/src/content/posts/` directory and add your Markdown files:

```bash
mkdir -p frontend/src/content/posts
```

### Add Frontmatter & Markdown Parsers
Install lightweight markdown and frontmatter parsers in `frontend`:

```bash
cd frontend
npm install gray-matter react-markdown remark-gfm rehype-highlight
```

### Import Markdown Using Vite Glob Imports
Vite supports eager/lazy raw glob imports out of the box:

```typescript
// frontend/src/utils/posts.ts
import matter from 'gray-matter';

// Loads all markdown files as raw strings at build time
const postFiles = import.meta.glob('../content/posts/**/*.md', { query: '?raw', import: 'default', eager: true });

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  content: string;
  tags?: string[];
}

export function getAllPosts(): BlogPost[] {
  return Object.entries(postFiles).map(([filepath, rawContent]) => {
    const { data, content } = matter(rawContent as string);
    const slug = filepath.split('/').pop()?.replace(/\.md$/, '') || '';
    return {
      slug,
      title: data.title || slug,
      date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
      tags: data.tags || [],
      content,
    };
  });
}
```

### Render Inside React Components
```tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function PostDetail({ post }: { post: BlogPost }) {
  return (
    <article className="prose prose-invert max-w-none">
      <h1>{post.title}</h1>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {post.content}
      </ReactMarkdown>
    </article>
  );
}
```

---

## 2. Serving via Local FastAPI Backend (Dynamic Content & RAG)

If you prefer keeping Markdown files centrally on your Mini PC or indexing them for Retrieval-Augmented Generation (RAG) with Ollama:

### Add Content Route in FastAPI (`backend/main.py`)
```python
import os
import frontmatter
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/posts", tags=["Posts"])
CONTENT_DIR = os.getenv("CONTENT_DIR", "/app/content")

@router.get("/")
async def list_posts():
    posts = []
    if not os.path.exists(CONTENT_DIR):
        return posts
    for root, _, files in os.walk(CONTENT_DIR):
        for f in files:
            if f.endswith(".md"):
                post = frontmatter.load(os.path.join(root, f))
                posts.append({
                    "slug": f[:-3],
                    "title": post.get("title", f[:-3]),
                    "date": str(post.get("date", "")),
                    "summary": post.get("summary", ""),
                    "tags": post.get("tags", [])
                })
    return sorted(posts, key=lambda x: x["date"], reverse=True)
```

### Hybrid Strategy
- **High Availability**: Keep static posts compiled on GitHub Pages for guaranteed uptime.
- **AI Intelligence**: Connect the Mini PC Ollama API (`/api/chat`) for local semantic search, question-answering, and code explanation directly from your documents.
