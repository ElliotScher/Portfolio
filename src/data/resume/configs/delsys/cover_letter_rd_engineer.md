# Cover Letter — R&D Engineer — Delsys

Dear Delsys Hiring Team,

I'm writing to apply for the R&D Engineer position. I'm a Robotics Engineering student at Worcester Polytechnic Institute (B.S., expected May 2027), and Delsys' mission of turning multi modal physiological signals into actionable insight closely matches the kind of work I've been doing for the last two years: designing signal processing and computer vision algorithms that have to hold up on real hardware, not just perform well in a notebook.

Most directly relevant is **GompeiVision**, a computer vision stack I designed and built for the WPI Robotics Resource Center to enable real time 3D localization from multi camera hardware. It runs multi threaded, multi process pipelines on a Linux coprocessor, with separate threads for frame acquisition, fiducial detection, and pose estimation via PnP, so that no single stage blocks real time throughput. Getting there meant debugging real IO constraints along the way, including USB bandwidth limits when running several cameras on the same coprocessor, which is part of what pushed the architecture toward isolated per camera processes instead of one shared pipeline. That same emphasis on decomposing a signal pipeline into robust, independently testable stages carries directly into **WPICal**, a calibration tool I built (now integrated into WPILib) that formulates multi view camera and tag pose estimation as a nonlinear least squares problem solved with Ceres Solver. This kind of numerical optimization work is central to translating raw sensor data into clean, physically meaningful outputs.

I've also had to own the evaluation side of an algorithm, not just the implementation. As part of a WPI team project, I helped build **ParkVision**, a computer vision system for the National Park Service to track visitor movement from trail camera footage: a detection through analysis pipeline (YOLO detection, multi object tracking, re identification, direction and speed estimation) that we validated against manually collected ground truth, reaching 98% agreement on vehicle counts and 93% on license plate reads. Building explicit error analysis frameworks rather than trusting a model's output on faith is exactly the kind of rigor your job posting describes.

I also have experience getting algorithms onto real, constrained hardware under time pressure. As an FRC Electrical Engineering Intern at FIRST Headquarters, I built cross language (Python, C++, Java) embedded robot code used by thousands of teams worldwide. I'm proficient in Python, comfortable in C++, and familiar with PyTorch and scikit learn from coursework and project work, and I'd welcome the chance to build directly on NVIDIA Jetson class hardware.

I'd be glad to talk through any of this work in more detail. Thank you for your consideration.

Sincerely,
Elliot Scher
ecscher@wpi.edu | (803) 873-3478 | linkedin.com/in/elliotscher | github.com/ElliotScher
