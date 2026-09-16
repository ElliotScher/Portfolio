import { describe, it, expect, beforeEach } from "vitest";
import { recordProjectViewTime, getProjectViewTimes, getFeaturedProjectForResume, getRankedProjectsForResume, resetProjectViewTimes } from "../src/utils/analytics";
import { ProjectTexKey } from "../src/data/projects/projectTexMap";

describe("Analytics Module", () => {
    beforeEach(() => {
        resetProjectViewTimes();
    });

    it("should initially have no view times recorded", () => {
        const times = getProjectViewTimes();
        expect(times).toEqual({});
    });

    it("should record viewing time for a project under its mapped LaTeX key", () => {
        // GompeiVision maps to ProjectTexKey.GompeiVision ("gompeivision")
        recordProjectViewTime("GompeiVision", 5000);
        const times = getProjectViewTimes();
        expect(times[ProjectTexKey.GompeiVision]).toBe(5000);
    });

    it("should aggregate viewing time for multiple view events of the same project", () => {
        recordProjectViewTime("GompeiVision", 3000);
        recordProjectViewTime("GompeiVision", 4000);
        const times = getProjectViewTimes();
        expect(times[ProjectTexKey.GompeiVision]).toBe(7000);
    });

    it("should aggregate viewing times for projects mapping to the same LaTeX file", () => {
        // FRC1902024Codebase and FRC1902025Codebase both map to first_mentor (ProjectTexKey.FirstMentor)
        recordProjectViewTime("FRC1902024Codebase", 2000);
        recordProjectViewTime("FRC1902025Codebase", 3000);
        const times = getProjectViewTimes();
        expect(times[ProjectTexKey.FirstMentor]).toBe(5000);
    });

    it("should default the featured project to GompeiVision when nothing is tracked", () => {
        expect(getFeaturedProjectForResume()).toBe(ProjectTexKey.GompeiVision);
    });

    it("should feature whichever project has the most view time, even if job-affiliated", () => {
        recordProjectViewTime("ParkVision", 100000);
        recordProjectViewTime("GompeiLib", 5000);
        expect(getFeaturedProjectForResume()).toBe(ProjectTexKey.ParkVision);
    });

    it("should rank the remaining projects by view duration descending, excluding whichever is featured", () => {
        // Set up durations: GompeiLib = 20s, NixHub = 10s, RBE3001 (RobotArm) = 5s.
        // GompeiLib has the most view time, so it becomes the featured entry
        // and is excluded from the ranked list — ranking starts at #2.
        recordProjectViewTime("GompeiLib", 20000);
        recordProjectViewTime("NixHub", 10000);
        recordProjectViewTime("RBE3001", 5000);

        expect(getFeaturedProjectForResume()).toBe(ProjectTexKey.GompeiLib);

        const ranked = getRankedProjectsForResume();
        expect(ranked).not.toContain(ProjectTexKey.GompeiLib);
        expect(ranked.slice(0, 2)).toEqual([
            ProjectTexKey.NixHub,
            ProjectTexKey.RobotArm
        ]);
    });

    it("should never rank a job-affiliated project, whether or not it's featured", () => {
        // GompeiVision becomes featured (most view time); WPICal and
        // ParkVision are tracked but not featured — per the resume's rule,
        // a job-affiliated project that isn't featured stays in Experience
        // in reverse-chronological order, never entering the ranked list.
        recordProjectViewTime("GompeiVision", 50000);
        recordProjectViewTime("WPICal", 40000);
        recordProjectViewTime("ParkVision", 30000);
        recordProjectViewTime("NixHub", 1000);

        const ranked = getRankedProjectsForResume();
        expect(ranked).not.toContain(ProjectTexKey.GompeiVision);
        expect(ranked).not.toContain(ProjectTexKey.WpiCal);
        expect(ranked).not.toContain(ProjectTexKey.ParkVision);
        expect(ranked[0]).toBe(ProjectTexKey.NixHub);
    });

    it("should always sort portfolio-less resume fragments (Kitbot, Software Knowledge Base) last", () => {
        recordProjectViewTime("NixHub", 1000);

        const ranked = getRankedProjectsForResume();
        const kitbotIndex = ranked.indexOf(ProjectTexKey.Kitbot);
        const knowledgeBaseIndex = ranked.indexOf(ProjectTexKey.SoftwareKnowledgeBase);

        expect(kitbotIndex).toBe(ranked.length - 2);
        expect(knowledgeBaseIndex).toBe(ranked.length - 1);
    });
});
