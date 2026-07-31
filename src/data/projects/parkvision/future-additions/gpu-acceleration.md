### GPU-Accelerated Inference

Every detection pipeline in Park Vision currently runs CPU-only by design — `pyproject.toml` pins PyTorch to its CPU wheel index, and `video_yolo.py`'s worker threads hardcode `device = "cpu"`, since the deployment target is an ordinary ranger's laptop with no GPU. That's the right default for a downloadable field tool, but it means processing a full season of footage can take a long time, even with adaptive frame-skipping.

#### Goals
- **Optional, Not Required**: Keep CPU-only as the default and guaranteed-to-work path for laptops in the field, while adding an opt-in fast path for anyone processing a large backlog on a machine that actually has a discrete GPU (a ranger station workstation, for instance).
- **Order-of-Magnitude Throughput on Bulk Backlogs**: A season's archive of trail-camera footage represents hours of video across many cameras — GPU inference could turn a multi-day batch job into an overnight one.

#### Planned Approach
- **A Runtime-Detected Device Flag**: Replace the hardcoded `device = "cpu"` with a check for CUDA availability, falling back to CPU automatically when no compatible GPU is present, so the same installed app works correctly either way without a separate build.
- **Switch the PyTorch Wheel Index Conditionally**: `pyproject.toml`'s pin to the CPU-only PyTorch index would need to become configurable at install time (or ship as a separate optional build) rather than a blanket project-wide default, since a CUDA-enabled PyTorch wheel is considerably larger and requires matching GPU drivers.
