### Why Pytest?

Evaluating an agent meant playing thousands of games, which is impractical through the rendered Pygame window:

* **Headless Regression Tests**: The headless test harness was wrapped in Pytest. Each variant plays 10 seeded games with rendering disabled and must not crash and must escape in at least half of them.
* **Catching Regressions Early**: Small tweaks to the monster prediction model or a distance threshold could quietly break a different variant. Running every variant in the test suite surfaced those regressions immediately.
* **Reproducibility**: Tests run with fixed monster random seeds, so a failing game can be replayed exactly.
