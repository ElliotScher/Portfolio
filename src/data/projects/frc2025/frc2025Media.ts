import type { MediaItem } from "../../../components/mediaGallery";

export const frc2025Media: MediaItem[] = [
    {
        src: "assets/projects/frc2025/RedundancyAuto.mp4",
        title: "V2 (Redundancy) Autonomous Scoring",
        caption: "A full autonomous routine showing the V2 robot autonomously scoring multiple coral pieces on the Reef in rapid succession in the autonomous period."
    },
    {
        src: "assets/projects/frc2025/AutoAlignTesting.mp4",
        title: "Autonomous Reef Alignment Testing",
        caption: "Closed-loop testing of the automatic alignment routine, showing the swerve drivetrain correcting translation and rotation to lock onto a Reef branch."
    },
    {
        src: "assets/projects/frc2025/StateMachineTesting.mp4",
        title: "Directed Graph State Machine Integration",
        caption: "Testing the state machine transitions, validating that the arm retracts and the elevator moves only when transition paths are clear, avoiding self-collision.",
        endTime: 28
    },
    {
        src: "assets/projects/frc2025/AdvancedStickSystem.mp4",
        title: "Advanced Driver Control System",
        caption: "Demonstration of V1 (StackUp) automated system for algae removal."
    },
    {
        src: "assets/projects/frc2025/ArmCharacterization.mp4",
        title: "Superstructure SysID Characterization",
        caption: "Running WPILib SysID characterization routines on the elevator and arm pivot to calculate precise feedforward (kS, kV, kA) and feedback constants, with a little bit of added flare :)."
    },
    {
        src: "assets/projects/frc2025/InverseKinematics1.mp4",
        title: "Inverse Kinematics Path Testing (Angle 1)",
        caption: "Testing coordinates and angular limits in simulation for the multi-axis superstructure to translate the target X/Y/Z positions into joint configurations."
    },
    {
        src: "assets/projects/frc2025/InverseKinematics2.mp4",
        title: "Inverse Kinematics Path Testing (Angle 2)",
        caption: "A secondary perspective verifying the simulated synchronized movements of the elevator and arm pivot to prevent collision or hardware binding."
    },
    {
        src: "assets/projects/frc2025/RedundancyProcessing.mp4",
        title: "V2 (Redundancy) Coprocessor Vision Tracking",
        caption: "V2 (Redundancy) scoring algae in the processor."
    },
    {
        src: "assets/projects/frc2025/RedundancyMatch.mp4",
        title: "V2 (Redundancy) Competition Match (View 1)",
        caption: "Competition footage highlighting the V2 robot executing high-speed cycles, scoring Reef coral, and collecting algae on the playfield."
    },
    {
        src: "assets/projects/frc2025/RedundancyMatch2.MOV",
        title: "V2 (Redundancy) Competition Match (View 2)",
        caption: "A secondary match video showcasing the robustness of the swerve drivetrain and reliability of the state-machine-controlled superstructure."
    },
    {
        src: "assets/projects/frc2025/PootMatch1.MOV",
        title: "V3 (Poot) Competition Match (View 3)",
        caption: "Direct footage of the V3 robot scoring coral and executing the endgame climb and securing critical ranking points.",
        startTime: 48
    },
    {
        src: "assets/projects/frc2025/PootMatch2.MOV",
        title: "V3 (Poot) Competition Match (View 2)",
        caption: "A secondary match video showcasing the V3 robot's intake efficiency and agility.",
        startTime: 30
    },
    {
        src: "assets/projects/frc2025/PootMatch3.MOV",
        title: "V3 (Poot) Competition Match (View 1)",
        caption: "Match play of the V3 (Poot) robot demonstrating high-speed cycles and rapid scoring sequences during competition.",
        startTime: 62
    }
];
