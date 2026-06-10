### Linux for FRC Shared Codebase

The shared codebase target hardware is the RoboRIO, an embedded Linux controller running NI Linux Real-Time:

* **Embedded Real-Time Executions**: The RoboRIO's real-time Linux kernel ensures deterministic execution of the control loops (set to 20ms or custom 10ms periods).
* **Remote Deployment & Debugging**: Connects to developer systems via SSH, allowing rapid deployments (`scp`) and interactive remote debugging.
* **Filesystem Logs**: Standardizes logging target paths like `/U/logs` (USB drives) for continuous log collection.
