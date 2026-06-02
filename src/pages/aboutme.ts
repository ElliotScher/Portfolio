import { createTechStack } from "../components/techStack";

export function renderAboutMe(): HTMLElement {
    const page = document.createElement("div");
    page.className = "page-about-me";
    page.style.padding = "var(--space-4)";
    page.style.display = "flex";
    page.style.flexDirection = "column";
    page.style.gap = "var(--space-4)";

    page.innerHTML = `
        <section class="about-me-hero">
            <h1>About Me</h1>
            <p class="subtitle" style="font-size: 1.15rem; max-width: 800px; margin-bottom: var(--space-3);">
                I am a systems developer and robotics programmer specializing in low-level, real-world engineering. 
                My focus lies at the intersection of computer vision, autonomous controls, and performance-critical systems.
            </p>
            <div class="bio-content" style="max-width: 800px; color: var(--muted); line-height: 1.6;">
                <p>
                    Throughout my engineering journey, I have designed and deployed real-time vision-based localization frameworks, 
                    modular control libraries for autonomous robots, and distributed device communication networks. 
                    I enjoy solving complex software and hardware integration challenges under strict performance constraints.
                </p>
            </div>
        </section>

        <section class="about-me-skills-section">
            <h2 style="margin-top: 0; margin-bottom: var(--space-2);">Core Expertise</h2>
            <p style="color: var(--muted); margin-bottom: var(--space-3);">
                Click on the vertices of the geometric web below to explore my experience and project integration for each core technology.
            </p>
            <div id="global-skills-tech-stack-container"></div>
        </section>
    `;

    const skillsContainer = page.querySelector("#global-skills-tech-stack-container");
    if (skillsContainer) {
        const coreSkills = ["C++", "Java", "Python", "OpenCV", "ROS 2", "Linux", "Docker", "CMake", "Gradle", "Typescript", "HTML", "CSS"];
        // Passing no project ID indicates a global, profile-wide description should be loaded
        const techStackWidget = createTechStack(coreSkills);
        skillsContainer.appendChild(techStackWidget);
    }

    return page;
}