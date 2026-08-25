
export function renderAboutMe(): HTMLElement {
    const page = document.createElement("div");
    page.className = "page-about-me";

    page.innerHTML = `
        <section class="about-me-hero animate-fade-in">
            <h1>Project Context & Background</h1>
            <p class="subtitle">
                Understanding the academic coursework, competitive organizations, and mentorship initiatives that form the background of my software projects.
            </p>
        </section>

        <section class="context-section animate-fade-in">
            <h2>Worcester Polytechnic Institute (WPI)</h2>
            
            <div class="wpi-context-panel">
                <div class="wpi-column">
                    <h3>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #ff4d4d;">
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
                        </svg>
                        Academic Coursework Context
                    </h3>
                    <p>
                        Much of my engineering and software development takes place at <strong>Worcester Polytechnic Institute (WPI)</strong>. WPI’s curriculum follows the <em>WPI Plan</em>, which emphasizes immersive, project-based education.
                    </p>
                    <p>
                        Instead of relying solely on traditional classroom exams, students spend their academic careers solving real-world challenges through extensive team-based projects. This hands-on curriculum provides the direct context behind my academic projects, including <strong>RBE 1001</strong> (mobile manipulators), <strong>RBE 3001</strong> (robotic arm kinematics), and <strong>RBE 3002/300X</strong> (ROS-based systems and autonomous navigation).
                    </p>
                </div>
                
                <div class="wpi-column">
                    <h3>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #ff4d4d;">
                            <polyline points="16 18 22 12 16 6"></polyline>
                            <polyline points="8 6 2 12 8 18"></polyline>
                        </svg>
                        WPI Robotics Resource Center (RRC)
                    </h3>
                    <p>
                        Beyond coursework, I collaborate with WPI’s <strong>Robotics Resource Center (RRC)</strong>. The RRC serves as an educational facility that supports student competitive teams and develops open-source software libraries.
                    </p>
                    <p>
                        Working with the RRC provided the operational context for my project <strong>GompeiVision</strong>, a custom camera coprocessor tracking solution designed to provide high-speed localization tools for teams in the WPI robotics community.
                    </p>
                </div>
            </div>
        </section>

        <section class="context-section animate-fade-in">
            <h2>The FIRST Robotics Ecosystem</h2>
            
            <div class="first-context-panel">
                <div class="first-column">
                    <h3>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                            <path d="M2 17l10 5 10-5"></path>
                            <path d="M2 12l10 5 10-5"></path>
                        </svg>
                        Competition Framework
                    </h3>
                    <p>
                        The <strong>FIRST Robotics Competition (FRC)</strong> is a global organization that challenges high school students to build 120-pound robots under strict time constraints. FRC operates as a real-world testing ground for several of my software systems.
                    </p>
                    <p>
                        Writing code that must reliably perform under high-stakes, real-time match conditions provides the background for tools like <strong>WPICal</strong> (a camera and field calibration software) and <strong>GompeiLib</strong> (a library of reusable controls and sensor classes).
                    </p>
                </div>
                
                <div class="first-column">
                    <h3>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <circle cx="12" cy="12" r="4"></circle>
                            <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line>
                            <line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line>
                            <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line>
                            <line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line>
                        </svg>
                        Progression of FIRST Programs
                    </h3>
                    <p>
                        FIRST supports students from early childhood to high school through graduated programs: <strong>FIRST LEGO League (FLL)</strong> for fundamentals, <strong>FIRST Tech Challenge (FTC)</strong> for mid-scale platforms, and the flagship <strong>FIRST Robotics Competition (FRC)</strong>.
                    </p>
                    <p>
                        This progression establishes a pipeline where older students learn professional practices. It gives context to why we design modular software, helping students understand the progression from block-based programming to object-oriented environments.
                    </p>
                </div>
            </div>
        </section>

        <section class="context-section animate-fade-in">
            <h2>The FIRST Philosophy</h2>
            
            <div class="first-info-grid">
                <div class="first-info-card">
                    <div class="first-info-card-header">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                        <h3>Gracious Professionalism</h3>
                    </div>
                    <p>
                        This philosophy encourages high-quality work, respects the value of others, and values the community. In the context of software development, it translates to writing clean, well-documented, and readable code that can be easily understood and built upon by students and other teams.
                    </p>
                </div>
                
                <div class="first-info-card">
                    <div class="first-info-card-header">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        <h3>Coopertition</h3>
                    </div>
                    <p>
                        Coopertition emphasizes that teams can cooperate even while competing. This is the direct context behind making my projects open-source. By publishing libraries publicly, we enable other teams to learn from our solutions, raising the collective engineering standards of the community.
                    </p>
                </div>
                
                <div class="first-info-card">
                    <div class="first-info-card-header">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                        </svg>
                        <h3>Open-Source Collaboration</h3>
                    </div>
                    <p>
                        Both values cultivate a unique culture where codebases are shared openly. Rather than hiding algorithms, teams publish their repositories immediately after competition seasons. This culture provides the framework for why my codebases are designed to be shared and adapted.
                    </p>
                </div>
            </div>
        </section>

        <section class="context-section animate-fade-in">
            <h2>Mentorship on FRC Team 190</h2>
            
            <div class="mentorship-context-panel">
                <div class="mentorship-column">
                    <h3>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        Controls Mentorship
                    </h3>
                    <p>
                        <strong>FRC Team 190</strong> (WPI & Mass Academy of Math and Science) is a founding team in FRC, established in 1992. Supported by the WPI Robotics Resource Center (RRC), the team serves as a collaborative lab for mentoring.
                    </p>
                    <p>
                        As the <strong>Lead Controls Mentor</strong>, I guide student programmers through writing their robot control software. My focus is on teaching students software architecture, design patterns, and engineering practices as they implement their code.
                    </p>
                </div>
                
                <div class="mentorship-column">
                    <h3>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                            <line x1="8" y1="21" x2="16" y2="21"></line>
                            <line x1="12" y1="17" x2="12" y2="21"></line>
                        </svg>
                        Robot Codebase Context
                    </h3>
                    <p>
                        This mentorship is the direct context for the <strong>FRC 190 2024, 2025, and 2026 Robot Codebases</strong>, as well as the <strong>FRC Shared Codebase</strong> design.
                    </p>
                    <p>
                        These projects represent the collaborative output of my student developers. Rather than writing the software myself, I advise on system structure, review pull requests, and guide the software lifecycle, making these repositories cooperative educational deliverables.
                    </p>
                </div>
            </div>
        </section>

    `;

    return page;
}