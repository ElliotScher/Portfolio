### Web Calibration Dashboard

Currently, GompeiVision stores the camera settings and calibrations in the robot code which gets published to the GompeiVision coprocessor at runtime. This pipeline is good, but currently there is no way to calibrate the cameras without relying on outside tools. I would like to implement a camera calibration routine that runs on the coprocessor to remove the need for external calibration software.

#### Goals
- **Interactive Calibration:** Generate checkerboard/ChArUco calibration patterns directly on-screen, capturing frames dynamically to compute lens intrinsic parameters and distortion coefficients.
- **Real-Time Video Stream:** View a low-latency raw or annotated video stream (overlaying detected tags and axis vectors) directly in the browser.
- **Latency Diagnostics:** Graph pipeline performance metrics, including acquisition, detection, and communication latency.

#### Planned Tech Stack
- **WebSockets / HTTP Server:** A fast, lightweight C++ server framework (such as Crow or httplib) running in a background process.
- **React / Vanilla Web UI:** A responsive dashboard styled to match our standard driver diagnostics, providing a visual control panel for system configuration.
