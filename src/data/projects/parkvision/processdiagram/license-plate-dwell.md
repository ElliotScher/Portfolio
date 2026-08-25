# License Plates & Dwell Time

One of the Park Service's specific asks was dwell time at parking lots: how long does a given car actually stay parked? Answering that means reliably recognizing the *same* vehicle across multiple sightings, hours apart - which is exactly what a license plate is for.

## Reading a Plate That Was Never Meant to Be Read Up Close

`video_plateextractor.py` first localizes plates with a dedicated YOLO model, then hands each cropped plate to **fast-plate-ocr**, a recognition model trained specifically on license plates - chosen deliberately over a generic OCR engine like Tesseract, which struggles badly with the embossed characters, decorative state graphics, and low resolution of a plate photographed from a distant, weatherproofed trail camera. Every crop is padded outward by 8% before recognition, since a plate reads more reliably with a small border than cropped edge-to-edge, and every crop's timestamp, source video, and frame index get written to a manifest file - necessary because once a frame is cropped down to just the plate, the on-screen timestamp overlay burned into the original footage is gone.

## Figuring Out *When*, Three Different Ways

Getting a trustworthy timestamp for a frame turns out to need a fallback chain, not one method: first, try to OCR the timestamp actually burned into the footage by the camera itself (cropping the bottom strip of the frame and reading it with Tesseract); if that fails, fall back to parsing the filename and folder naming convention the pipeline's own ingestion tools already produce (`HH-MM-SS.jpg` inside a `YYYY-MM-DD` folder); and if even that's unavailable, fall back to the file's own last-modified time as a final resort.

## Matching a Plate to Itself, Even With a Misread Character

OCR isn't perfect - a single misread character would otherwise fracture one continuous parking event into several disconnected "different" plates. `plate_dwellprofiler.py` supports both exact-text matching and a fuzzy mode based on Levenshtein edit distance, chaining together readings that are all within a small number of character edits of each other (with an optional time-gap guard so two different vehicles with coincidentally similar plates hours apart don't get merged). Readings can also be pooled across multiple camera folders - an entry-facing and an exit-facing camera at the same lot, for instance - into one shared timeline. For each matched vehicle, dwell time is simply the gap between its earliest and latest sighting.

This is the subsystem behind one of the project's headline accuracy figures: **93% of license plates read correctly**, measured against manually processed footage at Acadia's Jordan Pond parking lot.
