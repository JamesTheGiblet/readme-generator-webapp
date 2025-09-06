const formSteps = [
    {
        title: "Project Basics",
        fields: [
            {
                id: "projectTitle",
                label: "Project Title",
                type: "text",
                placeholder: "e.g., Praximous README Generator",
                required: true,
                helpText: "The main title of your project."
            },
            {
                id: "projectDescription",
                label: "Project Description",
                type: "textarea",
                placeholder: "A short and catchy description of your project.",
                required: true,
                helpText: "A one-paragraph description of your project's purpose and value."
            },
            {
                id: "projectType",
                label: "Project Type / Platform (Optional)",
                type: "select",
                options: ["", "Web Application", "Mobile Application", "Desktop Application", "CLI Tool", "Library / Framework", "Data Science Project", "Game", "Other"],
                required: false,
                helpText: "What kind of project is this?"
            },
            {
                id: "liveDemoUrl",
                label: "Live Demo URL (Optional)",
                type: "url",
                placeholder: "https://example.com",
                helpText: "Link to a live demo of your project.",
            }
        ]
    },
    {
        title: "Technical Details",
        fields: [
            {
                id: "techStack",
                label: "Languages & Frameworks",
                type: "textarea",
                placeholder: "e.g., JavaScript, React, Node.js, CSS",
                helpText: "Comma-separated list. This will be auto-filled when you select a Project Type.",
                formatter: (value) => {
                    if (!value || typeof value !== "string") return "";
                    const techs = value.split(',').map(tech => tech.trim()).filter(Boolean);
                    if (techs.length === 0) return "";
                    return techs.map(tech => {
                        const techName = tech.trim();
                        const badgeColor = getTechBadgeColor(techName);
                        const logoName = getTechLogoName(techName);
                        return `![${techName}](https://img.shields.io/badge/${encodeURIComponent(techName)}-${badgeColor}?style=for-the-badge&logo=${logoName}&logoColor=white)`;
                    }).join(' ');
                }
            },
            {
                id: "projectTools",
                label: "Development Tools",
                type: "textarea",
                placeholder: "e.g., VS Code, Webpack, Docker",
                helpText: "Comma-separated list of tools used. Auto-filled when you select a Project Type.",
                formatter: (value) => {
                    if (!value) return "";
                    return value.split(',').map(tool => `* ${tool.trim()}`).join('\n');
                }
            },
            {
                id: "features",
                label: "Key Features",
                type: "textarea",
                placeholder: "Feature 1\nFeature 2\nFeature 3",
                helpText: "List the key features of your project, one per line.",
                formatter: (value) => {
                    if (!value) return "";
                    // Split by lines and ensure each line starts with a bullet point
                    return value.split('\n')
                        .map(line => line.trim())
                        .filter(line => line.length > 0)
                        .map(line => {
                            // If line doesn't start with -, *, or +, add a dash
                            if (!line.match(/^[-*+]\s/)) {
                                return `- ${line}`;
                            }
                            return line;
                        })
                        .join('\n');
                }
            }
        ]
    },
    {
        title: "Setup and Usage",
        fields: [
            {
                id: "installation",
                label: "Installation Instructions",
                type: "textarea",
                placeholder: "1. Clone the repo\n   ```sh\n   git clone https://github.com/your_username/your_project.git\n   ```\n2. Install NPM packages\n   ```sh\n   npm install\n   ```",
                helpText: "Provide step-by-step instructions. This will be auto-filled with a template when you select a Project Type.",
            },
            {
                id: "usage",
                label: "Usage Guide",
                type: "textarea",
                placeholder: "Provide examples of how to use your project.",
                helpText: "Explain how to use your project after installation."
            }
        ]
    },
    {
        title: "Final Touches",
        fields: [
            {
                id: "contributing",
                label: "Contributing Guidelines",
                type: "textarea",
                placeholder: "Contributions are what make the open source community such an amazing place... We welcome contributions!",
                helpText: "Explain how others can contribute to your project."
            },
            {
                id: "githubUsername",
                label: "GitHub Username (Optional)",
                type: "text",
                placeholder: "e.g., JamesTheGiblet",
                helpText: "Your GitHub username for the contact section.",
                required: false
            },
            {
                id: "license",
                label: "License",
                type: "select",
                options: ["MIT", "GPLv3", "Apache 2.0", "Unlicensed"],
                helpText: "Choose a license for your project."
            },
            {
                id: "readmeTone",
                label: "README Tone",
                type: "select",
                options: ["Professional", "Friendly", "Concise"],
                required: false,
                helpText: "Select the overall tone for the generated README."
            }
        ]
    }
];

// Helper function to get badge colors for different technologies
function getTechBadgeColor(tech) {
    const colors = {
        'javascript': '%23F7DF1E',
        'typescript': '%233178C6',
        'react': '%2361DAFB',
        'vue.js': '%234FC08D',
        'angular': '%23DD0031',
        'node.js': '%23339933',
        'python': '%233776AB',
        'java': '%23ED8B00',
        'c#': '%23239120',
        'go': '%2300ADD8',
        'rust': '%23000000',
        'html': '%23E34F26',
        'css': '%231572B6',
        'sass': '%23CC6699',
        'bootstrap': '%237952B3',
        'tailwind': '%2338B2AC',
        'express': '%23000000',
        'django': '%23092E20',
        'flask': '%23000000',
        'mongodb': '%2347A248',
        'postgresql': '%23336791',
        'mysql': '%234479A1',
        'redis': '%23DC382D',
        'docker': '%232496ED',
        'kubernetes': '%23326CE5',
        'aws': '%23232F3E',
        'azure': '%230078D4',
        'gcp': '%234285F4'
    };
    
    const techLower = tech.toLowerCase().replace(/\s+/g, '').replace('.', '');
    return colors[techLower] || '%23333333';
}

// Helper function to get logo names for shields.io badges
function getTechLogoName(tech) {
    const logos = {
        'javascript': 'javascript',
        'typescript': 'typescript',
        'react': 'react',
        'vue.js': 'vuedotjs',
        'angular': 'angular',
        'node.js': 'nodedotjs',
        'python': 'python',
        'java': 'java',
        'c#': 'csharp',
        'go': 'go',
        'rust': 'rust',
        'html': 'html5',
        'css': 'css3',
        'sass': 'sass',
        'bootstrap': 'bootstrap',
        'tailwind': 'tailwindcss',
        'express': 'express',
        'django': 'django',
        'flask': 'flask',
        'mongodb': 'mongodb',
        'postgresql': 'postgresql',
        'mysql': 'mysql',
        'redis': 'redis',
        'docker': 'docker',
        'kubernetes': 'kubernetes',
        'aws': 'amazon-aws',
        'azure': 'microsoft-azure',
        'gcp': 'google-cloud'
    };
    
    const techLower = tech.toLowerCase().replace(/\s+/g, '').replace('.', '');
    return logos[techLower] || tech.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}