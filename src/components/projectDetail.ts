import type {Project} from "../data/projects";
import showdown from "showdown";
import { createProcessDiagram } from "./processDiagram";
import { createTechStack } from "./techStack";

let currentDetail: HTMLElement | null = null;
let renderId = 0;

// Configure Showdown to generate header IDs
const converter = new showdown.Converter({
    ghCompatibleHeaderId: true,
    simpleLineBreaks: true,
});

export function createProjectDetail(initial: Project): HTMLElement {
    const container = document.createElement("div");
    container.className = "project-detail-wrapper";
    container.id = "project-detail-wrapper";

    render(container, initial);

    currentDetail = container;

    return container;
}

export function setActiveProject(project: Project) {
    if (!currentDetail) return;

    render(currentDetail, project);
}

// Map of markdown modules
const markdownFiles = import.meta.glob('../data/markdown/**/*.md', { query: '?raw', import: 'default' });

async function render(container: HTMLElement, project: Project) {
    const currentRenderId = ++renderId;

    container.innerHTML = `
        <div class="project-detail-layout">
            <div class="project-detail">
                <button class="back-to-projects-btn" aria-label="Back to projects">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back to Projects
                </button>
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <h1>${project.title}</h1>
                </div>

                <p>${project.summary}</p>

                <div id="project-markdown-content">Loading...</div>
            </div>
            <div id="project-nav-menu"></div>
        </div>
    `;

    const backBtn = container.querySelector(".back-to-projects-btn");
    backBtn?.addEventListener("click", () => {
        const layoutElement = container.closest(".projects-page-layout");
        if (layoutElement) {
            layoutElement.classList.remove("show-detail");
            layoutElement.classList.add("show-list");
        }
    });

    const contentContainer = container.querySelector("#project-markdown-content");
    const navMenuContainer = container.querySelector("#project-nav-menu");

    if (project.markdownFile) {
        try {
            const loadMarkdown = markdownFiles[project.markdownFile] as () => Promise<string>;
            if (loadMarkdown) {
                const mdContent = await loadMarkdown();
                
                if (currentRenderId !== renderId) return;

                if (contentContainer) {
                    const htmlContent = converter.makeHtml(mdContent);
                    contentContainer.innerHTML = htmlContent;

                    // Extract headers and generate nav menu
                    const headers = extractHeaders(htmlContent);
                    if (navMenuContainer) {
                        navMenuContainer.innerHTML = createNavMenu(headers);
                    }

                    // Mount interactive components
                    if (contentContainer instanceof HTMLElement) {
                        mountInteractiveComponents(contentContainer, project);
                    }
                }
            } else {
                 if (currentRenderId !== renderId) return;
                 if (contentContainer) {
                    contentContainer.innerHTML = "<p>Markdown file not found.</p>";
                 }
            }
        } catch (error) {
            if (currentRenderId !== renderId) return;
            if (contentContainer) {
                contentContainer.innerHTML = "<p>Error loading project details.</p>";
                console.error("Failed to load markdown:", error);
            }
        }
    }
}

function extractHeaders(htmlContent: string): {level: number, text: string, id: string}[] {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const headers: {level: number, text: string, id: string}[] = [];
    tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(header => {
        headers.push({
            level: parseInt(header.tagName.substring(1)),
            text: header.textContent || '',
            id: header.id
        });
    });
    return headers;
}

function createNavMenu(headers: {level: number, text: string, id: string}[]): string {
    if (headers.length === 0) {
        return "";
    }

    const minLevel = headers.reduce((min, h) => Math.min(min, h.level), 6);

    const navItems = headers.map(header => {
        const indentation = (header.level - minLevel) * 1; // 1rem per level
        return `
        <li style="padding-left: ${indentation}rem;">
            <a href="#${header.id}">${header.text}</a>
        </li>
    `}).join('');

    return `
        <div class="project-nav-menu-wrapper">
            <h4>On this page</h4>
            <ul>${navItems}</ul>
        </div>
    `;
}

function mountInteractiveComponents(container: HTMLElement, project: Project) {
    const processDiagramPlaceholder = container.querySelector('#gompei-vision-process-diagram');
    if (processDiagramPlaceholder instanceof HTMLElement) {
        createProcessDiagram(processDiagramPlaceholder);
    }

    const techStackPlaceholder = container.querySelector('.project-tech-stack') || container.querySelector('[id$="-tech-stack"]');
    if (techStackPlaceholder instanceof HTMLElement) {
        const techWidget = createTechStack(project.technologies, project.id, project.markdownFile);
        techStackPlaceholder.innerHTML = "";
        techStackPlaceholder.appendChild(techWidget);
    }
}
