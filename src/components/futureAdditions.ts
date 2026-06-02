import showdown from "showdown";
import { gompeiVisionAdditionsData } from "../data/projects/gompeivision/gompeiVisionAdditions.ts";
import { technologyIcons } from "../data/technologyIcons";

const converter = new showdown.Converter({
    ghCompatibleHeaderId: true,
    simpleLineBreaks: true,
});

// Import projects files dynamically
const markdownFiles = import.meta.glob('../data/projects/**/*.md', { query: '?raw', import: 'default' });

export function createFutureAdditions(container: HTMLElement) {
    container.innerHTML = "";

    const splitContainer = document.createElement("div");
    splitContainer.className = "future-additions-split-layout";

    // 1. Left Menu Pane
    const menuPane = document.createElement("div");
    menuPane.className = "future-additions-menu";

    gompeiVisionAdditionsData.forEach((addition) => {
        const btn = document.createElement("button");
        btn.className = "menu-btn";
        btn.setAttribute("type", "button");
        btn.setAttribute("data-id", addition.id);
        btn.setAttribute("aria-label", `Show details for ${addition.title}`);

        const iconUrl = technologyIcons[addition.icon];
        const logoHTML = iconUrl 
            ? `<img class="menu-btn-logo" src="${iconUrl}" alt="${addition.icon} logo" />`
            : "";

        btn.innerHTML = `
            ${logoHTML}
            <span class="menu-btn-text">${addition.title}</span>
        `;

        btn.addEventListener("click", () => {
            selectFeature(addition.id, btn);
        });

        menuPane.appendChild(btn);
    });

    // 2. Right Content Card
    const cardPane = document.createElement("div");
    cardPane.className = "future-additions-content-card";

    const detailContent = document.createElement("div");
    detailContent.className = "future-additions-detail-content";
    cardPane.appendChild(detailContent);

    splitContainer.appendChild(menuPane);
    splitContainer.appendChild(cardPane);
    container.appendChild(splitContainer);

    const menuBtns = menuPane.querySelectorAll(".menu-btn");
    const mdCache: Record<string, string> = {};

    async function selectFeature(id: string, activeBtn: HTMLElement) {
        // Toggle active menu states
        menuBtns.forEach(b => b.classList.remove("active"));
        activeBtn.classList.add("active");

        const addition = gompeiVisionAdditionsData.find(a => a.id === id);
        if (!addition) return;

        // Transition fade out
        detailContent.classList.add("transition-out");

        try {
            let htmlContent = "";
            if (addition.markdownFile) {
                if (mdCache[addition.markdownFile]) {
                    htmlContent = mdCache[addition.markdownFile];
                } else {
                    const loadMarkdown = markdownFiles[addition.markdownFile] as () => Promise<string>;
                    if (loadMarkdown) {
                        const rawMd = await loadMarkdown();
                        htmlContent = converter.makeHtml(rawMd);
                        mdCache[addition.markdownFile] = htmlContent;
                    } else {
                        htmlContent = `<p>Details file not found: <code>${addition.markdownFile}</code></p>`;
                    }
                }
            } else {
                htmlContent = "<p>No description available.</p>";
            }

            // Wait briefly for transition (200ms matching CSS transition-out)
            setTimeout(() => {
                detailContent.innerHTML = htmlContent;
                detailContent.classList.remove("transition-out");
                
                // Adjust layout height if needed
                adjustLayout();
            }, 200);

        } catch (error) {
            console.error("Failed to load projects for future addition:", error);
            setTimeout(() => {
                detailContent.innerHTML = "<p>Error loading detailed explanation.</p>";
                detailContent.classList.remove("transition-out");
            }, 200);
        }
    }

    // Adapt layout to size constraint
    function adjustLayout() {
        const parent = container.parentElement;
        const availableWidth = parent ? parent.getBoundingClientRect().width : window.innerWidth;

        if (window.innerWidth <= 768 || availableWidth < 720) {
            splitContainer.classList.add("stacked-layout");
        } else {
            splitContainer.classList.remove("stacked-layout");
        }
    }

    const resizeHandler = () => {
        if (!document.body.contains(container)) {
            window.removeEventListener("resize", resizeHandler);
            return;
        }
        adjustLayout();
    };
    window.addEventListener("resize", resizeHandler);

    // Run initial layout check
    adjustLayout();

    // Auto-select first menu item by default
    if (menuBtns.length > 0) {
        const firstBtn = menuBtns[0] as HTMLElement;
        const firstId = firstBtn.getAttribute("data-id");
        if (firstId) {
            selectFeature(firstId, firstBtn);
        }
    }
}
