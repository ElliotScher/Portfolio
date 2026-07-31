// Project LaTeX raw imports relative to src/data/projects/
import gompeiVisionTex from "./gompeivision/gompeivision.tex?raw";
import gompeiLibTex from "./gompeilib/gompeilib.tex?raw";
import wpicalTex from "./wpical/wpical.tex?raw";
import rbe1001Tex from "./rbe1001/rbe1001.tex?raw";
import robotArmTex from "./rbe3001/robot_arm.tex?raw";
import robotNavigationTex from "./rbe3002/robot_navigation.tex?raw";
import rosPlatformTex from "./rbe300x/ros_platform.tex?raw";
import firstMentorTex from "./frc190-common/first_mentor.tex?raw";
import kitbotTex from "./kitbot2025/kitbot.tex?raw";
import softwareKnowledgeBaseTex from "./software_knowledge_base/software_knowledge_base.tex?raw";
import incubatorTex from "./incubator/incubator.tex?raw";
import nixHubTex from "./nixhub/nixhub.tex?raw";
import parkVisionTex from "./parkvision/parkvision.tex?raw";

export const ProjectTexKey = {
    GompeiVision: "gompeivision",
    GompeiLib: "gompeilib",
    WpiCal: "wpical",
    Rbe1001: "rbe1001",
    RobotArm: "robot_arm",
    RobotNavigation: "robot_navigation",
    RosPlatform: "ros_platform",
    FirstMentor: "first_mentor",
    Kitbot: "kitbot",
    SoftwareKnowledgeBase: "software_knowledge_base",
    Incubator: "incubator",
    NixHub: "nixhub",
    ParkVision: "parkvision"
} as const;

export type ProjectTexKey = typeof ProjectTexKey[keyof typeof ProjectTexKey];

export const projectTexMap: Record<ProjectTexKey, string> = {
    [ProjectTexKey.GompeiVision]: gompeiVisionTex,
    [ProjectTexKey.GompeiLib]: gompeiLibTex,
    [ProjectTexKey.WpiCal]: wpicalTex,
    [ProjectTexKey.Rbe1001]: rbe1001Tex,
    [ProjectTexKey.RobotArm]: robotArmTex,
    [ProjectTexKey.RobotNavigation]: robotNavigationTex,
    [ProjectTexKey.RosPlatform]: rosPlatformTex,
    [ProjectTexKey.FirstMentor]: firstMentorTex,
    [ProjectTexKey.Kitbot]: kitbotTex,
    [ProjectTexKey.SoftwareKnowledgeBase]: softwareKnowledgeBaseTex,
    [ProjectTexKey.Incubator]: incubatorTex,
    [ProjectTexKey.NixHub]: nixHubTex,
    [ProjectTexKey.ParkVision]: parkVisionTex
};
