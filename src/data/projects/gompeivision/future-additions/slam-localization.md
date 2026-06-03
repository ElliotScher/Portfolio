### SLAM & Advanced Localization

To move beyond frame-by-frame PNP solutions and enable robust, drift-free robot navigation, we plan to implement a suite of independent state-estimation algorithms running in parallel on the coprocessor. This includes integrating TagSLAM, Visual SLAM (vSLAM), and Monte Carlo Localization (MCL).

#### Core Localization Engines
- **TagSLAM:** Combines AprilTag detections from mono and stereo cameras with robot wheel/IMU odometry to build a high-precision, optimized 3D map of the field layout, exporting a refined AprilTag map (`MapData`) to correct field configuration discrepancies.
- **vSLAM (Visual SLAM):** Tracks visual feature landmarks across consecutive frames to estimate the camera's trajectory and construct a local 3D point cloud (`LocalGeometricMap`). It supports saving/loading maps to persistent storage as initialization priors for future runs.
- **Monte Carlo Localization (MCL):** Uses a particle-filtering approach to fuse camera-relative observations with robot odometry, matching localized features against a pre-loaded geometric map to output highly stable global pose estimates.

#### Data Routing & Fusing
- **Modality-Aware Routing:** Stereo camera streams serve as the primary inputs for vSLAM and MCL to retrieve depth details directly, while mono streams run on demand (manually triggered) to conserve system bandwidth.
- **Persistent Storage Integration:** Generated local geometric maps are serialized and stored. Upon startup, these maps can be loaded back into vSLAM and MCL to act as structural localization priors.
- **Odometry & IMU Fusing:** Live robot telemetry (wheel odometry, heading, modules) is streamed from the roboRIO into all three estimation engines to constrain tracking drift during fast movements.

#### Planned Tech Stack
- **TagSLAM / GTSAM:** Perform factor graph optimization to solve for robot poses and AprilTag poses simultaneously.
- **ORB-SLAM3 / RTAB-Map:** High-performance, open-source vSLAM frameworks for real-time stereo tracking and mapping.
- **ROS 2 Navigation Stack (Nav2):** Leverage existing ROS 2 nodes for MCL (e.g., AMCL) and map sharing.
