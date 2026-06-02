### GPU Detection Support

Many coprocessors specialize in graphically intensive tasks and feature built-in GPU processors. In future implementations of GompeiVision, I would like to implement an AprilTag detector capable of using GPU hardware rather than CPU hardware.

#### Goals
- **Minimize Detection Latency:** Offloading compute-heavy tasks like image thresholding, quad extraction, and tag identification to the GPU to achieve near-instantaneous pose estimation.
- **Support High-Framerate & High-Resolution Streams:** Enable processing of 1080p camera streams or high-framerate configurations (60+ FPS) without dropping frames or stalling.
- **Free CPU Overhead:** Relieve CPU congestion on the coprocessor, ensuring that other vital processes (such as network communications, OS tasks, and logging) have ample resources to execute reliably.
- **Enable Multi-Camera Scaling:** Scale the vision pipeline to run multiple camera streams concurrently on a single coprocessor by distributing the parallel processing workload across the GPU cores.