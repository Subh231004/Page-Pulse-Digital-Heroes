const ERROR_MESSAGES = {
  INVALID_URL: "Please enter a valid URL (e.g. https://example.com).",
  UNREACHABLE: "Could not reach that URL. Check the domain and try again.",
  TIMEOUT: "The page took too long to respond. Try again or use a faster site.",
  NON_HTML_RESPONSE: "That URL did not return an HTML page. Try a different URL.",
  INTERNAL_ERROR: "Something went wrong on our end. Please try again.",
};

export default function ErrorBanner({ error }) {
  const message = ERROR_MESSAGES[error.code] || error.message || "An unexpected error occurred.";

  return (
    <div
      className="w-full max-w-xl mx-auto flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-medium"
      style={{
        background: "rgba(254,202,202,0.85)",
        backdropFilter: "blur(6px)",
        border: "1px solid rgba(239,68,68,0.3)",
        color: "#991b1b",
      }}
    >
      <span className="text-lg">&#9888;</span>
      <span>{message}</span>
    </div>
  );
}
