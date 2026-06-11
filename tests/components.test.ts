import { describe, it, expect, vi } from "vitest";
import { createContactLinks } from "../src/components/contactLinks";
import { createSidebar } from "../src/components/sidebar";
import { createProjectList } from "../src/components/projectList";
import { createTechStack } from "../src/components/techStack";
import { createProcessDiagram } from "../src/components/processDiagram";
import { createFutureAdditions } from "../src/components/futureAdditions";
import { createMediaGallery } from "../src/components/mediaGallery";
import type { MediaItem } from "../src/components/mediaGallery";
import type { Project } from "../src/data/projects/projects";
import type { ProcessNode } from "../src/components/processDiagram";
import type { FutureAddition } from "../src/components/futureAdditions";

// Mock IntersectionObserver globally
globalThis.IntersectionObserver = class MockIntersectionObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    constructor() {}
} as any;

const mockProjects: Project[] = [
    {
        id: "proj1",
        title: "Test Project 1",
        summary: "Summary of project 1",
        technologies: ["C++", "VEX"],
        markdownFile: "test1.md",
        resumeTexFile: "gompeivision" as any
    },
    {
        id: "proj2",
        title: "Test Project 2",
        summary: "Summary of project 2",
        technologies: ["Python"],
        markdownFile: "test2.md",
        resumeTexFile: "wpical" as any
    }
];

describe("ContactLinks Component", () => {
    it("should render contact links with correct href targets", () => {
        const el = createContactLinks();
        expect(el.className).toBe("contact-links");
        
        const anchors = el.querySelectorAll("a");
        expect(anchors.length).toBe(3);
        expect(anchors[0].getAttribute("href")).toContain("mailto:");
        expect(anchors[1].getAttribute("href")).toBe("https://github.com/ElliotScher");
        expect(anchors[2].getAttribute("href")).toBe("https://linkedin.com/in/elliotscher");
    });
});

describe("Sidebar Component", () => {
    it("should render navigation buttons and close mobile layout on click", () => {
        const el = createSidebar();
        expect(el.tagName.toLowerCase()).toBe("aside");
        
        const homeBtn = el.querySelector("#home-button");
        const projectsBtn = el.querySelector("#projects-button");
        const aboutBtn = el.querySelector("#about-button");
        const resumeBtn = el.querySelector("#resume-button");

        expect(homeBtn).toBeTruthy();
        expect(projectsBtn).toBeTruthy();
        expect(aboutBtn).toBeTruthy();
        expect(resumeBtn).toBeTruthy();

        // Create layout div to test class removal
        const layout = document.createElement("div");
        layout.className = "layout sidebar-open";
        document.body.appendChild(layout);

        homeBtn?.dispatchEvent(new Event("click"));
        expect(window.location.hash).toBe("#/home");
        expect(layout.classList.contains("sidebar-open")).toBe(false);

        document.body.removeChild(layout);
    });
});

describe("ProjectList Component", () => {
    it("should render project cards and set active state", () => {
        const el = createProjectList(mockProjects, mockProjects[0]);
        expect(el.className).toBe("project-list");
        
        const cards = el.querySelectorAll(".project-card");
        expect(cards.length).toBe(2);
        expect(cards[0].classList.contains("active")).toBe(true);
        expect(cards[1].classList.contains("active")).toBe(false);

        expect(cards[0].querySelector(".project-card-title")?.textContent).toBe("Test Project 1");
        expect(cards[0].querySelector(".project-card-summary")?.textContent).toBe("Summary of project 1");
    });

    it("should update window hash on project card click", () => {
        const el = createProjectList(mockProjects);
        const secondCard = el.querySelectorAll(".project-card")[1];

        secondCard.dispatchEvent(new Event("click"));
        expect(window.location.hash).toBe("#/projects/proj2");
    });
});

describe("TechStack Component", () => {
    it("should render empty state when no technologies are listed", () => {
        const el = createTechStack([]);
        expect(el.querySelector(".tech-stack-empty")).toBeTruthy();
    });

    it("should render floating bubbles when no projectId is provided", () => {
        const el = createTechStack(["C++", "Python", "VEX"]);
        expect(el.classList.contains("tech-stack-widget")).toBe(true);
        expect(el.classList.contains("floating-mode")).toBe(true);
        
        const bubbles = el.querySelectorAll(".tech-circle");
        expect(bubbles.length).toBe(3);
    });

    it("should render geometric wheel when projectId is provided", () => {
        const el = createTechStack(["C++", "Python", "VEX"], "proj1");
        expect(el.classList.contains("floating-mode")).toBe(false);
        expect(el.querySelector(".tech-stack-svg")).toBeTruthy();
        expect(el.querySelector("polygon")).toBeTruthy();
    });
});

describe("ProcessDiagram Component", () => {
    it("should render step nodes and connector paths", () => {
        const mockDiagramData: ProcessNode[] = [
            { id: "step1", label: "Initialization", markdownFile: "step1.md" },
            { id: "step2", label: "Execution", markdownFile: "step2.md" }
        ];

        const container = document.createElement("div");
        createProcessDiagram(container, mockDiagramData);

        const stepper = container.querySelector(".process-stepper");
        expect(stepper).toBeTruthy();
        
        const nodes = stepper?.querySelectorAll(".step-node");
        expect(nodes?.length).toBe(2);

        const connectors = stepper?.querySelectorAll(".step-connector");
        expect(connectors?.length).toBe(1);
    });
});

describe("FutureAdditions Component", () => {
    it("should render menu buttons and detail content container", () => {
        const mockAdditions: FutureAddition[] = [
            { id: "feat1", title: "Autonomy", summary: "Self-driving features", markdownFile: "feat1.md", icon: "Python" }
        ];

        const container = document.createElement("div");
        createFutureAdditions(container, mockAdditions);

        const menu = container.querySelector(".future-additions-menu");
        expect(menu).toBeTruthy();

        const btn = menu?.querySelector(".menu-btn");
        expect(btn?.querySelector(".menu-btn-text")?.textContent).toBe("Autonomy");

        expect(container.querySelector(".future-additions-content-card")).toBeTruthy();
    });
});

describe("MediaGallery Component", () => {
    it("should render media items successfully", async () => {
        const mockMedia: MediaItem[] = [
            { src: "assets/img1.jpg", title: "Image 1", alt: "Alt text 1" },
            { src: "assets/vid1.mp4", title: "Video 1", startTime: 2, endTime: 5 }
        ];

        const container = document.createElement("div");
        createMediaGallery(container, mockMedia);

        const cards = container.querySelectorAll(".media-gallery-card");
        expect(cards.length).toBe(2);

        // Click on the first card to trigger lightbox rendering
        cards[0].dispatchEvent(new Event("click"));
        
        const lightbox = document.body.querySelector(".media-lightbox-overlay");
        expect(lightbox).toBeTruthy();

        // Close lightbox
        const closeBtn = lightbox?.querySelector(".lightbox-close-btn");
        closeBtn?.dispatchEvent(new Event("click"));

        lightbox?.dispatchEvent(new Event("animationend"));
        expect(document.body.querySelector(".media-lightbox-overlay")).toBeFalsy();
    });
});
