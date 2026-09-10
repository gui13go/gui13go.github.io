# Guilherme Viegas - Blog & Technical Notes

Personal technical website and engineering blog hosted on GitHub Pages: [gui13go.github.io](https://gui13go.github.io/)

Covering GNU/Linux kernel, virtualization, low-level systems, cybersecurity architectures, and cloud infrastructure.

---

## 🚀 Quick Commands for Managing Posts

### 1. Create a New Post
To scaffold a new blog post with pre-configured frontmatter, run:
```bash
hugo new content posts/my-new-post.md
```

### 2. Preview Locally
Run Hugo's development server with hot-reload:
```bash
hugo server -p 1313
```
Then open `http://localhost:1313/` in your browser.

### 3. Add Cover Images
Place your images in `static/images/` and reference them in your post's frontmatter:
```yaml
cover:
  image: "/images/your-cover-image.png"
  alt: "Descriptive alt text"
```

### 4. Publish to GitHub Pages
Commit and push to `main`:
```bash
git add .
git commit -m "Add new post: My New Post"
git push origin main
```
The automated GitHub Actions workflow will build and deploy your site in ~30 seconds.
