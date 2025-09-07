/**
 * The core README generation engine.
 */

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
            return processedData[key] && String(processedData[key]).trim() !== '' ? content : '';
        });

        // Replace placeholders iteratively to avoid issues with complex multi-line strings.
        for (const key in processedData) {
            if (Object.hasOwnProperty.call(processedData, key)) {
                const placeholder = `{{${key}}}`;
                const replacementValue = processedData[key] || '';
                // Using split/join is a robust way to replace all occurrences without regex complexities.
                template = template.split(placeholder).join(replacementValue);
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
