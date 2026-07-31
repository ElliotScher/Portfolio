import type { ProcessNode } from "../../../components/processDiagram";

export const parkVisionProcessData: ProcessNode[] = [
    {
        id: 'detection',
        label: 'Detection',
        markdownFile: '../data/projects/parkvision/processdiagram/detection.md'
    },
    {
        id: 'trackinggrouping',
        label: 'Tracking & Grouping',
        markdownFile: '../data/projects/parkvision/processdiagram/tracking-grouping.md'
    },
    {
        id: 'directionspeed',
        label: 'Direction & Speed',
        markdownFile: '../data/projects/parkvision/processdiagram/direction-speed.md'
    },
    {
        id: 'licenseplatedwell',
        label: 'Plates & Dwell Time',
        markdownFile: '../data/projects/parkvision/processdiagram/license-plate-dwell.md'
    },
    {
        id: 'occupancyprofiling',
        label: 'Occupancy Profiling',
        markdownFile: '../data/projects/parkvision/processdiagram/occupancy-profiling.md'
    },
    {
        id: 'applicationexport',
        label: 'App, Database & Export',
        markdownFile: '../data/projects/parkvision/processdiagram/application-export.md'
    }
];
