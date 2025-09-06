/**
 * The core README generation engine.
 */

/**
 * Gathers all form data into a single object.
 * @returns {Object} An object where keys are field IDs and values are the user's input.
 */
function getFormData() {
    const formData = {};
    const form = document.getElementById('readme-form');
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        formData[input.id] = input.value;
    });
    return formData;
}

/**
 * Generates the complete README Markdown string based on the current form data.
 * @param {Object} formData - The data collected from the form.
 * @returns {Promise<string>} A promise that resolves with the generated Markdown content.
 */
async function generateReadme(formData) {
    try {
        const tone = formData.readmeTone || 'Professional';
        let templateFile = 'default.md';

        if (tone === 'Friendly') {
            templateFile = 'friendly.md';
        } else if (tone === 'Concise') {
            templateFile = 'concise.md';
        }

        const response = await fetch(`templates/${templateFile}`);
        if (!response.ok) {
            throw new Error(`Failed to load template '${templateFile}': ${response.statusText}`);
        }
        let template = await response.text();

        const allFields = formSteps.flatMap(step => step.fields);
        const processedData = {};

        // Process data using formatters if they exist
        for (const key in formData) {
            const field = allFields.find(f => f.id === key);
            const value = formData[key];
            if (field && field.formatter) {
                processedData[key] = field.formatter(value);
            } else {
                processedData[key] = value;
            }
        }

        // Handle conditional blocks: {{#if key}}...{{/if}}
        template = template.replace(/\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, key, content) => {
            return processedData[key] && processedData[key].trim() !== '' ? content.trim() : '';
        });

        // Handle simple replacements: {{key}}
        template = template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return processedData[key] || '';
        });

        return template.trim() ? template.trim() : '# Your README will appear here...';
    } catch (error) {
        console.error("Error generating README:", error);
        return "Error: Could not generate README. Failed to load template.";
    }
}
