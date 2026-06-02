# AprilTag Detection

The AprilTag Detection stage is the first active processing step in the pipeline after frame acquisition. Implemented in the `FiducialDetector` class, this step operates entirely in 2D image-space, identifying tag candidates and extracting precise corner coordinates.

## Core Detection Engine

GompeiVision integrates the official C-based **AprilTag** library and targets the **`tag36h11`** tag family, which is the standard fiducial marker family used in the FIRST Robotics Competition (FRC). 

## Configuration and Tuning

To balance CPU usage with detection range and precision, `FiducialDetector` configures the AprilTag algorithm with the following parameters:

* **Quad Decimation (`quad_decimate = 4.0`):** Crucial for performance, this decimate factor downsamples the tag candidate generation step. Higher values significantly reduce CPU utilization at the cost of slight detection range. A value of `4.0` offers the optimal trade-off for coprocessors like the Orange Pi 5.
* **Edge Refinement (`refine_edges = true`):** Enables sub-pixel edge refinement on the detected quad boundaries. This is highly critical for downstream pose estimation, as even a pixel-level deviation in corner detection can lead to severe rotational and depth errors in 3D solving.
* **Multi-Threading (`nthreads = 2`):** Distributes the detection workload across 2 CPU threads to minimize frame processing latency and maintain target framerates (>50 FPS).

## Processing Steps

1. **Grayscale Conversion:** Since the AprilTag detector operates on single-channel luminosity data, the incoming BGR/YUYV frame is converted to grayscale using `cv::cvtColor`.
2. **Tag Search & Extraction:** The frame is passed to `apriltag_detector_detect()`, which performs quad detection, thresholding, and decodes the tag payload.
3. **Observation Filtering:** Valid tag detections are collected, extracting:
   * **Tag ID:** Matched against the field layout map.
   * **2D Corner Points:** Coordinates of the four corners in image pixel space.
   * **Confidence Metrics:** Includes the decision margin ($H_0$ vs $H_1$ hypothesis testing) to filter out false positives.