### Why Pytest?

Pytest serves as the test framework for validating the custom pub-sub middleware and node behaviors:

* **Verifying Middleware Reliability**: Since `mini_ros` implements thread management, message queueing policies (DROP, POP_OLD, RAISE, BLOCK), and request-reply services, writing thorough unit tests is critical. Pytest allows testing these concurrent operations using fixtures and assertions.

* **Simulating Sim and Node Lifecycles**: Pytest simplifies writing mock nodes and topics, verifying that message routing, callbacks, and FSM/Behavior Tree state transitions occur exactly as specified without needing a live connection to CoppeliaSim.

* **CI Integration & Test Coverage**: Pytest integrates with tools like `pytest-cov` to track test coverage, ensuring the core concurrency code is robust and free from race conditions or deadlocks.
