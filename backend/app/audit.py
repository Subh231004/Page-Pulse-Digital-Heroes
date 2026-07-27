import httpx
from bs4 import BeautifulSoup

from .errors import UNREACHABLE, TIMEOUT, NON_HTML_RESPONSE, INTERNAL_ERROR

FETCH_TIMEOUT = 8.0


async def fetch_page(url: str) -> tuple[str, int, int]:
    try:
        async with httpx.AsyncClient(timeout=FETCH_TIMEOUT, follow_redirects=True) as client:
            response = await client.get(url)
            elapsed = int(response.elapsed.total_seconds() * 1000)
    except httpx.TimeoutException:
        raise TIMEOUT
    except (httpx.ConnectError, httpx.TooManyRedirects):
        raise UNREACHABLE
    except Exception:
        raise UNREACHABLE

    content_type = response.headers.get("content-type", "")
    if "text/html" not in content_type:
        raise NON_HTML_RESPONSE

    return response.text, response.status_code, elapsed


def analyze_html(html: str, url: str, status: int, elapsed_ms: int) -> dict:
    try:
        soup = BeautifulSoup(html, "html.parser")
    except Exception:
        raise INTERNAL_ERROR

    title_tag = soup.find("title")
    title = title_tag.get_text(strip=True) if title_tag else None

    meta_tag = soup.find("meta", attrs={"name": "description"})
    meta_description = meta_tag.get("content", "").strip() or None if meta_tag else None

    h1_count = len(soup.find_all("h1"))
    h2_count = len(soup.find_all("h2"))
    h3_count = len(soup.find_all("h3"))

    images = soup.find_all("img")
    total_images = len(images)
    images_missing_alt = sum(
        1 for img in images if not img.get("alt") or img.get("alt").strip() == ""
    )

    link_count = len(soup.find_all("a"))
    paragraph_count = len(soup.find_all("p"))
    list_count = len(soup.find_all(["ul", "ol"]))

    has_meta_viewport = soup.find("meta", attrs={"name": "viewport"}) is not None
    has_canonical = soup.find("link", attrs={"rel": "canonical"}) is not None

    og_title = og_desc = og_image = None
    for meta in soup.find_all("meta"):
        prop = (meta.get("property") or "").lower()
        if prop == "og:title":
            og_title = meta.get("content", "").strip() or None
        elif prop == "og:description":
            og_desc = meta.get("content", "").strip() or None
        elif prop == "og:image":
            og_image = meta.get("content", "").strip() or None

    for tag in soup(["script", "style", "nav", "header", "footer"]):
        tag.decompose()

    body_text = soup.get_text(separator=" ", strip=True)
    word_count = len(body_text.split())

    return {
        "url": url,
        "status": status,
        "response_time_ms": elapsed_ms,
        "title": title,
        "meta_description": meta_description,
        "h1_count": h1_count,
        "h2_count": h2_count,
        "h3_count": h3_count,
        "total_images": total_images,
        "images_missing_alt": images_missing_alt,
        "link_count": link_count,
        "paragraph_count": paragraph_count,
        "list_count": list_count,
        "word_count": word_count,
        "has_meta_viewport": has_meta_viewport,
        "has_canonical": has_canonical,
        "og_title": og_title,
        "og_description": og_desc,
        "og_image": og_image,
    }
