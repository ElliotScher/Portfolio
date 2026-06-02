### Why Docker was chosen for GompeiVision

One challenge with supporting multiple hardware platforms is ensuring that the development and deployment environments remain consistent. To solve this, I used Docker to containerize the build environment.

- **Developer Onboarding**: Docker allows the entire toolchain, including compilers, libraries, and dependencies, to be defined in code and reproduced on any machine. This eliminates the "it works on my computer" problem and makes onboarding new developers significantly easier.
- **CI/CD Simplification**: It simplifies automated builds and testing, since every build runs in the same controlled environment regardless of the underlying operating system or hardware.
