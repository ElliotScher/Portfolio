### Why JUnit was chosen for GompeiLib

JUnit is the industry-standard testing framework for Java applications, used to verify code correctness before deployment.

- **Reliability**: JUnit allows developer teams to run unit tests on core abstractions, state machines, and calculations in isolation, preventing regressions.
- **Hardware-Free Verification**: Because testing on physical robots is limited and time-constrained during FRC build seasons, unit tests verify library logic on a computer without requiring physical hardware.
- **Continuous Integration**: JUnit tests can run automatically in GitHub Actions pipelines on every pull request, ensuring only stable releases are published to GitHub Packages.
