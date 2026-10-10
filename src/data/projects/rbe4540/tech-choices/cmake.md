### Why CMake?

CMake (through `ament_cmake` and `colcon`) builds the C++ perception package:

* **ROS 2 Build Standard**: `ament_cmake` is the standard way to build C++ ROS 2 packages, handling message dependencies, install rules, and launch/config file installation.
* **Dependency Discovery**: `find_package` locates PCL, Eigen, `pcl_conversions`, and `tf2_eigen`, keeping the build portable across the simulation machine and the lab PC.
* **Library + Node Split**: The pipeline stages are compiled into a library that the ROS node links against, keeping the PCL processing code separate from the ROS plumbing.
