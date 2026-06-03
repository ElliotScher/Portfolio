### Alternative Detection Algorithms

To increase the flexibility and performance options of the GompeiVision platform, we plan to support multiple detection algorithms. Specifically, we want to integrate the ArUco and ArUco-nano detection algorithms alongside our primary AprilTag detector. This allows teams to trade off localization accuracy for processing speed depending on their hardware capabilities and distance requirements.

#### Goals
- **Algorithm Variety Over Constant Markers:** Provide choices between different detection algorithms (standard Apriltag, OpenCV ArUco, and ArUco-nano) while keeping the physical marker types (e.g. AprilTags on the field) constant. Modern libraries allow ArUco detectors to decode AprilTag dictionaries.
- **Improved Performance on Edge Hardware:** Leverage the ArUco and ArUco-nano algorithms to achieve lower latency and higher framerates on low-power coprocessors, as ArUco-based detection is typically faster than standard AprilTag processing.
- **Distance-Accuracy Tradeoffs:** Recognize and manage the trade-offs where ArUco/ArUco-nano algorithms are faster but exhibit reduced accuracy and a shorter detection range at farther distances compared to standard AprilTag detectors. This gives teams the ability to switch algorithms based on their matching constraints.

#### Planned Tech Stack
- **OpenCV ArUco Module:** Configure OpenCV's native ArUco detector (which supports AprilTag dictionaries) to perform high-speed candidate quad detection and decimation.
- **ArUco-Nano Library:** Integrate the ultra-lightweight ArUco-nano detection pipeline to bypass heavy thresholding and contour-finding overhead, maximizing speed on entry-level edge coprocessors.