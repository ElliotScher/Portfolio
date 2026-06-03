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
        summary: 'Develop support for AprilTag detection using GPU hardware for coprocessors with limited CPU compute power.',
        markdownFile: '../data/projects/gompeivision/future-additions/gpu-detection.md',
        icon: 'Nvidia'
    },

    {
        id: 'web-dashboard',
        title: 'Web Calibration Dashboard',
        summary: 'A browser-based diagnostic dashboard for camera calibration, latency metrics, and network stream viewing.',
        markdownFile: '../data/projects/gompeivision/future-additions/web-dashboard.md',
        icon: 'HTML'
    },
    {
        id: 'detection-algorithms',
        title: 'Alternative Detection Algorithms',
        summary: 'Integrate ArUco and ArUco-nano detection algorithms to support different speed-accuracy trade-offs while using standard physical markers on the field.',
        markdownFile: '../data/projects/gompeivision/future-additions/detection-algorithms.md',
        icon: 'OpenCV'
    },
    {
        id: 'ubuntu-installer',
        title: 'Custom Ubuntu Installer',
        summary: 'Fork Canonical’s Ubuntu installer (Subiquity) to deploy a pre-configured OS image complete with dependencies and optimizations.',
        markdownFile: '../data/projects/gompeivision/future-additions/ubuntu-installer.md',
        icon: 'Ubuntu'
    },
    {
        id: 'nixos-distribution',
        title: 'Declarative NixOS Configuration',
        summary: 'Build reproducible and immutable OS configurations and target flash images using NixOS Flakes for stable deployments.',
        markdownFile: '../data/projects/gompeivision/future-additions/nixos-distribution.md',
        icon: 'Nixos'
    },
    {
        id: 'object-detection',
        title: 'NPU/TPU Acceleration',
        summary: 'Deploy real-time deep learning models on M.2/USB NPU/TPU accelerators to recognize robots, track game pieces, and crop image frames to speed up AprilTag detection.',
        markdownFile: '../data/projects/gompeivision/future-additions/object-detection.md',
        icon: 'Tensorflow'
    },
    {
        id: 'slam-localization',
        title: 'SLAM & Advanced Localization',
        summary: 'Implement independent estimation systems including TagSLAM, vSLAM, and Monte Carlo Localization (MCL) using stereo camera streams and persistent geometric mapping.',
        markdownFile: '../data/projects/gompeivision/future-additions/slam-localization.md',
        icon: 'ROS 2'
    },
    {
        id: 'match-recording',
        title: 'Match Video Recording',
        summary: 'Automatically record, compress, and archive video streams from all active cameras, synchronized with FRC field state and indexed with match numbers.',
        markdownFile: '../data/projects/gompeivision/future-additions/match-recording.md',
        icon: 'WPILib'
    },
    {
        id: 'apple-silicon',
        title: 'Apple Silicon Compilation',
        summary: 'Enable native compilation and target-specific optimizations for Apple Silicon to leverage high-bandwidth USB controllers, unified memory, and efficient hardware acceleration.',
        markdownFile: '../data/projects/gompeivision/future-additions/apple-silicon.md',
        icon: 'Apple'
    }
];