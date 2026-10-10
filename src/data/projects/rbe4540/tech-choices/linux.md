### Why Linux (Ubuntu)?

The project was developed and run on Ubuntu 24.04:

* **ROS 2 Jazzy Tier 1 Platform**: Ubuntu 24.04 is the primary supported platform for ROS 2 Jazzy, MoveIt, and Gazebo, with binary packages available through apt.
* **Hardware Drivers**: The RealSense camera driver and the Kinova Kortex driver are both built and tested on Ubuntu, and udev rules give reliable USB access to the camera.
* **Same Environment Everywhere**: Running the same OS in simulation and on the lab PC meant the pipeline moved to hardware without platform-specific changes.
