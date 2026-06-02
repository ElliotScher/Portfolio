# Image Acquisition

The Image Acquisition stage is the starting point of the GompeiVision pipeline. Implemented in the `Camera` class, it manages the physical connection to the camera hardware, configures capture parameters, and streams frames into the processing thread.

## OpenCV Video Capture & V4L2

Each physical camera stream is managed independently using OpenCV’s `cv::VideoCapture` interface, configured to use the **V4L2 (Video4Linux2)** backend on Linux.

* **Latency Over Throughput:** In real-time robot localization, outdated (stale) data is far more dangerous than dropped frames. To avoid processing queued frames, GompeiVision captures frames asynchronously, ensuring that the detection thread always pulls the absolute newest frame available from the camera buffer.
* **Auto-Reconnection (`attemptReconnect`):** If a frame capture fails (due to power fluctuations or cable wiggle), the pipeline flags the camera as disconnected and continuously attempts to reinitialize the capture handle in the background without crashing the main application.
* **Exposure & Brightness Control:** Camera exposure is configured manually to prevent motion blur and overexposure of reflective field elements. The `Camera` class exposes manual controls (`setExposure` and `setBrightness`) which are applied directly to the hardware via OpenCV properties.

## Hardware Specifications

GompeiVision is optimized to run on Team 190's standard hardware configuration:
* **ThriftyCam:** A global shutter monochrome camera capable of capturing crisp, motion-blur-free images of AprilTags while the robot is moving.
* **Uncompressed Streams:** Video is streamed in uncompressed **YUYV** format over USB 3.0 to eliminate compression/decompression latency and JPEG artifacting.
* **High Framerate:** Streams run at **>50 FPS** with resolutions at **$1280 \times 720$** or higher.

## Persistent Camera Mapping (udev Rules)

One of the major challenges with using USB cameras in multi-camera configurations is device node unpredictability. Because ThriftyCams do not possess unique embedded serial numbers, the Linux kernel assigns `/dev/video*` paths dynamically during boot or replugs. 

If two cameras swap nodes, the coordinate transformations are inverted, which completely invalidates localization.

### The Solution: USB Port Mapping via udev
To guarantee consistency across reboots, GompeiVision binds cameras to stable identifiers based on their physical USB port topography rather than serial numbers.

1. Linux maps USB devices into predictable directory paths under `/dev/v4l/by-path/` (e.g., `platform-xhci-hcd.0.shared-usb-0:1.1:1.0-video-index0`).
2. Custom `/etc/udev/rules.d/` rules are defined to detect which USB port a camera is plugged into and map it to a persistent alias (e.g., `/dev/camera_front`, `/dev/camera_back`).
3. The `PipelineManager` launches pipelines targeted at these stable paths, ensuring the correct physical transform (offset relative to the robot's center) is always matched to the corresponding camera.