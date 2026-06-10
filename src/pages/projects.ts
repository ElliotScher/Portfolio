import { projects } from "../data/projects/projects.ts";
import type { Project } from "../data/projects/projects.ts";
import { createProjectList } from "../components/projectList";
import { createProjectDetail } from "../components/projectDetail";

export function renderProjects(initialProject?: Project, showDetailOnMobile = false): HTMLElement {
    const page = document.createElement("div");
    // Ensure the page doesn't exceed the container height
    page.style.height = "100%";
    page.style.overflow = "hidden";

    const layout = document.createElement("div");
    layout.className = `projects-page-layout ${showDetailOnMobile ? "show-detail" : "show-list"}`;
    layout.style.display = "flex";
    layout.style.height = "100%";
    layout.style.overflow = "hidden"; // Prevent layout from expanding
    layout.style.position = "relative"; // Add relative positioning for absolute children

    // Retrieve initial collapsed state from localStorage
    const isInitiallyCollapsed = localStorage.getItem("project-sidebar-collapsed") === "true";
    if (isInitiallyCollapsed) {
        layout.classList.add("sidebar-collapsed");
    }

    const listContainer = document.createElement("div");
    listContainer.className = "collapsible-project-list-container";

    const triggerZone = document.createElement("div");
    triggerZone.className = "project-list-trigger-zone";

    const initial = initialProject || projects[0];

    const list = createProjectList(projects, initial);
    listContainer.appendChild(list);

    const detail = createProjectDetail(initial);

    // Create the toggle button
    const toggleBtn = document.createElement("button");
    toggleBtn.className = "project-sidebar-toggle";
    toggleBtn.setAttribute("aria-label", "Toggle project list");
    toggleBtn.title = isInitiallyCollapsed ? "Show Project List" : "Hide Project List";
    toggleBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6"/>
        </svg>
    `;

    toggleBtn.addEventListener("click", () => {
        layout.classList.toggle("sidebar-collapsed");
        const collapsed = layout.classList.contains("sidebar-collapsed");
        localStorage.setItem("project-sidebar-collapsed", collapsed ? "true" : "false");
        toggleBtn.title = collapsed ? "Show Project List" : "Hide Project List";
    });

    layout.appendChild(triggerZone);
    layout.appendChild(listContainer);
    layout.appendChild(toggleBtn);
    layout.appendChild(detail);

    page.appendChild(layout);

    return page;
}
