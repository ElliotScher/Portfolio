### Why MATLAB was chosen for the Robotic Arm Project

MATLAB was the primary programming and numerical computing environment used throughout the WPI RBE 3001 course, offering several distinct advantages for prototyping robotic controls:

- **Matrix Operations**: Kinematic derivations (DH matrices, homogeneous transformations, Jacobian matrices) consist of extensive matrix multiplications and linear algebraic operations. MATLAB's native matrix-first architecture optimizes these calculations.
- **Symbolic Math Toolbox**: Used to analytically derive the forward kinematics equations and the Manipulator Jacobian before exporting them as fast, optimized floating-point functions (`dh2fk` and `jacob3001`).
- **Computer Vision & Image Processing Toolboxes**: Provided high-level tools like the Camera Calibrator app (for checkerboard intrinsic calibration) and the Color Thresholder (for HSV masking), allowing rapid setup of the perception pipeline.
- **Dynamixel SDK Integration**: Allowed serial communication to command joint angles and read servo telemetry (position/velocity) directly from the MATLAB workspace.
