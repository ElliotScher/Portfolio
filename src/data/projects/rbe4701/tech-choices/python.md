### Why Python?

The Bomberman game engine provided by the course is written in Python, so the agents were written as Python subclasses of its `CharacterEntity`:

* **Direct Access to the Engine**: Agents read the world state, simulate future world states for feature evaluation, and plug straight into the existing game loop without any bridging layer.
* **Fast Experimentation**: Value iteration parameters, reward shaping, and the Q-learning feature set changed constantly. Python made it quick to try a change, retrain, and compare results.
* **Tooling in the Same Language**: The headless test harness, training scripts, feature-pruning scripts, and the Pygame Q-value debugger were all written in Python alongside the agents.
