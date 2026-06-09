### Linux for FRC 2025 Codebase

Linux provides the operating system platform for both the robot's real-time controller (RoboRIO) and its visual processing systems:

* **NI Linux Real-Time**: Host OS on the RoboRIO that ensures deterministic, low-jitter execution of swerve drive and superstructure control loops.
* **Vision Coprocessor**: Connects dual visual cameras directly to a Linux Mini PC, running low-latency V4L2 capture and neural network object detection pipelines for Algae tracking.
* **Network Integration**: Standard Linux networking protocols (like mDNS and SSH) coordinate telemetry data streams between the coprocessor, RoboRIO, and Driver Station dashboard.
