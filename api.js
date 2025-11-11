/**
 * Handles interactions with the GitHub API for repository analysis.
 */

const api = {
    // --- DOM Element Selectors ---
    elements: {
        githubUrlInput: document.getElementById('github-url'),
        analyzeBtn: document.getElementById('analyze-btn'),
        githubStatus: document.getElementById('github-status'),
    },

    /**
     * Initializes the API module and event listeners.
     */
    init() {
        if (this.elements.analyzeBtn) {
            this.elements.analyzeBtn.addEventListener('click', () => this.analyzeRepo());
        }
    },

    /**
     * Analyzes a GitHub repository URL to pre-fill form fields.
     */
    async analyzeRepo() {
        const url = this.elements.githubUrlInput.value.trim();
        const match = url.match(/^https?:\/\/github\.com\/([a-zA-Z0-9-._-]+)\/([a-zA-Z0-9-._-]+)\/?$/);

        if (!match) {
            this.elements.githubStatus.innerHTML = `<span class="text-danger"><i class="bi bi-exclamation-triangle-fill"></i> Invalid GitHub repository URL.</span>`;
            return;
        }

        const [, owner, repo] = match;
        this.elements.githubStatus.innerHTML = `<div class="spinner-border spinner-border-sm" role="status"></div> Analyzing repository...`;
        this.elements.analyzeBtn.disabled = true;

        try {
            const [repoRes, languagesRes, contentsRes] = await Promise.all([
                fetch(`https://api.github.com/repos/${owner}/${repo}`),
                fetch(`https://api.github.com/repos/${owner}/${repo}/languages`),
                fetch(`https://api.github.com/repos/${owner}/${repo}/contents/`)
            ]);

            if (!repoRes.ok) throw new Error(`Failed to fetch repository data (Status: ${repoRes.status}).`);

            const repoData = await repoRes.json();
            const languagesData = languagesRes.ok ? await languagesRes.json() : {};
            const contentsData = contentsRes.ok ? await contentsRes.json() : [];
            const fileNames = contentsData.map(file => file.name);
            let packageJson = null;

            if (fileNames.includes('package.json')) {
                this.elements.githubStatus.innerHTML = `<div class="spinner-border spinner-border-sm" role="status"></div> Analyzing package.json...`;
                const packageJsonRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`);
                if (packageJsonRes.ok) {
                    const packageJsonData = await packageJsonRes.json();
                    packageJson = JSON.parse(atob(packageJsonData.content));
                }
            }

            this.populateFormFromApiData({ repoData, languagesData, fileNames, packageJson, owner, repo });

            form.elements.formContainer.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
            this.elements.githubStatus.innerHTML = `<span class="text-success"><i class="bi bi-check-circle-fill"></i> Repository analyzed successfully!</span>`;

        } catch (error) {
            let errorMessage = `An error occurred: ${error.message}`;
            if (error.message.includes('404')) errorMessage = `Repository not found. Check the URL and ensure it's public.`;
            if (error.message.includes('403')) errorMessage = `API rate limit exceeded. Please wait and try again later.`;
            this.elements.githubStatus.innerHTML = `<span class="text-danger"><i class="bi bi-exclamation-triangle-fill"></i> ${errorMessage}</span>`;
        } finally {
            this.elements.analyzeBtn.disabled = false;
        }
    },

    /**
     * Populates the form with data retrieved from the GitHub API.
     * @param {Object} apiData - The collected data from GitHub.
     */
    populateFormFromApiData(apiData) {
        const { repoData, languagesData, fileNames, packageJson, owner, repo } = apiData;

        const setFieldValue = (id, value) => {
            const element = document.getElementById(id);
            if (element && value) element.value = value;
        };

        let detectedType = this.detectProjectType(fileNames, packageJson) || this.detectProjectTypeFromDescription(repoData.description);

        if (detectedType) {
            setFieldValue('projectType', detectedType);
            form.applySuggestions(detectedType, { owner, repo });
        }

        const languages = Object.keys(languagesData);
        if (languages.length > 0) {
            setFieldValue('techStack', languages.join(', '));
        }

        setFieldValue('projectTitle', repoData.name.split(/[-_]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));
        setFieldValue('githubUsername', repoData.owner.login);
        setFieldValue('liveDemoUrl', repoData.homepage);
        setFieldValue('projectDescription', repoData.description);

        if (repoData.license?.spdx_id) {
            const licenseInput = document.getElementById('license');
            const licenseOption = Array.from(licenseInput.options).find(opt => opt.value.toLowerCase().includes(repoData.license.spdx_id.toLowerCase()));
            if (licenseOption) licenseInput.value = licenseOption.value;
        }

        if (fileNames.some(f => f.toLowerCase() === 'contributing.md')) {
            setFieldValue('contributing', `Contributions are welcome! Please see the CONTRIBUTING.md file for guidelines.`);
        } else {
            setFieldValue('contributing', window.APP_DATA.defaultContributingText);
        }
    },

    /**
     * Detects the project type based on the files in the repository root.
     * @param {string[]} fileNames - An array of file names.
     * @param {Object|null} packageJson - The parsed package.json content.
     * @returns {string} The detected project type or an empty string.
     */
    detectProjectType(fileNames, packageJson = null) {
        if (fileNames.includes('pubspec.yaml')) return 'Mobile Application';
        if (fileNames.some(f => f.endsWith('.uproject') || f.endsWith('.unity'))) return 'Game';
        if (fileNames.some(f => f.endsWith('.sln'))) return 'Desktop Application';
        if (fileNames.includes('Cargo.toml') || fileNames.includes('go.mod')) return 'CLI Tool';

        if (packageJson) {
            const deps = { ...(packageJson.dependencies || {}), ...(packageJson.devDependencies || {}) };
            if (deps.react) return 'React Web Application';
            if (deps.next) return 'Next.js Web Application';
            if (deps.vue) return 'Vue.js Web Application';
            if (deps.angular) return 'Angular Web Application';
            if (deps.express) return 'API / Backend';
            return 'Web Application';
        }

        if (fileNames.includes('index.html')) return 'Static Web Application';
        if (fileNames.includes('requirements.txt') || fileNames.includes('Pipfile')) return 'Data Science Project';
        if (fileNames.includes('Gemfile')) return 'Web Application';
        return '';
    },

    /**
     * Detects the project type by analyzing keywords in the project description.
     * @param {string} description - The project description text.
     * @returns {string} The detected project type or an empty string.
     */
    detectProjectTypeFromDescription(description) {
        if (!description) return '';
        const descLower = description.toLowerCase();
        const typeKeywords = {
            'Mobile Application': ['mobile app', 'ios app', 'android app', 'flutter', 'react native'],
            'Desktop Application': ['desktop app', 'electron', 'wpf', 'winforms', 'macos app'],
            'CLI Tool': ['cli', 'command-line', 'terminal tool'],
            'Web Application': ['web app', 'website', 'spa'],
            'Library / Framework': ['library', 'framework', 'package', 'module'],
            'Data Science Project': ['data science', 'machine learning', 'deep learning', 'jupyter'],
            'Game': ['game', 'unity', 'unreal engine'],
        };

        for (const type in typeKeywords) {
            if (typeKeywords[type].some(keyword => descLower.includes(keyword))) {
                return type;
            }
        }
        return '';
    }
};