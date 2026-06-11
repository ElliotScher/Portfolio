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

    // Check height and apply tighter spacing if it exceeds 11in (1056px at 96 DPI)
    // requestAnimationFrame(() => {
    //     const paperPage = page.querySelector(".paper-page") as HTMLElement;
    //     if (paperPage) {
    //         if (paperPage.scrollHeight > 1056) {
    //             console.warn(`Resume height (${paperPage.scrollHeight}px) exceeds 1 page (1056px)! Applying tighter spacing class.`);
    //             paperPage.classList.add("tighter-spacing");
    //
    //             // If it still overflows after tighter spacing, apply extra tighter spacing
    //             if (paperPage.scrollHeight > 1056) {
    //                 console.warn(`Resume height (${paperPage.scrollHeight}px) still exceeds 1 page! Applying extra-tighter spacing class.`);
    //                 paperPage.classList.add("extra-tighter-spacing");
    //             }
    //         }
    //     }
    // });

    return page;
}
