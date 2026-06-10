import type { ProcessNode } from "../../components/processDiagram.ts";
import type { FutureAddition } from "../../components/futureAdditions.ts";
import type { MediaItem } from "../../components/mediaGallery.ts";

import { gompeiVisionProcessData } from "./gompeivision/gompeiVisionProcess.ts";
import { gompeiVisionAdditionsData } from "./gompeivision/gompeiVisionAdditions.ts";
import { gompeiVisionMedia } from "./gompeivision/gompeiVisionMedia.ts";
import { wpiCalAdditionsData } from "./wpical/wpiCalAdditions.ts";
import { wpiCalProcessData } from "./wpical/wpiCalProcess.ts";
import { rbe3001Media } from "./rbe3001/rbe3001Media.ts";
import { frc2025Media } from "./frc2025/frc2025Media.ts";
import { frc2024Media } from "./frc2024/frc2024Media.ts";
import { rbe1001Media } from "./rbe1001/rbe1001Media.ts";
import { frc2026Media } from "./frc2026/frc2026Media.ts";

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
        id: "RBE1001",
        title: "Autonomous Mobile Manipulator",
        summary: "An autonomous fruit harvesting and classifying mobile robot programmed in VEX V5 Python",
        technologies: ["Python", "VEX V5 Brain"],
        markdownFile: "../data/projects/rbe1001/RBE1001.md",
        mediaData: rbe1001Media,
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
    // {
    //     id: "Incubator",
    //     title: "Automated Laboratory Incubator",
    //     summary: "Distributed laboratory incubator control suite with real-time optical density tracking",
    //     technologies: ["Python", "C++", "Raspberry Pi", "Arduino"],
    //     markdownFile: "../data/projects/incubator/Incubator.md",
    // },
    {
        id: "FRCSharedCodebase",
        title: "FRC Shared Codebase Design & Execution",
        summary: "Single-codebase multi-robot architecture for FRC teams",
        technologies: ["Java", "Gradle", "Linux", "WPILib"],
        markdownFile: "../data/projects/frcsharedcodebase/FRCSharedCodebase.md",
        githubUrl: "https://github.com/Team-190/2k26-Robot-Code"
    },
    {
        id: "FRC1902024Codebase",
        title: "FRC 190 2024 Codebase",
        summary: "Robot Codebase for FRC 190 2024 competition season",
        technologies: ["Java", "Gradle", "Linux", "WPILib"],
        markdownFile: "../data/projects/frc2024/FRC2024.md",
        githubUrl: "https://github.com/Team-190/2k24-Robot-Code",
        mediaData: frc2024Media,
    },
    {
        id: "FRC1902025Codebase",
        title: "FRC 190 2025 Codebase",
        summary: "Robot Codebase for FRC 190 2025 competition season",
        technologies: ["Java", "Gradle", "Linux", "WPILib"],
        markdownFile: "../data/projects/frc2025/FRC2025.md",
        githubUrl: "https://github.com/Team-190/2k25-Robot-Code",
        mediaData: frc2025Media,
    },
    {
        id: "FRC1902026Codebase",
        title: "FRC 190 2026 Codebase",
        summary: "Robot Codebase for FRC 190 2026 competition season",
        technologies: ["Java", "Gradle", "Linux", "WPILib"],
        markdownFile: "../data/projects/frc2026/FRC2026.md",
        githubUrl: "https://github.com/Team-190/2k26-Robot-Code",
        mediaData: frc2026Media,
    }
];
