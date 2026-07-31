import type { Project } from "../data/projects/projects.ts";
import { markdownConverter } from "../utils/markdown";
import { createProcessDiagram } from "./processDiagram";
import { createTechStack } from "./techStack";
import { createFutureAdditions } from "./futureAdditions";
import { createMediaGallery } from "./mediaGallery";
import { parseHash, scrollToAnchor } from "../utils/hash";
import hljs from "highlight.js";


const githubIcon = `
<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    class="github-btn-icon"
    width="16"
    height="16"
>
    <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 5.02 3.25 9.27 7.76 10.77.57.1.78-.25.78-.55v-2.02c-3.15.68-3.81-1.34-3.81-1.34-.52-1.3-1.26-1.65-1.26-1.65-1.03-.7.08-.69.08-.69 1.13.08 1.73 1.17 1.73 1.17 1.01 1.73 2.64 1.23 3.28.94.1-.73.4-1.23.72-1.52-2.52-.29-5.17-1.26-5.17-5.62 0-1.24.44-2.25 1.16-3.05-.12-.29-.5-1.46.11-3.04 0 0 .95-.3 3.11 1.16a10.8 10.8 0 0 1 5.66 0c2.16-1.46 3.1-1.16 3.1-1.16.62 1.58.24 2.75.12 3.04.72.8 1.15 1.81 1.15 3.05 0 4.37-2.66 5.32-5.2 5.6.41.36.77 1.08.77 2.18v3.23c0 .3.2.66.79.55 4.5-1.5 7.75-5.75 7.75-10.77C23.25 5.48 18.27.5 12 .5Z"/>
</svg>
`;

const teamIcon = `
<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="team-badge-icon"
    width="13"
    height="13"
>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
</svg>
`;

let currentDetail: HTMLElement | null = null;
let renderId = 0;

// Configure Showdown to generate header IDs


export function createProjectDetail(initial: Project): HTMLElement {
    const container = document.createElement("div");
    container.className = "project-detail-wrapper";
    container.id = "project-detail-wrapper";

    // Auto-expand details and smooth-scroll when clicking hash links pointing inside them
    container.addEventListener("click", (e) => {
        const link = (e.target as HTMLElement).closest("a");
        if (link) {
            const href = link.getAttribute("href");
            if (href && href.startsWith("#") && !href.startsWith("#/")) {
                const targetId = decodeURIComponent(href.substring(1));
                const targetElem = container.querySelector(`[id="${targetId}"]`);
                if (targetElem) {
                    e.preventDefault();
                    let parent = targetElem.parentElement;
                    while (parent && parent !== container) {
                        if (parent.tagName === "DETAILS" && !(parent as HTMLDetailsElement).open) {
                            (parent as HTMLDetailsElement).open = true;
                        }
                        parent = parent.parentElement;
                    }
                    const projectId = container.getAttribute("data-project-id") || "";
                    window.location.hash = `#/projects/${projectId}#${targetId}`;
                    setTimeout(() => {
                        targetElem.scrollIntoView({ behavior: "smooth" });
                    }, 50);
                }
            }
        }
    });

    render(container, initial);

    currentDetail = container;

    return container;
}


export function setActiveProject(project: Project) {
    if (!currentDetail) return;

    render(currentDetail, project);
}

// Map of projects modules
const markdownFiles = import.meta.glob('../data/projects/**/*.md', { query: '?raw', import: 'default' });

async function render(container: HTMLElement, project: Project) {
    const currentRenderId = ++renderId;
    container.setAttribute("data-project-id", project.id);

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
                <div class="project-detail-title-row">
                    <div class="project-detail-title-group">
                        <h1>${project.title}</h1>
                        ${project.teamProject
                            ? `<span class="project-team-badge" title="Built collaboratively as part of a team">
                                ${teamIcon}
                                <span>Team Project</span>
                               </span>`
                            : ""
                        }
                    </div>
                    ${project.githubUrl
                        ? `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-github-btn" aria-label="View source code on GitHub">
                            ${githubIcon}
                            <span>View Source</span>
                           </a>`
                        : `<div class="project-github-btn disabled" aria-label="Source code is not available for this project">
                            ${githubIcon}
                            <span>View Source</span>
                            <span class="project-github-tooltip">Source code isn't available for this project</span>
                           </div>`
                    }
                </div>

                <div id="project-projects-content">
                    <div class="loading-container">
                        <div class="loading-spinner-wrapper">
                            <div class="loading-spinner"></div>
                            <div class="loading-spinner-inner"></div>
                        </div>
                        <div class="loading-text">Loading Project Details</div>
                    </div>
                </div>
            </div>
            <div id="project-nav-menu"></div>
        </div>
    `;

    const backBtn = container.querySelector(".back-to-projects-btn");
    backBtn?.addEventListener("click", () => {
        window.location.hash = "#/projects";
    });

    const contentContainer = container.querySelector("#project-projects-content");
    const navMenuContainer = container.querySelector("#project-nav-menu");

    if (project.markdownFile) {
        try {
            const loadMarkdown = markdownFiles[project.markdownFile] as () => Promise<string>;
            if (loadMarkdown) {
                const mdContent = await loadMarkdown();
                
                if (currentRenderId !== renderId) return;

                if (contentContainer) {
                    const htmlContent = markdownConverter.makeHtml(mdContent);
                    contentContainer.innerHTML = htmlContent;

                    // Apply syntax highlighting to code blocks
                    contentContainer.querySelectorAll("pre code").forEach((block) => {
                        hljs.highlightElement(block as HTMLElement);
                    });

                    // Prepend dynamic base URL to relative image, iframe, embed paths and pdf links
                    contentContainer.querySelectorAll("img, iframe, embed, a").forEach(el => {
                        const attr = el.tagName.toLowerCase() === "a" ? "href" : "src";
                        const url = el.getAttribute(attr);
                        if (url && !url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("/") && !url.startsWith("#")) {
                            const targetUrl = `${import.meta.env.BASE_URL}${url}`;
                            if (el.tagName.toLowerCase() === "a") {
                                if (url.toLowerCase().endsWith(".pdf")) {
                                    el.setAttribute("href", targetUrl);
                                }
                            } else if (el instanceof HTMLImageElement) {
                                el.src = targetUrl;
                            } else {
                                el.setAttribute(attr, targetUrl);
                            }
                        }
                    });

                    // Extract headers and generate nav menu
                    const headers = extractHeaders(htmlContent);
                    if (navMenuContainer) {
                        navMenuContainer.innerHTML = createNavMenu(headers);
                    }

                    // Mount interactive components
                    if (contentContainer instanceof HTMLElement) {
                        mountInteractiveComponents(contentContainer, project);
                    }

                    // Render LaTeX formulas
                    if ((window as any).MathJax) {
                        (window as any).MathJax.typesetClear([contentContainer]);
                        (window as any).MathJax.typesetPromise([contentContainer]);
                    }

                    // Auto-scroll to anchor if present in hash on render completion
                    const { anchor } = parseHash();
                    if (anchor) {
                        scrollToAnchor(anchor);
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
                console.error("Failed to load projects:", error);
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
    const processDiagramPlaceholder = container.querySelector('.project-process-diagram') || container.querySelector('#gompei-vision-process-diagram');
    if (processDiagramPlaceholder instanceof HTMLElement && project.processData) {
        createProcessDiagram(processDiagramPlaceholder, project.processData);
    }

    const techStackPlaceholder = container.querySelector('.project-tech-stack') || container.querySelector('[id$="-tech-stack"]');
    if (techStackPlaceholder instanceof HTMLElement) {
        const techWidget = createTechStack(project.technologies, project.id, project.markdownFile);
        techStackPlaceholder.innerHTML = "";
        techStackPlaceholder.appendChild(techWidget);
    }

    const futureAdditionsPlaceholder = container.querySelector('.project-future-additions') || container.querySelector('#gompei-vision-future-additions');
    if (futureAdditionsPlaceholder instanceof HTMLElement && project.futureAdditionsData) {
        createFutureAdditions(futureAdditionsPlaceholder, project.futureAdditionsData);
    }

    const mediaGalleryPlaceholder = container.querySelector('.project-media-gallery') || container.querySelector('#gompei-vision-media-gallery');
    if (mediaGalleryPlaceholder instanceof HTMLElement && project.mediaData) {
        createMediaGallery(mediaGalleryPlaceholder, project.mediaData);
    }
}
