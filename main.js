document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selectors ---
    const formContainer = document.getElementById('readme-form');
    const progressBar = document.getElementById('progress-bar');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const githubUrlInput = document.getElementById('github-url');
    const clearFormBtn = document.getElementById('clear-form-btn');
    const generatorTitle = document.getElementById('generator-title');
    const generatorModeTabs = document.getElementById('generatorModeTabs');
    const generatorContent = document.getElementById('generator-content');
    const resultContainer = document.getElementById('result-container');
    const resultMarkdown = document.getElementById('result-markdown');
    const startOverBtn = document.getElementById('start-over-btn');
    const githubAnalysisContainer = document.getElementById('github-analysis-container');
    const analyzeBtn = document.getElementById('analyze-btn');
    const githubStatus = document.getElementById('github-status');
    const mainNav = document.getElementById('mainNav');
    const copyToastEl = document.getElementById('copy-toast');
    const copyToast = new bootstrap.Toast(copyToastEl);
    const examplesModal = document.getElementById('examplesModal');

    // --- State Management ---
    let currentStep = 0;
    let generatedMarkdown = '';
    let suggestionsData = {};

    // --- Functions ---

    /**
     * Saves the current form data to localStorage.
     */
    function saveFormProgress() {
        const formData = getFormData();
        localStorage.setItem('readmeGeneratorProgress', JSON.stringify(formData));
    }

    /**
     * Loads form data from localStorage and populates the fields.
     */
    function loadFormProgress() {
        const savedData = localStorage.getItem('readmeGeneratorProgress');
        if (savedData) {
            const formData = JSON.parse(savedData);
            let hasLoadedData = false;
            for (const id in formData) {
                const element = document.getElementById(id);
                if (element && formData[id]) {
                    element.value = formData[id];
                    hasLoadedData = true;
                }
            }
            if (hasLoadedData) {
                console.log('Form progress restored from localStorage.');
            }
        }
    }

    /**
     * Clears the form and removes the saved progress from localStorage.
     */
    function clearFormProgress() {
        if (confirm('Are you sure you want to clear all fields? This will also remove your saved progress.')) {
            localStorage.removeItem('readmeGeneratorProgress');
            document.getElementById('readme-form').reset();
            githubUrlInput.value = '';
            githubStatus.innerHTML = '';
            formContainer.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        }
    }

    /**
     * Dynamically builds the form steps from the form-data.js configuration.
     */
    function buildForm() {
        formSteps.forEach((step, index) => {
            const stepDiv = document.createElement('div');
            stepDiv.classList.add('form-step');
            if (index === 0) stepDiv.classList.add('active');

            step.fields.forEach(field => {
                const formGroup = document.createElement('div');
                formGroup.classList.add('mb-3');

                let inputHtml = '';
                const commonAttrs = `id="${field.id}" class="form-control" ${field.required ? 'required' : ''} aria-label="${field.label}"`;

                if (field.type === 'textarea') {
                    inputHtml = `<textarea ${commonAttrs} rows="4" placeholder="${field.placeholder || ''}"></textarea>`;
                } else if (field.type === 'select') {
                    const options = field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('');
                    inputHtml = `<select ${commonAttrs}>${options}</select>`;
                } else {
                    inputHtml = `<input type="${field.type}" ${commonAttrs} placeholder="${field.placeholder || ''}">`;
                }

                formGroup.innerHTML = `
                    <label for="${field.id}" class="form-label">${field.label}</label>
                    ${inputHtml}
                    ${field.helpText ? `<div class="form-text">${field.helpText}</div>` : ''}
                `;

                stepDiv.appendChild(formGroup);
            });
            formContainer.appendChild(stepDiv);
        });
    }

    /**
     * Updates the visibility of form steps and navigation buttons.
     */
    function updateFormStep() {
        const steps = document.querySelectorAll('.form-step');
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === currentStep);
        });

        prevBtn.style.display = currentStep === 0 ? 'none' : 'inline-block';
        nextBtn.textContent = currentStep === steps.length - 1 ? 'Finish' : 'Next';

        const progress = ((currentStep + 1) / steps.length) * 100;
        progressBar.style.width = `${progress}%`;
        progressBar.setAttribute('aria-valuenow', progress);
    }

    /**
     * Handles navigation to the next step.
     */
    async function nextStep() {
        if (!validateCurrentStep()) {
            return; // Stop if the current step is invalid
        }

        if (currentStep < formSteps.length - 1) {
            currentStep++;
            updateFormStep();
        } else {
            // Handle form completion
            const formData = getFormData();
            generatedMarkdown = await generateReadme(formData);
            
            resultMarkdown.value = generatedMarkdown;

            generatorContent.classList.add('d-none');
            resultContainer.classList.remove('d-none');
        }
    }

    /**
     * Validates all required fields in the current step.
     * @returns {boolean} - True if all required fields are filled, false otherwise.
     */
    function validateCurrentStep() {
        let isStepValid = true;
        const currentFields = formSteps[currentStep].fields;

        currentFields.forEach(field => {
            const inputElement = document.getElementById(field.id);
            // The .is-invalid class is a Bootstrap class for styling validation errors.
            if (field.required && !inputElement.value.trim()) {
                inputElement.classList.add('is-invalid');
                isStepValid = false;
            } else {
                inputElement.classList.remove('is-invalid');
            }
        });

        return isStepValid;
    }

    /**
     * Handles navigation to the previous step.
     */
    function prevStep() {
        if (currentStep > 0) {
            currentStep--;
            updateFormStep();
        }
    }

    /**
     * Analyzes a GitHub repository URL to pre-fill form fields.
     */
    async function analyzeRepo() {
        const url = githubUrlInput.value.trim();
        const githubRepoRegex = /^https?:\/\/github\.com\/([a-zA-Z0-9-._-]+)\/([a-zA-Z0-9-._-]+)\/?$/;
        const match = url.match(githubRepoRegex);

        if (!match) {
            githubStatus.innerHTML = `<span class="text-danger"><i class="bi bi-exclamation-triangle-fill"></i> Invalid GitHub repository URL.</span>`;
            return;
        }

        const [, owner, repo] = match;
        githubStatus.innerHTML = `<div class="spinner-border spinner-border-sm" role="status"></div> Analyzing repository...`;
        analyzeBtn.disabled = true;

        try {
            // Fetch repo details, languages, and root contents concurrently
            const [repoRes, languagesRes, contentsRes] = await Promise.all([
                fetch(`https://api.github.com/repos/${owner}/${repo}`),
                fetch(`https://api.github.com/repos/${owner}/${repo}/languages`),
                fetch(`https://api.github.com/repos/${owner}/${repo}/contents/`)
            ]);

            if (!repoRes.ok) {
                throw new Error(`Failed to fetch repository data (Status: ${repoRes.status}). Check the URL and repository permissions.`);
            }

            const repoData = await repoRes.json();
            const languagesData = languagesRes.ok ? await languagesRes.json() : {};
            const contentsData = contentsRes.ok ? await contentsRes.json() : [];
            const fileNames = contentsData.map(file => file.name);

            // Helper to set value and trigger input event
            const setFieldValue = (id, value) => {
                const element = document.getElementById(id);
                if (element) {
                    element.value = value;
                }
            };

            // 1. Detect Project Type from file structure
            githubStatus.innerHTML = `<div class="spinner-border spinner-border-sm" role="status"></div> Detecting project type...`;
            let detectedType = detectProjectType(fileNames);

            // 2. Analyze description text if no type was found from files
            if (!detectedType && repoData.description) {
                const detectedFromDesc = detectProjectTypeFromDescription(repoData.description);
                if (detectedFromDesc) {
                    detectedType = detectedFromDesc;
                }
            }

            // 3. Auto-populate suggestions based on detected type
            if (detectedType) {
                setFieldValue('projectType', detectedType);
                // We call this directly, bypassing the confirmation prompt for a smoother UX.
                const suggestions = suggestionsData[detectedType];
                if (suggestions) {
                    setFieldValue('techStack', suggestions.techStack);
                    setFieldValue('projectTools', suggestions.tools);
                    setFieldValue('installation', suggestions.setup);
                    setFieldValue('features', suggestions.features);
                }
            } else {
                // If no type detected, use languages from API as a fallback
                setFieldValue('techStack', Object.keys(languagesData).join(', '));
            }

            // Populate form fields
            setFieldValue('projectTitle', repoData.name.split(/[-_]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));
            setFieldValue('githubUsername', repoData.owner.login || '');

            // Handle description: prefer repo description, fall back to README content
            if (repoData.description) {
                setFieldValue('projectDescription', repoData.description);
            } else {
                // If no description, try to fetch README content
                githubStatus.innerHTML = `<div class="spinner-border spinner-border-sm" role="status"></div> Analyzing... Fetching README...`;
                const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`);
                if (readmeRes.ok) {
                    const readmeData = await readmeRes.json();
                    // Content is base64 encoded, so we need to decode it
                    const decodedContent = atob(readmeData.content);
                    setFieldValue('projectDescription', decodedContent);
                } else {
                    // No README found or other error, leave description blank
                    setFieldValue('projectDescription', '');
                }
            }

            const licenseInput = document.getElementById('license');
            if (licenseInput && repoData.license?.spdx_id) {
                const licenseOption = Array.from(licenseInput.options).find(opt => opt.value.toLowerCase().includes(repoData.license.spdx_id.toLowerCase()));
                if (licenseOption) licenseInput.value = licenseOption.value;
            }

            // Trigger a single update for all fields
            formContainer.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));

            githubStatus.innerHTML = `<span class="text-success"><i class="bi bi-check-circle-fill"></i> Repository analyzed successfully!</span>`;

        } catch (error) {
            githubStatus.innerHTML = `<span class="text-danger"><i class="bi bi-exclamation-triangle-fill"></i> ${error.message}</span>`;
        } finally {
            analyzeBtn.disabled = false;
        }
    }

    /**
     * Detects the project type based on the files in the repository root.
     * @param {string[]} fileNames - An array of file names from the repo root.
     * @returns {string} The detected project type or an empty string.
     */
    function detectProjectType(fileNames) {
        // More specific checks first
        if (fileNames.includes('pubspec.yaml')) return 'Mobile Application'; // Flutter
        if (fileNames.some(f => f.endsWith('.uproject'))) return 'Game'; // Unreal Engine
        if (fileNames.includes('ProjectSettings') && fileNames.some(f => f.endsWith('.unity'))) return 'Game'; // Unity
        if (fileNames.some(f => f.endsWith('.sln'))) return 'Desktop Application'; // .NET
        if (fileNames.includes('Cargo.toml')) return 'CLI Tool'; // Rust
        if (fileNames.includes('go.mod')) return 'CLI Tool'; // Go

        // Web and JS-related
        if (fileNames.includes('package.json')) {
            // Could be refined by actually reading the package.json, but this is a good start.
            return 'Web Application';
        }
        if (fileNames.includes('requirements.txt') || fileNames.includes('Pipfile')) {
            // Could be Django/Flask (Web) or a script (Data Science/CLI). A safe bet.
            return 'Data Science Project';
        }
        if (fileNames.includes('Gemfile')) return 'Web Application'; // Ruby on Rails
        return ''; // Default if no specific files are found
    }

/**
 * Detects the project type by analyzing keywords in the project description.
 * @param {string} description - The project description text.
 * @returns {string} The detected project type or an empty string.
 */
function detectProjectTypeFromDescription(description) {
    if (!description) return '';
    const descLower = description.toLowerCase();

    // Define keywords for each project type.
    // Order from more specific to more general if there's overlap.
    const typeKeywords = {
        'Mobile Application': ['mobile app', 'ios app', 'android app', 'flutter app', 'react native'],
        'Desktop Application': ['desktop app', 'desktop application', 'electron app', 'wpf', 'winforms', 'macos app'],
        'CLI Tool': ['cli', 'command-line', 'command line', 'terminal tool'],
        'Web Application': ['web app', 'web application', 'website', 'single page application', 'spa'],
        'Library / Framework': ['library', 'framework', 'package', 'module'],
        'Data Science Project': ['data science', 'machine learning', 'deep learning', 'jupyter'],
        'Game': ['game', 'unity game', 'unreal engine game'],
    };

    for (const type in typeKeywords) {
        for (const keyword of typeKeywords[type]) {
            if (descLower.includes(keyword)) {
                return type; // Return the first match
            }
        }
    }

    return ''; // No keywords found
}

    /**
     * Fetches the suggestion data from the JSON file.
     */
    async function loadSuggestions() {
        try {
            const response = await fetch('templates/suggestions.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            suggestionsData = await response.json();
        } catch (error) {
            console.error("Could not load templates/suggestions.json:", error);
            // Disable suggester buttons if the file fails to load
            document.querySelectorAll('.suggester-btn').forEach(btn => {
                btn.disabled = true;
                btn.title = "Could not load suggestions.";
            });
        }
    }

    /**
     * Handles populating form fields based on the selected project type.
     * @param {string} projectType - The selected project type from the dropdown.
     */
    function handleProjectTypeChange(projectType) {
        if (!projectType || !suggestionsData[projectType]) {
            return;
        }

        const suggestions = suggestionsData[projectType];
        const fieldsToUpdate = {
            techStack: suggestions.techStack,
            projectTools: suggestions.tools,
            installation: suggestions.setup,
            features: suggestions.features
        };

        const targetInputs = {};
        let hasExistingContent = false;
        for (const id in fieldsToUpdate) {
            const input = document.getElementById(id);
            if (input) {
                targetInputs[id] = input;
                if (input.value.trim() !== '') {
                    hasExistingContent = true;
                }
            }
        }

        const canProceed = !hasExistingContent || confirm("This will overwrite existing content in related 'Tech', 'Tools', and 'Installation' fields. Are you sure?");

        if (canProceed) {
            for (const id in targetInputs) {
                if (fieldsToUpdate[id] !== undefined) {
                    targetInputs[id].value = fieldsToUpdate[id];
                }
            }
        }
    }
    /**
     * Copies the generated Markdown to the clipboard.
     */
    function copyMarkdown() {
        navigator.clipboard.writeText(generatedMarkdown).then(() => {
            copyToast.show();
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy markdown.');
        });
    }

    /**
     * Triggers a download of the generated README.md file.
     */
    function downloadMarkdown() {
        const blob = new Blob([generatedMarkdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'README.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Toggles the light/dark theme.
     */
    function toggleTheme() {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        themeToggle.innerHTML = isDarkMode ? '<i class="bi bi-moon-stars-fill"></i>' : '<i class="bi bi-sun-fill"></i>';
    }

    /**
     * Applies the saved theme from localStorage on page load.
     */
    function applySavedTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
        } else {
            themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
        }
    }

    /**
     * Handles the navbar shrink effect on scroll.
     */
    function handleScroll() {
        if (window.scrollY > 50) {
            mainNav.classList.add('navbar-scrolled');
        } else {
            mainNav.classList.remove('navbar-scrolled');
        }
    }

    // --- Logic for examples modal ---
    if (examplesModal) {
        const exampleTabs = examplesModal.querySelectorAll('.nav-link[data-bs-toggle="tab"]');

        const loadExampleContent = async (tab) => {
            const targetPaneId = tab.getAttribute('data-bs-target');
            const targetPane = document.querySelector(targetPaneId);
            
            // Only load if it hasn't been loaded yet (check for spinner)
            if (targetPane && targetPane.querySelector('.spinner-border')) {
                const path = tab.dataset.examplePath;
                try {
                    const response = await fetch(path);
                    if (!response.ok) {
                        throw new Error(`Failed to load ${path}`);
                    }
                    const markdown = await response.text();
                    // Use a custom class for the preview content inside the modal
                    targetPane.innerHTML = `<div class="readme-preview-content">${marked.parse(markdown)}</div>`;
                } catch (error) {
                    console.error(error);
                    targetPane.innerHTML = `<div class="alert alert-danger">Could not load example. Please ensure the file exists at '${path}'.</div>`;
                }
            }
        };

        // Load content for the initially active tab when the modal is shown for the first time
        examplesModal.addEventListener('shown.bs.modal', () => {
            const activeTab = examplesModal.querySelector('.nav-link.active');
            if (activeTab) {
                loadExampleContent(activeTab);
            }
        }, { once: true });

        // Add event listeners to other tabs to load content when they become active
        exampleTabs.forEach(tab => {
            tab.addEventListener('shown.bs.tab', (event) => {
                loadExampleContent(event.target);
            });
        });
    }

    // --- Event Listeners ---
    nextBtn.addEventListener('click', nextStep);
    prevBtn.addEventListener('click', prevStep);
    copyBtn.addEventListener('click', copyMarkdown);
    downloadBtn.addEventListener('click', downloadMarkdown);
    startOverBtn.addEventListener('click', () => {
        resultContainer.classList.add('d-none');
        generatorContent.classList.remove('d-none');
        currentStep = 0;
        updateFormStep();
    });
    themeToggle.addEventListener('click', toggleTheme);
    clearFormBtn.addEventListener('click', clearFormProgress);
    analyzeBtn.addEventListener('click', analyzeRepo);
    window.addEventListener('scroll', handleScroll);

    generatorModeTabs.addEventListener('click', (event) => {
        event.preventDefault();
        const clickedTab = event.target.closest('.nav-link');
        if (!clickedTab) return;

        const mode = clickedTab.dataset.mode;

        generatorModeTabs.querySelectorAll('.nav-link').forEach(tab => tab.classList.remove('active'));
        clickedTab.classList.add('active');

        if (mode === 'github') {
            githubAnalysisContainer.style.display = 'block';
            generatorTitle.textContent = 'GitHub README Generator';
        } else {
            githubAnalysisContainer.style.display = 'none';
            generatorTitle.textContent = 'README Generator';
        }
    });

    // Listen for input events to update preview and clear validation.
    formContainer.addEventListener('input', async (event) => {
        if (event.target.classList.contains('is-invalid')) {
            event.target.classList.remove('is-invalid');
        }

        // If the project type is changed, trigger the suggestion logic.
        if (event.target.id === 'projectType') {
            // Do not await here, let it run in the background
            handleProjectTypeChange(event.target.value);
        }

        saveFormProgress(); // Save progress on every input
    });

    // --- App Initialization ---
    async function initializeApp() {
        buildForm(); // Build form first to have buttons to disable on error
        loadFormProgress(); // Load any saved progress from localStorage
        await loadSuggestions();
        updateFormStep();
        applySavedTheme();
    }

    initializeApp();
});