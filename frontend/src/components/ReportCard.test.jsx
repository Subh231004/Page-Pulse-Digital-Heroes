import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ReportCard from "./ReportCard";

const sampleReport = {
  url: "https://example.com",
  status: 200,
  response_time_ms: 342,
  title: "Example Domain",
  meta_description: "A test description.",
  h1_count: 2,
  h2_count: 2,
  h3_count: 0,
  total_images: 3,
  images_missing_alt: 1,
  link_count: 5,
  paragraph_count: 3,
  list_count: 1,
  word_count: 187,
  has_meta_viewport: true,
  has_canonical: false,
  og_title: null,
  og_description: null,
  og_image: null,
};

describe("ReportCard", () => {
  it("renders all grouped sections", () => {
    render(<ReportCard report={sampleReport} />);
    expect(screen.getByText("Performance")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByText("Heading Structure")).toBeInTheDocument();
    expect(screen.getByText("Accessibility")).toBeInTheDocument();
    expect(screen.getByText("SEO / Meta")).toBeInTheDocument();
  });

  it("renders report data", () => {
    render(<ReportCard report={sampleReport} />);
    expect(screen.getByText("https://example.com")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();
    expect(screen.getByText("342 ms")).toBeInTheDocument();
    expect(screen.getByText("Example Domain")).toBeInTheDocument();
    expect(screen.getAllByText("2")).toHaveLength(2);
    expect(screen.getByText("187")).toBeInTheDocument();
  });

  it("renders em dash for null values", () => {
    const nullReport = { ...sampleReport, title: null, meta_description: null };
    render(<ReportCard report={nullReport} />);
    expect(screen.getAllByText("\u2014").length).toBeGreaterThanOrEqual(2);
  });

  it("renders boolean fields with emoji", () => {
    render(<ReportCard report={sampleReport} />);
    expect(screen.getByText(/Yes/)).toBeInTheDocument();
    expect(screen.getByText(/No/)).toBeInTheDocument();
  });
});
