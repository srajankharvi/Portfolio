/* ═══════════════════════════════════════════
   PORTFOLIO CONTENT DATA
   ═══════════════════════════════════════════ */

export const navItems = ["Home", "About", "Skills", "Certifications", "Projects", "Contact"];

export const heroContent = {
  greeting: "Hi, I'm",
  firstName: "Srajan",
  lastName: "Kharvi",
  subtitle: "Aspiring Software Developer",
  description:
    "Building modern web applications with Python while continuously learning and improving through real-world projects.",
  primaryButtonText: "View Projects",
  secondaryButtonText: "Contact Me",
};

export const roles = [
  "Aspiring Software Developer",
  "BCA Student",
  "Web Developer",
  "Problem Solver",
];

export const aboutContent = {
  heading: "Building My Journey Towards Software Development",
  eyebrow: "About Me",
  paragraphs: [
    "I'm Srajan, a Bachelor of Computer Applications (BCA) student at Dr. B. B. Hegde First Grade College, Kundapura, Karnataka.",
    "I enjoy solving problems through programming and building practical web applications. I believe in learning by building real projects, writing clean code, and continuously improving my technical skills.",
    "My primary focus is Python and Web Development, while currently expanding my knowledge in React, Machine Learning, and modern software development practices.",
    "I am always eager to learn new technologies, work on challenging projects, and grow into a skilled Software Developer.",
  ],
};

export const aboutCards = [
  {
    icon: "education",
    title: "Education",
    subtitle: "Bachelor of Computer Applications (BCA)",
    text: "Dr. B. B. Hegde First Grade College, Kundapura",
  },
  {
    icon: "location",
    title: "Location",
    subtitle: "Karnataka, India",
    text: "Open to remote & on-site internships across India",
  },
  {
    icon: "goal",
    title: "Career Goal",
    subtitle: "Aspiring Software Developer",
    text: "Focused on building practical, scalable software solutions.",
  },
  {
    icon: "learning",
    title: "Learning",
    subtitle: "Continuous Growth",
    text: "Currently exploring Web Development, Machine Learning, and modern development technologies.",
  },
];

export const categorizedSkills = [
  {
    categoryTitle: "Programming Languages",
    skills: [
      { name: "Python", level: "Intermediate" },
      { name: "JavaScript", level: "Beginner" },
      { name: "Java", level: "Beginner" },
      { name: "C", level: "Beginner" },
      { name: "C++", level: "Beginner" },
    ],
  },
  {
    categoryTitle: "Frontend Development",
    skills: [
      { name: "HTML5", level: "Intermediate" },
      { name: "CSS3", level: "Intermediate" },
      { name: "React", level: "Beginner" },
    ],
  },
  {
    categoryTitle: "Databases",
    skills: [
      { name: "SQL", level: "Familiar" },
      { name: "MongoDB", level: "Familiar" },
    ],
  },
  {
    categoryTitle: "Developer Tools",
    skills: [
      { name: "Git", level: "Intermediate" },
      { name: "GitHub", level: "Intermediate" },
      { name: "Visual Studio Code", level: "Proficient" },
    ],
  },
];

export const certificationsContent = {
  heading: "Certifications",
  description:
    "Professional certifications that demonstrate my commitment to continuous learning and skill development.",
  list: [
    {
      organization: "Infosys Springboard",
      course: "The Language of DevOps: DevOps Tools & Processes",
      issued: "June 26, 2026",
      issuedDateTime: "2026-06-26",
      status: "Verified",
      description:
        "Successfully completed an industry-focused certification covering DevOps concepts, tools, and software development workflows.",
      skills: ["DevOps", "Docker", "Git", "Linux", "Jenkins", "CI/CD"],
      certificateUrl: "/Beginner_Devops_Course.pdf",
    },
    {
      organization: "NPTEL",
      course: "Python for Data Science",
      issued: "Jan–Feb 2026",
      issuedDateTime: "2026-02",
      status: "Verified",
      description:
        "Completed an NPTEL certification focused on Python programming, data analysis fundamentals, and practical problem-solving.",
      skills: ["Python", "Data Science", "Analytics", "NumPy", "Pandas", "Visualization"],
      certificateUrl: "/NPTL_CERTIFICATE.pdf",
    },
  ],
};

export const projectsContent = {
  heading: "Featured Projects",
  description:
    "A collection of projects that showcase my programming skills, problem-solving ability, and passion for building practical software solutions.",
  list: [
    {
      title: "Future Map",
      description:
        "AI-powered career guidance platform designed to help students explore career paths, discover learning roadmaps, and prepare for interviews with personalized recommendations.",
      tags: ["React", "AI Integration", "Full Stack", "Career Guidance"],
      features: ["Clean Code", "Problem Solving", "User Experience", "Modern Tech"],
      image: "/future-map-preview.webp",
      imageFallback: "/future-map-preview.png",
      github: "https://github.com/srajankharvi/Future-Map",
      live: "https://future-map-xi.vercel.app",
      featured: true,
    },
  ],
};

export const contactContent = {
  heading: "Let's Connect",
  description:
    "I'm currently looking for internship opportunities, collaborative projects, and learning experiences in software development. Feel free to reach out if you'd like to connect.",
  availability: "Open to Internships & Collaboration",
  email: "srajankharvi.dev@gmail.com",
  location: "Karnataka, India",
};

export const socials = [
  {
    label: "GitHub",
    href: "https://github.com/srajankharvi",
    icon: "github",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/srajan-kharvi-6aba9a3b8/",
    icon: "linkedin",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/saju_kharvi_99/",
    icon: "instagram",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/people/Srajan-Kharvi/pfbid02gZrKaV9gbyt9rS636oz81M2YSfajPrKLctaDBGeLvaZCseZbFmZnSnWEptQpXuTrl/",
    icon: "facebook",
  },
];

export const footerContent = {
  name: "Srajan Kharvi",
  description:
    "Aspiring Software Developer passionate about building modern web applications, learning new technologies, and creating software that solves real-world problems.",
};
