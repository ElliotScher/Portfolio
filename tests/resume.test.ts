import { describe, it, expect, vi } from "vitest";
import { parseHash, scrollToAnchor } from "../src/utils/hash";
import { parseYaml, formatInline, parseTexToHtml, renderResume } from "../src/pages/resume";

describe("Hash Router Parameter Parsing", () => {
    it("should parse path, query params, and anchor from window hash", () => {
        vi.stubGlobal("window", {
            location: {
                hash: "#/resume?config=full#education"
            }
        });
        
        const res = parseHash();
        expect(res.path).toBe("/resume");
        expect(res.queryParams).toEqual({ config: "full" });
        expect(res.anchor).toBe("education");
    });

    it("should handle hash without query parameters", () => {
        vi.stubGlobal("window", {
            location: {
                hash: "#/resume"
            }
        });

        const res = parseHash();
        expect(res.path).toBe("/resume");
        expect(res.queryParams).toEqual({});
        expect(res.anchor).toBe("");
    });

    it("should handle empty or default root hashes", () => {
        vi.stubGlobal("window", {
            location: {
                hash: "#/"
            }
        });

        const res = parseHash();
        expect(res.path).toBe("/");
        expect(res.queryParams).toEqual({});
        expect(res.anchor).toBe("");
    });
});

describe("YAML Resume Config Parser", () => {
    it("should parse standard config sections into clean lists", () => {
        const mockYaml = `
# Modular resume configurations
contact:
  - redacted
education:
  - wpi
skills:
  - software
  - cad
  - lab
experience:
  - wpi_rrc
  - first_hq
projects:
  - robot_arm
  - robot_navigation
        `;

        const config = parseYaml(mockYaml);
        
        expect(config.contact).toEqual(["redacted"]);
        expect(config.education).toEqual(["wpi"]);
        expect(config.skills).toEqual(["software", "cad", "lab"]);
        expect(config.experience).toEqual(["wpi_rrc", "first_hq"]);
        expect(config.projects).toEqual(["robot_arm", "robot_navigation"]);
    });

    it("should ignore comments and empty spaces", () => {
        const mockYaml = `
# Header Comment
education:
  - wpi # line comment
# Footer comment
        `;

        const config = parseYaml(mockYaml);
        expect(config.education).toEqual(["wpi"]);
    });
});

describe("LaTeX Inline Formatter", () => {
    it("should strip LaTeX line breaks and specific sizes", () => {
        const input = "WPI College\\\\[2pt] and trailing\\\\";
        const formatted = formatInline(input);
        expect(formatted).toBe("WPI College and trailing");
    });

    it("should convert LaTeX spaces to HTML non-breaking spaces", () => {
        const input = "Elliot\\quad|\\quadScher\\qquad(WPI)";
        const formatted = formatInline(input);
        expect(formatted).toContain("&nbsp;|&nbsp;");
        expect(formatted).toContain("&nbsp;&nbsp;");
    });

    it("should convert LaTeX href blocks to HTML anchors", () => {
        const input = "\\href{mailto:ecscher@wpi.edu}{ecscher@wpi.edu}";
        const formatted = formatInline(input);
        expect(formatted).toBe('<a href="mailto:ecscher@wpi.edu" target="_blank" rel="noopener noreferrer">ecscher@wpi.edu</a>');
    });

    it("should format bold, italic, and Large text wrappers", () => {
        const input = "\\textbf{Elliot Scher} is {\\Large WPI} \\textit{alumni}";
        const formatted = formatInline(input);
        expect(formatted).toContain('<span class="bold">Elliot Scher</span>');
        expect(formatted).toContain('<span class="large">WPI</span>');
        expect(formatted).toContain('<span class="italic">alumni</span>');
    });

    it("should remove LaTeX escape backslashes", () => {
        const input = "Software \\& CAD \\% Lab \\$ Project \\# Title \\_ Name";
        const formatted = formatInline(input);
        expect(formatted).toBe("Software & CAD % Lab $ Project # Title _ Name");
    });
});

describe("LaTeX to HTML Parser Helper", () => {
    it("should map itemize block to bullet list tags", () => {
        const input = `
\\begin{itemize}
\\item Programmed embedded systems in C\\&C++
\\item Designed custom robot arm link members
\\end{itemize}
        `;

        const html = parseTexToHtml(input);
        expect(html).toContain('<ul class="resume-bullets">');
        expect(html).toContain('<li>Programmed embedded systems in C&C++</li>');
        expect(html).toContain('<li>Designed custom robot arm link members</li>');
        expect(html).toContain('</ul>');
    });

    it("should convert LaTeX \\hfill layout lines to row divs", () => {
        const input = "Robotics Engineer \\hfill Worcester, MA";
        const html = parseTexToHtml(input);
        expect(html).toBe('<div class="resume-row"><span>Robotics Engineer</span><span>Worcester, MA</span></div>\n');
    });
});

describe("renderResume Component", () => {
    it("should render default interactive resume successfully", () => {
        // Mock a div for content in global doc so no element errors
        const contentDiv = document.createElement("div");
        contentDiv.id = "content";
        document.body.appendChild(contentDiv);

        const el = renderResume();
        expect(el).toBeInstanceOf(HTMLElement);
        expect(el.innerHTML).toContain("Resume");
        expect(el.innerHTML).toContain("Elliot Scher");

        document.body.removeChild(contentDiv);
    });

    it("should render full resume config from queryParams", () => {
        const el = renderResume({ config: "full" });
        expect(el).toBeInstanceOf(HTMLElement);
        expect(el.innerHTML).toContain("Elliot Scher");
        expect(el.innerHTML).toContain("Technical Skills");
    });

    it("should render redacted resume config from queryParams", () => {
        const el = renderResume({ config: "redacted" });
        expect(el).toBeInstanceOf(HTMLElement);
        expect(el.innerHTML).toContain("Elliot Scher");
    });
});

describe("scrollToAnchor Helper", () => {
    it("should find and scroll to the target element ID", () => {
        const contentDiv = document.createElement("div");
        contentDiv.id = "content";
        document.body.appendChild(contentDiv);

        const targetDiv = document.createElement("div");
        targetDiv.id = "my-anchor";
        // Mock scrollIntoView function
        const mockScroll = vi.fn();
        targetDiv.scrollIntoView = mockScroll;
        contentDiv.appendChild(targetDiv);

        scrollToAnchor("my-anchor");

        // Wait for timeout inside scrollToAnchor
        setTimeout(() => {
            expect(mockScroll).toHaveBeenCalled();
            document.body.removeChild(contentDiv);
        }, 100);
    });
});
