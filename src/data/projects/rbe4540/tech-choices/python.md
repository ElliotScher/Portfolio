### Why Python?

Python was used for the `kinova_sim` package that moves the camera and executes grasps:

* **MoveIt Through `rclpy`**: A small `ArmMover` wrapper calls MoveIt's `compute_ik`, `compute_cartesian_path`, and `move_action` interfaces from Python, which keeps the reachability checks for every candidate grasp short and readable.
* **Fast Iteration on Motion Logic**: The executor's sequencing (pre-grasp, approach, close, lift) changed often while tuning on hardware. Python let those changes be tested immediately without rebuilding.
* **NumPy for Poses**: Grasp poses are handled as 4x4 homogeneous transforms in NumPy and SciPy, making offsets like the 10 cm pre-grasp backoff and the lift a one-line operation.
