import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import UrlForm from "./UrlForm";

describe("UrlForm", () => {
  it("renders input and submit button", () => {
    render(<UrlForm onSubmit={() => {}} loading={false} />);
    expect(screen.getByPlaceholderText("https://example.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /audit/i })).toBeInTheDocument();
  });

  it("calls onSubmit with the entered URL", async () => {
    const onSubmit = vi.fn();
    render(<UrlForm onSubmit={onSubmit} loading={false} />);

    await userEvent.type(screen.getByPlaceholderText("https://example.com"), "https://example.com");
    await userEvent.click(screen.getByRole("button", { name: /audit/i }));

    expect(onSubmit).toHaveBeenCalledWith("https://example.com");
  });

  it("disables input and button while loading", () => {
    render(<UrlForm onSubmit={() => {}} loading={true} />);
    expect(screen.getByPlaceholderText("https://example.com")).toBeDisabled();
    expect(screen.getByRole("button", { name: /auditing/i })).toBeDisabled();
  });
});
