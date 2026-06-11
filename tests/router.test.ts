import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { initRouter } from "../src/router";
import * as hashUtils from "../src/utils/hash";

// Mock IntersectionObserver globally
globalThis.IntersectionObserver = class MockIntersectionObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    constructor() {}
} as any;

describe("Router Component", () => {
    let contentDiv: HTMLElement;
    let hashchangeListener: Function | null = null;

    beforeEach(() => {
        hashchangeListener = null;
        vi.spyOn(window, "addEventListener").mockImplementation((event, listener) => {
            if (event === "hashchange") {
                hashchangeListener = listener as Function;
            }
        });

        // Mock the sidebar navigation element
        const sidebar = document.createElement("div");
        sidebar.className = "sidebar";
        sidebar.innerHTML = `
            <nav>
                <button id="home-button"></button>
                <button id="projects-button"></button>
                <button id="about-button"></button>
                <button id="resume-button"></button>
            </nav>
        `;
        document.body.appendChild(sidebar);

        contentDiv = document.createElement("div");
        contentDiv.id = "content";
        document.body.appendChild(contentDiv);
    });

    afterEach(() => {
        document.body.innerHTML = "";
        vi.restoreAllMocks();
    });

    it("should initialize routing listeners and navigate to home by default", () => {
        vi.spyOn(hashUtils, "parseHash").mockReturnValue({
            path: "/",
            queryParams: {},
            anchor: ""
        });

        initRouter();
        expect(contentDiv.textContent).toContain("Elliot Scher");
    });

    it("should navigate to about page on hash change", () => {
        initRouter();
        
        vi.spyOn(hashUtils, "parseHash").mockReturnValue({
            path: "/about",
            queryParams: {},
            anchor: ""
        });

        if (hashchangeListener) {
            hashchangeListener();
        }

        expect(contentDiv.textContent).toContain("Project Context & Background");
    });

    it("should navigate to resume page on hash change", () => {
        initRouter();
        
        vi.spyOn(hashUtils, "parseHash").mockReturnValue({
            path: "/resume",
            queryParams: {},
            anchor: ""
        });

        if (hashchangeListener) {
            hashchangeListener();
        }

        expect(contentDiv.textContent).toContain("Resume");
    });
});
