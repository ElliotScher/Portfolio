# Detection

Every trail camera in Acadia produces one of two things: a dated folder of still JPEGs, or MP4/AVI video clips. Before Park Vision can count, track, or measure anything, it first has to answer the basic question every stage downstream depends on: *what's in this frame, and where?*

## Two Entry Points, One Model Family

`image_yolo.py` and `video_yolo.py` both run **Ultralytics YOLO** — a real-time object detector — but are shaped around very different inputs. Images are static files, so `image_yolo.py` simply chunks the file list evenly across a chosen number of worker threads, each loading its own model instance and calling `model.predict()` per file. Video is a stream that has to be decoded frame-by-frame, so `video_yolo.py` is instead a bounded producer/consumer pipeline: one thread reads frames off the video and pushes them onto a capped queue, while several worker threads pull frames off and run detection — capped specifically so a long clip can't buffer unlimited decoded frames into RAM ahead of the detectors keeping up.

The project ships several purpose-specific models under `models/`: a general-purpose detector (`yolo26s.pt`) trained on the standard COCO classes, a pose-keypoint variant (`yolo26s-pose.pt`) used later for pedestrian direction, and a dedicated license-plate localizer (`license-plate.pt`) that can optionally run alongside the general model on every processed video frame.

## From 80 COCO Classes Down to Three

COCO detectors recognize dozens of categories, but Park Vision only cares about three: people, bicycles, and vehicles. A shared mapping (`classes.py`) folds buses and trucks into "car" and motorcycles into "bicycle," so every downstream stage — tracking, clustering, direction, speed — only ever has to reason about person / bicycle / car, regardless of what the raw detector originally called it.

## Keeping It Fast Enough to Actually Use

A multi-hour trail-camera clip spends most of its runtime with no one in frame. `video_yolo.py` exploits that with adaptive frame-skipping: a `--downsample` factor processes only every Nth frame outright, and `--variable-downsample` goes further, skipping additional frames immediately after one comes back empty, on the assumption that an empty stretch tends to stay empty for a little while. Both pipelines default to running entirely on CPU — the desktop app is meant to run on an ordinary ranger's laptop, not a GPU workstation, so `pyproject.toml` pins PyTorch to its CPU-only build and each pipeline explicitly caps PyTorch's internal thread pool (`torch.set_num_threads(1)`) so the many detection worker threads don't fight each other for the same CPU cores.

The output of this stage is a JSON detection report — every box, its class, its confidence, and (for video) its frame index — that every later stage in the pipeline reads back in rather than re-running detection itself.
