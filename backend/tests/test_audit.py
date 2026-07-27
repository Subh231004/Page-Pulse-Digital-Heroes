import os
from pathlib import Path

import httpx
import pytest
import respx
from fastapi.testclient import TestClient

from app.main import app
from app.audit import analyze_html
from app.errors import NON_HTML_RESPONSE

FIXTURES = Path(__file__).parent / "fixtures"


def read_fixture(name: str) -> str:
    return (FIXTURES / name).read_text(encoding="utf-8")


class TestAnalyzeHtml:
    """Pure-function unit tests for analyze_html."""

    def test_happy_path(self):
        html = read_fixture("valid.html")
        result = analyze_html(html, "https://example.com", 200, 123)

        assert result["url"] == "https://example.com"
        assert result["status"] == 200
        assert result["response_time_ms"] == 123
        assert result["title"] == "Test Page Title"
        assert result["meta_description"] == "A test meta description for the page."
        assert result["h1_count"] == 2
        assert result["h2_count"] == 2
        assert result["h3_count"] == 1
        assert result["total_images"] == 3
        assert result["images_missing_alt"] == 2
        assert result["link_count"] == 3
        assert result["paragraph_count"] == 3
        assert result["list_count"] == 2
        assert result["word_count"] > 0
        assert result["has_meta_viewport"] is True
        assert result["has_canonical"] is True
        assert result["og_title"] == "OG Test Title"
        assert result["og_description"] == "OG test description."
        assert result["og_image"] == "https://example.com/og.jpg"

    def test_missing_title_and_meta(self):
        html = read_fixture("missing_meta.html")
        result = analyze_html(html, "https://example.com", 200, 50)

        assert result["title"] == "No Meta Desc"
        assert result["meta_description"] is None
        assert result["og_title"] is None
        assert result["og_description"] is None
        assert result["og_image"] is None
        assert result["has_meta_viewport"] is False
        assert result["has_canonical"] is False

    def test_images_missing_alt(self):
        """alt='' and no alt attribute both count as missing."""
        html = read_fixture("valid.html")
        result = analyze_html(html, "https://example.com", 200, 0)
        assert result["total_images"] == 3
        assert result["images_missing_alt"] == 2

    def test_malformed_html_does_not_crash(self):
        html = read_fixture("malformed.html")
        result = analyze_html(html, "https://example.com", 200, 0)
        assert result["title"] is not None
        assert result["h1_count"] >= 1
        assert result["h2_count"] >= 1


class TestIntegration:
    """Integration tests via TestClient with respx-mocked httpx calls."""

    client = TestClient(app)

    @respx.mock
    def test_happy_path_integration(self):
        html = read_fixture("valid.html")
        respx.get("https://example.com").mock(
            return_value=httpx.Response(200, text=html, headers={"content-type": "text/html"})
        )

        resp = self.client.post("/api/audit", json={"url": "https://example.com"})
        assert resp.status_code == 200
        data = resp.json()
        assert data["title"] == "Test Page Title"
        assert data["status"] == 200
        assert data["h1_count"] == 2
        assert data["h2_count"] == 2
        assert data["h3_count"] == 1
        assert data["total_images"] == 3
        assert data["images_missing_alt"] == 2
        assert data["link_count"] == 3
        assert data["paragraph_count"] == 3
        assert data["list_count"] == 2
        assert data["has_meta_viewport"] is True
        assert data["has_canonical"] is True
        assert data["og_title"] == "OG Test Title"

    @respx.mock
    def test_non_html_raises_error(self):
        respx.get("https://example.com/data.json").mock(
            return_value=httpx.Response(200, text='{"ok": true}', headers={"content-type": "application/json"})
        )

        resp = self.client.post("/api/audit", json={"url": "https://example.com/data.json"})
        assert resp.status_code == 415
        data = resp.json()
        assert data["error"]["code"] == "NON_HTML_RESPONSE"

    @respx.mock
    def test_timeout_returns_504(self):
        respx.get("https://slow.example.com").mock(side_effect=httpx.TimeoutException("timeout"))

        resp = self.client.post("/api/audit", json={"url": "https://slow.example.com"})
        assert resp.status_code == 504
        data = resp.json()
        assert data["error"]["code"] == "TIMEOUT"

    @respx.mock
    def test_unreachable_returns_502(self):
        respx.get("https://bad.example.com").mock(side_effect=httpx.ConnectError("DNS failure"))

        resp = self.client.post("/api/audit", json={"url": "https://bad.example.com"})
        assert resp.status_code == 502
        data = resp.json()
        assert data["error"]["code"] == "UNREACHABLE"

    def test_malformed_url_returns_400(self):
        resp = self.client.post("/api/audit", json={"url": "not-a-valid-url"})
        assert resp.status_code == 400
        data = resp.json()
        assert data["error"]["code"] == "INVALID_URL"
