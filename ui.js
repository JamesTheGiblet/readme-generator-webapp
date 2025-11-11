/**
 * Handles UI interactions, theme management, and other visual components.
 */

const ui = {
    // --- DOM Element Selectors ---
    elements: {
        themeToggle: document.getElementById('theme-toggle'),
        mainNav: document.getElementById('mainNav'),
        backToTopBtn: document.querySelector('.back-to-top-btn'),
        examplesModal: document.getElementById('examplesModal'),
        copyToastEl: document.getElementById('copy-toast'),
        generatorModeTabs: document.getElementById('generatorModeTabs'),
        githubAnalysisContainer: document.getElementById('github-analysis-container'),
        generatorTitle: document.getElementById('generator-title'),
        generatorContent: document.getElementById('generator-content'),
        resultContainer: document.getElementById('result-container'),
        startOverBtn: document.getElementById('start-over-btn'),
        copyBtn: document.getElementById('copy-btn'),
        downloadBtn: document.getElementById('download-btn'),
    },

    copyToast: null,

    /**
     * Initializes all UI components and event listeners.
     */
    init() {
        if (this.elements.copyToastEl) {
            this.copyToast = new bootstrap.Toast(this.elements.copyToastEl);
        }

        this.applySavedTheme();
        this.handleScroll(); // Initial check

        // --- Event Listeners ---
        if (this.elements.themeToggle) this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        window.addEventListener('scroll', () => this.handleScroll());
        if (this.elements.backToTopBtn) {
            this.elements.backToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }


        if (this.elements.examplesModal) this.initExamplesModal();
        if (this.elements.generatorModeTabs) this.initGeneratorModeTabs();

        if (this.elements.startOverBtn) {
            this.elements.startOverBtn.addEventListener('click', () => {
                this.elements.resultContainer.classList.add('d-none');
                this.elements.generatorContent.classList.remove('d-none');
                form.resetToFirstStep();
            });
        }

        if (this.elements.copyBtn) this.elements.copyBtn.addEventListener('click', () => this.copyMarkdown());
        if (this.elements.downloadBtn) this.elements.downloadBtn.addEventListener('click', () => this.downloadMarkdown());
    },

    /**
     * Toggles the light/dark theme.
     */
    toggleTheme() {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        this.elements.themeToggle.innerHTML = isDarkMode ? '<i class="bi bi-moon-stars-fill"></i>' : '<i class="bi bi-sun-fill"></i>';
    },

    /**
     * Applies the saved theme from localStorage on page load.
     */
    applySavedTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            this.elements.themeToggle.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
        } else {
            this.elements.themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
        }
    },

    /**
     * Handles the navbar shrink effect and back-to-top button visibility on scroll.
     */
    handleScroll() {
        if (this.elements.mainNav) {
            this.elements.mainNav.classList.toggle('navbar-scrolled', window.scrollY > 50);
        }
        if (this.elements.backToTopBtn) {
            this.elements.backToTopBtn.classList.toggle('show', window.scrollY > 300);
        }
    },

    /**
     * Initializes the logic for the README examples modal.
     */
    initExamplesModal() {
        const loadExampleContent = (tab) => {
            const targetPaneId = tab.getAttribute('data-bs-target');
            const targetPane = document.querySelector(targetPaneId);
            if (targetPane && targetPane.querySelector('.spinner-border')) {
                setTimeout(() => {
                    const exampleKey = tab.dataset.examplePath.split('/').pop().replace('-readme.md', '');
                    try {
                        const markdown = window.APP_DATA.examples[exampleKey];
                        targetPane.innerHTML = `<div class="readme-preview-content">${marked.parse(markdown)}</div>`;
                    } catch (error) {
                        targetPane.innerHTML = `<div class="alert alert-danger">Could not load example.</div>`;
                    }
                }, 200);
            }
        };

        this.elements.examplesModal.addEventListener('shown.bs.modal', () => {
            const activeTab = this.elements.examplesModal.querySelector('.nav-link.active');
            if (activeTab) loadExampleContent(activeTab);
        }, { once: true });

        this.elements.examplesModal.querySelectorAll('.nav-link[data-bs-toggle="tab"]').forEach(tab => {
            tab.addEventListener('shown.bs.tab', (event) => loadExampleContent(event.target));
        });
    },

    /**
     * Initializes the generator mode switcher tabs (GitHub/Manual).
     */
    initGeneratorModeTabs() {
        this.elements.generatorModeTabs.addEventListener('click', (event) => {
            event.preventDefault();
            const clickedTab = event.target.closest('.nav-link');
            if (!clickedTab) return;

            this.elements.generatorModeTabs.querySelectorAll('.nav-link').forEach(tab => {
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
            });
            clickedTab.classList.add('active');
            clickedTab.setAttribute('aria-selected', 'true');

            const isGithubMode = clickedTab.dataset.mode === 'github';
            this.elements.githubAnalysisContainer.classList.toggle('hidden-fade', !isGithubMode);
            this.elements.generatorTitle.textContent = isGithubMode ? 'GitHub README Generator' : 'Manual Generator';
        });
    },
};