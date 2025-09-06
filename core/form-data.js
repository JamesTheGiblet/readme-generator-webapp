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
                        const badgeText = encodeURIComponent(tech.replace(/-/g, '--'));
                        const logoName = tech.toLowerCase().replace(/ /g, '').replace(/\./g, 'dot').replace(/\+/g, 'plus').replace(/#/g, 'sharp').replace('c#', 'csharp').replace('++', 'plusplus');
                        const badgeColor = '2d2d2d'; // A neutral color

                        // Construct a full, valid shields.io URL for the badge
                        const url = `https://img.shields.io/badge/${badgeText}-${badgeColor}?style=for-the-badge&logo=${logoName}&logoColor=white`;
                        return `![${tech}](${url})`;
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
                placeholder: "Live Preview\nGitHub Analysis\nAuto-Save Progress",
                helpText: "List the key features of your project, one per line. We'll format it as a list for you.",
                formatter: (value) => {
                    if (!value) return "";
                    return value.split('\n').map(line => line.trim()).filter(Boolean).map(line => `- ${line}`).join('\n');
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
