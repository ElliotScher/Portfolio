import { createContactLinks } from "../components/contactLinks.ts";

export function renderHome(): HTMLElement {
    const page = document.createElement("div");
    page.className = "page home";

    page.innerHTML = `
        <section class="hero">
            <div class="hero-left">
                <span class="hero-badge">Robotics Engineering Student</span>
                <h1>Elliot Scher</h1>

                <p class="subtitle">
                    Developing practical software for robotics, computer vision, and real-time control applications.
                </p>

                <div class="hero-actions">
                    <a href="#/projects" class="btn btn-primary">Explore Projects</a>
                    <a href="#/about" class="btn btn-secondary">Deep Dives & Role Clarifications</a>
                </div>

                <div class="hero-contact-links">
                </div>
            </div>
        </section>
    `;

    const contactLinksContainer = page.querySelector('.hero-contact-links');
    if (contactLinksContainer) {
        contactLinksContainer.appendChild(createContactLinks());
    }

    return page;
}
