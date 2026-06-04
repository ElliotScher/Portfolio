### Why ROS 2?

ROS 2 (Robot Operating System) serves as the core system middleware, enabling distributed processing and reliable communication between the robot's subsystems:

* **Distributed Node Architecture**: By splitting the control loops, path planning, and mapping into separate ROS nodes, the system ensures that compute-heavy processes (like A* planning on larger maps) do not block real-time motor commands and LiDAR input pipelines.
* **TF2 Transform Tree**: Managing spatial coordinate transforms (e.g., from the map frame `/map` to the odometry frame `/odom`, and down to the robot base `/base_link` and LiDAR scanner `/base_scan`) is critical. ROS 2's native **tf2** package handles these conversions continuously in the background, allowing the path planner to translate map goals into local robot commands.
* **Standard Message Schemas**: Leveraging standard ROS messages (like `geometry_msgs/msg/Twist` for driving and `nav_msgs/msg/OccupancyGrid` for mapping) allows the system to seamlessly interface with standard visualization tools like **Rviz2** and hardware drivers.
