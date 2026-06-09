### Gradle for FRC Shared Codebase

Gradle acts as the build automation tool and package manager for the robot project:

* **Compile-Time SSH Safety Check**: During deployment (`./gradlew deploy`), Gradle runs custom tasks that SSH into the RoboRIO using JSch to check `/etc/machine-info` and compare the target robot flag against the compiled configuration code, preventing accidental deployment of mismatched software.
* **Task-based Deployment**: Automates code compilation, testing, and deployment to the RoboRIO embedded Linux controller via standard deployment tasks.
* **Dependency Management**: Standardizes the integration of vendor libraries (CTRE Phoenix, REV Robotics, Choreo path planner) and updates them across all developer systems.
* **Multi-Project Builds**: Handles dependencies between the main robot codebase and local helper libraries (such as `lib/` which synchronizes with GompeiLib) seamlessly.
