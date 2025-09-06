/**
 * Gathers all data from the form fields.
 * @returns {object} An object containing all form data.
 */
export function getReadmeData() {
    return {
        projectName: document.getElementById('projectName')?.value || '',
        description: document.getElementById('description')?.value || '',
        version: document.getElementById('version')?.value || '',
        primaryLanguage: document.getElementById('primaryLanguage')?.value || '',
        projectType: document.getElementById('projectType')?.value || '',
        githubUrl: document.getElementById('githubUrl')?.value || '',
        keyFeatures: document.getElementById('keyFeatures')?.value || '',
        installation: document.getElementById('installation')?.value || '',
        usage: document.getElementById('usage')?.value || '',
        license: document.getElementById('license')?.value || '',
        author: document.getElementById('author')?.value || '',
        email: document.getElementById('email')?.value || '',
        website: document.getElementById('website')?.value || '',
        tone: document.getElementById('tone')?.value || 'professional',
        includeBadges: document.getElementById('includeBadges')?.checked || false,
        includeContributing: document.getElementById('contributing')?.checked || false,
        includeChangelog: document.getElementById('changelog')?.checked || false,
        includeRoadmap: document.getElementById('roadmap')?.checked || false,
        includeFaq: document.getElementById('faq')?.checked || false,
        includeAcknowledgments: document.getElementById('acknowledgments')?.checked || false,
        includeScreenshots: document.getElementById('screenshots')?.checked || false,
    };
}