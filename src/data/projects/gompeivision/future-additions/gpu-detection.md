### GPU Detection Support

Many coprocessors specialize in graphically intensive tasks and feature built-in GPU processors. In future implementations of GompeiVision, I would like to implement an AprilTag detector capable of using GPU hardware rather than CPU hardware.

#### Goals
- **Reduced CPU Overhead:** Offload the computationally expensive parts of the image pipeline, such as thresholding, decimation, and candidate quad detection, to the GPU. This frees up vital CPU cycles for high-rate network communication, pose filtering, and general robot control tasks.
- **Higher Resolution & Framerates:** Process high-resolution camera feeds (e.g., 1080p) at elevated framerates (>55 FPS) without requiring high decimation rates, resulting in increased detection range and precision.

#### Planned Tech Stack
- **CUDA & Nvidia Isaac ROS:** Leverage CUDA-based acceleration for teams utilizing Nvidia Jetson platforms (such as the Jetson Orin Nano). Utilizing Nvidia's official optimized AprilTag packages can yield sub-millisecond detection latency.
- **Zero-Copy Memory Architectures:** Utilize DMA-BUF or unified memory mapping (such as CUDA Unified Memory) to feed captured camera frames directly into GPU memory, eliminating expensive CPU-to-GPU memory copies.
