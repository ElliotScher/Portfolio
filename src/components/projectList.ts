import type {Project} from "../data/projects/projects.ts";
import { technologyIcons } from "../assets/logos/technologyIcons.ts";

export function createProjectList(projects: Project[], activeProject?: Project): HTMLElement {
    const container = document.createElement("div");
    container.className = "project-list";

    const targetActive = activeProject || projects[0];

    for (const project of projects) {
        const card = document.createElement("div");
        card.className = "project-card";
        card.setAttribute("data-project-id", project.id);
        
        const cardContent = document.createElement("div");
        cardContent.className = "project-card-content";

        const textContent = document.createElement("div");
        textContent.className = "project-card-text";

        const title = document.createElement("h3");
        title.textContent = project.title;
        title.className = "project-card-title";

        const summary = document.createElement("p");
        summary.textContent = project.summary;
        summary.className = "project-card-summary";

        const techList = document.createElement("ul");
        techList.className = "tech-list";
        techList.innerHTML = project.technologies.map(t => {
            const iconUrl = technologyIcons[t];
            if (iconUrl) {
                 return `<li class="tech-icon-item">
                     <img src="${iconUrl}" alt="${t} logo" width="24" height="24">
                     <span class="tech-icon-tooltip">${t}</span>
                 </li>`;
            }
            return `<li class="tech-text-item">${t}</li>`;
        }).join("");

        textContent.appendChild(title);
        textContent.appendChild(summary);
        textContent.appendChild(techList);

        cardContent.appendChild(textContent);
        
        card.appendChild(cardContent);

        card.addEventListener("click", () => {
            window.location.hash = `#/projects/${project.id}`;
        });

        // Set the active project card initially
        if (targetActive && project.id === targetActive.id) {
            card.classList.add("active");
        }

        container.appendChild(card);
    }

    return container;
}
