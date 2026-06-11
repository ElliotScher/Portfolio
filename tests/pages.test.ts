import { describe, it, expect, vi } from "vitest";

// Mock IntersectionObserver globally
globalThis.IntersectionObserver = class MockIntersectionObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    constructor() {}
} as any;
import { renderHome } from "../src/pages/home";
import { renderAboutMe } from "../src/pages/aboutme";
import { renderProjects } from "../src/pages/projects";
import { projects } from "../src/data/projects/projects";

describe("Home Page", () => {
    it("should render home page structure and contact links container", () => {
        const el = renderHome();
        expect(el.classList.contains("home")).toBe(true);
        expect(el.querySelector("h1")?.textContent).toBe("Elliot Scher");
        expect(el.querySelector(".hero-contact-links")).toBeTruthy();
    });
});

describe("About Me Page", () => {
    it("should render about me page with educational context", () => {
        const el = renderAboutMe();
        expect(el.className).toBe("page-about-me");
        expect(el.querySelector("h1")?.textContent).toBe("Project Context & Background");
        expect(el.innerHTML).toContain("Worcester Polytechnic Institute");
    });
});

describe("Projects Page", () => {
    it("should render collapsible project list and project detail wrappers", () => {
        const el = renderProjects();
        expect(el.querySelector(".projects-page-layout")).toBeTruthy();
        expect(el.querySelector(".project-list")).toBeTruthy();
        expect(el.querySelector(".project-detail-wrapper")).toBeTruthy();
    });

    it("should select initial project when provided", () => {
        const target = projects[1];
        const el = renderProjects(target);
        
        const activeCard = el.querySelector(".project-card.active");
        expect(activeCard?.getAttribute("data-project-id")).toBe(target.id);
        
        const detailTitle = el.querySelector(".project-detail-title-row h1");
        expect(detailTitle?.textContent).toBe(target.title);
    });

    it("should handle showDetailOnMobile parameter", () => {
        const el = renderProjects(undefined, true);
        const layout = el.querySelector(".projects-page-layout");
        expect(layout?.classList.contains("show-detail")).toBe(true);
    });
});
