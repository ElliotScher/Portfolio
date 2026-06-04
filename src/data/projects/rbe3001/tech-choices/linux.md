### Why Linux (Ubuntu) was chosen for the Robotic Arm Project

The OMX arm controller and Dynamixel SDK were run on a PC running Ubuntu 24.04 LTS, providing several benefits:

- **Low-Latency Serial Communication**: Linux offers highly reliable, low-latency USB-to-serial communication (`/dev/ttyUSB0`) with the Dynamixel U2D2 hardware interface, which is crucial for real-time trajectory execution.
- **Standard Robotics Environment**: Ubuntu is the industry-standard OS for robotics research and development, ensuring native compatibility with the Dynamixel SDK and low-level hardware drivers.
- **Process Scheduling & Command Line Tools**: Allowed for easy scripting, background logging, and clean resource management while coordinating camera feeds and hardware control loops.
