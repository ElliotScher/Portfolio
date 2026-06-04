### Why Python?

Python was selected as the core programming language for the Generic Robotic Systems Framework (`mini_ros`) due to its suitability for rapid architecture design and cross-platform scripting:

* **Dynamic Execution and Rapid Prototyping**: Building a custom publish-subscribe and Behavior Tree architecture from scratch requires frequent design iterations. Python's interpreted nature avoids compile-time overhead, allowing instant verification of message-passing pipelines.

* **First-Class Threading and Queue Support**: The framework implements a multi-threaded architecture where each node runs in its own execution thread. Python's built-in `threading` and `queue` libraries provide ready-to-use thread-safe components (like `Queue` and `RLock`), facilitating queue policies like `DROP` or `POP_OLD`.

* **Rich Ecosystem for Simulation and Testing**: Python easily interfaces with ZeroMQ, enabling clean communication with CoppeliaSim via the official ZMQ-Remote API. It also integrates seamlessly with unit-testing suites like Pytest and auto-documentation libraries like Sphinx.
