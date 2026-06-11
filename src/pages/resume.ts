import QRCode from "qrcode";
import { getTopProjectsForResume } from "../utils/analytics";

// YAML raw imports
import configFullYaml from "../data/resume/configs/config_full.yml?raw";
import configRedactedYaml from "../data/resume/configs/config_redacted.yml?raw";

// Project LaTeX raw imports
import { projectTexMap, ProjectTexKey } from "../data/projects/projectTexMap";
import { projects } from "../data/projects/projects";

// Dynamically glob all modular resume LaTeX fragments
const resumeTexFiles = import.meta.glob("../data/resume/resume/**/*.tex", {
    query: "?raw",
    import: "default",
    eager: true
}) as Record<string, string>;

function getTexContent(section: string, name: string): string {
    const targetSuffix = `/${section}/${name}.tex`;
    for (const [filePath, content] of Object.entries(resumeTexFiles)) {
        if (filePath.endsWith(targetSuffix)) {
            return content;
        }
    }
    return "";
}

interface ResumeConfig {
    contact: string[];
    education: string[];
    skills: string[];
    experience: string[];
    projects: string[];
}

export function parseYaml(yamlText: string): ResumeConfig {
    const lines = yamlText.split("\n");
    const config: ResumeConfig = {
        contact: [],
        education: [],
        skills: [],
        experience: [],
        projects: []
    };
    let currentKey: keyof ResumeConfig | null = null;

    for (let line of lines) {
        // Strip comments
        const commentIndex = line.indexOf("#");
        if (commentIndex !== -1) {
            line = line.substring(0, commentIndex);
        }
        line = line.trim();
        if (!line) continue;

        if (line.endsWith(":")) {
            const key = line.slice(0, -1).trim() as keyof ResumeConfig;
            if (["contact", "education", "skills", "experience", "projects"].includes(key)) {
                currentKey = key;
            } else {
                currentKey = null;
            }
        } else if (line.startsWith("-") && currentKey) {
            const value = line.substring(1).trim();
            if (value) {
                config[currentKey].push(value);
            }
        }
    }
    return config;
}

export function formatInline(text: string): string {
    let clean = text
        .replace(/\\+\[[^\]]*\]/g, "") // remove \\[2pt] etc first
        .replace(/\\\\$/g, "") // remove trailing \\
        .replace(/\\quad\|\\quad/g, " &nbsp;|&nbsp; ")
        .replace(/\\quad/g, " &nbsp; ")
        .replace(/\\qquad/g, " &nbsp;&nbsp; ")
        .replace(/~/g, " ");

    // Parse \href{url}{text}
    clean = clean.replace(/\\href\{([^}]+)\}\{([^}]+)\}/g, (_, url, label) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
    });

    // Parse \textbf{text}
    clean = clean.replace(/\\textbf\{([^}]+)\}/g, '<span class="bold">$1</span>');

    // Parse \textit{text}
    clean = clean.replace(/\\textit\{([^}]+)\}/g, '<span class="italic">$1</span>');

    // Parse {\Large text} or \Large text
    clean = clean.replace(/\{\\Large\s+([^}]+)\}/g, '<span class="large">$1</span>');
    clean = clean.replace(/\\Large\s+([^\\]+)/g, '<span class="large">$1</span>');

    // Replace remaining LaTeX escaped characters
    clean = clean
        .replace(/\\&/g, "&")
        .replace(/\\%/g, "%")
        .replace(/\\\$/g, "$")
        .replace(/\\#/g, "#")
        .replace(/\\_/g, "_")
        .replace(/\\/g, ""); // strip any remaining backslashes

    return clean.trim();
}

export function parseTexToHtml(tex: string): string {
    const lines = tex.split("\n");
    let html = "";

    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        if (line.includes("\\begin{center}") || line.includes("\\end{center}")) {
            continue;
        }

        if (line.includes("\\begin{itemize}")) {
            html += `<ul class="resume-bullets">\n`;
            continue;
        }

        if (line.includes("\\end{itemize}")) {
            html += `</ul>\n`;
            continue;
        }

        if (line.startsWith("\\item")) {
            const content = line.substring(5).trim();
            html += `  <li>${formatInline(content)}</li>\n`;
            continue;
        }

        // Handle \hfill lines
        if (line.includes("\\hfill")) {
            const parts = line.split("\\hfill");
            const left = formatInline(parts[0]);
            const right = formatInline(parts[1]);
            html += `<div class="resume-row"><span>${left}</span><span>${right}</span></div>\n`;
            continue;
        }

        // Regular line
        const formatted = formatInline(line);
        if (formatted) {
            html += `<div class="resume-row"><span>${formatted}</span></div>\n`;
        }
    }

    return html;
}

export function renderResume(queryParams?: Record<string, string>): HTMLElement {
    const page = document.createElement("div");
    page.className = "page resume-page animate-fade-in";

    const printIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon">
        <polyline points="6 9 6 2 18 2 18 9"></polyline>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
        <rect x="6" y="14" width="12" height="8"></rect>
    </svg>
    `;

    function buildResumeHtml() {
        const configName = queryParams?.config;
        let activeConfig: ResumeConfig | null = null;
        if (configName === "full") {
            activeConfig = parseYaml(configFullYaml);
        } else if (configName === "redacted") {
            activeConfig = parseYaml(configRedactedYaml);
        }

        const topProjects = getTopProjectsForResume();

        // Contact
        const contactType = activeConfig ? activeConfig.contact[0] : "redacted";
        const contactTex = getTexContent("contact", contactType) || getTexContent("contact", "redacted");

        // Parse contact details (only keep the left minipage content if it exists, or the whole file)
        const leftMinipageTex = contactTex.split("\\end{minipage}")[0] || contactTex;
        const contactLines = leftMinipageTex.split("\n")
            .map(line => line.trim())
            .filter(line => {
                if (!line) return false;
                if (line.includes("begin{center}") || line.includes("end{center}")) return false;
                if (line.includes("minipage") || line.includes("noindent") || line.includes("vspace") || line.includes("hfill") || line.includes("includegraphics")) return false;
                return true;
            });
        
        const nameLine = contactLines.find(l => l.includes("Elliot Scher"));
        const nameMatch = nameLine ? nameLine.match(/\\textbf\{([^}]+)\}/) : null;
        const name = nameMatch ? nameMatch[1] : "Elliot Scher";
        
        const contactDetailsLines = contactLines.filter(l => !l.includes("Elliot Scher"));
        const contactHtml = contactDetailsLines.map(line => formatInline(line)).join("<br/>\n");

        // Parse education
        const educationKeys = activeConfig ? activeConfig.education : ["wpi"];
        const educationHtml = educationKeys.map(key => {
            const tex = getTexContent("education", key);
            return tex ? `<div class="resume-item">${parseTexToHtml(tex)}</div>` : "";
        }).join("\n");

        // Parse skills
        const skillsKeys = activeConfig ? activeConfig.skills : ["software", "cad", "lab"];
        const skillsHtml = skillsKeys.map(key => {
            const tex = getTexContent("skills", key);
            if (!tex) return "";
            const formatted = formatInline(tex.trim());
            return `<div class="skill-line">${formatted}</div>`;
        }).join("\n");

        // Parse experience
        const experienceKeys = activeConfig ? activeConfig.experience : ["wpi_rrc", "first_hq", "private_contract", "stem_for_kids"];
        const experienceHtml = experienceKeys.map(key => {
            const tex = getTexContent("experience", key);
            return tex ? `<div class="resume-item">${parseTexToHtml(tex)}</div>` : "";
        }).join("\n");

        // Parse projects
        const projectsList = activeConfig ? activeConfig.projects : topProjects;
        const projectsHtml = projectsList.map(key => {
            const tex = projectTexMap[key as ProjectTexKey];
            if (!tex) return "";
            const parsed = parseTexToHtml(tex);

            const matchedProject = projects.find(p => p.resumeTexFile === key);
            const url = matchedProject
                ? `https://elliotscher.net/#/projects/${matchedProject.id}`
                : "https://elliotscher.net";

            return `
                <div class="resume-item project-item-layout">
                    <div class="project-item-left-pane">
                        ${parsed}
                    </div>
                    <div class="project-item-right-pane">
                        <a href="${url}" target="_blank" rel="noopener noreferrer" title="Click to view project details">
<!--                            <div class="project-qrcode qr-container-target" data-url="${url}"></div>-->
                        </a>
                    </div>
                </div>
            `;
        }).join("\n");

        return `
            <div class="paper-page">
                <div class="resume-content-wrapper">
                    <div class="resume-header-layout">
                        <div class="resume-header-left-pane">
                            <h1 class="resume-name">${name}</h1>
                            <div class="resume-contact">${contactHtml}</div>
                        </div>
                        <div class="resume-header-right-pane">
                            <div class="qr-grid">
                                <div class="qr-item">
                                    <a href="https://github.com/ElliotScher" target="_blank" rel="noopener noreferrer" title="Click to visit GitHub">
                                        <div class="resume-qrcode qr-container-target" data-url="https://github.com/ElliotScher"></div>
                                    </a>
                                    <span class="qr-label">GitHub</span>
                                </div>
                                <div class="qr-item">
                                    <a href="https://linkedin.com/in/elliotscher" target="_blank" rel="noopener noreferrer" title="Click to visit LinkedIn">
                                        <div class="resume-qrcode qr-container-target" data-url="https://linkedin.com/in/elliotscher"></div>
                                    </a>
                                    <span class="qr-label">LinkedIn</span>
                                </div>
                                <div class="qr-item">
                                    <a href="mailto:ecscher@wpi.edu" target="_blank" rel="noopener noreferrer" title="Click to email via Outlook">
                                        <div class="resume-qrcode qr-container-target" data-url="mailto:ecscher@wpi.edu"></div>
                                    </a>
                                    <span class="qr-label">Outlook</span>
                                </div>
                                <div class="qr-item">
                                    <a href="https://elliotscher.net" target="_blank" rel="noopener noreferrer" title="Click to view interactive Portfolio">
                                        <div class="resume-qrcode qr-container-target" data-url="https://elliotscher.net"></div>
                                    </a>
                                    <span class="qr-label">Portfolio</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="resume-section">
                        <h2 class="resume-section-title">Education</h2>
                        <div class="resume-section-divider"></div>
                        ${educationHtml}
                    </div>

                    <div class="resume-section">
                        <h2 class="resume-section-title">Technical Skills</h2>
                        <div class="resume-section-divider"></div>
                        <div class="resume-skills-container">${skillsHtml}</div>
                    </div>

                    <div class="resume-section">
                        <h2 class="resume-section-title">Experience</h2>
                        <div class="resume-section-divider"></div>
                        ${experienceHtml}
                    </div>

                    <div class="resume-section">
                        <h2 class="resume-section-title">Projects & Leadership</h2>
                        <div class="resume-section-divider"></div>
                        ${projectsHtml}
                    </div>
                </div>
            </div>
        `;
    }

    page.innerHTML = `
        <section class="resume-header no-print">
            <div class="resume-header-left">
                <h1>Resume</h1>
            </div>
            <button id="btn-print-resume" class="btn btn-primary">
                ${printIcon} Print / Save PDF
            </button>
        </section>

        <section class="resume-sheet-container">
            <div id="resume-sheet-content">
                ${buildResumeHtml()}
            </div>
        </section>
    `;

    const btnPrint = page.querySelector("#btn-print-resume") as HTMLButtonElement;
    btnPrint.addEventListener("click", () => {
        window.print();
    });

    // Render the QR codes client-side
    page.querySelectorAll(".qr-container-target").forEach(async container => {
        const url = container.getAttribute("data-url");
        if (url) {
            try {
                const svgString = await QRCode.toString(url, {
                    type: "svg",
                    margin: 0,
                    color: {
                        dark: "#1a252c", // Match resume text color
                        light: "#ffffff"
                    }
                });
                container.innerHTML = svgString;
            } catch (err) {
                console.error("Failed to generate QR code", err);
            }
        }
    });

    // Handle print layout adjustments on the fly
    const handleBeforePrint = () => {
        const paperPage = page.querySelector(".paper-page") as HTMLElement;
        const contentWrapper = page.querySelector(".resume-content-wrapper") as HTMLElement;
        if (!paperPage || !contentWrapper) {
            window.removeEventListener("beforeprint", handleBeforePrint);
            window.removeEventListener("afterprint", handleAfterPrint);
            return;
        }

        // Save original style properties to restore later
        (window as any)._originalResumeStyle = paperPage.getAttribute("style");

        // Optimal spacing t in [0, 2.0]
        // t = 0: normal/default spacing
        // t = 1.0: original maximum spacing compression
        // t = 2.0: extra tightness spacing compression
        const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

        const getPaddingYPx = (t: number, scaleFactor: number = 1.0) => {
            const paddingYIn = Math.max(0.12, lerp(0.5, 0.25, t)) * scaleFactor;
            return paddingYIn * 2 * 96; // top and bottom padding combined
        };

        const applySpacing = (t: number, scaleFactor: number = 1.0) => {
            const paddingY = Math.max(0.12, lerp(0.5, 0.25, t)) * scaleFactor;
            const paddingX = Math.max(0.35, lerp(0.6, 0.45, t)) * scaleFactor;
            const fontSize = Math.max(6.5, lerp(9.5, 8.0, t)) * scaleFactor;
            const lineHeight = Math.max(1.02, lerp(1.35, 1.12, t)) * scaleFactor;
            const headerMargin = Math.max(1, lerp(12, 4, t)) * scaleFactor;
            const sectionMargin = Math.max(1, lerp(10, 2, t)) * scaleFactor;
            const dividerMargin = Math.max(1, lerp(6, 2, t)) * scaleFactor;
            const itemMargin = Math.max(0, lerp(8, 1, t)) * scaleFactor;
            const bulletMargin = Math.max(0, lerp(2, 0.2, t)) * scaleFactor;
            const rowMargin = Math.max(0, lerp(2, 0.2, t)) * scaleFactor;
            const skillsGap = Math.max(0, lerp(3, 0.5, t)) * scaleFactor;
            const projectMargin = Math.max(0, lerp(8, 1, t)) * scaleFactor;

            const nameFontSize = Math.max(12, lerp(20, 15, t)) * scaleFactor;
            const contactFontSize = Math.max(6.5, lerp(9, 7.5, t)) * scaleFactor;
            const sectionTitleFontSize = Math.max(8.0, lerp(11, 9.0, t)) * scaleFactor;

            const qrSize = Math.max(0.30, lerp(0.65, 0.45, t)) * scaleFactor;
            const projectQrSize = Math.max(0.20, lerp(0.45, 0.3, t)) * scaleFactor;

            paperPage.style.setProperty("--page-padding-y", `${paddingY}in`);
            paperPage.style.setProperty("--page-padding-x", `${paddingX}in`);
            paperPage.style.setProperty("--resume-font-size", `${fontSize}pt`);
            paperPage.style.setProperty("--resume-line-height", `${lineHeight}`);
            paperPage.style.setProperty("--header-margin-bottom", `${headerMargin}px`);
            paperPage.style.setProperty("--section-margin-top", `${sectionMargin}px`);
            paperPage.style.setProperty("--divider-margin-bottom", `${dividerMargin}px`);
            paperPage.style.setProperty("--item-margin-bottom", `${itemMargin}px`);
            paperPage.style.setProperty("--bullet-margin-bottom", `${bulletMargin}px`);
            paperPage.style.setProperty("--row-margin-bottom", `${rowMargin}px`);
            paperPage.style.setProperty("--skills-gap", `${skillsGap}px`);
            paperPage.style.setProperty("--project-margin-bottom", `${projectMargin}px`);

            paperPage.style.setProperty("--name-font-size", `${nameFontSize}pt`);
            paperPage.style.setProperty("--contact-font-size", `${contactFontSize}pt`);
            paperPage.style.setProperty("--section-title-font-size", `${sectionTitleFontSize}pt`);
            paperPage.style.setProperty("--qr-size", `${qrSize}in`);
            paperPage.style.setProperty("--project-qr-size", `${projectQrSize}in`);
        };

        const targetHeight = 1048; // Leave a minor 8px safety buffer to prevent browser layout engine rounding pagination

        // Step 1: Check if content fits with standard spacing (t = 0)
        applySpacing(0);
        const heightAtZero = contentWrapper.offsetHeight + getPaddingYPx(0);
        console.log(`heightAtZero: ${heightAtZero}px, targetHeight: ${targetHeight}px`);

        if (heightAtZero <= targetHeight) {
            // Fits perfectly on 1 page with no compression
            console.log("Resume fits perfectly with default spacing.");
        } else {
            // Step 2: Check if content fits with maximum compression (t = 2.0)
            applySpacing(2.0);
            const heightAtMax = contentWrapper.offsetHeight + getPaddingYPx(2.0);
            console.log(`heightAtMax (t=2.0): ${heightAtMax}px`);

            if (heightAtMax > targetHeight) {
                // Even at max compression, it overflows. Scale spacing and fonts down to fit perfectly.
                let scaleFactor = (targetHeight / heightAtMax) * 0.98;
                console.log(`Content exceeds 1 page at max compression. Applying scaleFactor: ${scaleFactor}`);
                applySpacing(2.0, scaleFactor);

                // Safe micro-adjust if text-wrapping discrete boundaries still cause minor overflow
                const finalHeight = contentWrapper.offsetHeight + getPaddingYPx(2.0, scaleFactor);
                if (finalHeight > targetHeight) {
                    scaleFactor *= (targetHeight / finalHeight) * 0.98;
                    applySpacing(2.0, scaleFactor);
                }
            } else {
                // Step 3: Binary search for the optimal spacing 't' in [0, 2.0]
                let low = 0;
                let high = 2.0;
                let optimalT = 2.0;

                for (let i = 0; i < 10; i++) {
                    const mid = (low + high) / 2;
                    applySpacing(mid);
                    const height = contentWrapper.offsetHeight + getPaddingYPx(mid);

                    if (height <= targetHeight) {
                        // Mid fits! Try to make it looser (smaller t) to minimize white space
                        high = mid;
                        optimalT = mid;
                    } else {
                        // Mid overflows! Must make it tighter (larger t)
                        low = mid;
                    }
                }
                console.log(`Optimized resume spacing t to: ${optimalT}`);
                applySpacing(optimalT);
            }
        }
    };

    const handleAfterPrint = () => {
        const paperPage = page.querySelector(".paper-page") as HTMLElement;
        if (!paperPage) {
            window.removeEventListener("beforeprint", handleBeforePrint);
            window.removeEventListener("afterprint", handleAfterPrint);
            return;
        }

        const originalStyle = (window as any)._originalResumeStyle;
        if (originalStyle !== undefined) {
            if (originalStyle !== null) {
                paperPage.setAttribute("style", originalStyle);
            } else {
                paperPage.removeAttribute("style");
            }
            delete (window as any)._originalResumeStyle;
        }
    };

    if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
        if ((window as any)._handleBeforePrint) {
            window.removeEventListener("beforeprint", (window as any)._handleBeforePrint);
        }
        if ((window as any)._handleAfterPrint) {
            window.removeEventListener("afterprint", (window as any)._handleAfterPrint);
        }

        (window as any)._handleBeforePrint = handleBeforePrint;
        (window as any)._handleAfterPrint = handleAfterPrint;

        window.addEventListener("beforeprint", handleBeforePrint);
        window.addEventListener("afterprint", handleAfterPrint);
    }

    return page;
}
