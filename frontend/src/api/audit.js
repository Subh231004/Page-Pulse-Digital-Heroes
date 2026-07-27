const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export class AuditApiError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "AuditApiError";
    this.code = code;
  }
}

export async function auditUrl(url) {
  const resp = await fetch(`${API_URL}/api/audit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  const body = await resp.json();

  if (!resp.ok) {
    const code = body?.error?.code || "UNKNOWN";
    const message = body?.error?.message || "An unexpected error occurred.";
    throw new AuditApiError(code, message);
  }

  return body;
}
