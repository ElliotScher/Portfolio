### Why ROS 2?

ROS 2 (Jazzy) ties the perception, planning, and hardware together:

* **TF2 Transform Tree**: Every camera view is captured in the moving camera frame. TF2 looks up the camera pose at each cloud's timestamp so all the views can be merged in the robot's base frame.
* **Swappable Simulation and Hardware**: The same nodes run against Gazebo or against the Kortex arm driver and RealSense camera driver. Only launch files and YAML parameters change between the two.
* **MoveIt and RViz**: ROS 2 provides MoveIt for collision-aware motion planning and RViz for visualizing every stage of the pipeline, from merged clouds to normals and the selected grasp.
