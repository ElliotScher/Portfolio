### Deep Learning & NPU/TPU Acceleration

To expand GompeiVision beyond CPU-bound 2D fiducial markers, we plan to implement a deep learning-based object detection pipeline accelerated by dedicated NPU/TPU hardware. This addition will enable real-time 3D localization of game elements, robot detection, and accelerated AprilTag detection.

#### Goals
- **NPU-Accelerated AprilTag Cropping:** Run a lightweight bounding-box model on an external M.2 or USB TPU/NPU (like Google Coral or Hailo) to locate AprilTags in high-resolution frames. The system then crops these small regions of interest (ROIs) for CPU decoding, drastically reducing processing latency and CPU utilization.
- **Dynamic Game Object Tracking:** Train and deploy lightweight deep learning models to identify and track game-specific objects (such as notes, cubes, or cones) on the field, automating robot intake and scoring mechanisms.
- **Opponent and Ally Robot Detection:** Detect other robots on the field to dynamically avoid collisions during autonomous routines and implement strategic defensive or cooperative actions.

#### Planned Tech Stack
- **Google Coral USB Accelerator / Hailo M.2 Card:** Offloads machine learning inference to dedicated edge hardware, ensuring high framerates without taxing the coprocessor's CPU.
- **Ultralytics YOLO & PyTorch:** Train custom, quantized object detection models tailored for FRC game pieces and robot chassis datasets.
