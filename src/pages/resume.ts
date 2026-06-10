import { getTopProjectsForResume } from "../utils/analytics";

// LaTeX raw imports
import contactRedactedTex from "../data/resume/resume/contact/redacted.tex?raw";
import wpiTex from "../data/resume/resume/education/wpi.tex?raw";
import softwareTex from "../data/resume/resume/skills/software.tex?raw";
import cadTex from "../data/resume/resume/skills/cad.tex?raw";
import labTex from "../data/resume/resume/skills/lab.tex?raw";
import wpiRrcTex from "../data/resume/resume/experience/wpi_rrc.tex?raw";
import firstHqTex from "../data/resume/resume/experience/first_hq.tex?raw";
import privateContractTex from "../data/resume/resume/experience/private_contract.tex?raw";
import stemForKidsTex from "../data/resume/resume/experience/stem_for_kids.tex?raw";

// Project LaTeX raw imports
import gompeiVisionTex from "../data/projects/gompeivision/gompeivision.tex?raw";
import gompeiLibTex from "../data/projects/gompeilib/gompeilib.tex?raw";
import wpicalTex from "../data/projects/wpical/wpical.tex?raw";
import rbe1001Tex from "../data/projects/rbe1001/rbe1001.tex?raw";
import robotArmTex from "../data/projects/rbe3001/robot_arm.tex?raw";
import robotNavigationTex from "../data/projects/rbe3002/robot_navigation.tex?raw";
import rosPlatformTex from "../data/projects/rbe300x/ros_platform.tex?raw";
import firstMentorTex from "../data/projects/frc190-common/first_mentor.tex?raw";
import kitbotTex from "../data/projects/kitbot2025/kitbot.tex?raw";
import softwareKnowledgeBaseTex from "../data/projects/software_knowledge_base/software_knowledge_base.tex?raw";
import incubatorTex from "../data/projects/incubator/incubator.tex?raw";

const projectTexMap: Record<string, string> = {
    gompeivision: gompeiVisionTex,
    gompeilib: gompeiLibTex,
    wpical: wpicalTex,
    rbe1001: rbe1001Tex,
    robot_arm: robotArmTex,
    robot_navigation: robotNavigationTex,
    ros_platform: rosPlatformTex,
    first_mentor: firstMentorTex,
    kitbot: kitbotTex,
    software_knowledge_base: softwareKnowledgeBaseTex,
    incubator: incubatorTex
};

function formatInline(text: string): string {
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

function parseTexToHtml(tex: string): string {
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

export function renderResume(): HTMLElement {
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
        const topProjects = getTopProjectsForResume();

        // Parse contact details from redacted.tex
        const contactLines = contactRedactedTex.split("\n")
            .map(line => line.trim())
            .filter(line => line && !line.includes("begin{center}") && !line.includes("end{center}"));
        
        const nameLine = contactLines.find(l => l.includes("Elliot Scher"));
        const nameMatch = nameLine ? nameLine.match(/\\textbf\{([^}]+)\}/) : null;
        const name = nameMatch ? nameMatch[1] : "Elliot Scher";
        
        const contactDetailsLines = contactLines.filter(l => !l.includes("Elliot Scher"));
        const contactHtml = contactDetailsLines.map(line => formatInline(line)).join("<br/>\n");

        // Parse education
        const educationHtml = `<div class="resume-item">${parseTexToHtml(wpiTex)}</div>`;

        // Parse skills
        const skillsHtml = [softwareTex, cadTex, labTex].map(tex => {
            const formatted = formatInline(tex.trim());
            return `<div class="skill-line">${formatted}</div>`;
        }).join("\n");

        // Parse experience
        const experienceHtml = [wpiRrcTex, firstHqTex, privateContractTex, stemForKidsTex].map(tex => {
            return `<div class="resume-item">${parseTexToHtml(tex)}</div>`;
        }).join("\n");

        // Parse projects
        const projectsHtml = topProjects.map(key => {
            const tex = projectTexMap[key];
            if (!tex) return "";
            return `<div class="resume-item">${parseTexToHtml(tex)}</div>`;
        }).join("\n");

        return `
            <div class="paper-page">
                <div class="resume-header-center">
                    <h1 class="resume-name">${name}</h1>
                    <div class="resume-contact">${contactHtml}</div>
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
                <p class="subtitle">Curriculum Vitae containing technical skills, experience, and academic projects.</p>
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

    return page;
}
