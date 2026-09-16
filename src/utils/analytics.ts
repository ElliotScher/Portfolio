import { projects } from "../data/projects/projects";
import { ProjectTexKey } from "../data/projects/projectTexMap";

// In-memory store that resets on page reload and leaves no persistent footprint
const viewTimes: Record<string, number> = {};

export function recordProjectViewTime(projectId: string, durationMs: number) {
    if (!projectId || durationMs <= 0) return;
    
    // Find the project and check if it maps to a resume .tex file
    const project = projects.find(p => p.id === projectId);
    if (!project || !project.resumeTexFile) return;
    
    const key = project.resumeTexFile;
    viewTimes[key] = (viewTimes[key] || 0) + durationMs;
}

export function getProjectViewTimes(): Record<string, number> {
    return viewTimes;
}

export function resetProjectViewTimes() {
    for (const key of Object.keys(viewTimes)) {
        delete viewTimes[key];
    }
}

// Projects that are always shown exclusively via their affiliated job on the
// resume (e.g. GompeiVision under WPI Robotics Resource Center) *unless*
// they turn out to be the single most-viewed project overall, in which case
// they become the featured entry instead (see getFeaturedProjectForResume).
// They never appear in the ranked Projects & Leadership list either way.
const JOB_PROJECT_KEYS = new Set<string>([
    ProjectTexKey.GompeiVision,
    ProjectTexKey.WpiCal,
    ProjectTexKey.ParkVision
]);

// Resume-only project fragments with no corresponding portfolio project page
// (no entry in projects.ts references them) — always sorted to the very end
// of the ranking, after every tracked or catalog-ordered project, since a
// reader could never have spent time viewing a page that doesn't exist.
const NO_PORTFOLIO_PAGE_KEYS: string[] = [ProjectTexKey.Kitbot, ProjectTexKey.SoftwareKnowledgeBase];

// Stable fallback order for untracked, non-job, portfolio-linked projects.
const CATALOG_FALLBACK_ORDER: string[] = [
    ProjectTexKey.RobotArm,
    ProjectTexKey.RobotNavigation,
    ProjectTexKey.RosPlatform,
    ProjectTexKey.GompeiLib,
    ProjectTexKey.FirstMentor,
    ProjectTexKey.Rbe1001,
    ProjectTexKey.NixHub
];

// Determines which project to feature at the top of the interactive resume
// (above Experience) when no explicit resume config is selected: whichever
// project — job-affiliated or not — the visitor has spent the most time
// viewing, defaulting to GompeiVision when there's no tracked view time yet.
export function getFeaturedProjectForResume(): string {
    const times = getProjectViewTimes();

    const sortedTracked = Object.entries(times)
        .filter(([, time]) => time > 0)
        .sort((a, b) => b[1] - a[1]);

    return sortedTracked.length > 0 ? sortedTracked[0][0] : ProjectTexKey.GompeiVision;
}

// Full ranked ordering of every eligible project for the Projects &
// Leadership section (2nd-most-viewed onward — the #1 spot is the featured
// entry above and is excluded here): whichever the visitor has spent the
// most time on first, then the rest of the catalog in a stable fallback
// order. Job-affiliated projects (GompeiVision, WPICal, Park Vision) never
// appear here — if one of them isn't the featured entry, it stays in
// Experience in reverse-chronological order instead. The two resume-only
// fragments with no portfolio page always sort last.
export function getRankedProjectsForResume(): string[] {
    const times = getProjectViewTimes();
    const featured = getFeaturedProjectForResume();

    const sortedTracked = Object.entries(times)
        .filter(([key, time]) => time > 0 && key !== featured && !JOB_PROJECT_KEYS.has(key))
        .sort((a, b) => b[1] - a[1])
        .map(([key]) => key);

    const alreadyPlaced = new Set([...sortedTracked, featured]);
    const untracked = CATALOG_FALLBACK_ORDER.filter(key => !alreadyPlaced.has(key));

    return [...sortedTracked, ...untracked, ...NO_PORTFOLIO_PAGE_KEYS];
}
