import { navigate } from "../router.ts";

import { renderHome } from "../pages/home.ts";
import { renderProjects } from "../pages/projects.ts";
import { createContactLinks } from "./contactLinks.ts";
import {renderAboutMe} from "../pages/aboutme.ts";

export function createSidebar(): HTMLElement {
    const sidebar = document.createElement("aside");

    sidebar.className = "sidebar";

    sidebar.innerHTML = `
        <div class="sidebar-top">
            <div class="sidebar-header">
                <img class="profile-photo" src="public/favicon.svg" alt="Elliot Scher" />
                <h1 class="logo">Elliot Scher</h1>
            </div>

            <nav>
                <button id="home-button">
                    Home
                </button>

                <button id="projects-button">
                    Projects
                </button>
                
                <button id="about-me-button">
                    About Me
                </button>
            </nav>
        </div>
        
        <div class="sidebar-footer">
        </div>
    `;
    
    const footer = sidebar.querySelector('.sidebar-footer');
    if (footer) {
        footer.appendChild(createContactLinks());
    }

    sidebar
        .querySelector("#home-button")
        ?.addEventListener("click", () => {
            navigate(renderHome());
        });

    sidebar
        .querySelector("#projects-button")
        ?.addEventListener("click", () => {
            navigate(renderProjects());
        });

    sidebar.querySelector("#about-me-button")
        ?.addEventListener("click", () => {
            navigate(renderAboutMe());
        })

    return sidebar;
}