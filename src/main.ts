import "./styles/main.css";
import "highlight.js/styles/github-dark.css";

import { createSidebar } from "./components/sidebar";
import { initRouter } from "./router";

const app = document.getElementById("app");

if (!app) {
    throw new Error("Missing app");
}

const layout = document.createElement("div");
layout.className = "layout";

// Create mobile header
const mobileHeader = document.createElement("header");
mobileHeader.className = "mobile-header";
mobileHeader.innerHTML = `
    <button class="mobile-menu-toggle" aria-label="Toggle Menu">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" x2="20" y1="12" y2="12"></line>
            <line x1="4" x2="20" y1="6" y2="6"></line>
            <line x1="4" x2="20" y1="18" y2="18"></line>
        </svg>
    </button>
    <div class="mobile-logo-wrapper">
        <img class="profile-photo-small" src="${import.meta.env.BASE_URL}favicon.svg" alt="Elliot Scher" />
        <span class="mobile-logo-text">Elliot Scher</span>
    </div>
    <div style="width: 40px;"></div> <!-- Spacer to visually balance menu button -->
`;

const backdrop = document.createElement("div");
backdrop.className = "sidebar-backdrop";

const sidebar = createSidebar();

const content = document.createElement("main");
content.id = "content";

layout.appendChild(mobileHeader);
layout.appendChild(backdrop);
layout.appendChild(sidebar);
layout.appendChild(content);

app.appendChild(layout);

mobileHeader.querySelector(".mobile-menu-toggle")?.addEventListener("click", () => {
    layout.classList.toggle("sidebar-open");
});

backdrop.addEventListener("click", () => {
    layout.classList.remove("sidebar-open");
});

initRouter();