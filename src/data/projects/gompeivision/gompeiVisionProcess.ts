import type { ProcessNode } from "../../../components/processDiagram";

export const gompeiVisionProcessData: ProcessNode[] = [
    {
        id: 'imageacquisition',
        label: 'Image Acquisition',
        markdownFile: '../data/projects/gompeivision/processdiagram/image-acquisition.md'
    },
    {
        id: 'detection',
        label: 'AprilTag Detection',
        markdownFile: '../data/projects/gompeivision/processdiagram/detection.md'
    },
    {
        id: 'poseestimation',
        label: 'Pose Estimation',
        markdownFile: '../data/projects/gompeivision/processdiagram/poseestimation.md'
    },
    {
        id: 'networkcommunication',
        label: 'Network Communication',
        markdownFile: '../data/projects/gompeivision/processdiagram/networkcommunication.md'
    },
    {
        id: 'fieldlocalization',
        label: 'Field Localization',
        markdownFile: '../data/projects/gompeivision/processdiagram/fieldlocalization.md'
    }
];