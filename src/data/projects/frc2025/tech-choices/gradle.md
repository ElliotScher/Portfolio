### Gradle for FRC 2025 Codebase

Gradle is the build automation system used to manage dependencies, compile Java source files, and deploy executable binaries to the robot's onboard controller:

* **WPILib Deployment**: Coordinates deploying compiled code, configuration assets, and native libraries directly to the RoboRIO.
* **Reflective Safety Verification**: Runs custom Groovy tasks (`checkRoboRIOtoRobotType`) before deployment to prevent flashing incompatible configurations onto live hardware.
* **Dependency Orchestration**: Simplifies vendor API integration (such as CTRE Phoenix 6, RevLib, and AdvantageKit) and keeps versions locked across developers.
