document.addEventListener('DOMContentLoaded', () => {
    /**
     * Fetches and loads data required for the application, like templates and examples.
     * @returns {Promise<void>}
     */
    async function loadAppData() {
        const fetchFile = async (url) => {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to load: ${url}`);
            return response.text();
        };
    
        try {
            const [professional, friendly, concise, professionalEx, friendlyEx, conciseEx] = await Promise.all([
                fetchFile('templates/professional-readme.md'),
                fetchFile('templates/friendly-readme.md'),
                fetchFile('templates/concise-readme.md'),
                fetchFile('examples/professional-readme.md'),
                fetchFile('examples/friendly-readme.md'),
                fetchFile('examples/concise-readme.md')
            ]);
    
            window.APP_DATA.templates = { Professional: professional, Friendly: friendly, Concise: concise };
            window.APP_DATA.examples = { professional: professionalEx, friendly: friendlyEx, concise: conciseEx };
    
        } catch (error) {
            console.error("Fatal Error: Could not load initial app data.", error);
            // Optionally, display a user-facing error message on the page
        }
    }
    
    /**
     * Initializes the application after all data has been loaded.
     */
    async function initializeApp() {
        await loadAppData(); // Wait for templates and examples to be loaded
    
        // Initialize UI components (theme, navbar, etc.) for all pages
        ui.init();
    
        // Initialize form-specific logic only on the main generator page
        if (document.getElementById('readme-form')) {
            form.init();
            api.init();
        }
    }

    initializeApp();
});
