# Camera Calibration

Camera calibration computes the lens's intrinsic properties, creating a model to correct for lens distortion. This step is necessary to accurately translate 2D pixel positions of AprilTags into real-world 3D vectors.

## In-App Calibration Engines

WPICal provides two distinct numerical engines to perform camera calibration natively inside the desktop application:

* **MRcal Backend (Recommended):** Developed by NASA’s Jet Propulsion Laboratory (JPL), MRcal is a modern camera calibration framework that utilizes B-splines to model physical distortions. It provides higher accuracy and is mathematically more robust against bad or noisy calibration frames.
* **OpenCV Backend:** A standard checkerboard solver that uses polynomial models to calculate camera focal parameters and radial distortion coefficients.

Regardless of the engine, the user must input the exact board configuration:
* **Square Width & Marker Width:** The dimensions (measured using precise calipers) of the checkerboard squares and inner ArUco markers.
* **Board Dimensions:** The number of horizontal and vertical grid squares. The board height must be an odd number of rows to bypass a known bug in OpenCV's contrib board detection.

## Intrinsics Output JSON

After running the calibration, WPICal automatically saves the computed parameters to a file named `cameracalibration.json` in the video directory. This file contains the core intrinsic parameters required for the field solver:

* `avg_reprojection_error`: The average pixel error of the projected corners. Values under `0.5` pixels indicate a successful calibration.
* `camera_matrix`: The $3 \times 3$ intrinsic camera matrix containing the focal lengths the principal point coordinates.
* `distortion_coefficients`: The lens distortion parameters for radial and tangential alignment.

## Importing Pre-Computed Calibrations

If teams have already calibrated their cameras using external web services (like **CalibDB.net**), WPICal supports importing these directly. Users can upload the OpenCV-formatted JSON download from CalibDB, provided the calibration matches the resolution of the field videos.
