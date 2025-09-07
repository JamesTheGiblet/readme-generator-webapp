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
                helpText: "A one-paragraph description of your project's purpose and value.",
                formatter: (value) => {
                    if (!value) return '';
                    return value.replace(/\r\n/g, '\n');
                }
            },
            {
                id: "projectType",
                label: "Project Type / Platform (Optional)",
                type: "select",
                options: ["", "Web Application", "API / Backend", "Mobile Application", "Desktop Application", "CLI Tool", "Library / Framework", "Data Science Project", "Game", "Browser Extension", "Discord Bot", "Other"],
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
                formatter: (value) => {
                    if (!value) return '';
                    // This ensures multi-line strings with special markdown characters are handled correctly by normalizing line endings.
                    return value.replace(/\r\n/g, '\n');
                }
            },
            {
                id: "usage",
                label: "Usage Guide",
                type: "textarea",
                placeholder: "Provide examples of how to use your project.",
                helpText: "Explain how to use your project after installation.",
                formatter: (value) => {
                    if (!value) return '';
                    return value.replace(/\r\n/g, '\n');
                }
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
                helpText: "Explain how others can contribute to your project.",
                formatter: (value) => {
                    if (!value) return '';
                    return value.replace(/\r\n/g, '\n');
                }
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
                helpText: "Choose a license for your project.",
                formatter: (value) => {
                    if (!value || value === 'Unlicensed') return '';
                    const licenseData = {
                        'MIT': { badge: 'MIT-yellow', link: 'MIT' },
                        'GPLv3': { badge: 'GPLv3-blue', link: 'GPL-3.0' },
                        'Apache 2.0': { badge: 'Apache_2.0-blue', link: 'Apache-2.0' }
                    };
                    const data = licenseData[value];
                    if (!data) return '';
                    return `[!License: ${value}](https://opensource.org/licenses/${data.link})`;
                }
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
    const colors = { // Maintained in parallel with logos map
        'javascript': '%23F7DF1E',
        'typescript': '%233178C6',
        'react': '%2361DAFB',
        'nextjs': '%23000000',
        'vue.js': '%234FC08D',
        'angular': '%23DD0031',
        'node.js': '%23339933',
        'python': '%233776AB',
        'java': '%23ED8B00',
        'c#': '%23239120',
        'c++': '%2300599C',
        'go': '%2300ADD8',
        'rust': '%23000000',
        'kotlin': '%237F52FF',
        'swift': '%23F05138',
        'flutter': '%2302569B',
        'html': '%23E34F26',
        'css': '%231572B6',
        'sass': '%23CC6699',
        'bootstrap': '%237952B3',
        'tailwindcss': '%2338B2AC',
        'vite': '%23646CFF',
        'express': '%23000000',
        'django': '%23092E20',
        'flask': '%23000000',
        'gin': '%23008ECF',
        'pytorch': '%23EE4C2C',
        'tensorflow': '%23FF6F00',
        'jupyter': '%23F37626',
        'mongodb': '%2347A248',
        'postgresql': '%23336791',
        'mysql': '%234479A1',
        'redis': '%23DC382D',
        'docker': '%232496ED',
        'kubernetes': '%23326CE5',
        'tauri': '%2324C8DB',
        '.netmaui': '%23512BD4',
        'qt': '%2341CD52',
        'godot': '%23478CBF',
        'discord.js': '%235865F2',
        'discord.py': '%235865F2',
        'pm2': '%232B037A',
        'aws': '%23232F3E',
        'azure': '%230078D4',
        'gcp': '%234285F4',
        'doxygen': '%23273472',
        'mlflow': '%230194E2'
    };
    
    const techLower = tech.toLowerCase().replace(/\s+/g, '').replace(/[.+]/g, '');
    return colors[techLower] || '%23333333';
}

// Helper function to get logo names for shields.io badges
function getTechLogoName(tech) {
    const logos = { // Maintained in parallel with colors map
        'javascript': 'javascript',
        'typescript': 'typescript',
        'react': 'react',
        'nextjs': 'nextdotjs',
        'vue.js': 'vuedotjs',
        'angular': 'angular',
        'node.js': 'nodedotjs',
        'python': 'python',
        'java': 'java',
        'c#': 'csharp',
        'c++': 'cplusplus',
        'go': 'go',
        'rust': 'rust',
        'kotlin': 'kotlin',
        'swift': 'swift',
        'flutter': 'flutter',
        'html': 'html5',
        'css': 'css3',
        'sass': 'sass',
        'bootstrap': 'bootstrap',
        'tailwindcss': 'tailwindcss',
        'vite': 'vite',
        'express': 'express',
        'django': 'django',
        'flask': 'flask',
        'gin': 'gin',
        'pytorch': 'pytorch',
        'tensorflow': 'tensorflow',
        'jupyter': 'jupyter',
        'mongodb': 'mongodb',
        'postgresql': 'postgresql',
        'mysql': 'mysql',
        'redis': 'redis',
        'docker': 'docker',
        'kubernetes': 'kubernetes',
        'tauri': 'tauri',
        '.netmaui': 'dotnet',
        'qt': 'qt',
        'godot': 'godotengine',
        'discord.js': 'discorddotjs',
        'discord.py': 'discord',
        'pm2': 'pm2',
        'aws': 'amazon-aws',
        'azure': 'microsoft-azure',
        'gcp': 'google-cloud',
        'doxygen': 'doxygen',
        'mlflow': 'mlflow'
    };
    
    const techLower = tech.toLowerCase().replace(/\s+/g, '').replace(/[.+]/g, '');
    return logos[techLower] || tech.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}