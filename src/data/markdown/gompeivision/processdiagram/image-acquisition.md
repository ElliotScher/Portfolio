# Image Aquisition

Each camera stream is captured using OpenCV’s video capture interface. Frames are processed independently per camera in separate execution contexts to ensure that no single camera blocks the rest of the system.

A key design goal here was minimizing latency rather than maximizing throughput. In a robotics context, stale pose data is often more harmful than dropped frames, so the pipeline is designed to always process the most recent available frame rather than queueing older ones.

To support multiple physical cameras reliably, each device is mapped to a stable identifier at the operating system level using persistent udev rules. This ensures that camera assignment remains consistent across reboots and hardware reconfiguration.