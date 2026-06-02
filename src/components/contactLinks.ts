export function createContactLinks(): HTMLElement {
    const container = document.createElement("div");
    container.className = "contact-links";

    const emailIcon = `
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        class="contact-icon"
    >
        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
    </svg>
    `;

    const githubIcon = `
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="contact-icon"
    >
        <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 5.02 3.25 9.27 7.76 10.77.57.1.78-.25.78-.55v-2.02c-3.15.68-3.81-1.34-3.81-1.34-.52-1.3-1.26-1.65-1.26-1.65-1.03-.7.08-.69.08-.69 1.13.08 1.73 1.17 1.73 1.17 1.01 1.73 2.64 1.23 3.28.94.1-.73.4-1.23.72-1.52-2.52-.29-5.17-1.26-5.17-5.62 0-1.24.44-2.25 1.16-3.05-.12-.29-.5-1.46.11-3.04 0 0 .95-.3 3.11 1.16a10.8 10.8 0 0 1 5.66 0c2.16-1.46 3.1-1.16 3.1-1.16.62 1.58.24 2.75.12 3.04.72.8 1.15 1.81 1.15 3.05 0 4.37-2.66 5.32-5.2 5.6.41.36.77 1.08.77 2.18v3.23c0 .3.2.66.79.55 4.5-1.5 7.75-5.75 7.75-10.77C23.25 5.48 18.27.5 12 .5Z"/>
    </svg>
    `;

    const linkedinIcon = `
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="contact-icon"
    >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
    `;

    container.innerHTML = `
        <a href="mailto:ecscher84@gmail.com,ecscher@wpi.edu" class="contact-link" aria-label="Email">
            ${emailIcon}
        </a>
        <a href="https://github.com/ElliotScher" target="_blank" rel="noopener noreferrer" class="contact-link" aria-label="GitHub">
            ${githubIcon}
        </a>
        <a href="https://linkedin.com/in/elliotscher" target="_blank" rel="noopener noreferrer" class="contact-link" aria-label="LinkedIn">
            ${linkedinIcon}
        </a>
    `;

    return container;
}