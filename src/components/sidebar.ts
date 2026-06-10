import { createContactLinks } from "./contactLinks.ts";

export function createSidebar(): HTMLElement {
    const sidebar = document.createElement("aside");

    sidebar.className = "sidebar";

    sidebar.innerHTML = `
        <div class="sidebar-top">
            <div class="sidebar-header">
                <img class="profile-photo" src="${import.meta.env.BASE_URL}favicon.svg" alt="Elliot Scher" />
                <h1 class="logo">Elliot Scher</h1>
            </div>

            <nav>
                <button id="home-button">
                    Home
                </button>

                <button id="projects-button">
                    Projects
                </button>
                
                <button id="about-button">
                    About
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

    const closeMobileSidebar = () => {
        const layout = document.querySelector(".layout");
        if (layout) {
            layout.classList.remove("sidebar-open");
        }
    };

    sidebar
        .querySelector("#home-button")
        ?.addEventListener("click", () => {
            window.location.hash = "#/home";
            closeMobileSidebar();
        });

    sidebar
        .querySelector("#projects-button")
        ?.addEventListener("click", () => {
            window.location.hash = "#/projects";
            closeMobileSidebar();
        });

    sidebar.querySelector("#about-button")
        ?.addEventListener("click", () => {
            window.location.hash = "#/about";
            closeMobileSidebar();
        });

    return sidebar;
}