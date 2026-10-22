import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PrivacyPage from "@/app/privacy/page";
import { SECTIONS, SUPPORT_EMAIL } from "@/app/privacy/content";
import { SUPPORT_EMAIL as BRAND_SUPPORT_EMAIL } from "@/lib/brand";

describe("Privacy page", () => {
  it("renders every section, with an anchor the contents list can reach", () => {
    const { container } = render(<PrivacyPage />);
    for (const section of SECTIONS) {
      expect(container.querySelector(`#${section.id}`)).not.toBeNull();
      expect(screen.getAllByText(section.title).length).toBeGreaterThan(0);
    }
  });

  it("gives every contents entry a target that exists", () => {
    const { container } = render(<PrivacyPage />);
    const hrefs = Array.from(container.querySelectorAll('nav a[href^="#"]')).map((a) =>
      a.getAttribute("href")!.slice(1)
    );
    expect(hrefs).toHaveLength(SECTIONS.length);
    for (const id of hrefs) expect(container.querySelector(`#${id}`)).not.toBeNull();
  });

  it("offers a way to reach us about it", () => {
    render(<PrivacyPage />);
    expect(screen.getByRole("link", { name: SUPPORT_EMAIL })).toHaveAttribute(
      "href",
      `mailto:${SUPPORT_EMAIL}`
    );
  });

  // The app runs no analytics or session recording, so the policy must not
  // claim a vendor for either.
  it("names no analytics or session recording provider", () => {
    const { container } = render(<PrivacyPage />);
    expect(container.textContent).not.toMatch(/mixpanel|clarity|session replay/i);
  });
});

// The privacy page's contact address is the brand's one support inbox, not
// a copy that can drift from it.
it("reaches support at the brand's support address", () => {
  expect(SUPPORT_EMAIL).toBe(BRAND_SUPPORT_EMAIL);
});
