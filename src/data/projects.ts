export interface Project {
    id: string;
    title: string;
    summary: string;
    technologies: string[];
    markdownFile: string;
}

export const projects: Project[] = [
    {
        id: "GompeiVision",
        title: "GompeiVision",
        summary: "Vision-based robot localization and real-time positioning framework",
        technologies: ["OpenCV", "C++", "CMake", "Docker", "Linux", "WPILib"],
        markdownFile: "../data/markdown/gompeivision/GompeiVision.md",
    },
    {
        id: "GompeiLib",
        title: "GompeiLib",
        summary: "Modular robotics software framework for autonomous control and subsystem management",
        technologies: ["Java", "Gradle", "Junit", "WPILib"],
        markdownFile: "../data/markdown/GompeiLib.md",
    },
    {
        id: "WPICal",
        title: "WPICal",
        summary: "Camera and field calibration tool for generating AprilTag maps via least squares optimization",
        technologies: ["C++", "CMake", "OpenCV"],
        markdownFile: "../data/markdown/WPICal.md",
    },
    {
        id: "KnowledgeBase",
        title: "Knowledge Base",
        summary: "Central robotics knowledge base for software, vision, and controls documentation",
        technologies: ["Typescript", "HTML", "CSS", "Markdown"],
        markdownFile: "../data/markdown/KnowledgeBase.md",
    },
    {
        id: "RBE3001",
        title: "Robotic Arm",
        summary: "4-dof robotic arm and vision system implemented in MATLAB",
        technologies: ["MATLAB", "Linux"],
        markdownFile: "../data/markdown/RBE3001.md",
    },
    {
        id: "RBE3002",
        title: "Robotic Navigation",
        summary: "ROS-based SLAM, monte-carlo localization, and frontier exploration, and path planning for autonomous maze solving",
        technologies: ["Python", "ROS 2"],
        markdownFile: "../data/markdown/RBE3002.md",
    },
    {
        id: "RBE300X",
        title: "Generic Robotic Systems Framework",
        summary: "ROS 2-inspired publish-subscribe architecture for distributed robotic software systems",
        technologies: ["Python", "Anaconda", "Pytest"],
        markdownFile: "../data/markdown/RBE300X.md",
    },
    {
        id: "RotaryODSampler",
        title: "Rotary Optical Density Instrument",
        summary: "Distributed optical density monitoring system with embedded device communication",
        technologies: ["Python", "C++", "Raspberry Pi", "Arduino"],
        markdownFile: "../data/markdown/RotaryODSampler.md",
    },
    {
        id: "FRC2025KitBot",
        title: "2025 FRC KitBot",
        summary: "Base robot code for FRC 2025 competition season",
        technologies: ["Java", "C++", "Python", "LabVIEW", "WPILib"],
        markdownFile: "../data/markdown/2025FRCKitBot.md",
    },
    {
        id: "FRC1902024Codebase",
        title: "FRC 190 2024 Codebase",
        summary: "Robot Codebase for FRC 190 2024 competition season",
        technologies: ["Java", "Gradle", "Linux", "WPILib"],
        markdownFile: "../data/markdown/FRC2024.md",
    },
    {
        id: "FRC1902025Codebase",
        title: "FRC 190 2025 Codebase",
        summary: "Robot Codebase for FRC 190 2025 competition season",
        technologies: ["Java", "Gradle", "Linux", "WPILib"],
        markdownFile: "../data/markdown/FRC2025.md",
    },
    {
        id: "FRC1902026Codebase",
        title: "FRC 190 2026 Codebase",
        summary: "Robot Codebase for FRC 190 2026 competition season",
        technologies: ["Java", "Gradle", "Linux", "WPILib"],
        markdownFile: "../data/markdown/FRC2026.md",
    }
];
