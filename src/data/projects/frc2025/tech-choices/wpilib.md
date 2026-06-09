### WPILib for FRC 2025 Codebase

WPILib is the official software suite for FRC development, providing crucial control loops, kinematics, and simulation utilities:

* **Swerve Pose Estimator**: Coordinates wheel odometry and camera vision tag updates, maintaining an accurate field coordinate model.
* **Superstructure Simulation**: Powers the multi-stage elevator and arm pivot simulators (`ElevatorSim` and `SingleJointedArmSim`) using physics models.
* **Command Composition**: Simplifies combining multiple mechanism tasks into clean sequential paths using the Command-Based framework.
