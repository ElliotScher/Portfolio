export interface ProcessNode {
    id: string;
    label: string;
    markdownFile: string;
}

export const gompeiVisionProcessData: ProcessNode[] = [
    {
        id: 'imageacquisition',
        label: 'Image Acquisition',
        markdownFile: '../data/markdown/gompeivision/processdiagram/image-acquisition.md'
    },
    {
        id: 'detection',
        label: 'AprilTag Detection',
        markdownFile: '../data/markdown/gompeivision/processdiagram/detection.md'
    },
    {
        id: 'poseestimation',
        label: 'Pose Estimation',
        markdownFile: '../data/markdown/gompeivision/processdiagram/poseestimation.md'
    },
    {
        id: 'networkcommunication',
        label: 'Network Communication',
        markdownFile: '../data/markdown/gompeivision/processdiagram/networkcommunication.md'
    },
    {
        id: 'fieldlocalization',
        label: 'Field Localization',
        markdownFile: '../data/markdown/gompeivision/processdiagram/fieldlocalization.md'
    }
];