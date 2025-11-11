document.addEventListener('DOMContentLoaded', () => {
    const loadComponent = async (selector, url) => {
        const element = document.querySelector(selector);
        if (!element) return;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${url}`);
            }
            const html = await response.text();
            element.innerHTML = html;
        } catch (error) {
            console.error(error);
            element.innerHTML = `<p class="text-danger text-center">Error: Could not load component from ${url}</p>`;
        }
    };

    // Load navbar and footer into their placeholders
    // We use Promise.all to load them concurrently.
    Promise.all([
        loadComponent('#navbar-placeholder', 'components/nav.html'),
        loadComponent('#footer-placeholder', 'components/footer.html')
    ]);
});