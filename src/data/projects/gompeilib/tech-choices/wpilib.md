### Why WPILib was chosen for GompeiLib

WPILib is the standard software library used in the FIRST Robotics Competition (FRC), providing core classes for robot control.

- **Standard Abstractions**: GompeiLib inherits and extends WPILib's geometry (`Pose2d`, `Rotation2d`) and kinematics classes (`SwerveDriveKinematics`), allowing it to integrate directly with standard FRC drivetrain algorithms.
- **Hardware Integration**: WPILib provides the low-level communication interfaces for CAN bus devices, sensors, and driver station operations that GompeiLib wraps in its custom IO layers.
- **Simulation Infrastructure**: Building on top of WPILib allows GompeiLib's motor abstractions to easily hook into physics simulations like `DCMotorSim` for hardware-free testing.
