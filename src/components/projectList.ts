import type {Project} from "../data/projects";
import { setActiveProject } from "./projectDetail";
import { technologyIcons } from "../data/technologyIcons";

// Helper function to get an icon based on category
export function getCategoryIcon(category: string, className: string = "project-card-icon"): string {
    switch (category) {
        case "WPI":
            return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>`;
        case "FRC":
            return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><rect x="6" y="2" width="12" height="8" rx="2" ry="2"></rect><line x1="12" y1="14" x2="12" y2="10"></line></svg>`;
        case "Personal":
            return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
        default:
            return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }
}

export function createProjectList(projects: Project[], activeProject?: Project): HTMLElement {
    const container = document.createElement("div");
    container.className = "project-list";

    const targetActive = activeProject || projects[0];

    for (const project of projects) {
        const card = document.createElement("div");
        card.className = "project-card";
        
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
            setActiveProject(project);
            
            // Highlight the active card
            document.querySelectorAll(".project-card").forEach(c => c.classList.remove("active"));
            card.classList.add("active");

            // Transition layout view on mobile
            const layoutElement = card.closest(".projects-page-layout");
            if (layoutElement) {
                layoutElement.classList.remove("show-list");
                layoutElement.classList.add("show-detail");
            }
        });

        // Set the active project card initially
        if (targetActive && project.id === targetActive.id) {
            card.classList.add("active");
        }

        container.appendChild(card);
    }

    return container;
}
