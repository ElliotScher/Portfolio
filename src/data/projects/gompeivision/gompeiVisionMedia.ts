import type { MediaItem } from "../../../components/mediaGallery";

export const gompeiVisionMedia: MediaItem[] = [
    {
        src: "assets/projects/Scoring1.mp4",
        title: "Automated Game Piece Scoring (Angle 1)",
        caption: "A video demonstration of the robot autonomously aligning and scoring a game piece on the FRC competition field."
    },
    {
        src: "assets/projects/Scoring2.mp4",
        title: "Automated Game Piece Scoring (Angle 2)",
        caption: "A secondary demonstration showing the robot locating the target zone and successfully scoring a game piece from a different field starting position."
    },
    {
        src: "assets/projects/logpractice.mp4",
        title: "Vision Pose Estimation Log",
        caption: "A demonstration showing the robot's on-board log data and the apriltags it was seeing during a practice session. The red robot is the fused global pose of the robot, and each other color robot and lines represents a different camera seeing the apriltags."
    }
];
