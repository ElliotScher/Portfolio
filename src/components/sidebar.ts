import { createContactLinks } from "./contactLinks.ts";

export function createSidebar(): HTMLElement {
    const sidebar = document.createElement("aside");

    sidebar.className = "sidebar";

    sidebar.innerHTML = `
        <div class="sidebar-top">
            <div class="sidebar-header">
                <img class="profile-photo" src="${import.meta.env.BASE_URL}assets/headshots/headshot2 (Edited).png" alt="Elliot Scher" />
                <h1 class="logo">Elliot Scher</h1>
            </div>

            <nav>
                <button id="home-button" title="Home">
                    <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                    <span class="nav-label">Home</span>
                </button>

                <button id="projects-button" title="Projects">
                    <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect width="7" height="7" x="3" y="3" rx="1"/>
                        <rect width="7" height="7" x="14" y="3" rx="1"/>
                        <rect width="7" height="7" x="14" y="14" rx="1"/>
                        <rect width="7" height="7" x="3" y="14" rx="1"/>
                    </svg>
                    <span class="nav-label">Projects</span>
                </button>

                <button id="about-button" title="About">
                    <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span class="nav-label">About</span>
                </button>

                <button id="resume-button" title="Resume">
                    <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
                        <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
                        <path d="M10 9H8"/>
                        <path d="M16 13H8"/>
                        <path d="M16 17H8"/>
                    </svg>
                    <span class="nav-label">Resume</span>
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

    sidebar.querySelector("#resume-button")
        ?.addEventListener("click", () => {
            window.location.hash = "#/resume";
            closeMobileSidebar();
        });

    return sidebar;
}