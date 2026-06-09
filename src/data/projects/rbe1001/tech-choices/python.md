### Why Python was chosen for WPI RBE 1001

Python is the programming language utilized for the VEX V5 Labs and the Final Autonomous Fruit Harvester Project in WPI RBE 1001, providing several distinct advantages for prototyping robotic behaviors:

- **Official VEX V5 Python API**: The VEX V5 system natively supports Python compilation and runtime execution on the V5 Brain. This allows direct hardware communication with motors, encoders, the inertial gyro, line sensors, sonar, and the vision camera.
- **Rapid Prototyping & Dynamic Typing**: Writing control loops, path corrections, and state machines in Python eliminates compilation overhead, facilitating rapid iterative debugging on the physical robot during lab sessions.
- **Standard Math & Vector Libraries**: Python’s standard `math` and geometry functions enable real-time execution of Mecanum kinematic vector projections, coordinate transformations, and sensor noise filtering equations.
- **Readability & Modular Structure**: Object-oriented programming in Python allows encapsulation of complex features (such as line sensor arrays, dual-motor lift PID controls, and odometry estimation) into isolated, maintainable classes.
