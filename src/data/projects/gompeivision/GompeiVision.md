## Summary

**GompeiVision** is a custom, open-source computer vision stack designed for the WPI Robotics Resource Center (RRC) to enable real-time, 3D field-relative robot localization in the FIRST Robotics Competition (FRC). By offloading computationally heavy image processing from the main robot controller (roboRIO) to a dedicated Linux coprocessor, GompeiVision runs independent, multi-threaded camera pipelines to capture frames, detect AprilTag fiducial markers, and solve the Perspective-n-Point (PnP) problem. This architecture delivers high-frame-rate, low-latency position tracking back to the robot, offering a cost-effective, custom-built, and educational alternative to off-the-shelf FRC vision solutions.

***

## Context

In the FIRST Robotics Competition (FRC), robots often need an understanding of their position on the field to automate scoring tasks. To accommodate this requirement, fiducial markers known as AprilTags are placed around the field for the robots to see. By detecting these markers with onboard cameras, robots can apply computer vision and pose estimation algorithms to calculate the precise position and orientation of each camera relative to the field.

### Field Localization Anchors

To automate navigation and scoring, the robot must constantly track its coordinate position relative to the playing field. This is achieved by combining pre-mapped field geometry with visual checkpoints:

<div class="project-hardware-image-wrapper">
    <img src="assets/projects/2026-playing-field-page.webp" alt="2026 FRC Playing Field AprilTag Map" class="project-hardware-image">
    <p class="project-image-caption">The standard FRC playing field layout, mapping the exact global placements and coordinate positions of AprilTag anchors.</p>
</div>

<div class="project-hardware-image-wrapper">
    <img src="assets/projects/apriltag.webp" alt="AprilTag Fiducial Marker Example" class="project-hardware-image">
    <p class="project-image-caption">An example of a 2D fiducial marker from the tag36h11 family, serving as a high-contrast visual landmark.</p>
</div>

* **The FRC Playing Field Map**: The competition field is a pre-defined coordinate space. Fixed AprilTags are placed at strategic, known 3D positions (such as scoring goals, loading zones, and field borders) before the match starts.
* **AprilTag Fiducial Markers**: These high-contrast square markers act as physical landmarks. Because the system knows the exact dimensions and 3D coordinates of each unique marker ID, a camera detecting a marker can calculate the vector distance and relative rotation from the camera to the tag.

By detecting one or more tags, GompeiVision solves the Perspective-n-Point (PnP) problem to translate pixel coordinates into 3D robot positions relative to the field origin.

While established localization solutions can simplify deployment and reduce development effort, they often limit a team's ability to customize or extend the underlying system. In contrast, having control over the full perception stack, including hardware, software, and localization algorithms allows teams to tailor the system to their specific requirements, experiment with new approaches, and diagnose issues more effectively. This level of control also enables teams to develop and deploy fixes independently when bugs are discovered, reducing dependence on external development cycles and allowing problems to be resolved more quickly.

To address the issues with off-the-shelf vision solutions, I designed and implemented a custom computer vision stack called **GompeiVision** as a task for my job working for the WPI Robotics Resource Center (RRC). The design constraints for the project were as follows:
* Must comply with all FRC rules and regulations
* Must run on a wide variety of hardware
* Must cost less than other off-the-shelf vision solutions common in FRC
* Must be educational to students who scale the project in the future

## Why a Coprocessor?

The primary robot controller used in FRC, the roboRIO, is responsible for executing all robot control logic, including motor control, sensor processing, communication with the Driver Station, and autonomous routines. While it is well-suited for deterministic real-time control tasks, it does not provide enough computational performance to efficiently run modern computer vision workloads such as AprilTag detection and pose estimation from multiple high-resolution camera streams.

To overcome this limitation, FRC teams commonly use a separate device known as a coprocessor to perform vision processing. A coprocessor offloads the computationally expensive image processing pipeline from the roboRIO, allowing the robot controller to focus on control and decision-making tasks while the coprocessor handles camera capture, AprilTag detection, and localization. Once vision measurements have been computed, they are transmitted back to the roboRIO over the robot network, where they can be fused with encoder and gyroscope data to improve localization accuracy. GompeiVision follows this architecture by running on a dedicated Linux-based coprocessor, enabling real-time multi-camera localization while remaining fully compatible with standard FRC robot software.

<div class="project-hardware-image-wrapper">
    <img src="assets/projects/MiniPC.jpg" alt="Mini PC Coprocessor Hardware" class="project-hardware-image">
    <p class="project-image-caption">Onboard coprocessor (small form-factor Linux Mini PC) mounted on the robot chassis to run the OpenCV and AprilTag vision pipeline.</p>
</div>

## Tech Stack

To achieve these goals, the stack was chosen with an emphasis on portability, affordability, educational value, and maintainability. Rather than relying on specialized hardware or proprietary software, GompeiVision was built using widely available open-source technologies.

Click on any of the technology circles below to see why it was chosen for this project:

<div class="project-tech-stack" data-project-id="GompeiVision"></div>

## System Design

A key architectural decision in GompeiVision is the use of a multi-process model for pipeline isolation. Each physical camera and its corresponding pipeline runs in its own dedicated process, rather than being handled within a single monolithic application. This ensures that failures, stalls, or performance degradation in one camera pipeline do not impact the others. It also improves scalability, since additional cameras can be added without introducing shared-state bottlenecks across the system.

<div class="project-hardware-image-wrapper">
    <img src="assets/projects/USB.jpg" alt="USB Connection to Coprocessor" class="project-hardware-image">
    <p class="project-image-caption">USB camera connection plugged directly into one of the coprocessor's high-speed USB ports.</p>
</div>

USB-based cameras are widely used in FRC vision systems because they offer a cost-effective, plug-and-play solution with direct OS-level integration. By utilizing standard USB connections to plug directly into the coprocessor ports, the system avoids the network routing overhead and power distribution complexities associated with industrial Ethernet cameras. Under Linux, these devices map directly to standard video device files (via V4L2), allowing the camera processes in GompeiVision to capture low-latency raw frames at high frame rates, which is critical for real-time localization.

Within each camera process, the pipeline is further decomposed into multiple threads, each responsible for a specific stage of processing. Typically, one thread handles frame acquisition from OpenCV, another performs AprilTag detection, and another is responsible for pose estimation, filtering, and publishing results. These threads communicate through lightweight shared data structures, allowing each stage to operate asynchronously. This design prevents slower stages, such as detection or PnP solving, from blocking real-time frame capture, ensuring that the system always processes the most recent available image.

Each pipeline has 4 distinct parts, and come together with a sensor fusion operation on the RoboRIO:

<div id="gompei-vision-process-diagram"></div>

## Results and Testing

Here are demonstrations of the system in action, showcasing the robot autonomously aligning and scoring game pieces on the field using the localization data.

<div id="gompei-vision-media-gallery"></div>

## Future Additions

Below are some of the planned improvements, architectural updates, and research initiatives for the next iterations of GompeiVision:

<div id="gompei-vision-future-additions"></div>