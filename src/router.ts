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
        sidebar.querySelector("#about-me-button")?.classList.add("active");
    }
}