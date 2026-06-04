## Summary

**GompeiLib** is a library of reusable components, subsystems, IO, and utilities for use on FRC teams. It is an open-source, modular Java library originally designed for FRC Team 190 to accelerate robot software development by providing battle-tested, reusable subsystem abstractions, hardware-agnostic motor and sensor interfaces, and fully integrated simulation and logging infrastructure. GompeiLib encapsulates years of competition experience into a composable framework and is distributed with GitHub Packages through Maven, meaning it can be easily pulled into any FRC robot project as a dependency.

***

## Context

Every season in the FIRST Robotics Competition (FRC), hundreds of teams independently develop software to solve the same fundamental challenges. Despite differences in physical robot designs, teams repeatedly implement similar subsystem architectures, sensor interfaces, and control algorithms. This duplication of effort consumes valuable engineering time that could otherwise be spent optimizing game strategy and developing advanced autonomous capabilities.

To get a basic robot moving quickly, teams often resort to copy-pasting code from previous seasons or relying on ad-hoc structures. However, this approach inevitably leads to configuration bloat, device conflicts, and code that cannot be tested without physical access to the robot. Standardizing a team's software stack through a unified library addresses these issues, enabling cleaner code reviews, faster student onboarding, and centralized updates that immediately benefit all of a team's robot projects.

### Robot Software Architecture & Abstraction

To achieve this standard, robot control code must isolate low-level device configurations from high-level operational logic. This is accomplished by establishing two core architectural pillars:

* **Hardware Abstraction Layer (IO)**: By separating physical hardware API calls (e.g., motor controller status, sensor readings) into abstract interfaces, the codebase can run seamlessly on both the physical robot and a simulated desktop environment without changes.
* **Reusable Subsystem Templates**: A suite of standard mechanical templates (such as drivetrains, elevators, shooters, and intakes) that wrap common FRC kinematics, feedback control loops (PID), and state machines, allowing developers to instantiate new subsystems with minimal boilerplate.

To address these challenges in FRC robot software development, I designed and implemented **GompeiLib** as a modular framework for FRC Team 190. By providing these standardized layers, the library enables FRC teams to transition from raw, hardware-coupled code to robust, unit-tested, and simulation-compatible software. The design constraints for the project were as follows:
* Must be fully compatible with WPILib and standard FRC tools (like AdvantageKit logging and simulation)
* Must support clean hardware abstraction to enable unit testing and 100% hardware-free simulation
* Must support multiple motor controller and sensor vendors transparently (e.g., CTRE, REV, SparkMax, TalonFX)
* Must be modular, well-documented, and easy for new students to consume as a Maven dependency

## Tech Stack

Click on any of the technology circles below to see why it was chosen for this project:

<div class="project-tech-stack" data-project-id="GompeiLib"></div>

## Library Structure

GompeiLib is organized into a modular package hierarchy to separate core hardware abstractions and configuration logic from physical subsystem templates. 

