import { describe, it, expect, beforeEach } from "vitest";
import { recordProjectViewTime, getProjectViewTimes, getTopProjectsForResume, resetProjectViewTimes } from "../src/utils/analytics";
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

    it("should return the top projects sorted by view duration descending", () => {
        // Set up durations: WpiCal = 20s, GompeiVision = 10s, GompeiLib = 5s
        recordProjectViewTime("WPICal", 20000);
        recordProjectViewTime("GompeiVision", 10000);
        recordProjectViewTime("GompeiLib", 5000);

        const top = getTopProjectsForResume();
        expect(top).toEqual([
            ProjectTexKey.WpiCal,
            ProjectTexKey.GompeiVision,
            ProjectTexKey.GompeiLib
        ]);
    });

    it("should fall back to defaults if less than 3 projects are viewed", () => {
        // View only GompeiLib (5s)
        recordProjectViewTime("GompeiLib", 5000);

        const top = getTopProjectsForResume();
        // Defaults: GompeiVision, WpiCal, FirstMentor.
        // Since GompeiLib is the only viewed, it should be first, and the remaining 2 slots
        // should be filled by defaults (preserving order: GompeiVision, WpiCal)
        expect(top).toEqual([
            ProjectTexKey.GompeiLib,
            ProjectTexKey.GompeiVision,
            ProjectTexKey.WpiCal
        ]);
    });
});
