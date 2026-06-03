### Match Video Recording

To improve driver feedback, team scouting, and post-match post-mortems, we plan to implement an automated video recording utility. This system will record compressed video streams from all camera feeds, dynamically synchronized with the match state.

#### Goals
- **Automated Triggering:** Automatically start and stop recordings based on the FRC robot state (Autonomous, Teleop, and Disabled) received via WPILib NetworkTables or the Driver Station protocol.
- **Hardware-Accelerated Compression:** Utilize hardware-accelerated video encoders (such as Nvidia NVENC or Raspberry Pi hardware codecs) to compress video streams in real-time with minimal CPU overhead.
- **Match-Indexed Metadata:** Store video files with matching timestamps, match numbers, alliance details, and camera configurations parsed from the FRC Driver Station API to enable easy lookup and playback.

#### Planned Tech Stack
- **GStreamer / FFmpeg:** Use high-performance media frameworks to build optimized video pipeline structures, handling direct hardware encoding and containerization.
- **WPILib NetworkTables:** Monitor robot status flags and match configuration variables (match type, match number, game state) to orchestrate recording events.
