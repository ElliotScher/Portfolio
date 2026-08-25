### Why C++ was chosen for GompeiVision

While OpenCV is natively written in C/C++ it has a Python implementation as well. There aren't a lot of performance differences between the two implementations because Python wraps the native C/C++ code, so the execution overhead is minimal.

Even with comparable performance, I chose C/C++ for most of the source code for GompeiVision primarily due to its educational value:

- **Educational Value**: The students using GompeiVision already do a significant amount of Python programming through robotics and coursework, so implementing the system in C++ exposes them to a different set of software engineering concepts.
- **Embedded Performance**: As the project grows and new features, hardware support, or algorithms are added over time, it is possible that there will be new computation overhead where C++ would have an advantage over python.
- **Industry Preparation**: This aligns with the goal of making the project not only a practical localization solution, but also a valuable learning resource for students who go on to work in robotics professionally.
