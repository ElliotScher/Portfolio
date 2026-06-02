# Network Communication

Final pose estimates are published to the robot using NetworkTables, enabling real-time consumption by control software running on the roboRIO.

Each update includes:

* Robot pose (x, y, theta)
* Timestamp
* Per-camera contribution data (for debugging)
* Optional diagnostic metrics (tag count, error estimates)

On the robot side, this data can be fused with other sensors such as encoders or gyroscopes to improve overall localization robustness.