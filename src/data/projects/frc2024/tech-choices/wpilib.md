### WPILib for FRC 2024 Codebase

WPILib is the official software library for the FIRST Robotics Competition, providing the foundational APIs for robot control, kinematics, and telemetry:

* **Command-Based Architecture**: Structures the codebase around modular, asynchronous commands (like `aimTowardSpeaker` or `joystickDrive`), enabling clean composition of complex parallel actions.
* **Kinematics & Pose Estimation**: Fuses high-frequency swerve module encoders and Pigeon 2 gyro readings with dual-camera visual updates via `SwerveDrivePoseEstimator`, maintaining a smooth coordinate state on the field.
* **Physics Simulation Support**: Provides physics-modeling utilities (such as `ElevatorSim` and `SingleJointedArmSim`) that power the codebase's offline simulation modes.
