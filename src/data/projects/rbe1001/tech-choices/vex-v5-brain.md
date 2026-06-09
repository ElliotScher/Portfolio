### Why the VEX V5 Brain was chosen for RBE 1001

The VEX V5 Robot Brain acts as the central control hub for the RBE 1001 robot, coordinating all processing, sensor inputs, power distribution, and motor outputs:

- **All-in-One Integration**: The V5 Brain combines a 4.25-inch color touchscreen, 21 smart ports (supporting both digital/analog signals and smart motor feedback), and built-in wireless radio links into a single unified package.
- **Onboard Microprocessor**: Runs a dual-core ARM Cortex-A9 processor, providing sufficient real-time computational power to execute multi-threaded control tasks, high-frequency gyro readings, and computer vision data pipelines without latency.
- **Smart Port Diagnostics**: Smart ports automatically detect connected devices, provide real-time current draw telemetry, and allow high-speed bidirectional communication with VEX Smart Motors at 100Hz.
- **Debugging & Touchscreen GUI**: The Brain’s screen is used during labs to output sensor diagnostics, display coordinate odometry coordinates ($X, Y, \theta$), print vision detection logs, and trigger autonomous routines directly via on-screen buttons.
