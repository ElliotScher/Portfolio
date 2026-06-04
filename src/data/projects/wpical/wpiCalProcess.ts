import type { ProcessNode } from "../../../components/processDiagram";

export const wpiCalProcessData: ProcessNode[] = [
    {
        id: 'videocapture',
        label: 'Video Capture',
        markdownFile: '../data/projects/wpical/processdiagram/videocapture.md'
    },
    {
        id: 'cameracalibration',
        label: 'Camera Calibration',
        markdownFile: '../data/projects/wpical/processdiagram/cameracalibration.md'
    },
    {
        id: 'fieldsetup',
        label: 'Field Setup',
        markdownFile: '../data/projects/wpical/processdiagram/fieldsetup.md'
    },
    {
        id: 'optimization',
        label: 'Least Squares Solve',
        markdownFile: '../data/projects/wpical/processdiagram/optimization.md'
    },
    {
        id: 'export',
        label: 'Combine & Export',
        markdownFile: '../data/projects/wpical/processdiagram/export.md'
    }
];
