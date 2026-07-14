import type { ProcessNode } from "../../components/processDiagram.ts";
import type { FutureAddition } from "../../components/futureAdditions.ts";
import type { MediaItem } from "../../components/mediaGallery.ts";
import { ProjectTexKey } from "./projectTexMap";

import { gompeiVisionProcessData } from "./gompeivision/gompeiVisionProcess.ts";
import { gompeiVisionAdditionsData } from "./gompeivision/gompeiVisionAdditions.ts";
import { gompeiVisionMedia } from "./gompeivision/gompeiVisionMedia.ts";
import { wpiCalAdditionsData } from "./wpical/wpiCalAdditions.ts";
import { wpiCalProcessData } from "./wpical/wpiCalProcess.ts";
import { nixHubAdditionsData } from "./nixhub/nixHubAdditions.ts";
import { nixHubProcessData } from "./nixhub/nixHubProcess.ts";
import { rbe3001Media } from "./rbe3001/rbe3001Media.ts";
import { frc2025Media } from "./frc190-common/frc2025/frc2025Media.ts";
import { frc2024Media } from "./frc190-common/frc2024/frc2024Media.ts";
import { rbe1001Media } from "./rbe1001/rbe1001Media.ts";
import { frc2026Media } from "./frc190-common/frc2026/frc2026Media.ts";

export interface Project {
    id: string;
    title: string;
    summary: string;
    technologies: string[];
    markdownFile: string;
    resumeTexFile: ProjectTexKey;
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
        resumeTexFile: ProjectTexKey.GompeiVision,
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
        resumeTexFile: ProjectTexKey.GompeiLib,
        githubUrl: "https://github.com/Team-190/GompeiLib",
    },
    {
        id: "WPICal",
        title: "WPICal",
        summary: "Camera and field calibration tool for generating AprilTag maps via least squares optimization",
        technologies: ["C++", "CMake", "OpenCV", "WPILib"],
        markdownFile: "../data/projects/wpical/WPICal.md",
        resumeTexFile: ProjectTexKey.WpiCal,
        githubUrl: "https://github.com/ElliotScher/WPICal-wpical",
        processData: wpiCalProcessData,
        futureAdditionsData: wpiCalAdditionsData,
    },
    {
        id: "RBE1001",
        title: "Autonomous Mobile Manipulator",
        summary: "An autonomous fruit harvesting and classifying mobile robot programmed in VEX V5 Python",
        technologies: ["Python", "VEX"],
        markdownFile: "../data/projects/rbe1001/RBE1001.md",
        resumeTexFile: ProjectTexKey.Rbe1001,
        mediaData: rbe1001Media,
    },
    {
        id: "RBE3001",
        title: "Robotic Arm",
        summary: "4-dof robotic arm and vision system implemented in MATLAB",
        technologies: ["MATLAB", "Linux"],
        markdownFile: "../data/projects/rbe3001/RBE3001.md",
        resumeTexFile: ProjectTexKey.RobotArm,
        mediaData: rbe3001Media,
    },
    {
        id: "RBE3002",
        title: "Robotic Navigation",
        summary: "ROS-based SLAM, monte-carlo localization, and frontier exploration, and path planning for autonomous maze solving",
        technologies: ["Python", "ROS 2"],
        markdownFile: "../data/projects/rbe3002/RBE3002.md",
        resumeTexFile: ProjectTexKey.RobotNavigation,
    },
    {
        id: "RBE300X",
        title: "Generic Robotic Systems Framework",
        summary: "ROS 2-inspired publish-subscribe architecture for distributed robotic software systems",
        technologies: ["Python", "Anaconda", "Pytest"],
        markdownFile: "../data/projects/rbe300x/RBE300X.md",
        resumeTexFile: ProjectTexKey.RosPlatform,
    },
    {
        id: "FRCSharedCodebase",
        title: "FRC Shared Codebase Design & Execution",
        summary: "Single-codebase multi-robot architecture for FRC teams",
        technologies: ["Java", "Gradle", "Linux", "WPILib"],
        markdownFile: "../data/projects/frc190-common/frcsharedcodebase/FRCSharedCodebase.md",
        resumeTexFile: ProjectTexKey.FirstMentor,
        githubUrl: "https://github.com/Team-190/2k26-Robot-Code",
    },
    {
        id: "FRC1902024Codebase",
        title: "FRC 190 2024 Codebase",
        summary: "Robot Codebase for FRC 190 2024 competition season",
        technologies: ["Java", "Gradle", "Linux", "WPILib"],
        markdownFile: "../data/projects/frc190-common/frc2024/FRC2024.md",
        resumeTexFile: ProjectTexKey.FirstMentor,
        githubUrl: "https://github.com/Team-190/2k24-Robot-Code",
        mediaData: frc2024Media,
    },
    {
        id: "FRC1902025Codebase",
        title: "FRC 190 2025 Codebase",
        summary: "Robot Codebase for FRC 190 2025 competition season",
        technologies: ["Java", "Gradle", "Linux", "WPILib"],
        markdownFile: "../data/projects/frc190-common/frc2025/FRC2025.md",
        resumeTexFile: ProjectTexKey.FirstMentor,
        githubUrl: "https://github.com/Team-190/2k25-Robot-Code",
        mediaData: frc2025Media,
    },
    {
        id: "FRC1902026Codebase",
        title: "FRC 190 2026 Codebase",
        summary: "Robot Codebase for FRC 190 2026 competition season",
        technologies: ["Java", "Gradle", "Linux", "WPILib"],
        markdownFile: "../data/projects/frc190-common/frc2026/FRC2026.md",
        resumeTexFile: ProjectTexKey.FirstMentor,
        githubUrl: "https://github.com/Team-190/2k26-Robot-Code",
        mediaData: frc2026Media,
    },
    {
        id: "NixHub",
        title: "NixHub",
        summary: "Single Nix flake providing fully declarative, reproducible NixOS system and Home Manager configuration across multiple machines",
        technologies: ["Nixos", "Bash", "GitHub Actions", "Git"],
        markdownFile: "../data/projects/nixhub/NixHub.md",
        resumeTexFile: ProjectTexKey.NixHub,
        githubUrl: "https://github.com/ElliotScher/NixHub",
        processData: nixHubProcessData,
        futureAdditionsData: nixHubAdditionsData,
    }
];
