### GTSAM Real-Time Multi-Camera Calibration

Currently, WPICal relies on Ceres Solver to run batch non-linear least squares optimization. While Ceres is highly robust, it requires all visual observations to be compiled into a single batch problem before solving. For the next iteration of WPICal, we plan to transition the optimization engine to **GTSAM (Georgia Tech Smoothing and Mapping)** to represent the calibration problem as a **Factor Graph**.

This transition will enable a **Real-Time Multi-Camera Calibration** system running online directly on the robot chassis while driving. This approach is very similar to **TagSLAM**, utilizing visual landmarks (AprilTags) and gyroscope/odometry motion constraints to solve for camera extrinsic mounting offsets and AprilTag coordinates simultaneously.

#### Goals
- **Incremental Solving (iSAM2):** By using GTSAM’s Bayes tree-based incremental solver (iSAM2), WPICal can perform real-time optimization updates on the robot. As the robot traverses the field, the system updates the estimated positions dynamically rather than waiting for a post-processed batch pass.
- **Online Extrinsics & Tag Solving:** Solve for the 6-DOF coordinate transformations (translation and rotation) of all robot-mounted cameras relative to the physical center of rotation, while simultaneously refining the field's AprilTag coordinates.
- **NetworkTables Broadcasting:** Publish solved camera transforms and tag coordinate adjustments over the **NetworkTables (NT4)** protocol in real-time. This allows roboRIO code and coprocessors to consume the calibrated transformations immediately.
- **Local JSON Storage:** Export the final, optimized calibration maps and camera mounting extrinsics directly to standardized JSON files on local disk, ensuring instant compatibility with FRC toolchains.

#### Planned Tech Stack
- **GTSAM (C++ Library):** Integrate the GTSAM C++ library as a core package dependency via CMake and vcpkg.
- **Eigen3 Integration:** Leverage GTSAM's native use of Eigen for matrix computations, aligning with our current CMake configurations.
