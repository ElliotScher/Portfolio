import { parseHash, scrollToAnchor } from "./utils/hash";
import { renderHome } from "./pages/home";
import { renderProjects } from "./pages/projects";
import { renderAboutMe } from "./pages/aboutme";
import { renderResume } from "./pages/resume";
import { projects } from "./data/projects/projects.ts";
import { setActiveProject } from "./components/projectDetail";
import { recordProjectViewTime } from "./utils/analytics";

let currentProjectId: string | null = null;
let startTime: number = 0;

export function navigate(page: HTMLElement) {
    const content = document.getElementById("content");

    if (!content) {
        return;
    }

    page.classList.add("page");

    content.innerHTML = "";
    content.appendChild(page);

    // Update sidebar navigation active state
    updateSidebarHighlight(page);

    requestAnimationFrame(() => {
        page.classList.add("visible");
    });
}

function updateSidebarHighlight(page: HTMLElement) {
    const sidebar = document.querySelector(".sidebar");
    if (!sidebar) return;

    sidebar.querySelectorAll("nav button").forEach(btn => btn.classList.remove("active"));

    if (page.classList.contains("home")) {
        sidebar.querySelector("#home-button")?.classList.add("active");
    } else if (page.querySelector(".projects-page-layout")) {
        sidebar.querySelector("#projects-button")?.classList.add("active");
    } else if (page.classList.contains("page-about-me")) {
        sidebar.querySelector("#about-button")?.classList.add("active");
    } else if (page.classList.contains("resume-page")) {
        sidebar.querySelector("#resume-button")?.classList.add("active");
    }
}

export function initRouter() {
    window.addEventListener("hashchange", handleRoute);

    // Track tab closes/page reloads
    window.addEventListener("beforeunload", () => {
        if (currentProjectId) {
            const duration = Date.now() - startTime;
            recordProjectViewTime(currentProjectId, duration);
        }
    });

    // Track browser tab switching
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
            if (currentProjectId) {
                const duration = Date.now() - startTime;
                recordProjectViewTime(currentProjectId, duration);
                currentProjectId = null;
            }
        } else if (document.visibilityState === "visible") {
            const { path } = parseHash();
            if (path.startsWith("/projects")) {
                const segments = path.split("/");
                const projectId = segments[2];
                if (projectId) {
                    currentProjectId = projectId;
                    startTime = Date.now();
                }
            }
        }
    });

    handleRoute();
}

function handleRoute() {
    const { path, queryParams, anchor } = parseHash();

    // Record time spent on previous project if leaving it
    if (currentProjectId) {
        const duration = Date.now() - startTime;
        recordProjectViewTime(currentProjectId, duration);
        currentProjectId = null;
    }

    if (path === "/" || path === "/home" || path === "") {
        navigate(renderHome());
        if (anchor) {
            scrollToAnchor(anchor);
        }
    } else if (path === "/about") {
        navigate(renderAboutMe());
        if (anchor) {
            scrollToAnchor(anchor);
        }
    } else if (path === "/resume") {
        navigate(renderResume(queryParams));
        if (anchor) {
            scrollToAnchor(anchor);
        }
    } else if (path.startsWith("/projects")) {
        const segments = path.split("/");
        const projectId = segments[2];
        const matchedProject = projectId ? projects.find(p => p.id === projectId) : undefined;

        const existingLayout = document.querySelector(".projects-page-layout");
        if (existingLayout) {
            // We are already on the projects page!
            const projectToSelect = matchedProject || projects[0];
            const activeCard = existingLayout.querySelector(".project-card.active");
            const currentlyActiveId = activeCard?.getAttribute("data-project-id");

            if (currentlyActiveId !== projectToSelect.id) {
                // If switching projects within page tabs, record the time for the old one
                if (currentProjectId) {
                    const duration = Date.now() - startTime;
                    recordProjectViewTime(currentProjectId, duration);
                }

                const cards = existingLayout.querySelectorAll(".project-card");
                cards.forEach(card => {
                    const cardProjectId = card.getAttribute("data-project-id");
                    if (cardProjectId === projectToSelect.id) {
                        card.classList.add("active");
                    } else {
                        card.classList.remove("active");
                    }
                });
                setActiveProject(projectToSelect);
            } else {
                // If already active, scroll immediately if anchor exists
                if (anchor) {
                    scrollToAnchor(anchor);
                }
            }

            // Start timer for the new project
            currentProjectId = projectToSelect.id;
            startTime = Date.now();

            // Update layout view on mobile
            if (projectId) {
                existingLayout.classList.remove("show-list");
                existingLayout.classList.add("show-detail");
            } else {
                existingLayout.classList.remove("show-detail");
                existingLayout.classList.add("show-list");
            }
        } else {
            // Render the projects page anew
            const showDetailOnMobile = !!projectId;
            const projectToSelect = matchedProject || projects[0];

            // Start timer for the new project
            currentProjectId = projectToSelect.id;
            startTime = Date.now();

            navigate(renderProjects(projectToSelect, showDetailOnMobile));
        }
    } else {
        // Fallback to home
        navigate(renderHome());
    }
}