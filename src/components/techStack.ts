import { markdownConverter } from "../utils/markdown";
import { technologyIcons } from "../assets/logos/technologyIcons.ts";
import hljs from "highlight.js";



// Import projects files dynamically
const markdownFiles = import.meta.glob('../data/projects/**/*.md', { query: '?raw', import: 'default' });

/**
 * Utility to sanitize technology names into valid file names
 */
function getTechFileName(tech: string): string {
    return tech
        .toLowerCase()
        .replace(/\+\+/g, 'pp')
        .replace(/#/g, 'sharp')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '');
}

export function createTechStack(technologies: string[], projectId?: string, markdownFile?: string): HTMLElement {
    const container = document.createElement("div");
    container.className = "tech-stack-widget";
    if (!projectId) {
        container.classList.add("floating-mode");
    }

    const N = technologies.length;
    if (N === 0) {
        container.innerHTML = `<p class="tech-stack-empty">No technologies listed.</p>`;
        return container;
    }

    // Geometry parameters for viewport
    const size = !projectId ? 400 : 360;
    const cx = size / 2;
    const cy = size / 2;
    const R = 120; // Radius of polygon vertices
    const circleRadius = 32; // Half of 64px diameter

    // Calculate coordinates for each technology
    const points: { x: number; y: number; scale?: number; tech: string }[] = [];
    if (!projectId) {
        // Pre-calculated highly scattered asymmetrical coordinates with varying sizes
        const coords = [
            { x: 50, y: 55, scale: 1.15 },
            { x: 145, y: 110, scale: 0.8 },
            { x: 235, y: 50, scale: 1.0 },
            { x: 345, y: 80, scale: 0.8 },
            { x: 65, y: 195, scale: 0.8 },
            { x: 185, y: 175, scale: 1.2 },
            { x: 285, y: 210, scale: 0.8 },
            { x: 355, y: 170, scale: 1.05 },
            { x: 55, y: 335, scale: 1.0 },
            { x: 155, y: 345, scale: 0.8 },
            { x: 255, y: 315, scale: 1.25 },
            { x: 345, y: 325, scale: 0.85 }
        ];

        // Shuffle the coordinates array using Fisher-Yates shuffle
        for (let i = coords.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [coords[i], coords[j]] = [coords[j], coords[i]];
        }

        for (let i = 0; i < N; i++) {
            const coord = coords[i] || { x: cx, y: cy, scale: 1.0 };
            points.push({ x: coord.x, y: coord.y, scale: coord.scale, tech: technologies[i] });
        }
    } else {
        for (let i = 0; i < N; i++) {
            const theta = (2 * Math.PI * i) / N - Math.PI / 2;
            const x = cx + R * Math.cos(theta);
            const y = cy + R * Math.sin(theta);
            points.push({ x, y, tech: technologies[i] });
        }
    }

    // Generate SVG path points for geometric mode
    let pointsString = points.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
    
    // Create HTML structure
    if (!projectId) {
        // Floating mode (no SVGs, no center labels, just dispersed tech circles of varying sizes)
        container.innerHTML = `
            <div class="tech-stack-wheel-pane">
                <div class="tech-stack-wheel-container">
                    <div class="tech-stack-circles-container">
                        ${points.map((p) => {
                            const iconUrl = technologyIcons[p.tech];
                            const displayContent = iconUrl 
                                ? `<img class="tech-circle-icon" src="${iconUrl}" alt="${p.tech}" />`
                                : `<span class="tech-circle-text">${p.tech.substring(0, 3)}</span>`;
                            
                            return `
                                <button class="tech-circle" data-tech="${p.tech}">
                                    ${displayContent}
                                    <span class="tech-circle-tooltip">${p.tech}</span>
                                </button>
                            `;
                        }).join("")}
                    </div>
                </div>
            </div>
            <div class="tech-stack-detail-pane">
                <div class="tech-stack-detail-content">
                    <div class="tech-stack-welcome-state">
                        <h3>Core Expertise</h3>
                        <p>Click on any technology bubble to view detailed information about my experience and its usage across my projects.</p>
                    </div>
                </div>
            </div>
        `;
    } else {
        // Geometric wheel mode (connected lines, SVGs, center labels)
        container.innerHTML = `
            <div class="tech-stack-wheel-pane">
                <div class="tech-stack-wheel-container">
                    <!-- SVG lines behind circles -->
                    <svg class="tech-stack-svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
                        <!-- Outer reference circle -->
                        <circle cx="${cx}" cy="${cy}" r="${R}" class="tech-stack-ref-circle" />
                        
                        <!-- Dynamic Geometric Shape Polygon -->
                        ${N >= 3 ? `<polygon points="${pointsString}" class="tech-stack-polygon" />` : ""}
                        ${N === 2 ? `<line x1="${points[0].x}" y1="${points[0].y}" x2="${points[1].x}" y2="${points[1].y}" class="tech-stack-polygon" />` : ""}
                        
                        <!-- Center lines for 3+ vertices -->
                        ${N >= 3 ? points.map(p => `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" class="tech-stack-center-line" />`).join("") : ""}
                    </svg>
                    
                    <!-- Clickable Circles -->
                    <div class="tech-stack-circles-container">
                        ${points.map((p) => {
                            const iconUrl = technologyIcons[p.tech];
                            const displayContent = iconUrl 
                                ? `<img class="tech-circle-icon" src="${iconUrl}" alt="${p.tech}" />`
                                : `<span class="tech-circle-text">${p.tech.substring(0, 3)}</span>`;
                            
                            return `
                                <button class="tech-circle" data-tech="${p.tech}">
                                    ${displayContent}
                                    <span class="tech-circle-tooltip">${p.tech}</span>
                                </button>
                            `;
                        }).join("")}
                        
                        <!-- Central active text/logo -->
                        <div class="tech-stack-center-label">
                            <span class="center-tech-name">Select Tech</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tech-stack-detail-pane">
                <div class="tech-stack-detail-content">
                    <div class="tech-stack-welcome-state">
                        <h3>Project Technology Stack</h3>
                        <p>Click on any technology circle in the geometric diagram to view detailed reasons why it was selected for this project.</p>
                    </div>
                </div>
            </div>
        `;
    }

    const detailContent = container.querySelector(".tech-stack-detail-content") as HTMLElement;
    const centerLabel = container.querySelector(".center-tech-name") as HTMLElement;

    let lastWidth = 0;
    let lastWindowWidth = 0;

    function adjustLayout(force = false) {
        const parent = container.parentElement;
        const availableWidth = parent ? parent.getBoundingClientRect().width : window.innerWidth;
        const currentWindowWidth = window.innerWidth;

        // Skip calculations if width hasn't changed (e.g. mobile height-only resize on scroll)
        if (!force && availableWidth === lastWidth && currentWindowWidth === lastWindowWidth) {
            return;
        }

        lastWidth = availableWidth;
        lastWindowWidth = currentWindowWidth;

        let shouldStack = currentWindowWidth <= 768 || availableWidth < 720;

        if (!shouldStack) {
            container.classList.remove("stacked-layout");
            const detailPane = container.querySelector(".tech-stack-detail-pane") as HTMLElement;
            if (detailPane) {
                // If scrollHeight is strictly greater than clientHeight, it overflows
                const hasOverflow = detailPane.scrollHeight > detailPane.clientHeight;
                if (hasOverflow) {
                    shouldStack = true;
                }
            }
        }

        if (shouldStack) {
            container.classList.add("stacked-layout");
        } else {
            container.classList.remove("stacked-layout");
        }

        // Dynamically scale the wheel container to fit the available space
        requestAnimationFrame(() => {
            const wheelPane = container.querySelector(".tech-stack-wheel-pane") as HTMLElement;
            const wheelContainer = container.querySelector(".tech-stack-wheel-container") as HTMLElement;
            if (wheelPane && wheelContainer) {
                const paneWidth = wheelPane.getBoundingClientRect().width;
                const marginFactor = 32; // 16px safety margin on each side
                const targetWidth = paneWidth - marginFactor;

                wheelContainer.style.transformOrigin = "center center";

                if (targetWidth < size) { // size is 360
                    const scale = targetWidth / size;
                    wheelContainer.style.transform = `scale(${scale.toFixed(3)}) translate3d(0, 0, 0)`;
                    wheelContainer.style.left = `${((paneWidth - size) / 2).toFixed(1)}px`;
                    // Apply negative vertical margin to avoid empty spaces due to scale transform bounding box
                    const verticalMargin = Math.round((size * (scale - 1)) / 2);
                    wheelContainer.style.margin = `${verticalMargin}px 0`;
                } else {
                    wheelContainer.style.transform = "translate3d(0, 0, 0)";
                    wheelContainer.style.left = "0px";
                    wheelContainer.style.margin = "0 auto";
                }
            }
        });
    }

    const resizeHandler = () => {
        if (!document.body.contains(container)) {
            window.removeEventListener("resize", resizeHandler);
            return;
        }
        adjustLayout(false);
    };
    window.addEventListener("resize", resizeHandler);
    
    // Apply styling programmatically to avoid HTML template string CSS parser warnings
    const wheelContainer = container.querySelector(".tech-stack-wheel-container") as HTMLElement;
    if (wheelContainer) {
        wheelContainer.style.width = `${size}px`;
        wheelContainer.style.height = `${size}px`;
    }

    const circles = container.querySelectorAll(".tech-circle");
    circles.forEach((circle, i) => {
        const p = points[i];
        (circle as HTMLElement).style.left = `${(p.x - circleRadius).toFixed(1)}px`;
        (circle as HTMLElement).style.top = `${(p.y - circleRadius).toFixed(1)}px`;
        if (p.scale) {
            (circle as HTMLElement).style.setProperty("--base-scale", p.scale.toString());
        }
    });

    const centerLabelContainer = container.querySelector(".tech-stack-center-label") as HTMLElement;
    if (centerLabelContainer) {
        centerLabelContainer.style.left = `${cx - 50}px`;
        centerLabelContainer.style.top = `${cy - 20}px`;
    }
    
    // Function to load and render tech reason projects
    async function selectTech(techName: string, element: HTMLElement) {
        // Update active class on circles
        circles.forEach(c => c.classList.remove("active"));
        element.classList.add("active");

        // Update center label
        if (centerLabel) {
            centerLabel.textContent = techName;
            centerLabel.classList.add("active");
        }

        const techFileName = getTechFileName(techName);
        let mdPath = "";

        if (projectId && (projectId === "FRC1902024Codebase" || projectId === "FRC1902025Codebase" || projectId === "FRC1902026Codebase")) {
            // Shared FRC 190 codebase technical choices
            mdPath = `../data/projects/frc190-common/tech-choices/${techFileName}.md`;
        } else if (markdownFile) {
            // Resolve path relative to the project's projects file directory
            const lastSlash = markdownFile.lastIndexOf("/");
            const dir = lastSlash !== -1 ? markdownFile.substring(0, lastSlash) : "..";
            mdPath = `${dir}/tech-choices/${techFileName}.md`;
        } else if (projectId) {
            // Fallback project-specific choice
            mdPath = `../data/projects/tech-choices/${projectId}/${techFileName}.md`;
        } else {
            // Global skill details (About Me)
            mdPath = `../data/projects/technologies/${techFileName}.md`;
        }

        detailContent.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner-wrapper">
                    <div class="loading-spinner"></div>
                    <div class="loading-spinner-inner"></div>
                </div>
                <div class="loading-text">Loading Details</div>
            </div>
        `;

        try {
            const loadMarkdown = markdownFiles[mdPath] as () => Promise<string>;
            if (loadMarkdown) {
                const rawMd = await loadMarkdown();
                detailContent.innerHTML = markdownConverter.makeHtml(rawMd);

                // Apply syntax highlighting to code blocks
                detailContent.querySelectorAll("pre code").forEach((block) => {
                    hljs.highlightElement(block as HTMLElement);
                });
            } else {
                detailContent.innerHTML = `
                    <h3>${techName}</h3>
                    <p class="tech-no-info">No project-specific technology reasoning markdown file found at <code>${mdPath.replace("../data/projects/", "src/data/projects/")}</code>.</p>
                `;
            }
        } catch (error) {
            detailContent.innerHTML = `
                <h3>${techName}</h3>
                <p class="tech-no-info">No custom explanation has been written for <strong>${techName}</strong> in this context.</p>
            `;
            console.warn(`Could not load markdown for ${techName} at ${mdPath}:`, error);
        }

        // Render LaTeX formulas
        if ((window as any).MathJax) {
            (window as any).MathJax.typesetClear([detailContent]);
            (window as any).MathJax.typesetPromise([detailContent]);
        }

        // Adjust layout based on content sizing
        adjustLayout(true);
    }

    // Attach click listeners to circles
    circles.forEach(circle => {
        circle.addEventListener("click", () => {
            const tech = circle.getAttribute("data-tech");
            if (tech) {
                selectTech(tech, circle as HTMLElement);
            }
        });
    });

    // Intercept clicks on links pointing to projects (deep linking)
    detailContent.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        const anchor = target.closest("a");
        if (anchor) {
            const href = anchor.getAttribute("href");
            if (href && href.startsWith("#project-")) {
                e.preventDefault();
                const projId = href.replace("#project-", "");
                window.location.hash = `#/projects/${projId}`;
            }
        }
    });

    // Auto-select the first technology circle by default
    if (circles.length > 0) {
        requestAnimationFrame(() => {
            const firstCircle = circles[0] as HTMLElement;
            const tech = firstCircle.getAttribute("data-tech");
            if (tech) {
                selectTech(tech, firstCircle);
            }
        });
    }

    return container;
}
