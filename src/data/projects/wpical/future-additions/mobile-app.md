### Mobile Calibration Application

Carrying a laptop or driving a robot around a playing field to capture calibration video and process it is awkward and slows down the team. To make field-side calibration completely seamless, we plan to rewrite the calibration utility as a dedicated **Mobile Calibration Application**. This app will consolidate both camera intrinsic calibration and relative tag pose optimization into a single handheld workflow, running all computer vision and numerical solvers locally on a smartphone.

#### Goals
- **On-Device Intrinsic Calibration:** Use the phone's native camera API to capture high-framerate video, automatically detecting ChArUco pattern corners in real-time and calculating the camera’s focal lengths and lens distortion coefficients on the fly.
- **Handheld Field Scanning:** Allow a user to walk around the field and "scan" the AprilTags. The app will run on-device AprilTag detection and display a 3D visualization of the tag poses converging in real-time.
- **Embedded Optimization Engine:** Compile high-performance computer vision and linear algebra solvers (like OpenCV and GTSAM/Ceres) to run natively on mobile processor architectures (ARM64).
- **Direct Wireless Export:** Export the calibrated field map JSON wirelessly to Google Drive, email, or directly to the team's shared robot configuration directory.

#### Planned Tech Stack
- **Swift & Kotlin Native APIs:** Use Swift (iOS) and Kotlin (Android) native camera and hardware acceleration frameworks (like Apple's AVFoundation and Metal) to capture frames and process pixels with minimal overhead.
- **React Native & TypeScript UI:** Build a shared cross-platform user interface using React Native and TypeScript to maintain a consistent UI and codebase across iOS and Android devices.
- **C++ Mobile Bindings:** Wrap OpenCV C++ and GTSAM optimization code using Java Native Interface (JNI) for Android and Objective-C++ bridges for iOS to leverage high-performance native math libraries.
