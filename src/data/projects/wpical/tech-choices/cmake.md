### Why CMake was chosen for WPICal

CMake is the standard build system generator for modern C++ applications, particularly in the robotics and WPILib ecosystems.

- **Cross-Platform Compilation**: WPILib tools must build and run on Windows, macOS, and Linux. CMake generates appropriate build configurations (such as Visual Studio solutions, Xcode projects, or Makefiles) for each operating system from a single `CMakeLists.txt`.
- **Dependency Management**: WPICal relies on several external packages (like OpenCV, Ceres, Eigen, and apriltag). CMake integrates seamlessly with package managers like `vcpkg` to locate, build, and link these libraries automatically.
- **WPILib Build Integration**: The official WPILib codebase (`allwpilib`) uses CMake to build its C++ libraries and desktop tools. Using CMake allowed WPICal's build configuration to be directly included in WPILib's main build system under the `WITH_WPICAL` flag.
