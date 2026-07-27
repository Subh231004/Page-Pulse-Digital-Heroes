function Section({ title, children }) {
  return (
    <div className="mb-4">
      <h3 className="text-xs font-bold uppercase tracking-widest mb-2.5" style={{ color: "rgba(25,40,55,0.5)" }}>
        {title}
      </h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="flex justify-between py-1.5 border-b last:border-b-0" style={{ borderColor: "rgba(25,40,55,0.06)" }}>
      <span className="font-medium text-sm" style={{ color: "rgba(25,40,55,0.75)" }}>{label}</span>
      <span className="text-sm font-mono" style={{ color: "var(--color-text)" }}>{value ?? "\u2014"}</span>
    </div>
  );
}

function BoolField({ label, value }) {
  return (
    <Field label={label} value={value ? "\u2705 Yes" : "\u274C No"} />
  );
}

export default function ReportCard({ report }) {
  return (
    <div
      className="w-full max-w-xl mx-auto rounded-2xl px-6 py-5 space-y-5"
      style={{
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.3)",
        boxShadow: "0 8px 32px rgba(25,40,55,0.12)",
      }}
    >
      <p className="text-xs break-all" style={{ color: "rgba(25,40,55,0.5)" }}>{report.url}</p>

      <Section title="Performance">
        <Field label="HTTP Status" value={report.status} />
        <Field label="Response Time" value={`${report.response_time_ms} ms`} />
      </Section>

      <Section title="Content">
        <Field label="Page Title" value={report.title} />
        <Field label="Meta Description" value={report.meta_description} />
        <Field label="Word Count" value={report.word_count} />
        <Field label="Paragraphs" value={report.paragraph_count} />
        <Field label="Links" value={report.link_count} />
      </Section>

      <Section title="Heading Structure">
        <Field label="H1" value={report.h1_count} />
        <Field label="H2" value={report.h2_count} />
        <Field label="H3" value={report.h3_count} />
      </Section>

      <Section title="Accessibility">
        <Field label="Total Images" value={report.total_images} />
        <Field label="Missing Alt Text" value={report.images_missing_alt} />
        <Field label="Lists" value={report.list_count} />
      </Section>

      <Section title="SEO / Meta">
        <BoolField label="Viewport Meta" value={report.has_meta_viewport} />
        <BoolField label="Canonical URL" value={report.has_canonical} />
        <Field label="OG Title" value={report.og_title} />
        <Field label="OG Description" value={report.og_description} />
        <Field label="OG Image" value={report.og_image} />
      </Section>
    </div>
  );
}
