import { describe, expect, it } from "vitest";
import { attachmentDisplayUrl } from "./attachmentDisplayUrl";

describe("attachmentDisplayUrl", () => {
  it("routes absolute attachment URLs through the backend without tokens", () => {
    const result = attachmentDisplayUrl(
      "https://example.test/attachments/1?f=json&token=secret"
    );
    expect(result).toContain("http://localhost:5000/api/arcgis/proxy?url=");
    expect(decodeURIComponent(result)).toContain(
      "https://example.test/attachments/1?f=json"
    );
    expect(result).not.toContain("secret");
  });

  it("also removes tokens from non-absolute URLs", () => {
    const result = attachmentDisplayUrl("attachments/1?token=secret");
    expect(decodeURIComponent(result)).toContain("attachments/1");
    expect(result).not.toContain("secret");
  });
});
