/**
 * Manages the multi-step form, including building, validation, navigation, and data handling.
 */

const form = {
    // --- DOM Element Selectors ---
    elements: {
        formContainer: document.getElementById('readme-form'),
        progressBar: document.getElementById('progress-bar'),
        prevBtn: document.getElementById('prev-btn'),
        nextBtn: document.getElementById('next-btn'),
        clearFormBtn: document.getElementById('clear-form-btn'),
        resultMarkdown: document.getElementById('result-markdown'),
        generatorContent: document.getElementById('generator-content'),
        resultContainer: document.getElementById('result-container'),
    },

    // --- State ---
    currentStep: 0,
    suggestionsData: {},
    generatedMarkdown: '',

    /**
     * Initializes the form, builds steps, loads progress, and sets up listeners.
     */
    init() {
        this.buildForm();
        this.loadSuggestions();
        this.loadFormProgress();
        this.updateFormStep();

        // --- Event Listeners ---
        if (this.elements.nextBtn) this.elements.nextBtn.addEventListener('click', () => this.nextStep());
        if (this.elements.prevBtn) this.elements.prevBtn.addEventListener('click', () => this.prevStep());
        if (this.elements.clearFormBtn) this.elements.clearFormBtn.addEventListener('click', () => this.clearFormProgress());

        if (this.elements.formContainer) {
            this.elements.formContainer.addEventListener('input', (event) => {
                if (event.target.classList.contains('is-invalid')) {
                    event.target.classList.remove('is-invalid');
                }
                if (event.target.id === 'projectType') {
                    this.applySuggestions(event.target.value);
                }
                this.saveFormProgress();
            });
        }
    },

    /**
     * Dynamically builds the form steps from the form-data.js configuration.
     */
    buildForm() {
        formSteps.forEach((step, index) => {
            const stepDiv = document.createElement('div');
            stepDiv.className = `form-step ${index === 0 ? 'active' : ''}`;
            step.fields.forEach(field => {
                const formGroup = document.createElement('div');
                formGroup.className = 'mb-3';
                const commonAttrs = `id="${field.id}" class="form-control" ${field.required ? 'required' : ''} aria-label="${field.label}"`;
                let inputHtml = '';
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
            this.elements.formContainer.appendChild(stepDiv);
        });
    },

    /**
     * Updates the visibility of form steps and navigation buttons.
     */
    updateFormStep() {
        document.querySelectorAll('.form-step').forEach((step, index) => {
            step.classList.toggle('active', index === this.currentStep);
        });
        this.elements.prevBtn.style.display = this.currentStep === 0 ? 'none' : 'inline-block';
        this.elements.nextBtn.innerHTML = this.currentStep === formSteps.length - 1
            ? 'Finish <i class="bi bi-check-lg"></i>'
            : 'Next <i class="bi bi-arrow-right"></i>';
        const progress = ((this.currentStep + 1) / formSteps.length) * 100;
        this.elements.progressBar.style.width = `${progress}%`;
        this.elements.progressBar.setAttribute('aria-valuenow', progress);
    },

    /**
     * Handles navigation to the next step or finishes the form.
     */
    nextStep() {
        if (!this.validateCurrentStep()) return;
        if (this.currentStep < formSteps.length - 1) {
            this.currentStep++;
            this.updateFormStep();
        } else {
            this.generatedMarkdown = generateReadme(this.getFormData());
            this.elements.resultMarkdown.value = this.generatedMarkdown;
            this.elements.generatorContent.classList.add('d-none');
            this.elements.resultContainer.classList.remove('d-none');
        }
    },

    /**
     * Handles navigation to the previous step.
     */
    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.updateFormStep();
        }
    },

    /**
     * Resets the form to the first step.
     */
    resetToFirstStep() {
        this.currentStep = 0;
        this.updateFormStep();
    },

    /**
     * Validates all required fields in the current step.
     * @returns {boolean} True if the step is valid.
     */
    validateCurrentStep() {
        let isStepValid = true;
        formSteps[this.currentStep].fields.forEach(field => {
            const input = document.getElementById(field.id);
            let isFieldValid = true;
            if (field.required && !input.value.trim()) isFieldValid = false;
            if (field.type === 'url' && input.value.trim() && !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(input.value)) {
                isFieldValid = false;
            }
            input.classList.toggle('is-invalid', !isFieldValid);
            if (!isFieldValid) isStepValid = false;
        });
        return isStepValid;
    },

    /**
     * Gathers all form data into a single object.
     * @returns {Object} The form data.
     */
    getFormData() {
        const formData = {};
        this.elements.formContainer.querySelectorAll('input, textarea, select').forEach(input => {
            formData[input.id] = input.value;
        });
        return formData;
    },

    /**
     * Saves the current form data to localStorage.
     */
    saveFormProgress() {
        localStorage.setItem('readmeGeneratorProgress', JSON.stringify(this.getFormData()));
    },

    /**
     * Loads form data from localStorage.
     */
    loadFormProgress() {
        const savedData = JSON.parse(localStorage.getItem('readmeGeneratorProgress') || '{}');
        for (const id in savedData) {
            const element = document.getElementById(id);
            if (element && savedData[id]) element.value = savedData[id];
        }
    },

    /**
     * Clears the form and removes saved progress.
     */
    clearFormProgress() {
        if (confirm('Are you sure you want to clear all fields? This will also remove your saved progress.')) {
            localStorage.removeItem('readmeGeneratorProgress');
            this.elements.formContainer.reset();
            if (api.elements.githubUrlInput) api.elements.githubUrlInput.value = '';
            if (api.elements.githubStatus) api.elements.githubStatus.innerHTML = '';
            this.elements.formContainer.dispatchEvent(new Event('input', { bubbles: true }));
        }
    },

    /**
     * Fetches the suggestion data from the global APP_DATA object.
     */
    loadSuggestions() {
        this.suggestionsData = window.APP_DATA?.suggestions || {};
    },

    /**
     * Applies content suggestions based on the selected project type.
     * @param {string} projectType - The selected project type.
     * @param {Object} [context] - Optional context, e.g., { owner, repo }.
     */
    applySuggestions(projectType, context = {}) {
        const suggestions = this.suggestionsData[projectType];
        if (!suggestions) return;

        const fieldsToUpdate = {
            techStack: suggestions.techStack,
            projectTools: suggestions.tools,
            installation: suggestions.setup,
            features: suggestions.features,
            usage: suggestions.usage
        };

        const hasContent = Object.keys(fieldsToUpdate).some(id => {
            const input = document.getElementById(id);
            return input && input.value.trim() !== '';
        });

        if (!hasContent || confirm("This may overwrite existing content in related fields. Are you sure?")) {
            for (const id in fieldsToUpdate) {
                const input = document.getElementById(id);
                let value = fieldsToUpdate[id];
                if (id === 'installation' && value && context.owner && context.repo) {
                    value = value.replace('`git clone ...`', `\`git clone https://github.com/${context.owner}/${context.repo}.git\``)
                                 .replace('<project-name>', context.repo);
                }
                if (input && value !== undefined) input.value = value;
            }
        }
    },
};