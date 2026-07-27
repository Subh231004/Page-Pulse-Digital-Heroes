# Page Pulse

[![Loom Demo](https://cdn.loom.com/sessions/thumbnails/ba89aecde7fb48b29066c40ce0790e2c-0001.jpg)](https://www.loom.com/share/ba89aecde7fb48b29066c40ce0790e2c)

A two-service web tool that audits any public URL and returns a structured content/SEO health report — HTTP status, response time, page title, meta description, heading hierarchy, image accessibility, link/paragraph counts, Open Graph metadata, and more.

- **Frontend**: React (Vite) SPA with Tailwind CSS, Framer Motion animations, Lucide React icons — deployed to Vercel
- **Backend**: FastAPI + BeautifulSoup, deployed to Render
- **Live app**: [frontend-eight-gilt-78.vercel.app](https://frontend-eight-gilt-78.vercel.app)
- **API**: [page-pulse-digital-heroes-swo4.onrender.com](https://page-pulse-digital-heroes-swo4.onrender.com/docs)

---

## Local Setup

### Prerequisites

- Python 3.11+
- Node.js 18+

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate      # Windows
source .venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API is now running at `http://localhost:8000`. OpenAPI docs at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The SPA is now running at `http://localhost:5173` (use `-- --port <port>` if occupied).

### Environment Variables

| Variable        | Required | Default                  | Description                                  |
|-----------------|----------|--------------------------|----------------------------------------------|
| `VITE_API_URL`  | Frontend | `http://localhost:8000`  | Backend API base URL                         |
| `FRONTEND_URL`  | Backend  | `*` (all origins)        | CORS origin (comma-separated for production) |

---

## API Contract

### `POST /api/audit`

**Request**

```json
{ "url": "https://example.com" }
```

**Success (200)**

```json
{
  "url": "https://example.com",
  "status": 200,
  "response_time_ms": 268,
  "title": "Example Domain",
  "meta_description": null,
  "h1_count": 1,
  "h2_count": 0,
  "h3_count": 0,
  "total_images": 0,
  "images_missing_alt": 0,
  "link_count": 1,
  "paragraph_count": 1,
  "list_count": 0,
  "word_count": 21,
  "has_meta_viewport": true,
  "has_canonical": false,
  "og_title": null,
  "og_description": null,
  "og_image": null
}
```

**Error shape**

```json
{ "error": { "code": "TIMEOUT", "message": "The page took too long to respond." } }
```

| Scenario               | Code                | HTTP Status |
|------------------------|---------------------|-------------|
| Malformed/missing URL  | `INVALID_URL`       | 400         |
| DNS/connection failure | `UNREACHABLE`       | 502         |
| Request timeout (8s)   | `TIMEOUT`           | 504         |
| Redirect loop          | `UNREACHABLE`       | 502         |
| Non-HTML Content-Type  | `NON_HTML_RESPONSE` | 415         |
| Internal parse error   | `INTERNAL_ERROR`    | 500         |
| Target 4xx/5xx         | n/a — carried in `status` field | 200 |

---

## Tests

### Backend (pytest)

```bash
cd backend
pytest -v
```

9 tests covering: happy path with full fields, missing title/meta, image alt counting, malformed HTML, integration with mocked HTTP requests (timeout, unreachable, non-HTML, invalid URL).

### Frontend (Vitest)

```bash
cd frontend
npm test
```

7 tests covering: UrlForm rendering/submit/loading states, ReportCard section rendering/data display/null handling/boolean fields.

---

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app, routes, CORS, exception handlers
│   │   ├── schemas.py       # Pydantic request/response models
│   │   ├── errors.py        # AuditError hierarchy with codes
│   │   └── audit.py         # fetch_page + analyze_html logic
│   ├── tests/
│   │   └── test_audit.py    # Unit + integration tests
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/audit.js     # Centralized fetch wrapper
│   │   ├── components/
│   │   │   ├── UrlForm.jsx  # URL input + submit button
│   │   │   ├── ReportCard.jsx # Structured report display
│   │   │   └── ErrorBanner.jsx # Error code to message mapping
│   │   ├── App.jsx          # State machine + video background
│   │   └── index.css        # Tailwind + fonts + CSS variables
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

---

## Design Decisions

### 1. Separate services over monolith

Splitting frontend and backend into independently deployed services mirrors a realistic production architecture. It forces explicit API contracts, CORS awareness, and independent deployability — all skills relevant to real-world development.

### 2. Tailwind + Framer Motion for UI

Tailwind CSS provides utility-first styling with zero runtime overhead via PurgeCSS. Framer Motion handles the loading/success animation transitions declaratively. Lucide icons are tree-shakeable SVG components. Together they produce a polished UI with minimal hand-written CSS.

### 3. httpx async over sync requests

Using `httpx.AsyncClient` with FastAPI's async handler avoids blocking the event loop during HTTP fetch. The 8s timeout prevents hanging. BeautifulSoup parsing remains synchronous since it is negligible (<50ms for typical pages).

---

## Known Limitations

- **No JS-rendered page support**: The tool fetches raw HTML only. SPAs that render content via JavaScript will show incomplete results.
- **No rate limiting**: The endpoint is unprotected in this scope.
- **No caching**: Each audit fetches the page fresh.

---

## Deployment

### Backend (Render)

1. Create a new **Web Service** on Render
2. Set root directory to `backend`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add `FRONTEND_URL` env var set to your deployed frontend URL

### Frontend (Vercel)

1. Import the `frontend/` directory as a new project on Vercel
2. Set `VITE_API_URL` to your deployed Render backend URL
3. Deploy — Vercel auto-detects Vite

---

Built for Digital Heroes Training Task.
