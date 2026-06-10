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

export function getTopProjectsForResume(): string[] {
    const times = getProjectViewTimes();
    
    // Default fallback project keys in resumeData.projects:
    // GompeiVision, WPICal, and first_mentor (shared codebase)
    const defaults: string[] = [ProjectTexKey.GompeiVision, ProjectTexKey.WpiCal, ProjectTexKey.FirstMentor];
    
    // Sort keys based on accumulated view times descending
    const sortedTracked = Object.entries(times)
        .filter(([, time]) => time > 0)
        .sort((a, b) => b[1] - a[1])
        .map(([key]) => key);
        
    const uniqueKeys = new Set<string>(sortedTracked);
    
    // Fill in defaults if less than 3
    for (const def of defaults) {
        if (uniqueKeys.size >= 3) break;
        uniqueKeys.add(def);
    }
    
    return Array.from(uniqueKeys).slice(0, 3);
}
