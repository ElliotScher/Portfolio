import type { FutureAddition } from "../../../components/futureAdditions";

export const wpiCalAdditionsData: FutureAddition[] = [
    {
        id: 'gtsam-multicamera',
        title: 'GTSAM Multi-Camera SLAM',
        summary: 'Solve for camera extrinsic mounts and AprilTag field offsets in real-time on the robot using GTSAM (similar to TagSLAM), broadcasting via NetworkTables and saving JSON configuration files.',
        markdownFile: '../data/projects/wpical/future-additions/gtsam-multicamera.md',
        icon: 'WPILib'
    },
    {
        id: 'mobile-app',
        title: 'Mobile Calibration App',
        summary: 'Rewrite the tool as a native cross-platform mobile app that runs camera and field calibration locally on a smartphone, making physical field scanning quick and convenient.',
        markdownFile: '../data/projects/wpical/future-additions/mobile-app.md',
        icon: 'Apple'
    }
];
