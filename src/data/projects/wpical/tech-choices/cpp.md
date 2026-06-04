### Why C++ was chosen for WPICal

C++ is the primary programming language used for high-performance computer vision, robotics, and numerical optimization libraries. I selected C++ for WPICal to meet both performance and architectural requirements:

- **Mathematical Optimization Performance**: WPICal performs large-scale non-linear least squares optimization using Ceres Solver and Eigen. C++ compiles to native machine code, enabling the solver to perform thousands of iterations and solve complex matrix systems in milliseconds.
- **Computer Vision Operations**: Using OpenCV's native C++ API allows WPICal to process high-resolution video streams and extract AprilTag detections rapidly without garbage collection overhead or script interpreter delays.
- **WPILib Core Integration**: WPILib's native tool suite (including tools like OutlineViewer and SysId) is built in C++ using the `wpigui` framework. Writing WPICal in C++ made it a first-class citizen in the allwpilib repository, facilitating clean codebase integration and shared code reuse.
