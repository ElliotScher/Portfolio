import { resumeData } from "../data/resume/resumeData";
import { getTopProjectsForResume } from "../utils/analytics";

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
        const contact = resumeData.contactRedacted;
        const topProjects = getTopProjectsForResume();

        const contactHtml = `<a href="mailto:${contact.email}">${contact.email}</a> &nbsp;|&nbsp; ${contact.citizenship}<br/>
        <a href="https://${contact.linkedin}" target="_blank" rel="noopener noreferrer">${contact.linkedin}</a> &nbsp;|&nbsp; <a href="https://${contact.github}" target="_blank" rel="noopener noreferrer">${contact.github}</a>`;

        const edu = resumeData.education;
        const educationHtml = `
            <div class="resume-item">
                <div class="resume-row">
                    <span class="bold">${edu.school}</span>
                    <span>${edu.location}</span>
                </div>
                <div class="resume-row">
                    <span class="italic">${edu.degree}</span>
                    <span>${edu.date}</span>
                </div>
            </div>
        `;

        const skillsHtml = resumeData.skills.map(cat => `
            <div class="skill-line">
                <span class="bold">${cat.name}:</span> ${cat.skills}
            </div>
        `).join("");

        const experienceHtml = resumeData.experience.map(exp => `
            <div class="resume-item">
                <div class="resume-row">
                    <span class="bold">${exp.company}</span>
                    <span>${exp.location}</span>
                </div>
                <div class="resume-row">
                    <span class="italic">${exp.role}</span>
                    <span>${exp.duration}</span>
                </div>
                <ul class="resume-bullets">
                    ${exp.bullets.map(b => `<li>${b}</li>`).join("")}
                </ul>
            </div>
        `).join("");

        const projectsHtml = topProjects.map(key => {
            const proj = resumeData.projects[key];
            if (!proj) return "";
            return `
                <div class="resume-item">
                    <div class="resume-row">
                        <span class="bold">${proj.title}</span>
                    </div>
                    <ul class="resume-bullets">
                        ${proj.bullets.map(b => `<li>${b}</li>`).join("")}
                    </ul>
                </div>
            `;
        }).join("");

        return `
            <div class="paper-page">
                <div class="resume-header-center">
                    <h1 class="resume-name">${resumeData.name}</h1>
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
