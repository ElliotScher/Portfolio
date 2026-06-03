## Summary

**GompeiLib** is an open-source, modular Java library designed for FRC Team 190 to accelerate robot software development by providing battle-tested, reusable subsystem abstractions, hardware-agnostic motor and sensor interfaces, and fully integrated simulation and logging infrastructure. Rather than reimplementing common patterns from scratch each season, GompeiLib encapsulates years of competition experience into a composable framework that can be pulled into any FRC robot project as a dependency.

***

## Context

In the FIRST Robotics Competition (FRC), teams have roughly six weeks to design, build, and program a competition-ready robot. A significant portion of the software effort is spent re-implementing common subsystem patterns: rollers for intakes and outtakes, position-controlled arms and elevators, swerve drive modules, gyroscope interfaces, and autonomous routine infrastructure. These patterns are largely the same from season to season, yet subtle differences in hardware (motor controller vendors, encoder types, gyroscope models) and the need for robust simulation and logging support make it difficult to simply copy-paste code between projects.

GompeiLib was created to solve this problem. By factoring out the common subsystem architectures, hardware abstractions, and infrastructure code into a standalone library, each new season's robot codebase can focus exclusively on game-specific strategy and mechanism design rather than boilerplate. Teams that depend on GompeiLib can pull it in as a Gradle dependency via JitPack, gaining immediate access to the full suite of abstractions without any manual file copying.

## Architecture

The library's design is centered around three architectural pillars that work together to produce maintainable, testable, and vendor-agnostic robot software.

### Hardware Abstraction IO Pattern

The most important design decision in GompeiLib is the **IO abstraction pattern**. Every hardware device, whether a motor controller, absolute encoder, or gyroscope, is represented by three layers:

1. **Abstract Interface** — Defines the contract that all implementations must satisfy (e.g., `MotorController`, `AbsoluteEncoder`, `Gyro`). This layer exposes control methods like `setVoltage()`, `setPosition()`, and `setVelocity()`, as well as sensor reading methods like `getPosition()` and `getCurrent()`.

2. **Hardware Implementations** — Vendor-specific classes that communicate with real devices on the CAN bus:
   - `TalonFXMotorController` — CTRE TalonFX (Falcon 500 / Kraken) via Phoenix 6
   - `SparkMaxMotorController` — REV SparkMax (NEO) via the REV Robotics API
   - `CANCoderAbsoluteEncoder` — CTRE CANCoder via Phoenix 6
   - `Pigeon2Gyro` — CTRE Pigeon 2 IMU via Phoenix 6
   - `NavXGyro` — Kauai Labs NavX-MXP

3. **Simulation Implementations** — Physics-based simulation classes (`SimMotorController`, `SimAbsoluteEncoder`, `SimGyro`) that use WPILib's `DCMotorSim` to model motor dynamics, allowing the entire robot to be tested in simulation without any hardware connected.

This three-layer approach means that subsystem code never references vendor-specific APIs directly. Swapping from a TalonFX to a SparkMax motor controller requires changing only the configuration file, not the subsystem logic.

### JSON-Based Configuration

All hardware parameters, including CAN IDs, gear ratios, current limits, PID gains, motion magic profiles, and encoder offsets, are defined in a central JSON configuration file (`device_config.json`) rather than being hardcoded throughout the codebase. The `DeviceConfig` singleton loads this file at startup and provides typed configuration objects (`MotorConfig`, `EncoderConfig`) to factory methods that construct the appropriate hardware implementations.

This approach has several advantages:
- **Hardware changes don't require code changes** — swapping a motor's CAN ID or changing a gear ratio is a config edit, not a code change
- **Readable, centralized hardware mapping** — all hardware definitions live in one place
- **Factory dispatch** — the `MotorController.create()` factory method reads the config and automatically constructs the correct vendor-specific implementation

### AdvantageKit Logging Integration

Every hardware abstraction in GompeiLib is deeply integrated with [AdvantageKit](https://github.com/Mechanical-Advantage/AdvantageKit), a deterministic logging framework for FRC. Each motor controller, encoder, and gyroscope automatically logs its inputs (sensor readings) and outputs (commanded values) to a structured log file every robot cycle. This enables:

- **Post-match analysis** — Every sensor reading and command is recorded for debugging
- **Deterministic replay** — Logged data can be replayed through the exact same robot code to reproduce and diagnose issues without the physical robot
- **Simulation parity** — The same logging infrastructure works identically in simulation and on real hardware

## Subsystem Library

GompeiLib provides a set of generic, configurable subsystem templates that cover the most common FRC mechanism patterns. Each template handles motor control, sensor integration, logging, and feedforward compensation out of the box.

### GenericRoller

A simple single-motor subsystem for mechanisms that spin at a commanded percent output, such as intakes, outtakes, and conveyor belts. This is the simplest subsystem template and serves as a building block for more complex designs.

### GenericPositionSubsystem

A position-controlled subsystem using either standard PID or Motion Magic profiling. This template forms the base class for all position-controlled mechanisms and provides:
- Setpoint management with configurable position targets
- Motion Magic velocity, acceleration, and jerk limiting
- Gravity feedforward compensation (overridden by subclasses)
- Automatic logging of position, velocity, and motor state

### GenericArmSubsystem

Extends `GenericPositionSubsystem` with arm-specific physics. Arms are rotational mechanisms where the gravitational load varies with angle, so this subsystem applies a **cosine-based feedforward** — the feedforward voltage is proportional to the cosine of the arm's angle relative to horizontal, accurately compensating for the changing torque as the arm swings through its range of motion.

### GenericElevatorSubsystem

Extends `GenericPositionSubsystem` with elevator-specific physics. Elevators are linear mechanisms where gravity applies a constant downward force regardless of position, so this subsystem applies a **constant feedforward voltage** that counteracts gravity at all heights.

## Swerve Drive

GompeiLib includes a full swerve drive implementation capable of field-oriented control, heading stabilization, and vision-based pose estimation.

### Swerve Module

Each `SwerveModule` manages a drive motor, a steer motor, and an absolute encoder. The module handles:
- Continuous PID wrapping for steer angle control (−π to π), eliminating discontinuities at the ±180° boundary
- Module state optimization via `SwerveModuleState.optimize()`, which reverses the drive direction when the shortest steer path crosses the 180° boundary to minimize wheel rotation
- Tracking of `SwerveModuleState` (speed + angle) and `SwerveModulePosition` (distance + angle) for odometry

### Swerve Drive

The `SwerveDrive` class orchestrates four swerve modules into a complete drivetrain:
- **Kinematics** — Uses WPILib's `SwerveDriveKinematics` to convert desired chassis speeds into individual module states
- **Pose Estimation** — Integrates `SwerveDrivePoseEstimator` for continuous odometry, fusing wheel encoder data with gyroscope heading
- **Vision Fusion** — The `addVisionMeasurement()` method accepts pose estimates from external vision systems (such as GompeiVision) and fuses them into the pose estimator with configurable trust weights
- **Heading Control** — A `ProfiledPIDController` maintains a target heading, providing smooth angular velocity profiling during autonomous routines
- **Driving Modes** — Supports robot-oriented, field-oriented, and raw chassis speed control modes

## Supporting Infrastructure

### Vision Integration

The `VisionSubsystem` subscribes to pose estimates from an external vision system and feeds them into the swerve drive's pose estimator. It filters incoming measurements by confidence and distance thresholds to prevent outlier detections from corrupting the robot's position estimate.

### Autonomous Routines

The `AutonChooser` and `AutonRoutine` classes provide a clean interface for defining and selecting autonomous modes:
- Named autonomous routines are registered at startup
- The active routine is selected via the SmartDashboard UI before the match
- Each routine is a WPILib `Command` sequence that executes during the autonomous period

### Tunable Numbers

The `TunableNumber` utility exposes numeric parameters (such as PID gains, speed limits, and thresholds) to SmartDashboard for real-time adjustment. During development and testing, engineers can tune parameters on the fly without redeploying code, dramatically speeding up the tuning cycle.

### LED Control

The `LEDStrip` class provides a high-level interface for controlling WS2812-style addressable LED strips. It supports solid colors, rainbow patterns, blinking, and gradient effects, allowing robot state feedback to be visualized through LED animations.

### Alliance Utilities

The `AllianceUtil` class handles coordinate transformations for the red and blue alliance sides of the field. Since autonomous routines and vision-based targeting are typically authored for one alliance side, this utility automatically mirrors coordinates for the opposite alliance, eliminating the need to maintain separate paths for each side.

## Tech Stack

Click on any of the technology circles below to see why it was chosen for this project:

<div class="project-tech-stack" data-project-id="GompeiLib"></div>
