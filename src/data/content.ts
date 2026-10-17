/**
 * ALL SITE CONTENT LIVES HERE.
 * To add a project or certificate, copy an existing entry and edit it.
 * Anything in [square brackets] is a placeholder to replace before launch.
 */

export const profile = {
  name: "Haroon Khurram",
  title: "Data Science Student | Python Developer | Aspiring AI/ML Professional",
  intro:
    "Haroon Khurram is a BS Data Science student at UET Lahore with hands-on experience in Python, SQL, web development, databases, data analytics, and software projects. He enjoys building practical technology solutions and is currently expanding his expertise in Artificial Intelligence, Machine Learning, and Data Science.",
  location: "Lahore, Pakistan",
  metaDescription:
    "Haroon Khurram is a BS Data Science student at UET Lahore building projects in Python, SQL, Power BI, and full-stack development. Open to internships and collaboration.",
};

export const nav = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "certifications", label: "Certifications" },
  { id: "contact", label: "Contact" },
];

export const highlights = [
  { title: "Data Science", text: "Building a foundation in data analysis, AI and machine learning." },
  { title: "Software Development", text: "Experience building applications using Python, C#, web technologies and databases." },
  { title: "Practical Projects", text: "Hands-on projects involving attendance analytics, web scraping, databases and digital logic." },
];

export const about = {
  bio: [
    "Haroon Khurram is a Data Science student at UET Lahore with a growing focus on Artificial Intelligence, Machine Learning, Data Analytics, and software development. His experience includes building practical applications using Python, C#, SQL, Flask, web technologies, and Power BI.",
    "He is particularly interested in using programming and data to solve practical problems, and prefers learning through building real projects rather than relying solely on theoretical coursework. His current focus is strengthening his expertise in AI/ML, data science, advanced SQL, and analytical problem solving.",
  ],
  education: {
    school: "University of Engineering and Technology, Lahore",
    degree: "Bachelor of Science in Data Science",
    status: "Currently pursuing",
  },
  interests: [
    "Artificial Intelligence",
    "Machine Learning",
    "Data Science",
    "Data Analytics",
    "Software Development",
    "Backend Development",
  ],
  approach: ["Learn", "Build", "Analyze", "Improve"],
};

export const skills = [
  { group: "Programming", items: ["Python", "C#", "JavaScript", "SQL"] },
  { group: "Data & Analytics", items: ["Data Analysis", "Data Cleaning", "Data Visualization", "Power BI", "Excel"] },
  { group: "Databases", items: ["PostgreSQL", "SQL Server", "SQLite", "Relational Database Design"] },
  { group: "Web & Backend", items: ["HTML", "CSS", "JavaScript", "Flask", ".NET"] },
  { group: "Development & Tools", items: ["Git", "GitHub", "Visual Studio", "VS Code", "SQL Server Management Studio", "Proteus"] },
];

export const currentlyDeveloping = [
  "Machine Learning",
  "Artificial Intelligence",
  "Advanced Data Science",
  "Advanced SQL",
];

export const projects = [
  {
    title: "AT-PAS",
    subtitle: "Attendance Tracking & Performance Analytics System",
    description:
      "A full-stack attendance management and analytics system designed to manage student attendance and provide meaningful performance insights.",
    tech: ["Python", "Flask", "SQLite", "HTML", "CSS", "JavaScript", "Power BI"],
    keyAreas: ["Student/Teacher/Admin functionality", "Attendance management", "Backend processing", "Database integration", "Analytics dashboard", "Attendance visualization"],
    demonstrates: "Full-stack development, database integration, data analytics, dashboard development",
    github: "https://github.com/HaroonKhurram/AT-PAS",
    team: "",
    images: [
      { src: "/projects/at-pas-landing.webp", alt: "AT-PAS landing page" },
      { src: "/projects/at-pas-dashboard.webp", alt: "AT-PAS student dashboard built with Power BI" },
    ],
  },
  {
    title: "Omni Web Scraper",
    subtitle: "Multi-Site Web Scraping & Data Processing System",
    description:
      "A C#/.NET-based web scraping system that collects data from multiple websites, cleans the resulting datasets, and prepares them for analysis and visualization.",
    tech: ["C#", ".NET", "SQL Server", "HTML", "CSS", "JavaScript"],
    keyAreas: ["Scheduled and manual scraping", "Bulk scraping", "Data cleaning", "SQL Server storage", "Cleaned tables (gold prices in USD, Lahore weather)", "CSV export"],
    demonstrates: "Web scraping, data processing, C#/.NET, SQL, automation",
    github: "https://github.com/HaroonKhurram/Omni-Webscraper",
    team: "",
    images: [
      { src: "/projects/scraper-clean-data.webp", alt: "Omni Web Scraper cleaned data view" },
      { src: "/projects/scraper-dashboard.webp", alt: "Omni Web Scraper dashboard" },
    ],
  },
  {
    title: "Food Delivery Database System",
    subtitle: "Relational Database Management System",
    description:
      "A database project focused on designing and implementing the backend data architecture of a food delivery platform.",
    tech: ["SQL", "PostgreSQL", "Database Design"],
    keyAreas: ["Database schema", "ERD", "Relational data modeling", "SQL queries", "Views", "Triggers", "Stored procedures"],
    demonstrates: "Database design, SQL, data modeling, backend data architecture",
    github: "https://github.com/HaroonKhurram/food-delivery-database-system",
    team: "",
    images: [] as { src: string; alt: string }[],
  },
  {
    title: "Human Following Robot",
    subtitle: "IR Sensor-Controlled, Relay-Driven Motor Vehicle",
    description:
      "A hardware-only, proximity-triggered robot car built for a Digital Logic Design course. An IR sensor detects a hand in front of it and switches a relay that powers the motor, with no microcontroller and no programming. It was designed, simulated in Proteus, and tested on real hardware.",
    tech: ["IR Sensor", "Relay Module", "DC Motor", "Proteus"],
    keyAreas: ["Truth table and Boolean design", "Proteus simulation", "Hardware assembly and testing"],
    demonstrates: "Digital logic, circuit design, simulation, hardware implementation",
    github: "",
    team: "Team project (5 members)",
    images: [
      { src: "/projects/robot-1.webp", alt: "Human Following Robot with IR sensor and relay" },
      { src: "/projects/robot-2.webp", alt: "Human Following Robot chassis and wiring" },
    ],
  },
];

export const certificates = [
  { name: "AI Fundamentals", issuer: "DataCamp", date: "August 2026", url: "https://www.datacamp.com/skill-verification/AIF0023482565210" },
  { name: "SQL Associate", issuer: "DataCamp", date: "July 2026", url: "https://www.datacamp.com/certificate/SQA0014203131179" },
  { name: "Basics of Microsoft Power BI", issuer: "UniAthena, with Cambridge International Qualifications", date: "January 2026", url: "https://docs.uniathena.com/prod/course/certificate/625_1767540383_certificate.pdf" },
  { name: "Introduction to Data Analytics", issuer: "IBM, through Coursera", date: "October 2025", url: "https://coursera.org/verify/OGWDZTP1CQ73" },
];

export const resume = {
  file: "/Haroon-Khurram-Resume.pdf", // put the PDF in the /public folder with this name
  text: "Want a more detailed overview of my experience, projects and technical skills?",
};

export const contact = {
  heading: "Let's Connect",
  text: "I'm open to internships, collaborative projects, and opportunities where I can apply my skills in software development, data analytics, and data science while continuing to grow in AI and machine learning.",
  email: "harooneagle.ier@gmail.com",
  github: "https://github.com/HaroonKhurram",
  linkedin: "https://www.linkedin.com/in/haroon-khurram-096a53282",
  formKey: "7280c191-cbc6-408f-b35a-bae3364c6f3c", // paste your Web3Forms access key here
};

export const site = {
  lastUpdated: "October 2026", // update this by hand whenever you edit the site
};
