# Pose Estimation (PnP Solver)

Once a tag is detected, the system computes the 3D pose of the camera relative to that tag using a Perspective-n-Point (PnP) solve.

This step uses three key pieces of information:

* Known physical size of the AprilTag
* 2D pixel coordinates of detected tag corners
* Intrinsic camera calibration parameters (focal length, optical center, distortion coefficients)

From this, the system computes a transformation:

Tag frame → Camera frame

This results in a full 6-DOF pose estimate representing the camera’s position and orientation relative to the observed tag.

If multiple tags are visible in a single frame, each detection is processed independently in addition to the full multi-tag processing, producing multiple candidate poses.

Because each AprilTag has a known fixed position on the FRC field, the system can convert camera-relative poses into a global field coordinate frame.

This is done by chaining transformations:

Field → Tag → Camera

By inverting the appropriate transform, the system produces:

Camera → Field pose

When multiple tag observations are available simultaneously, the system combines them into a single pose estimate using a weighted approach based on detection confidence and geometric stability.