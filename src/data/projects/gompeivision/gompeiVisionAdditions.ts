export interface FutureAddition {
    id: string;
    title: string;
    summary: string;
    markdownFile: string;
    icon: string; // Technology key used to look up the SVG logo in technologyIcons
}

export const gompeiVisionAdditionsData: FutureAddition[] = [
    {
        id: 'gpu-detection',
        title: 'GPU Detection Support',
        summary: 'Develop support for AprilTag detection using GPU hardware for coprocessors with limited CPU compute power',
        markdownFile: '../data/projects/gompeivision/future-additions/gpu-detection.md',
        icon: 'Nvidia'
    },
    {
        id: 'web-dashboard',
        title: 'Web Calibration Dashboard',
        summary: 'A browser-based diagnostic dashboard for camera calibration, latency metrics, and network stream viewing.',
        markdownFile: '../data/projects/gompeivision/future-additions/web-dashboard.md',
        icon: 'HTML'
    }
];
