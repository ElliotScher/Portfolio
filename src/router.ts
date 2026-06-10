import { parseHash, scrollToAnchor } from "./utils/hash";
import { renderHome } from "./pages/home";
import { renderProjects } from "./pages/projects";
import { renderAboutMe } from "./pages/aboutme";
import { projects } from "./data/projects/projects.ts";
import { setActiveProject } from "./components/projectDetail";

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
    }
}

export function initRouter() {
    window.addEventListener("hashchange", handleRoute);
    handleRoute();
}

function handleRoute() {
    const { path, anchor } = parseHash();

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
            navigate(renderProjects(projectToSelect, showDetailOnMobile));
        }
    } else {
        // Fallback to home
        navigate(renderHome());
    }
}