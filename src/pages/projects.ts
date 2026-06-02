import { projects } from "../data/projects";
import type { Project } from "../data/projects";
import { createProjectList } from "../components/projectList";
import { createProjectDetail } from "../components/projectDetail";

export function renderProjects(initialProject?: Project): HTMLElement {
    const page = document.createElement("div");
    // Ensure the page doesn't exceed the container height
    page.style.height = "100%";
    page.style.overflow = "hidden";

    const layout = document.createElement("div");
    layout.className = "projects-page-layout";
    layout.style.display = "flex";
    layout.style.height = "100%";
    layout.style.overflow = "hidden"; // Prevent layout from expanding
    layout.style.position = "relative"; // Add relative positioning for absolute children

    const listContainer = document.createElement("div");
    listContainer.className = "collapsible-project-list-container";

    const triggerZone = document.createElement("div");
    triggerZone.className = "project-list-trigger-zone";

    const initial = initialProject || projects[0];

    const list = createProjectList(projects, initial);
    listContainer.appendChild(list);

    const detail = createProjectDetail(initial);

    layout.appendChild(triggerZone);
    layout.appendChild(listContainer);
    layout.appendChild(detail);

    page.appendChild(layout);

    return page;
}
