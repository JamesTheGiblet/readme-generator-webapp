document.addEventListener('DOMContentLoaded', () => {
    /**
     * Main application entry point.
     */
    function initializeApp() {
        // Initialize UI module for all pages (handles theme, navbar, etc.)
        if (typeof ui !== 'undefined') {
            ui.init();
        }

        // Initialize form and API modules only on the main generator page
        if (document.getElementById('readme-form')) {
            if (typeof form !== 'undefined') form.init();
            if (typeof api !== 'undefined') api.init();
        }
    }

    initializeApp();

    // Expose functions needed by other modules/inline scripts
    // (This part is for actions triggered from the UI module)
    if (typeof ui !== 'undefined') {
        ui.copyMarkdown = () => {
            navigator.clipboard.writeText(form.generatedMarkdown).then(() => {
                if (ui.copyToast) ui.copyToast.show();
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        };

        ui.downloadMarkdown = () => {
            const blob = new Blob([form.generatedMarkdown], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'README.md';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };
    }
});
