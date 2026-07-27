import { useState } from "react";

export default function UrlForm({ onSubmit, loading }) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim() && !loading) {
      onSubmit(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full max-w-xl mx-auto">
      <input
        type="text"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        disabled={loading}
        className="flex-1 px-5 py-3.5 rounded-full text-sm outline-none transition-shadow"
        style={{
          border: "2px solid rgba(25,40,55,0.15)",
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(6px)",
          color: "var(--color-text)",
          fontFamily: "var(--font-body)",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#7342E2")}
        onBlur={(e) => (e.target.style.borderColor = "rgba(25,40,55,0.15)")}
      />
      <button
        type="submit"
        disabled={loading || !url.trim()}
        className="px-6 py-3.5 rounded-full text-sm font-semibold text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: "#7342E2", boxShadow: "0 4px 24px rgba(115,66,226,0.28)" }}
        onMouseEnter={(e) => {
          if (!e.currentTarget.disabled) {
            e.currentTarget.style.transform = "scale(1.04)";
            e.currentTarget.style.filter = "brightness(1.1)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.filter = "brightness(1)";
        }}
      >
        {loading ? "Auditing..." : "Audit"}
      </button>
    </form>
  );
}
