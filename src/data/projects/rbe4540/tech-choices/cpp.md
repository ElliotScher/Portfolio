### Why C++?

C++ was used for the `cvproc` perception and grasp planning package:

* **Point Cloud Library (PCL)**: PCL is a native C++ library, so filtering, RANSAC plane fitting, Euclidean clustering, normal estimation, and PCA all run directly on PCL's data structures without any binding overhead.
* **Performance**: The contact pair search tests hundreds of thousands of point pairs per object. Compiled C++ with Eigen vector math keeps that search fast enough to run as part of an interactive pipeline.
* **Eigen Integration**: Transforms, surface normals, and approach vectors are all expressed with Eigen types, which PCL and `tf2_eigen` use natively.
