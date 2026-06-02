# AprilTag Detection

Each frame is passed into an AprilTag detection pipeline, where tags are extracted from grayscale image data. The detector identifies:

* Tag ID
* 2D corner positions in image space
* Detection confidence metrics

This stage produces a set of 2D observations that can be matched against a known field layout of AprilTags.