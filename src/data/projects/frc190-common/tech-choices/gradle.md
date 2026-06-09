### Gradle for FRC 190 Codebases

Gradle is used across FRC 190 projects because it is the official build system for FRC robot code, automating the process of dependency management, compilation, and deployment:

* **Official Build System**: Serves as the standardized build tool designated by WPILib, coordinating compiling, linking, and deployment tasks out-of-the-box.
* **GradleRIO Integration**: Executes standard FRC tasks to package code, JRE runtimes, and libraries, then deploys them over the network to the RoboRIO.
* **Dependency & Vendordep Management**: Simplifies importing third-party libraries (such as CTRE Phoenix, REV Robotics, and PhotonVision) through standard JSON configurations.
