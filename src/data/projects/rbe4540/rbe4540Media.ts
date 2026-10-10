import type { MediaItem } from "../../../components/mediaGallery";

export const rbe4540Media: MediaItem[] = [
    {
        src: "assets/projects/rbe4540/RealCubeGrasp.mp4",
        title: "Real Robot Grasp: Cube",
        caption: "The Kinova Gen3 lite sweeps its wrist-mounted RealSense D405 through four viewpoints, builds a merged point cloud of the table, synthesizes a grasp, and then executes the pre-grasp, approach, close, and lift sequence on a cube."
    },
    {
        src: "assets/projects/rbe4540/RealRectangleGrasp.mp4",
        title: "Real Robot Grasp: Rectangular Box",
        caption: "The same unmodified pipeline grasping a thin rectangular box, where the PCA major axis and friction-cone contact search choose a closing direction across the narrow face of the object."
    },
    {
        src: "assets/projects/rbe4540/SimGrasp.mp4",
        title: "Simulated Grasp in Gazebo",
        caption: "The full pipeline running in Gazebo: two camera views are captured, the grasp is planned by the C++/PCL node, and MoveIt checks reachability before moving to the pre-grasp pose, approaching, grasping, and lifting the object."
    }
];
