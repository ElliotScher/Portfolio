export interface ProjectResumeItem {
    id: string;
    title: string;
    bullets: string[];
}

export interface ExperienceResumeItem {
    company: string;
    location: string;
    role: string;
    duration: string;
    bullets: string[];
}

export interface SkillCategory {
    name: string;
    skills: string;
}

export interface ResumeData {
    name: string;
    contactFull: {
        phone: string;
        email: string;
        citizenship: string;
        linkedin: string;
        github: string;
    };
    contactRedacted: {
        email: string;
        citizenship: string;
        linkedin: string;
        github: string;
    };
    education: {
        school: string;
        location: string;
        degree: string;
        date: string;
    };
    skills: SkillCategory[];
    experience: ExperienceResumeItem[];
    projects: Record<string, ProjectResumeItem>;
}

export const resumeData: ResumeData = {
    name: "Elliot Scher",
    contactFull: {
        phone: "(803) 873-3478",
        email: "ecscher@wpi.edu",
        citizenship: "US Citizen",
        linkedin: "linkedin.com/in/elliotscher",
        github: "github.com/ElliotScher"
    },
    contactRedacted: {
        email: "ecscher@wpi.edu",
        citizenship: "US Citizen",
        linkedin: "linkedin.com/in/elliotscher",
        github: "github.com/ElliotScher"
    },
    education: {
        school: "Worcester Polytechnic Institute",
        location: "Worcester, MA",
        degree: "B.S. Robotics Engineering",
        date: "Expected May 2027"
    },
    skills: [
        {
            name: "Software Development",
            skills: "Java, Gradle, C/C++, CMake, Python, Git, Linux, Bash, Arduino, Raspberry Pi, MATLAB"
        },
        {
            name: "CAD & 3D Printing",
            skills: "Onshape, Bambu Labs, Creality, Makerbot"
        },
        {
            name: "Lab Equipment",
            skills: "Soldering Iron, Multimeter, Oscilloscope, DC Power Supply"
        }
    ],
    experience: [
        {
            company: "WPI Robotics Resource Center",
            location: "Worcester, MA",
            role: "XRP Curriculum Developer & Computer Vision Developer",
            duration: "Summer 2025",
            bullets: [
                "Developed educational robotics curriculum for the open-source Experiential Robotics Platform (XRP).",
                "Designed and implemented a custom computer vision localization pipeline for FIRST Robotics Competition robots using fiducial detection and pose estimation."
            ]
        },
        {
            company: "FIRST Headquarters",
            location: "Manchester, NH",
            role: "FRC Electrical Engineering Intern",
            duration: "Summer 2024",
            bullets: [
                "Developed robot code templates for the 2025 FRC base robot in Java, C++, Python, and LabVIEW.",
                "Created a fiducial calibration utility integrated into the WPILib open-source robotics library.",
                "Collaborated with engineers and contributors supporting thousands of FRC teams worldwide."
            ]
        },
        {
            company: "Private Contract",
            location: "Worcester, MA",
            role: "Software Developer",
            duration: "Summer 2025",
            bullets: [
                "Developed control software for a scientific instrument measuring optical density in agitated liquid samples.",
                "Implemented hardware interfacing and real-time data acquisition for automated laboratory measurements."
            ]
        },
        {
            company: "STEM for Kids",
            location: "Columbia, SC",
            role: "Programming Instructor",
            duration: "Summer 2022",
            bullets: [
                "Taught introductory programming concepts to K-5 students in classroom settings of up to 30 students."
            ]
        }
    ],
    projects: {
        gompeilib: {
            id: "GompeiLib",
            title: "GompeiLib Robotics Framework",
            bullets: [
                "Developed a modular robotics software framework for FIRST Robotics Competition robots in Java.",
                "Implemented reusable subsystems for drivetrain control, vision integration, sensor management, and autonomous operation.",
                "Designed abstractions to simplify robot code development and improve maintainability across competition seasons."
            ]
        },
        gompeivision: {
            id: "GompeiVision",
            title: "FRC Vision Localization System",
            bullets: [
                "Developed a multi-camera vision localization system for FRC robots using AprilTag pose estimation.",
                "Implemented persistent Linux camera identification using udev rules and physical USB path mapping.",
                "Optimized low-latency pose publishing between coprocessor and roboRIO using NetworkTables."
            ]
        },
        wpical: {
            id: "WPICal",
            title: "WPICal Fiducial Calibration Tool",
            bullets: [
                "Developed a fiducial calibration utility for the WPILib robotics software ecosystem used in FIRST Robotics Competition.",
                "Implemented camera calibration and AprilTag pose optimization tooling to improve robot localization accuracy.",
                "Contributed production-quality software integrated into the WPILib open-source library stack."
            ]
        },
        incubator: {
            id: "Incubator",
            title: "Distributed Optical Density Measurement and Automation System",
            bullets: [
                "Developed a distributed laboratory automation platform for monitoring optical density measurements in biological samples.",
                "Implemented a Raspberry Pi-based application layer for data visualization, experiment management, and system coordination.",
                "Designed embedded microcontroller software for real-time actuator and sensor control within the measurement system.",
                "Integrated serial UART communication between subsystems to support automated experimental workflows."
            ]
        },
        robot_arm: {
            id: "RBE3001",
            title: "Robotic Arm Manipulation and Vision",
            bullets: [
                "Developed inverse kinematics solutions for multi-joint robotic manipulators in MATLAB.",
                "Implemented cubic and quintic trajectory generation and motion planning for serial robotic arms.",
                "Built a computer vision pipeline for real-time colored object detection and target localization.",
                "Integrated perception and manipulation algorithms for autonomous object interaction tasks."
            ]
        },
        robot_navigation: {
            id: "RBE3002",
            title: "Autonomous Mobile Robot Navigation",
            bullets: [
                "Implemented SLAM, odometry fusion, and path planning algorithms for autonomous robot navigation through a maze.",
                "Integrated LiDAR and onboard sensor data for real-time localization and obstacle avoidance."
            ]
        },
        ros_platform: {
            id: "RBE300X",
            title: "Robotics Systems Software Platform",
            bullets: [
                "Designed and implemented a modular robotics software framework inspired by Robot Operating System (ROS) architectures.",
                "Developed asynchronous publish-subscribe communication systems, finite state machines, and behavior tree control architectures.",
                "Implemented fault handling and recovery mechanisms for distributed robotic subsystems.",
                "Deployed autonomous navigation software on a simulated robotic platform for testing and validation."
            ]
        },
        kitbot: {
            id: "KitBot", // Note: fallback if mapped to KitBot
            title: "FRC KitBot Control Software",
            bullets: [
                "Developed competition robot software for a FIRST Robotics Competition (FRC) KitBot platform in Java, C++, Python, and LabVIEW.",
                "Implemented modular subsystem architectures for drivetrain control and operator input handling.",
                "Designed reusable command-based software components to simplify testing, debugging, and future robot development."
            ]
        },
        software_knowledge_base: {
            id: "SoftwareKnowledgeBase",
            title: "Team 190 Software Knowledge Base",
            bullets: [
                "Developed a centralized knowledge base for FRC Team 190 to document best software development practices.",
                "Organized technical resources, guides, and onboarding materials to improve knowledge transfer between competition seasons.",
                "Maintained documentation for robot architecture, development workflows, tooling, and troubleshooting procedures to support student training and collaboration."
            ]
        },
        first_mentor: {
            id: "FRCSharedCodebase", // We can map this to Shared Codebase since it is in frc190-common
            title: "FIRST Robotics Competition (FRC) Mentorship (Team 190)",
            bullets: [
                "Lead programming and controls mentor.",
                "Teach high school students Java, C++, and control theory for use on competitive robotics team.",
                "Manage Git organization and sub-team projects.",
                "Volunteer 50–60 hours/week during robotics season."
            ]
        },
        rbe1001: {
            id: "RBE1001",
            title: "Autonomous Mobile Manipulator",
            bullets: [
                "Developed an autonomous fruit harvesting and sorting mobile robot using VEX V5 Python.",
                "Implemented holonomic Mecanum X-drive kinematics with field-oriented control utilizing inertial gyro feedback.",
                "Built closed-loop proportional-derivative (PD) line-following control loops and sonar-based height adjustment.",
                "Designed an 11-state finite state machine (FSM) to coordinate vision tracking, claw collection, and sorting mechanisms."
            ]
        }
    }
};
