import { createContactLinks } from "../components/contactLinks.ts";

export function renderHome(): HTMLElement {
    const page = document.createElement("div");
    page.className = "page home";

    page.innerHTML = `
        <section class="hero">
            <div class="hero-left">
                <h1>Elliot Scher</h1>

                <p class="subtitle">
                    Robotics programmer · Systems developer ·
                    Low-level / real-world engineering
                </p>

                <div class="hero-contact-links">
                </div>
            </div>
        </section>

        <section class="quick-info">
            <div class="card">
                <h3>Focus</h3>
                <p>Computer vision, robotics systems, backend tooling</p>
            </div>

            <div class="card">
                <h3>Experience</h3>
                <p>FRC vision pipelines, USB camera systems, telemetry</p>
            </div>

            <div class="card">
                <h3>Stack</h3>
                <p>C++, Java, Python, OpenCV, Linux</p>
            </div>
        </section>
    `;

    const contactLinksContainer = page.querySelector('.hero-contact-links');
    if (contactLinksContainer) {
        contactLinksContainer.appendChild(createContactLinks());
    }

    // Event listeners for hero actions
    const viewProjectsBtn = page.querySelector('.primary') as HTMLButtonElement;
    if (viewProjectsBtn) {
        viewProjectsBtn.onclick = () => {
            const infoSection = page.querySelector('.quick-info');
            infoSection?.scrollIntoView({ behavior: 'smooth' });
        };
    }

    return page;
}