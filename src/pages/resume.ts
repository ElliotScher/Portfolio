import QRCode from "qrcode";
import { getRankedProjectsForResume, getFeaturedProjectForResume } from "../utils/analytics";

// Project LaTeX raw imports
import { projectTexMap, ProjectTexKey } from "../data/projects/projectTexMap";
import { projects } from "../data/projects/projects";

// The complete catalog of projects eligible for the Projects & Leadership
// section (page 1's curated picks plus page 2's overflow), in display
// order. Deliberately excludes:
// - Incubator/"optical density" — see feedback memory: never surface that
//   project in a resume.
// - GompeiVision, WPICal, and Park Vision — each is always shown exclusively
//   as part of its affiliated job entry in Experience (see
//   `pairedJobForProject` below), never as its own standalone project entry.
const ALL_CATALOG_PROJECT_KEYS: ProjectTexKey[] = [
    ProjectTexKey.RobotArm,
    ProjectTexKey.RobotNavigation,
    ProjectTexKey.RosPlatform,
    ProjectTexKey.GompeiLib,
    ProjectTexKey.Kitbot,
    ProjectTexKey.FirstMentor,
    ProjectTexKey.SoftwareKnowledgeBase,
    ProjectTexKey.Rbe1001,
    ProjectTexKey.NixHub
];

// Dynamically glob all modular resume LaTeX fragments
const resumeTexFiles = import.meta.glob("../data/resume/resume/**/*.tex", {
    query: "?raw",
    import: "default",
    eager: true
}) as Record<string, string>;

// Dynamically glob all resume configs, recursively through any subdirectories
// (e.g. company/role-specific configs nested under configs/<company>/)
const resumeConfigFiles = import.meta.glob("../data/resume/configs/**/*.yml", {
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

// Derives the `?config=` name for a globbed config file path, e.g.
// ".../configs/config_full.yml" -> "full"
// ".../configs/bostondynamics/config_fleet_operations.yml" -> "bostondynamics/fleet_operations"
function configNameFromPath(filePath: string): string {
    const relative = filePath.split("/configs/")[1] ?? filePath;
    const segments = relative.replace(/\.yml$/, "").split("/");
    segments[segments.length - 1] = segments[segments.length - 1].replace(/^config_/, "");
    return segments.join("/");
}

function getConfigYaml(name: string): string | null {
    for (const [filePath, content] of Object.entries(resumeConfigFiles)) {
        if (configNameFromPath(filePath) === name) {
            return content;
        }
    }
    return null;
}

interface ResumeConfig {
    contact: string[];
    education: string[];
    skills: string[];
    // Jobs only. Each entry is either a bare job key (resume/experience/*.tex)
    // or a "jobKey@projectKey" pairing that renders the job's org/title/dates
    // as the heading with the project's bullets underneath — i.e. a project
    // built as part of that job. A paired project never gets its own entry
    // in `projects` below.
    experience: string[];
    // Non-job projects only, for the Projects & Leadership section.
    projects: string[];
    // Must be a plain, non-job-affiliated project key (see `projects` above)
    // — never a job or a job@project pairing.
    featured: string | null;
}

const LIST_KEYS = ["contact", "education", "skills", "experience", "projects"] as const;
type ResumeListKey = typeof LIST_KEYS[number];

export function parseYaml(yamlText: string): ResumeConfig {
    const lines = yamlText.split("\n");
    const config: ResumeConfig = {
        contact: [],
        education: [],
        skills: [],
        experience: [],
        projects: [],
        featured: null
    };
    let currentKey: ResumeListKey | null = null;

    for (let line of lines) {
        // Strip comments
        const commentIndex = line.indexOf("#");
        if (commentIndex !== -1) {
            line = line.substring(0, commentIndex);
        }
        line = line.trim();
        if (!line) continue;

        // Scalar "key: value" lines (currently just featured)
        const scalarMatch = line.match(/^([a-z_]+):\s*(.+)$/);
        if (scalarMatch && scalarMatch[1] === "featured") {
            config.featured = scalarMatch[2].trim();
            currentKey = null;
            continue;
        }

        if (line.endsWith(":")) {
            const key = line.slice(0, -1).trim();
            if ((LIST_KEYS as readonly string[]).includes(key)) {
                currentKey = key as ResumeListKey;
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
        const configYaml = configName ? getConfigYaml(configName) : null;
        const activeConfig: ResumeConfig | null = configYaml ? parseYaml(configYaml) : null;

        const rankedProjects = getRankedProjectsForResume();

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

        // Experience: jobs only. Each entry is a bare job key, or a
        // "jobKey@projectKey" pairing — a project built as part of that job,
        // rendered under the job's own heading with the project's bullets
        // (and the project's name promoted into the job's bold org line, so
        // it's prominent without getting its own separate entry anywhere).
        const splitTexHeaderAndBullets = (tex: string): { header: string; bullets: string } => {
            const idx = tex.indexOf("\\begin{itemize}");
            if (idx === -1) return { header: tex.trim(), bullets: "" };
            return { header: tex.slice(0, idx).trim(), bullets: tex.slice(idx).trim() };
        };

        const withProjectNameInOrgLine = (header: string, projectKey: string): string => {
            const projectName = projects.find(p => p.resumeTexFile === projectKey)?.title;
            if (!projectName) return header;
            return header.replace(/\\textbf\{([^}]*)\}/, (_match, org) => `\\textbf{${org} — ${projectName}}`);
        };

        const renderJobEntry = (entry: string): string => {
            const [jobKey, projectKey] = entry.includes("@")
                ? entry.split("@").map(s => s.trim())
                : [entry, null];

            const jobTex = getTexContent("experience", jobKey);
            if (!jobTex) return "";

            if (projectKey) {
                const projectTex = projectTexMap[projectKey as ProjectTexKey];
                if (projectTex) {
                    const { header } = splitTexHeaderAndBullets(jobTex);
                    const { bullets } = splitTexHeaderAndBullets(projectTex);
                    const namedHeader = withProjectNameInOrgLine(header, projectKey);
                    return `<div class="resume-item">${parseTexToHtml(`${namedHeader}\n${bullets}`)}</div>`;
                }
            }

            return `<div class="resume-item">${parseTexToHtml(jobTex)}</div>`;
        };

        // Projects & Leadership: non-job projects only. A single featured
        // project is highlighted above Experience; a few more relevant ones
        // follow it on page 1; the rest of the catalog spills onto page 2.
        const renderProjectEntry = (projectKey: string): string => {
            const tex = projectTexMap[projectKey as ProjectTexKey];
            if (!tex) return "";
            const matchedProject = projects.find(p => p.resumeTexFile === projectKey);
            const url = matchedProject
                ? `https://elliotscher.net/#/projects/${matchedProject.id}`
                : "https://elliotscher.net";

            return `
                <div class="resume-item project-item-layout">
                    <div class="project-item-left-pane">
                        ${parseTexToHtml(tex)}
                    </div>
                    <div class="project-item-right-pane">
                        <a href="${url}" target="_blank" rel="noopener noreferrer" title="Click to view project details">
<!--                            <div class="project-qrcode qr-container-target" data-url="${url}"></div>-->
                        </a>
                    </div>
                </div>
            `;
        };

        // Reverse chronological: NPS (Summer 2026), WPI RRC & Private
        // Contract (both Summer 2025), FIRST HQ (Summer 2024).
        const defaultExperienceJobs = [
            "nps_parkvision@parkvision",
            "wpi_rrc@gompeivision",
            "private_contract",
            "first_hq@wpical"
        ];

        // Fixed 1:1 job/project pairings, used to convert an analytics-ranked
        // bare project key (e.g. "gompeivision") into its paired form
        // ("wpi_rrc@gompeivision") when it turns out to be the featured entry.
        const pairedJobForProject: Partial<Record<string, string>> = {
            [ProjectTexKey.GompeiVision]: "wpi_rrc",
            [ProjectTexKey.WpiCal]: "first_hq",
            [ProjectTexKey.ParkVision]: "nps_parkvision"
        };
        const entryForProjectKey = (projectKey: string): string => {
            const jobKey = pairedJobForProject[projectKey];
            return jobKey ? `${jobKey}@${projectKey}` : projectKey;
        };

        // The featured entry can be either a plain, non-job project or a
        // "jobKey@projectKey" pairing (e.g. featuring GompeiVision surfaces
        // its WPI Robotics Resource Center job, prominently, up top). Either
        // way it's removed from wherever it'd otherwise appear — the
        // Experience list stays reverse chronological for everyone else, and
        // the Projects & Leadership picks stay deduplicated.
        const featuredEntry = activeConfig
            ? (activeConfig.featured ?? "wpi_rrc@gompeivision")
            : entryForProjectKey(getFeaturedProjectForResume());

        const featuredIsJob = featuredEntry.includes("@") || !!getTexContent("experience", featuredEntry);
        const featuredProjectKey = featuredIsJob
            ? (featuredEntry.includes("@") ? featuredEntry.split("@")[1]?.trim() ?? null : null)
            : featuredEntry;

        const experienceEntries = (activeConfig ? activeConfig.experience : defaultExperienceJobs)
            .filter(entry => entry !== featuredEntry);
        const experienceHtml = experienceEntries.map(renderJobEntry).join("\n");

        // Page 1 gets a handful of projects; the rest overflow to page 2. For
        // a static config that's its curated picks vs. the full catalog; for
        // the live default view it's analytics-ranked instead (2nd-most-
        // viewed project onward, already excluding the featured entry and
        // any job-affiliated project), split the same way.
        const PAGE1_PROJECT_COUNT = 3;
        const page1OtherProjectKeys = activeConfig
            ? activeConfig.projects.filter(key => key !== featuredProjectKey)
            : rankedProjects.slice(0, PAGE1_PROJECT_COUNT);

        const page2Keys = activeConfig
            ? (() => {
                const used = new Set([featuredProjectKey, ...page1OtherProjectKeys]);
                return ALL_CATALOG_PROJECT_KEYS.filter(key => !used.has(key));
            })()
            : rankedProjects.slice(PAGE1_PROJECT_COUNT);

        const featuredHtml = featuredIsJob ? renderJobEntry(featuredEntry) : renderProjectEntry(featuredEntry);
        const page1ProjectsHtml = page1OtherProjectKeys.map(renderProjectEntry).join("\n");
        const page2Html = page2Keys.map(renderProjectEntry).join("\n");

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
                        <h2 class="resume-section-title">Featured Project</h2>
                        <div class="resume-section-divider"></div>
                        ${featuredHtml}
                    </div>

                    <div class="resume-section">
                        <h2 class="resume-section-title">Experience</h2>
                        <div class="resume-section-divider"></div>
                        ${experienceHtml}
                    </div>

                    <div class="resume-section">
                        <h2 class="resume-section-title">Projects & Leadership</h2>
                        <div class="resume-section-divider"></div>
                        ${page1ProjectsHtml}
                    </div>
                </div>
            </div>

            <div class="paper-page">
                <div class="resume-content-wrapper">
                    <div class="resume-section">
                        <h2 class="resume-section-title">Projects & Leadership (cont.)</h2>
                        <div class="resume-section-divider"></div>
                        ${page2Html}
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

    // Save/restore each page's original inline style across print, keyed by element
    let originalPageStyles: Map<HTMLElement, string | null> | null = null;

    // Runs the single-page auto-fit binary search (shrink spacing/fonts until
    // content fits one printed page) against one specific paper-page/content
    // pair. Each page in a multi-page resume is fit independently.
    const fitPageToOnePage = (paperPage: HTMLElement, contentWrapper: HTMLElement) => {
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

        // Leave extra headroom below the 1056px (11in) physical page height: the
        // print/PDF rasterization pass measures slightly taller than this
        // screen-mode offsetHeight pass (subpixel rounding compounding across many
        // stacked project entries on a dense page), so a razor-thin buffer here
        // can still spill a few trailing lines onto an extra page.
        const targetHeight = 1010;

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

    const handleBeforePrint = () => {
        const paperPages = Array.from(page.querySelectorAll(".paper-page")) as HTMLElement[];
        if (paperPages.length === 0) {
            window.removeEventListener("beforeprint", handleBeforePrint);
            window.removeEventListener("afterprint", handleAfterPrint);
            return;
        }

        originalPageStyles = new Map(paperPages.map(p => [p, p.getAttribute("style")]));

        paperPages.forEach(paperPage => {
            const contentWrapper = paperPage.querySelector(".resume-content-wrapper") as HTMLElement | null;
            if (contentWrapper) {
                fitPageToOnePage(paperPage, contentWrapper);
            }
        });
    };

    const handleAfterPrint = () => {
        if (!originalPageStyles) {
            window.removeEventListener("beforeprint", handleBeforePrint);
            window.removeEventListener("afterprint", handleAfterPrint);
            return;
        }

        originalPageStyles.forEach((originalStyle, paperPage) => {
            if (originalStyle !== null) {
                paperPage.setAttribute("style", originalStyle);
            } else {
                paperPage.removeAttribute("style");
            }
        });
        originalPageStyles = null;
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
