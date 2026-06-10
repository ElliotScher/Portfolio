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

        <section class="intro-grid">
            <div class="intro-card who-i-am animate-fade-in">
                <div class="intro-card-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </div>
                <h3>Who I Am</h3>
                <p>
                    I am a robotics engineering student specializing in low-level robotic software engineering, performance-critical backends, and embedded development. I love turning complex mathematical models into predictable, deterministic physical operations.
                </p>
            </div>

            <div class="intro-card where-i-go animate-fade-in">
                <div class="intro-card-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
                    </svg>
                </div>
                <h3>Where I Go</h3>
                <p>
                    I study at <strong>Worcester Polytechnic Institute (WPI)</strong>, pursuing my degree in Robotics Engineering. I actively work with the <strong>WPI Robotics Resource Center (RRC)</strong> to mentor students in robotics and teach them software development best practices.
                </p>
            </div>

            <div class="intro-card what-i-do animate-fade-in">
                <div class="intro-card-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                </div>
                <h3>What I Do</h3>
                <p>
                    I am the <strong>Lead Controls Mentor on FRC Team 190</strong>, guiding student programmers to design robust robot codebases. I also develop open-source frameworks like <strong>GompeiVision</strong> (AprilTag tracking) and <strong>GompeiLib</strong>.
                </p>
            </div>
        </section>
    `;

    const contactLinksContainer = page.querySelector('.hero-contact-links');
    if (contactLinksContainer) {
        contactLinksContainer.appendChild(createContactLinks());
    }

    return page;
}