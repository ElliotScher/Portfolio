# Pose Estimation

Once AprilTag corners are extracted in 2D image space, GompeiVision translates these pixel coordinates into 3D camera-relative and field-relative poses. This represents the core mathematical localization engine of the system, implementing different algorithms depending on the number of tags visible.

## Single-Tag Pose Estimation

When only a single AprilTag is visible, the system relies on the **IPPE (Infinitesimal Plane-Based Pose Estimation) Square** solver (`cv::SOLVEPNP_IPPE_SQUARE`) inside OpenCV’s `solvePnPGeneric` routine.

* **The Ambiguity Problem:** Planar fiducial targets viewed from a single camera mathematically produce two valid pose solutions (ambiguity in rotation and translation around the tag's plane).
* **Our Solution:** Instead of guessing the correct pose on the coprocessor, GompeiVision publishes **both** potential poses to NetworkTables. The primary robot controller (roboRIO) then disambiguates the correct pose by comparing the solutions against its high-frequency drive odometry and gyroscope state.

## Multi-Tag Pose Estimation

When two or more tags are visible, the system switches to a multi-tag solver to produce a single, stable estimate of the camera's location relative to the field.

1. **Tag Coordinate Lookup:** The pipeline queries the `FieldInterface` to retrieve the known 3D field coordinates (ground-truth) of all visible AprilTags.
2. **Point Aggregation:** The 2D image corner coordinates (top-left, top-right, bottom-right, bottom-left) and their corresponding 3D field-relative coordinates are consolidated into single vectors.
3. **SQPNP Solver:** OpenCV’s `solvePnPGeneric` is executed with the **SQPNP (Square-PNP)** solver (`cv::SOLVEPNP_SQPNP`). SQPNP is a non-iterative, robust algorithm that computes a single globally optimal pose.
4. **Pose Inversion:** The solver calculates the pose of the field origin relative to the camera. GompeiVision inverts this transform to obtain the camera’s pose relative to the field origin.
5. **Robot Pose Offset:** By combining the field-relative camera pose with a pre-configured static transform of the camera relative to the robot frame, the system outputs the robot's actual position on the field.

## Aiming and Targeting

For utility functions such as alignment, aiming, and distance calculations (independent of global localization):
* The system computes horizontal/vertical angles and straight-line distance to specific tags.
* It uses `solvePnPGeneric` with `cv::SOLVEPNP_IPPE_SQUARE` and resolves the ambiguity on-board by selecting the pose candidate with the lower **reprojection error**.

## Coordinate Conventions

To maintain compatibility with standard robotics libraries:
* **AprilTag Poses:** Use the **WPILib standard** (X forward, Y left, Z up).
* **Corner Ordering:** Consistently mapped as Top-Left, Top-Right, Bottom-Right, and Bottom-Left to match the detector's pixel coordinates.
* **Camera Calibration:** Integrates camera intrinsics matrices and distortion coefficients loaded from JSON configurations to correct for lens distortion.