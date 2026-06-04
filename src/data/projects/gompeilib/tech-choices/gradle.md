### Why Gradle was chosen for GompeiLib

Gradle is the official build system for FRC Java and C++ projects, making it the natural choice for managing GompeiLib.

- **Dependency Management**: Gradle automatically pulls in external libraries such as WPILib and vendor APIs (CTRE Phoenix, REV Robotics), ensuring all build targets are resolved correctly.
- **Package Distribution**: Gradle allows the project to be built and compiled into a Maven-compatible format, which is then published to GitHub Packages.
- **Seamless Consumption**: Teams can pull GompeiLib into their season codebases by simply adding a one-line Maven repository and dependency declaration in their own `build.gradle` configuration.
