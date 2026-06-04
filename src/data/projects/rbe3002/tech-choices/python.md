### Why Python?

Python was selected as the primary programming language for the high-level decision nodes in the RBE 3002 navigation stack due to several key factors:

* **Rapid Algorithm Prototyping**: Developing algorithms like A* path planning, frontier clustering, and coordinate transforms in Python requires zero compile times, allowing for rapid iteration and testing in Gazebo.
* **ROS 2 Client Library (`rclpy`)**: ROS 2 provides robust, first-class Python support, enabling clean implementations of publisher, subscriber, and service nodes. Python's dynamic typing simplifies parsing complex message structures like `nav_msgs/msg/OccupancyGrid` and `sensor_msgs/msg/LaserScan`.
* **Numerical Libraries**: The integration of **NumPy** allows for high-performance vectorized operations on the occupancy grid (e.g., cell indexing, coordinate conversions, and C-space wall padding via sliding-window filters), which would be far more verbose to write in C++.
