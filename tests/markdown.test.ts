import { describe, it, expect } from "vitest";
import { markdownConverter } from "../src/utils/markdown";

describe("Markdown Converter", () => {
    it("should parse standard markdown headers and formatting to HTML", () => {
        const input = "# Title\n\nThis is a **bold** statement.";
        const output = markdownConverter.makeHtml(input);
        expect(output).toContain("<h1 id=\"title\">Title</h1>");
        expect(output).toContain("<strong>bold</strong>");
    });

    it("should preserve LaTeX math equations for inline and display formats", () => {
        const input = "Inline math: $E=mc^2$\n\nDisplay math:\n\n$$f(x) = x^2$$";
        const output = markdownConverter.makeHtml(input);
        expect(output).toContain("Inline math: $E=mc^2$");
        expect(output).toContain("Display math:");
        expect(output).toContain("$$f(x) = x^2$$");
    });

    it("should clean HTML detail elements and inject content wrapper div", () => {
        const input = "<details><summary>Info</summary>Inside content</details>";
        const output = markdownConverter.makeHtml(input);
        expect(output).toContain("<details>");
        expect(output).toContain("<summary>Info</summary>");
        expect(output).toContain('<div class="details-content">Inside content</div>');
        expect(output).toContain("</details>");
    });
});
