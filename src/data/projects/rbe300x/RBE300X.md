## Summary

**Generic Robotic Systems Framework** (`mini_ros`) is a lightweight, ROS 2-inspired publish-subscribe software framework written in **Python**. Designed for WPI's RBE 300X (Software Design for Robotics) curriculum, the framework enables distributed, multithreaded robotic control. It features custom node registries, thread-safe message queues, a request-reply service model, and a custom Behavior Tree and Finite State Machine execution engine. The framework interfaces with the **CoppeliaSim** robotics simulator via a ZeroMQ-based bridge, allowing students to implement complex autonomous behaviors—such as Trémaux's maze-solving algorithm—on simulated differential-drive platforms.

***

## Context

In modern robotics engineering, software systems are rarely implemented as monolithic loops. Instead, they operate as distributed systems composed of modular nodes (e.g., sensor interfaces, localization filters, path planners, and motor controllers) communicating asynchronously. To understand the underlying challenges of message serialization, queue buffer policies, thread scheduling, and asynchronous request-reply interfaces, this project implements a complete ROS-like middleware from scratch.

The framework runs within a multithreaded environment. Each software node executes in its own thread, subscribing to telemetry topics or publishing control command messages. The entire graph of nodes, topics, and services is dynamically constructed at runtime based on external YAML configuration files, allowing rapid updates to the robot's routing without changing Python source code.

### Core Architecture and Concurrency

To coordinate complex autonomous behaviors, the framework implements several layers of control abstraction:

* **Publish-Subscribe Middleware**: Topics serve as named message channels managed by a global `TopicRegistry`. Nodes can dynamically register as publishers or subscribers. When a message is published, it is pushed to thread-safe queues associated with each subscriber. The subscriber node processes these messages sequentially at its configured rate.

* **Queue Management Policies**: To handle situations where a node processes messages slower than they are received, the system implements four configurable `QueuePolicy` modes: `DROP` (discards incoming messages when full), `POP_OLD` (removes the oldest message to make room), `BLOCK` (pauses the publisher thread), and `RAISE` (triggers an exception).

* **Synchronous Service Calls**: In addition to asynchronous topics, `mini_ros` supports a request-response communication pattern managed by a `ServiceRegistry`. A `ServiceClient` can send a request message to a registered `Service` and block until a response callback is executed by the service-providing node.

* **Behavior Tree & State Machine Engines**: For high-level decision making, the framework features a custom Behavior Tree (BT) implementation based on a composite vertex hierarchy (`VertexStatus`: SUCCESS, FAILURE, RUNNING). It supports control flow nodes such as sequences, selectors (fallbacks), and parallel execution nodes. It also includes a Finite State Machine (FSM) engine that executes enter, update, and exit actions based on state transition tables.

* **CoppeliaSim Simulation Bridge**: To connect the software nodes to simulated hardware, the framework includes a `CoppeliaSimBridge` utilizing the ZeroMQ Remote API. This bridge serializes requests from multiple Python node threads into a single ZMQ communication thread, preventing concurrency conflicts when querying laser scanner readings or setting wheel speeds.

## Tech Stack

Click on any of the technology circles below to see why it was chosen for this project:

<div class="project-tech-stack" data-project-id="RBE300X"></div>

## Process

The development of the Generic Robotic Systems Framework progressed through modular stages:

* **Pub-Sub Implementation**: Designed the thread-safe `Topic` and `Node` registry classes, handling lock management (`RLock`) and queue policies.

* **Service Architecture**: Developed the request-response service client model to support synchronous inter-node communications.

* **Simulator Integration**: Built the thread-isolated `CoppeliaSimBridge` using pyzmq to communicate with the simulated environment.

* **Behavior Tree Engine**: Coded the composite behavior tree node hierarchy, allowing task planning to be defined as executable graphs.

* **Algorithm Deployment**: Designed behavior trees and state machines to execute line following, obstacle detection, and Trémaux's maze-solving algorithm in simulated warehouse and maze environments.

* **Testing and Verification**: Wrote comprehensive unit test suites using Pytest to guarantee that queue policies and state transitions are deadlock-free.
