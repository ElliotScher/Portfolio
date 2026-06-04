# Video Capture & Preparation

The calibration pipeline begins with recording video footage of the calibration targets. To perform an accurate empirical measurement, the user must record two sets of videos: one for the camera's lens characteristics and another for the physical AprilTag placements on the field.

## Capturing the Calibration Targets

High-quality video capture is crucial for the mathematical solver to identify checkerboard corners and tag IDs reliably.

* **ChArUco Board Video:** The camera intrinsics are computed by detecting a ChArUco (Checkerboard + ArUco) pattern. The board must be mounted on a flat, rigid, non-reflective surface (such as a piece of glass or clipboard). The video is captured by moving the camera around the board at various angles and distances, ensuring the pattern covers all areas of the camera sensor to model radial lens distortion.
* **AprilTag Field Video:** The user records videos of the physical tags on the field. To obtain the best results, the user should record footage from multiple angles and positions, capturing transitions between tags. For instance, to link the position of `Tag A` to `Tag B`, at least some frames in the video must capture both tags simultaneously.

## Transcoding for Platform Compatibility

WPICal utilizes cross-platform media codecs to decode video streams, but video decoding behavior differs by operating system.

### The Linux MJPEG Transcoding Rule
On Linux hosts, WPICal requires videos to be transcoded to the **MJPEG** video codec in an **AVI** container without audio before they are loaded into the application. This ensures that the underlying OpenCV decoder can seek frames deterministically without compression stutter or keyframe lag.

Linux users transcode their files via `ffmpeg`:
```bash
ffmpeg -i input_video.mp4 -f avi -c:v mjpeg -b:v 20m -an output_video.avi
```
The `-b:v 20m` flag configures a high bitrate of 20 Mbps, preventing compression artifacts from degrading sub-pixel corner accuracy during detection.
