### Why OpenCV was chosen for WPICal

OpenCV (Open Source Computer Vision Library) is the industry-standard framework for real-time image processing and camera calibration.

- **ChArUco Calibration Support**: OpenCV provides robust, built-in algorithms for detecting ChArUco (Checkerboard + ArUco) boards. These patterns are ideal for camera calibration because they combine the corner localization precision of checkerboards with the quick ID verification of fiducial markers.
- **Camera Intrinsics Computation**: OpenCV includes optimized functions for computing the camera's projection matrix and distortion coefficients (radial and tangential), which are essential for correcting lens distortions before estimating 3D tag positions.
- **Video Processing API**: WPICal uses OpenCV's `VideoCapture` API to read and decode various video formats across different operating systems, providing a unified interface for processing field calibration footage.
