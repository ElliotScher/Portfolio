import type { ProcessNode } from "../components/processDiagram";
import type { FutureAddition } from "../components/futureAdditions";
import type { MediaItem } from "../components/mediaGallery";

import { gompeiVisionProcessData } from "./projects/gompeivision/gompeiVisionProcess";
import { gompeiVisionAdditionsData } from "./projects/gompeivision/gompeiVisionAdditions";
import { gompeiVisionMedia } from "./projects/gompeivision/gompeiVisionMedia";
import { wpiCalAdditionsData } from "./projects/wpical/wpiCalAdditions";
import { wpiCalProcessData } from "./projects/wpical/wpiCalProcess";
import { rbe3001Media } from "./projects/rbe3001/rbe3001Media";

export interface Project {
    id: string;
    title: string;
    summary: string;
    technologies: string[];
    markdownFile: string;
    githubUrl?: string;
    processData?: ProcessNode[];
    futureAdditionsData?: FutureAddition[];
    mediaData?: MediaItem[];
}

export const projects: Project[] = [
    {
        id: "GompeiVision",
        title: "GompeiVision",
        summary: "Vision-based robot localization and real-time positioning framework",
        technologies: ["OpenCV", "C++", "CMake", "Docker", "Linux", "WPILib"],
        markdownFile: "../data/projects/gompeivision/GompeiVision.md",
        githubUrl: "https://github.com/Team-190/GompeiVision",
        processData: gompeiVisionProcessData,
        futureAdditionsData: gompeiVisionAdditionsData,
        mediaData: gompeiVisionMedia,
    },
    {
        id: "GompeiLib",
        title: "GompeiLib",
        summary: "A library of reusable components, subsystems, IO, and utilities for use on FRC teams",
        technologies: ["Java", "Gradle", "Junit", "WPILib"],
        markdownFile: "../data/projects/gompeilib/GompeiLib.md",
        githubUrl: "https://github.com/Team-190/GompeiLib",
    },
    {
        id: "WPICal",
        title: "WPICal",
        summary: "Camera and field calibration tool for generating AprilTag maps via least squares optimization",
        technologies: ["C++", "CMake", "OpenCV", "WPILib"],
        markdownFile: "../data/projects/wpical/WPICal.md",
        githubUrl: "https://github.com/ElliotScher/WPICal-wpical",
        processData: wpiCalProcessData,
        futureAdditionsData: wpiCalAdditionsData,
    },
    {
        id: "RBE3001",
        title: "Robotic Arm",
        summary: "4-dof robotic arm and vision system implemented in MATLAB",
        technologies: ["MATLAB", "Linux"],
        markdownFile: "../data/projects/rbe3001/RBE3001.md",
        mediaData: rbe3001Media,
    },
    {
        id: "RBE3002",
        title: "Robotic Navigation",
        summary: "ROS-based SLAM, monte-carlo localization, and frontier exploration, and path planning for autonomous maze solving",
        technologies: ["Python", "ROS 2"],
        markdownFile: "../data/projects/rbe3002/RBE3002.md",
    },
    {
        id: "RBE300X",
        title: "Generic Robotic Systems Framework",
        summary: "ROS 2-inspired publish-subscribe architecture for distributed robotic software systems",
        technologies: ["Python", "Anaconda", "Pytest"],
        markdownFile: "../data/projects/rbe300x/RBE300X.md",
    },
    {
        id: "Incubator",
        title: "Automated Laboratory Incubator",
        summary: "Distributed laboratory incubator control suite with real-time optical density tracking",
        technologies: ["Python", "C++", "Raspberry Pi", "Arduino"],
        markdownFile: "../data/projects/incubator/Incubator_until_cam_looks.md",
    },
    {
        id: "FRC1902024Codebase",
        title: "FRC 190 2024 Codebase",
        summary: "Robot Codebase for FRC 190 2024 competition season",
        technologies: ["Java", "Gradle", "Linux", "WPILib"],
        markdownFile: "../data/projects/FRC2024.md",
    },
    {
        id: "FRC1902025Codebase",
        title: "FRC 190 2025 Codebase",
        summary: "Robot Codebase for FRC 190 2025 competition season",
        technologies: ["Java", "Gradle", "Linux", "WPILib"],
        markdownFile: "../data/projects/FRC2025.md",
    },
    {
        id: "FRC1902026Codebase",
        title: "FRC 190 2026 Codebase",
        summary: "Robot Codebase for FRC 190 2026 competition season",
        technologies: ["Java", "Gradle", "Linux", "WPILib"],
        markdownFile: "../data/projects/FRC2026.md",
    },
    {
        id: "KnowledgeBase",
        title: "Knowledge Base",
        summary: "Central robotics knowledge base for software, vision, and controls documentation",
        technologies: ["Typescript", "HTML", "CSS", "Markdown"],
        markdownFile: ".." +
            "/data/projects/KnowledgeBase.md",
    }
];
