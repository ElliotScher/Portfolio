### Linux for FRC 190 Codebases

Linux is the operating system foundation for FRC Team 190's onboard control systems and peripheral computing:

* **Real-Time Execution**: The RoboRIO runs a realtime version of Linux (NI Linux Real-Time), ensuring deterministic execution of critical control loops, swerve module tracking, and safety systems.
* **Coprocessor Platform**: Provides a stable and flexible environment for running custom vision coprocessors, machine learning note-detection, and USB camera capture services.
* **Developer Shell Access**: Standard SSH protocols are utilized by developers to configure network parameters, inspect log streams, and run deployment scripts.
