document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selectors ---
    const formContainer = document.getElementById('readme-form');
    const progressBar = document.getElementById('progress-bar');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const previewContainer = document.getElementById('preview-container');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const mainNav = document.getElementById('mainNav');
    const copyToastEl = document.getElementById('copy-toast');
    const copyToast = new bootstrap.Toast(copyToastEl);

    // --- State Management ---
    let currentStep = 0;
    let generatedMarkdown = '';
    let suggestionsData = {};

    // --- Functions ---

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
     * Updates the live preview pane with the generated Markdown.
     */
    async function updatePreview() {
        const formData = getFormData();
        generatedMarkdown = await generateReadme(formData);
        // Use marked.js to parse markdown into HTML
        previewContainer.innerHTML = marked.parse(generatedMarkdown);
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
    function nextStep() {
        if (!validateCurrentStep()) {
            return; // Stop if the current step is invalid
        }

        if (currentStep < formSteps.length - 1) {
            currentStep++;
            updateFormStep();
        } else {
            // Handle form completion (e.g., show a summary or final actions)
            alert('README generation complete! You can now copy or download the file.');
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
            installation: suggestions.setup
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

    // --- Event Listeners ---
    nextBtn.addEventListener('click', nextStep);
    prevBtn.addEventListener('click', prevStep);
    copyBtn.addEventListener('click', copyMarkdown);
    downloadBtn.addEventListener('click', downloadMarkdown);
    themeToggle.addEventListener('click', toggleTheme);
    window.addEventListener('scroll', handleScroll);

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

        await updatePreview();
    });

    // --- App Initialization ---
    async function initializeApp() {
        buildForm(); // Build form first to have buttons to disable on error
        await loadSuggestions();
        updateFormStep();
        await updatePreview();
        applySavedTheme();
    }

    initializeApp();
});