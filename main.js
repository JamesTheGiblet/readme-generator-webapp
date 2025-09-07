document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selectors ---
    const formContainer = document.getElementById('readme-form');
    const progressBar = document.getElementById('progress-bar');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
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
    const copyToastEl = document.getElementById('copy-toast');
    const copyToast = copyToastEl ? new bootstrap.Toast(copyToastEl) : null;
    const examplesModal = document.getElementById('examplesModal');

    // --- State Management ---
    let currentStep = 0;
    let formData = {};
    let generatorMode = 'github'; // 'github' or 'manual'
    let formSteps = [];

    // --- Functions ---

    /**
     * Initializes the application, loads saved data, and renders the first step.
     */
    function initializeApp() {
        loadProgress();
        updateGeneratorModeUI();
        renderStep(currentStep);
        updateProgress();
        updateNavButtons();
    }

    /**
     * Updates the UI based on the current generator mode.
     */
    function updateGeneratorModeUI() {
        formSteps = generatorMode === 'manual' ? manualFormSteps : githubFormSteps;
        if (githubAnalysisContainer) {
            githubAnalysisContainer.style.display = generatorMode === 'github' ? 'block' : 'none';
        }
        if (generatorTitle) {
            generatorTitle.textContent = generatorMode === 'github' ? 'GitHub README Generator' : 'Manual README Generator';
        }
        // Update active tab
        document.querySelectorAll('#generatorModeTabs .nav-link').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.mode === generatorMode);
        });
    }

    /**
     * Renders a specific step of the form.
     * @param {number} stepIndex - The index of the step to render.
     */
    function renderStep(stepIndex) {
        if (!formContainer || !formSteps[stepIndex]) return;

        const step = formSteps[stepIndex];
        formContainer.innerHTML = ''; // Clear previous step

        const stepDiv = document.createElement('div');
        stepDiv.className = 'form-step active';

        let formHtml = `<h4 class="mb-4">${step.title}</h4>`;
        step.fields.forEach(field => {
            formHtml += createFieldHtml(field);
        });

        stepDiv.innerHTML = formHtml;
        formContainer.appendChild(stepDiv);

        // Re-attach event listeners for dynamic content
        attachFieldListeners();
    }

    /**
     * Creates HTML string for a single form field.
     * @param {object} field - The field configuration object.
     * @returns {string} - The HTML string for the field.
     */
    function createFieldHtml(field) {
        const value = formData[field.id] || field.default || '';
        let fieldHtml = `<div class="mb-3">
            <label for="${field.id}" class="form-label">${field.label}</label>`;

        switch (field.type) {
            case 'text':
            case 'url':
                fieldHtml += `<input type="${field.type}" class="form-control" id="${field.id}" placeholder="${field.placeholder || ''}" value="${value}">`;
                break;
            case 'textarea':
                fieldHtml += `<textarea class="form-control" id="${field.id}" rows="5" placeholder="${field.placeholder || ''}">${value}</textarea>`;
                break;
            case 'select':
                fieldHtml += `<select class="form-select" id="${field.id}">`;
                field.options.forEach(option => {
                    fieldHtml += `<option value="${option.value}" ${value === option.value ? 'selected' : ''}>${option.label}</option>`;
                });
                fieldHtml += `</select>`;
                break;
            case 'checkbox-group':
                fieldHtml += '<div>';
                field.options.forEach(option => {
                    const isChecked = Array.isArray(value) && value.includes(option.value);
                    fieldHtml += `<div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" id="${field.id}-${option.value}" value="${option.value}" ${isChecked ? 'checked' : ''}>
                        <label class="form-check-label" for="${field.id}-${option.value}">${option.label}</label>
                    </div>`;
                });
                fieldHtml += '</div>';
                break;
        }

        if (field.helpText) {
            fieldHtml += `<div class="form-text">${field.helpText}</div>`;
        }
        fieldHtml += `</div>`;
        return fieldHtml;
    }

    /**
     * Attaches event listeners to form fields to update formData on change.
     */
    function attachFieldListeners() {
        formContainer.querySelectorAll('input, textarea, select').forEach(el => {
            el.addEventListener('input', handleInputChange);
        });
    }

    /**
     * Handles input changes and updates the formData object.
     * @param {Event} e - The input event.
     */
    function handleInputChange(e) {
        const field = e.target;
        if (field.type === 'checkbox') {
            const group = field.closest('div.mb-3').querySelectorAll('input[type="checkbox"]');
            const selectedValues = Array.from(group)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
            formData[group[0].id.split('-')[0]] = selectedValues;
        } else {
            formData[field.id] = field.value;
        }
        saveProgress();
    }

    /**
     * Shows the next step in the form or generates the README.
     */
    function showNextStep() {
        if (currentStep < formSteps.length - 1) {
            currentStep++;
            renderStep(currentStep);
        } else {
            generateReadme();
        }
        updateProgress();
        updateNavButtons();
        saveProgress();
    }

    /**
     * Shows the previous step in the form.
     */
    function showPrevStep() {
        if (currentStep > 0) {
            currentStep--;
            renderStep(currentStep);
            updateProgress();
            updateNavButtons();
            saveProgress();
        }
    }

    /**
     * Updates the progress bar based on the current step.
     */
    function updateProgress() {
        const percentage = ((currentStep + 1) / formSteps.length) * 100;
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
            progressBar.setAttribute('aria-valuenow', percentage);
        }
    }

    /**
     * Updates the visibility and text of navigation buttons.
     */
    function updateNavButtons() {
        if (prevBtn) prevBtn.style.display = currentStep === 0 ? 'none' : 'inline-block';
        if (nextBtn) nextBtn.innerHTML = currentStep === formSteps.length - 1 ? 'Generate README <i class="bi bi-magic"></i>' : 'Next <i class="bi bi-arrow-right"></i>';
    }

    /**
     * Saves the current form progress to localStorage.
     */
    function saveProgress() {
        const progress = {
            step: currentStep,
            data: formData,
            mode: generatorMode
        };
        localStorage.setItem('readmeGeneratorProgress', JSON.stringify(progress));
    }

    /**
     * Loads form progress from localStorage.
     */
    function loadProgress() {
        const savedProgress = localStorage.getItem('readmeGeneratorProgress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            currentStep = progress.step || 0;
            formData = progress.data || {};
            generatorMode = progress.mode || 'github';
        }
    }

    /**
     * Clears all saved progress and resets the form.
     */
    function clearFormProgress() {
        if (confirm('Are you sure you want to clear all fields and saved progress? This action cannot be undone.')) {
            localStorage.removeItem('readmeGeneratorProgress');
            currentStep = 0;
            formData = {};
            initializeApp();
            showForm();
        }
    }

    /**
     * Generates the README markdown and displays the result.
     */
    function generateReadme() {
        const markdown = generateMarkdown(formData);
        if (resultMarkdown) resultMarkdown.value = markdown;
        showResult();
    }

    /**
     * Shows the result view and hides the form.
     */
    function showResult() {
        if (generatorContent) generatorContent.classList.add('d-none');
        if (resultContainer) resultContainer.classList.remove('d-none');
    }

    /**
     * Shows the form view and hides the result.
     */
    function showForm() {
        if (generatorContent) generatorContent.classList.remove('d-none');
        if (resultContainer) resultContainer.classList.add('d-none');
    }

    /**
     * Copies the generated markdown to the clipboard.
     */
    function copyMarkdown() {
        if (resultMarkdown) {
            resultMarkdown.select();
            document.execCommand('copy');
            if (copyToast) copyToast.show();
        }
    }

    /**
     * Triggers a download of the generated markdown as a .md file.
     */
    function downloadMarkdown() {
        const markdown = resultMarkdown.value;
        const blob = new Blob([markdown], { type: 'text/markdown' });
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
     * Resets the view to the beginning of the form.
     */
    function startOver() {
        showForm();
        initializeApp();
    }

    /**
     * Fetches and pre-fills data from a GitHub repository.
     */
    async function analyzeRepo() {
        const url = githubUrlInput.value.trim();
        if (!url) {
            updateGithubStatus('Please enter a valid GitHub repository URL.', 'text-danger');
            return;
        }

        const repoPath = url.replace(/^(https?:\/\/)?github\.com\//, '');
        const parts = repoPath.split('/');
        if (parts.length < 2) {
            updateGithubStatus('Invalid URL format. Use "owner/repo".', 'text-danger');
            return;
        }
        const [owner, repo] = parts;

        updateGithubStatus('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Analyzing repository...', 'text-secondary');

        try {
            const [repoData, languages] = await Promise.all([
                fetch(`https://api.github.com/repos/${owner}/${repo}`).then(res => res.json()),
                fetch(`https://api.github.com/repos/${owner}/${repo}/languages`).then(res => res.json())
            ]);

            if (repoData.message) {
                throw new Error(repoData.message);
            }

            formData.title = repoData.name || '';
            formData.description = repoData.description || '';
            formData.repoUrl = repoData.html_url || '';
            formData.liveUrl = repoData.homepage || '';
            formData.languages = Object.keys(languages);

            updateGithubStatus('Repository analyzed successfully! Form has been pre-filled.', 'text-success');
            renderStep(currentStep); // Re-render to show pre-filled data
            saveProgress();

        } catch (error) {
            updateGithubStatus(`Error: ${error.message}. Please check the URL and ensure the repository is public.`, 'text-danger');
        }
    }

    /**
     * Updates the status message below the GitHub input.
     * @param {string} message - The message to display.
     * @param {string} className - The Bootstrap text color class.
     */
    function updateGithubStatus(message, className) {
        if (githubStatus) {
            githubStatus.innerHTML = message;
            githubStatus.className = `form-text mt-2 ${className}`;
        }
    }

    /**
     * Logic for examples modal: fetches and renders markdown examples.
     */
    if (examplesModal) {
        const exampleTabs = examplesModal.querySelectorAll('.nav-link[data-bs-toggle="tab"]');
        
        examplesModal.addEventListener('show.bs.modal', () => {
            const activeTab = examplesModal.querySelector('.nav-link.active');
            if (activeTab) {
                loadExample(activeTab);
            }
        });

        exampleTabs.forEach(tab => {
            tab.addEventListener('shown.bs.tab', (event) => {
                loadExample(event.target);
            });
        });

        async function loadExample(tabElement) {
            const examplePath = tabElement.dataset.examplePath;
            const targetPaneId = tabElement.getAttribute('data-bs-target');
            const targetPane = document.querySelector(targetPaneId);

            if (!targetPane || !examplePath || targetPane.dataset.loaded === 'true') {
                return;
            }

            targetPane.querySelector('.spinner-container').style.display = 'flex';

            try {
                const response = await fetch(examplePath);
                if (!response.ok) throw new Error('Failed to load example.');
                const markdown = await response.text();
                targetPane.innerHTML = `<div class="preview-container">${marked.parse(markdown)}</div>`;
                targetPane.dataset.loaded = 'true';
            } catch (error) {
                targetPane.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
            }
        }
    }

    // --- Event Listeners ---
    if (prevBtn) prevBtn.addEventListener('click', showPrevStep);
    if (nextBtn) nextBtn.addEventListener('click', showNextStep);
    if (copyBtn) copyBtn.addEventListener('click', copyMarkdown);
    if (downloadBtn) downloadBtn.addEventListener('click', downloadMarkdown);
    if (startOverBtn) startOverBtn.addEventListener('click', startOver);
    if (clearFormBtn) clearFormBtn.addEventListener('click', clearFormProgress);
    if (analyzeBtn) analyzeBtn.addEventListener('click', analyzeRepo);

    if (generatorModeTabs) {
        generatorModeTabs.addEventListener('click', (event) => {
            event.preventDefault();
            const target = event.target.closest('.nav-link');
            if (target && target.dataset.mode && target.dataset.mode !== generatorMode) {
                generatorMode = target.dataset.mode;
                currentStep = 0; // Reset to first step on mode change
                formData = {}; // Clear data on mode change
                saveProgress();
                initializeApp();
            }
        });
    }

    // --- App Initialization ---
    if (formContainer) {
        initializeApp();
    }
});