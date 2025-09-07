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
function generateReadme(formData) {
    try {
        const tone = formData.readmeTone || 'Professional'; // Default to Professional
        const readmeTemplates = window.APP_DATA.templates;
        let template = readmeTemplates[tone];
        if (!template) {
            console.warn(`Template for tone '${tone}' not found. Falling back to Professional.`);
            template = readmeTemplates['Professional'];
        }

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
            return processedData[key] && String(processedData[key]).trim() !== '' ? content.trim() : '';
        });

        // Replace placeholders iteratively to avoid issues with complex multi-line strings.
        for (const key in processedData) {
            if (Object.hasOwnProperty.call(processedData, key)) {
                // Using a function for the replacement value prevents special
                // interpretation of characters like '$' in the replacement string.
                const replacementValue = processedData[key] || '';
                template = template.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), () => replacementValue);
            }
        }

        // Clean up any remaining placeholders that didn't have data
        const finalTemplate = template.replace(/\{\{(\w+)\}\}/g, '');

        return finalTemplate.trim() ? finalTemplate.trim() : '# Your README will appear here...';
    } catch (error) {
        console.error("Error generating README:", error);
        return "Error: Could not generate README. Failed to load template.";
    }
}
