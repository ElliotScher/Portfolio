### Linux for FRC 2024 Codebase

Linux forms the operating system foundation for both the robot's real-time controller (RoboRIO) and its high-performance vision processing systems:

* **Real-Time Execution**: The RoboRIO runs a custom real-time Linux distribution (NI Linux Real-Time), ensuring deterministic control loops for swerve module tracking and safety triggers.
* **Vision Coprocessor Hosting**: The computer vision stack (*GompeiVision*) runs on a dedicated small-form-factor Linux Mini PC. This hosting environment supports low-latency USB camera capture (via V4L2) and runs the ML note-detection pipelines.
* **Remote Deployment & Orchestration**: Standard SSH protocols are utilized by developers to configure network parameters, inspect log streams, and run deployment scripts.
