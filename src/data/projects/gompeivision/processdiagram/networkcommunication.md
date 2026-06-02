# Network Communication

Once pose estimates and target data are computed, they must be transmitted to the primary robot controller (roboRIO) with minimal latency. GompeiVision accomplishes this using **WPILib NetworkTables (NT)**, the standard publish-subscribe system in FRC.

## Publisher Settings

Network communication is handled by the `NTOutputPublisher` class, which publishes updates under the namespace:
`/cameras/<hardware_id>/output/`

To prevent network bottlenecks while maintaining maximum responsiveness, the publisher uses custom `nt::PubSubOptions` settings:
* **Update Interval (`periodic = 0.01`):** Vision updates are published at **100 Hz** (every 10ms), aligning with the camera's capture cycle and keeping the roboRIO supplied with fresh data.
* **Keep Duplicates (`keepDuplicates = true`):** Preserves consecutive updates with matching values to ensure the roboRIO receives a continuous stream of timestamps.
* **Send All (`sendAll = true`):** Disables throttling, ensuring every frame's calculation is transmitted.

## Published Topics

Four topics are published per camera device:

1. **`connected` (Boolean):** The hardware connection status of the USB camera.
2. **`capture_fps` (Integer):** The rate at which the camera hardware captures frames (sensor throughput).
3. **`processing_fps` (Integer):** The rate at which the software pipeline completes detection and pose estimation.
4. **`observations` (Double Array):** The primary data payload, containing serialized poses and targeting diagnostics.

## Observations Data Schema

To bypass the overhead of complex serialization formats, the `observations` topic is packed into a high-performance, flat **Double Array** (`std::vector<double>`).

The array is packed in the following order:

### 1. Pose Header
* **`pose_count`** (Index 0): The number of valid poses included (`0.0`, `1.0`, or `2.0`).
  * `0.0`: No tags were detected; no pose data follows.
  * `1.0`: Multi-tag SQPNP pose, or a resolved single-tag pose.
  * `2.0`: Single-tag detection returning two ambiguous pose candidates (IPPE Square).

### 2. Pose Blocks (Repeated `pose_count` times)
Each block represents a 3D pose estimate and consists of **8 double values**:
* **`reprojection_error`** (1 double): The residual error of the camera solver.
* **`translation`** (3 doubles): `X`, `Y`, `Z` coordinates of the camera relative to the field origin (in meters).
* **`rotation`** (4 doubles): `W`, `X`, `Y`, `Z` quaternion representing the 3D orientation.

### 3. Individual Target Data (Appended for all visible tags)
For each detected AprilTag, the following target-specific telemetry is appended to the end of the array for aiming or logging:
* **`tag_id`** (1 double)
* **`corners_angles`** (horizontal/vertical angular offsets to tag corners or center)
* **`distance`** (1 double): Line-of-sight distance to the tag (in meters).

## Latency Compensation

NetworkTables allows publishing values with an associated timestamp. GompeiVision matches the observation payload to the exact timestamp (`result.timestamp`) captured when the camera sensor first registered the frame:
$$\text{Latency} = \text{Current Time}_{\text{roboRIO}} - \text{Timestamp}_{\text{Observation}}$$

On the roboRIO side, the WPILib Pose Estimator uses this delta to look back in time and apply the vision update at the correct historical point in the robot's odometry queue. This eliminates errors caused by processing and network transport delay.