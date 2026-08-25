### On-Camera Edge Processing & Remote Upload

Right now, getting footage into Park Vision means someone physically visiting each camera, pulling the SD card, and bringing it back to run the desktop app. Our team's own poster identified this as the clear next step: "develop a camera for video, onboard processing, and remote access."

#### Goals
- **Eliminate the Physical Retrieval Trip**: Process detections directly on (or near) the camera itself and upload only the lightweight results - not raw multi-gigabyte footage - over a cellular or satellite uplink, so visitor-use data is available without a ranger driving out to every site.
- **Near-Real-Time Visitor Counts**: A camera that reports results as it goes, rather than being batch-processed weeks later, would let park staff react to congestion the same day it happens instead of analyzing it retroactively at the end of a season.

#### Planned Approach
- **Single-Board Edge Compute**: A low-power board (in the Raspberry Pi class of hardware, or a similar ARM SBC) mounted alongside the camera, running a trimmed version of the existing CPU-only detection pipeline - the same YOLO models Park Vision already uses, just deployed at the edge instead of on a desktop.
- **Bandwidth-Aware Uplink**: Since remote camera sites in Acadia are unlikely to have reliable broadband, only structured detection results (and perhaps periodic thumbnail crops for spot-checking) would be transmitted, not full-resolution video - keeping data costs and power draw manageable on solar/battery-powered field hardware.
