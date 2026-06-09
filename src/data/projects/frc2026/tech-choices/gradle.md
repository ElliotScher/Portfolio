### Gradle for FRC 2026 Codebase

Gradle is the build automation system used to manage dependencies, compile Java source files, and deploy executable binaries to the robot's onboard controller:

* **GradleRIO Integration**: Incorporates the official WPILib build plugin (GradleRIO) to coordinate code deployment, JRE setup, and native library linking (such as CTRE Phoenix 6 and RevLib).
* **Multi-Robot Deploy Safety**: Utilizes custom Groovy tasks (`checkRoboRIOtoRobotType`) to SSH into the target RoboRIO, query its hostname/machine identity, and match it against the compiled target constant before flashing code.
* **Dependency Management**: Simplifies vendor dependency integration (like AdvantageKit and gversion), ensuring that all libraries match compatible versions across development environments.
