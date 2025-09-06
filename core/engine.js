/**
 * Builds the complete README markdown string from the provided data.
 * @param {object} data - The form data from getReadmeData().
 * @returns {string} The complete README content as a markdown string.
 */
export function buildReadmeContent(data) {
    const repoPathMatch = data.githubUrl ? data.githubUrl.match(/github\.com\/([^\/]+\/[^\/]+)/) : null;
    const repoPath = repoPathMatch && repoPathMatch[1] ? repoPathMatch[1].replace(/\.git$/, '') : null;
    const parts = [];

    // Project title
    parts.push(`# ${data.projectName || 'My Awesome Project'}`);

    // Badges
    if (data.includeBadges) {
        parts.push(generateBadges(data, repoPath));
    }

    // Description with tone consideration
    const description = data.description || 'A brief description of what your project does.';
    parts.push(enhanceDescriptionByTone(description, data.tone));

    // Table of Contents for longer READMEs
    if (hasMultipleSections(data)) {
        parts.push(generateTableOfContents(data));
    }

    // Key Features
    if (data.keyFeatures) {
        parts.push(`## ✨ Key Features\n\n${formatFeaturesList(data.keyFeatures)}`);
    }

    // Screenshots
    if (data.includeScreenshots) {
        parts.push(`## 📸 Screenshots\n\n!App Screenshot\n\n*Replace with actual screenshots of your application*`);
    }

    // Installation
    if (data.installation) {
        parts.push(`## 🚀 Installation\n\n\`\`\`bash\n${data.installation}\n\`\`\``);
    }

    // Usage
    if (data.usage) {
        const lang = data.primaryLanguage ? getLanguageCode(data.primaryLanguage) : 'javascript';
        parts.push(`## 💡 Usage\n\n\`\`\`${lang}\n${data.usage}\n\`\`\``);
    }

    // API Documentation (for API projects)
    if (data.projectType === 'API/Backend') {
        parts.push(generateAPISection());
    }

    // Roadmap
    if (data.includeRoadmap) {
        parts.push(generateRoadmapSection(repoPath));
    }

    // FAQ
    if (data.includeFaq) {
        parts.push(generateFaqSection());
    }

    // Contributing
    if (data.includeContributing) {
        parts.push(generateContributingSection(repoPath));
    }

    // Changelog
    if (data.includeChangelog) {
        parts.push(`## 📝 Changelog\n\nSee CHANGELOG.md for a complete list of changes and version history.`);
    }

    // License
    if (data.license && data.license !== 'Custom') {
        parts.push(`## 📄 License\n\nDistributed under the ${data.license} License. See \`LICENSE\` for more information.`);
    } else if (data.license === 'Custom') {
        parts.push(`## 📄 License\n\nSee the \`LICENSE\` file for license information.`);
    }

    // Author/Contact
    const contactInfo = generateContactSection(data);
    if (contactInfo) {
        parts.push(contactInfo);
    }

    // Acknowledgments
    if (data.includeAcknowledgments) {
        parts.push(generateAcknowledgmentsSection());
    }

    // Support section
    if (repoPath) {
        parts.push(`## 💝 Support\n\nIf this project helped you, please consider giving it a ⭐ on GitHub!`);
    }

    return parts.filter(Boolean).join('\n\n');
}

// Enhanced helper functions

function enhanceDescriptionByTone(description, tone) {
    const toneEnhancements = {
        professional: description,
        friendly: description + "\n\n> Built with ❤️ for developers who value great documentation!",
        technical: description + "\n\n### Technical Overview\n\nThis project implements modern best practices and follows industry standards.",
        creative: description + "\n\n✨ *Crafted with passion and attention to detail* ✨",
        minimal: description
    };
    return toneEnhancements[tone] || description;
}

function hasMultipleSections(data) {
    const sections = [
        data.keyFeatures, data.installation, data.usage, data.includeRoadmap,
        data.includeFaq, data.includeContributing, data.includeChangelog
    ];
    return sections.filter(Boolean).length >= 4;
}

function generateTableOfContents(data) {
    const sections = [];
    if (data.keyFeatures) sections.push('- ✨ Key Features');
    if (data.includeScreenshots) sections.push('- 📸 Screenshots');
    if (data.installation) sections.push('- 🚀 Installation');
    if (data.usage) sections.push('- 💡 Usage');
    if (data.projectType === 'API/Backend') sections.push('- 📡 API Reference');
    if (data.includeRoadmap) sections.push('- 🗺️ Roadmap');
    if (data.includeFaq) sections.push('- ❓ FAQ');
    if (data.includeContributing) sections.push('- 🤝 Contributing');
    if (data.license) sections.push('- 📄 License');

    return `## 📋 Table of Contents\n\n${sections.join('\n')}`;
}

function formatFeaturesList(features) {
    return features.split('\n')
        .filter(f => f.trim())
        .map(feature => {
            const clean = feature.replace(/^[•\-*\s]*/, '').trim();
            return `- ${clean}`;
        })
        .join('\n');
}

function getLanguageCode(language) {
    const langMap = {
        'JavaScript': 'javascript',
        'TypeScript': 'typescript',
        'Python': 'python',
        'Java': 'java',
        'C++': 'cpp',
        'C#': 'csharp',
        'Go': 'go',
        'Rust': 'rust',
        'PHP': 'php',
        'Ruby': 'ruby',
        'Kotlin': 'kotlin'
    };
    return langMap[language] || language.toLowerCase();
}

function generateAPISection() {
    return `## 📡 API Reference\n\n#### Get all items\n\n\`\`\`http\nGET /api/items\n\`\`\`\n\n| Parameter | Type     | Description                |\n| :-------- | :------- | :------------------------- |\n| \`api_key\` | \`string\` | **Required**. Your API key |\n\n#### Get item\n\n\`\`\`http\nGET /api/items/\${id}\n\`\`\`\n\n| Parameter | Type     | Description                       |\n| :-------- | :------- | :-------------------------------- |\n| \`id\`      | \`string\` | **Required**. Id of item to fetch |`;
}

function generateRoadmapSection(repoPath) {
    let content = `## 🗺️ Roadmap\n\n- [x] Initial release\n- [ ] Add more integrations\n- [ ] Improve performance\n- [ ] Mobile app version\n- [ ] Advanced analytics`;
    if (repoPath) {
        content += `\n\nSee the open issues for a full list of proposed features and known issues.`;
    }
    return content;
}

function generateFaqSection() {
    return `## ❓ FAQ\n\n#### **Q: How do I get started?**\nA: Follow the installation instructions above, then check out the usage examples.\n\n#### **Q: Is this project actively maintained?**\nA: Yes! We regularly update and improve the project based on user feedback.\n\n#### **Q: Can I contribute to this project?**\nA: Absolutely! Check out our contributing guidelines for more information.`;
}

function generateContributingSection(repoPath) {
    let content = `## 🤝 Contributing\n\nContributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.`;

    if (repoPath) {
        content += `\n\n### Development Setup\n\n1. Fork the Project\n2. Clone your fork (\`git clone https://github.com/YOUR_USERNAME/${repoPath.split('/')[1]}.git\`)\n3. Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)\n4. Make your changes\n5. Run tests (\`npm test\` or equivalent)\n6. Commit your Changes (\`git commit -m 'Add some AmazingFeature'\`)\n7. Push to the Branch (\`git push origin feature/AmazingFeature\`)\n8. Open a Pull Request\n\n### Code Style\n\nPlease ensure your code follows the existing style conventions and passes all tests.`;
    } else {
        content += `\n\nIf you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".`;
    }

    return content;
}

function generateContactSection(data) {
    const contactInfo = [];

    if (data.author) contactInfo.push(`**${data.author}**`);
    if (data.email) contactInfo.push(`- 📧 Email: ${data.email}`);
    if (data.website) contactInfo.push(`- 🌐 Website: ${data.website}`);
    if (data.githubUrl) {
        const username = data.githubUrl.split('/')[3];
        contactInfo.push(`- 🐙 GitHub: @${username}`);
    }

    if (contactInfo.length > 0) {
        return `## 👤 Author\n\n${contactInfo.join('\n')}`;
    }
    return '';
}

function generateAcknowledgmentsSection() {
    return `## 🙏 Acknowledgments\n\n- Shields.io for the badges\n- Choose an Open Source License for license guidance\n- GitHub Emoji Cheat Sheet for emojis\n- Readme Template for inspiration`;
}

function generateBadges(data, repoPath) {
    const badges = [];
    const style = 'for-the-badge';

    // License Badge
    if (data.license && data.license !== 'Custom') {
        const licenseFormatted = encodeURIComponent(data.license);
        if (repoPath) {
            badges.push(`[!License](https://github.com/${repoPath}/blob/main/LICENSE)`);
        } else {
            badges.push(`!License`);
        }
    }

    // Version Badge
    if (data.version) {
        const versionFormatted = encodeURIComponent(data.version);
        if (repoPath) {
            badges.push(`[!Version](https://github.com/${repoPath}/releases)`);
        } else {
            badges.push(`!Version`);
        }
    }

    // Primary Language Badge
    if (data.primaryLanguage && data.primaryLanguage !== 'Other') {
        const lang = encodeURIComponent(data.primaryLanguage);
        if (repoPath) {
            badges.push(`!Language`);
        } else {
            const langColor = getLanguageColor(data.primaryLanguage);
            badges.push(`!Language}&logoColor=white)`);
        }
    }

    // Build Status Badge (if GitHub repo)
    if (repoPath) {
        badges.push(`!Build Status`);
        badges.push(`!Issues`);
        badges.push(`!Forks`);
        badges.push(`!Stars`);
    }

    return badges.join(' ');
}

function getLanguageColor(language) {
    const colors = {
        'JavaScript': 'F7DF1E',
        'TypeScript': '3178C6',
        'Python': '3776AB',
        'Java': 'ED8B00',
        'C++': '00599C',
        'C#': '239120',
        'Go': '00ADD8',
        'Rust': '000000',
        'PHP': '777BB4',
        'Ruby': 'CC342D',
        'Kotlin': '0095D5'
    };
    return colors[language] || '333333';
}

function getLanguageLogo(language) {
    const logos = {
        'JavaScript': 'javascript',
        'TypeScript': 'typescript',
        'Python': 'python',
        'Java': 'java',
        'C++': 'cplusplus',
        'C#': 'csharp',
        'Go': 'go',
        'Rust': 'rust',
        'PHP': 'php',
        'Ruby': 'ruby',
        'Kotlin': 'kotlin'
    };
    return logos[language] || 'code';
}