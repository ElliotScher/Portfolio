### Why Pytest

Park Vision isn't just software that needs to not crash - it's software making quantitative claims (speeds, directions, plate reads) that need to be measurably correct, and Pytest is how that gets checked on every change:

- **Ground-Truth Benchmarks, Not Just Unit Tests**: Alongside ordinary unit tests, dedicated benchmark scripts validate the speed estimator against the BrnoCompSpeed traffic dataset (LiDAR-measured ground-truth speeds), the vehicle- and pedestrian-direction classifiers against hand-labeled image sets, and plate OCR against known plate text - turning "does the algorithm work" into a number (accuracy, RMSE, confusion matrix) that can regress and be caught.
- **A Test Suite That Mirrors the Source Layout**: `tests/` mirrors `src/`'s package structure one-to-one, so it's immediately obvious which module a given test file is exercising, and nothing in the detection/processing/utility split is left uncovered by convention.
- **Realistic Fixture Data, Not Just Mocks**: `tests/data/` ships real sample trail-camera-shaped images - including timestamp overlays and cropped license plates - so the OCR fallback chain and plate-matching logic are exercised against inputs that look like the messy real world, not idealized synthetic stand-ins.
- **CI-Gated on Every Push**: A dedicated GitHub Actions workflow (separate from the multi-platform build workflow) runs `uv run pytest` on every push, so correctness checks aren't blocked behind - or blocking - the slower three-OS PyInstaller build pipeline.
