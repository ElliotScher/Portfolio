# Field Setup & Constraints

Before starting the global optimization solver, WPICal must be configured with the physical constraints, initial coordinate frames, and input files.

## Optimization Parameters

The user configures the problem parameters in the GUI interface:

1. **Load Camera Intrinsics:** The user selects the `cameracalibration.json` file generated during the camera calibration step. This models the camera's perspective projection.
2. **Upload Ideal Field Map:** The solver requires an "initial guess" for the position of each tag on the field to initialize the optimization equations. WPICal loads the official WPILib AprilTag JSON layout file (e.g. the standard 3D CAD coordinates for the competition season).
3. **Select Video Directory:** Points WPICal to the folder containing the field videos. The tool loads all `.mp4` or `.avi` files in this directory to extract AprilTag frames.
4. **Choose Pinned Tag:** The user selects a single AprilTag ID to act as the "pinned" anchor. Because the relative tag solver operates on vector offsets, it must have a coordinate origin. The pinned tag is locked in its ideal map coordinate location, and all other tags are optimized relative to this reference anchor.
