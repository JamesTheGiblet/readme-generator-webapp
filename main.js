import { buildReadmeContent } from './core/engine.js';
import { getReadmeData } from './core/form-data.js';

// --- Global State ---
let currentStep = 1;
const totalSteps = 4;
let darkMode = false;

// --- Global Functions (callable from HTML via onclick) ---

function updateStepAndProgress() {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;

    document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
    const activeStep = document.getElementById(`step${currentStep}`);
    if (activeStep) {
        activeStep.classList.add('active');
    }

    const progress = (currentStep / totalSteps) * 100;
    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute('aria-valuenow', progress);
}

function validateStep(stepNumber) {
    const stepElement = document.getElementById(`step${stepNumber}`);
    if (!stepElement) return false;
    const requiredInputs = stepElement.querySelectorAll('[required]');
    let allValid = true;
    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            allValid = false;
        } else {
            input.classList.remove('is-invalid');
        }
    });
    if (!allValid) {
        showToast('Please fill in all required fields.', 'warning');
    }
    return allValid;
}

function prevStep() {
    if (currentStep <= 1) return;
    currentStep--;
    updateStepAndProgress();
}

function nextStep() {
    if (currentStep >= totalSteps) return;

    if (!validateStep(currentStep)) {
        return;
    }
    currentStep++;
    updateStepAndProgress();
}

function scrollToGenerator() {
    const generatorEl = document.getElementById('generator');
    if (generatorEl) {
        generatorEl.scrollIntoView({ behavior: 'smooth' });
    }
}

function showPricing() { showToast('Pricing details coming soon!', 'info'); }
function showDemo() { showToast('Demo video coming soon!', 'info'); }

async function generateReadme() {
    if (currentStep !== 3) return; // Only generate from step 3

    if (!validateStep(currentStep)) {
        return; // Stop if validation fails
    }

    currentStep++;
    updateStepAndProgress(); // Manually advance to the preview step

    const previewContainer = document.getElementById('readmePreview');
    previewContainer.innerHTML = '<div class="d-flex align-items-center p-4"><strong role="status">Generating with AI...</strong><div class="spinner-border ms-auto" aria-hidden="true"></div></div>';

    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network/AI delay

    const data = getReadmeData();
    const readmeContent = buildReadmeContent(data);

    // Sanitize content for safe HTML display inside <pre> tag
    const sanitizedContent = readmeContent.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    previewContainer.innerHTML = `<pre class="m-0">${sanitizedContent}</pre>`;
}

function copyReadme() {
    const readmePreview = document.getElementById('readmePreview');
    if (!readmePreview) return;
    navigator.clipboard.writeText(readmePreview.innerText).then(() => showToast('README copied to clipboard!', 'success'), () => showToast('Failed to copy.', 'danger'));
}

function downloadReadme() {
    const readmePreview = document.getElementById('readmePreview');
    if (!readmePreview) return;

    const readmeText = readmePreview.innerText;
    const blob = new Blob([readmeText], { type: 'text/markdown' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'README.md' });
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('Downloading README.md...', 'success');
}

function editReadme() {
    if (currentStep !== 4) return;
    prevStep();
    showToast('You can now edit your inputs again.', 'info');
}

function startOver() {
    const readmeForm = document.getElementById('readmeForm');
    if (readmeForm) {
        readmeForm.reset();
    }
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    currentStep = 1;
    updateStepAndProgress();

    const readmePreview = document.getElementById('readmePreview');
    if (readmePreview) {
        readmePreview.innerHTML = '';
    }
    showToast('Form has been reset.', 'info');
}

function shareReadme() {
    // Enhanced share functionality
    const readmePreview = document.getElementById('readmePreview');
    if (!readmePreview) return;

    const readmeText = readmePreview.innerText;
    const shareData = {
        title: 'My Generated README',
        text: 'Check out this README I generated with README Pro!',
        url: window.location.href
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        navigator.share(shareData).catch(() => {
            fallbackShare(readmeText);
        });
    } else {
        fallbackShare(readmeText);
    }
}

function fallbackShare(readmeText) {
    // Create a temporary shareable link (simulate backend)
    const shareId = Math.random().toString(36).substring(2, 15);
    const shareUrl = `${window.location.origin}/shared/${shareId}`;

    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl).then(() => {
            showToast('Share link copied to clipboard!', 'success');
        }).catch(() => {
            showToast(`Share link: ${shareUrl}`, 'info');
        });
    } else {
        showToast(`Share link: ${shareUrl}`, 'info');
    }
}

// --- Helper Functions ---

function showToast(message, type = 'primary') {
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) return;
    const toastId = 'toast-' + Date.now();
    const toastHTML = `<div id="${toastId}" class="toast align-items-center text-bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true"><div class="d-flex"><div class="toast-body">${message}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div></div>`;
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    const toastEl = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}

/**
 * Updates the entire page theme (body class and icons). This function is safe to call on any page.
 * @param {boolean} isDark - True for dark mode, false for light mode.
 */
function updateTheme(isDark) {
    const body = document.body;
    const themeIcon = document.querySelector('.theme-toggle i');

    if (isDark) {
        body.classList.add('dark-mode');
        if (themeIcon) themeIcon.className = 'bi bi-sun-fill';
    } else {
        body.classList.remove('dark-mode');
        if (themeIcon) themeIcon.className = 'bi bi-moon-fill';
    }
}

/**
 * Toggles the theme and saves the user's preference.
 */
function toggleDarkMode() {
    darkMode = !document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', darkMode);
    updateTheme(darkMode);
    showToast(darkMode ? 'Dark mode enabled' : 'Light mode enabled', 'info');
}

/**
 * Initializes the dark mode on page load based on saved preference or system settings.
 */
function initializeDarkMode() {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
        darkMode = savedMode === 'true';
    } else {
        darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    updateTheme(darkMode);
}

// Enhanced analytics counter animation
function animateCounters() {
    const counters = document.querySelectorAll('.analytics-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const originalText = element.textContent;
    const isRate = originalText.includes('/');
    const isK = originalText.toLowerCase().includes('k');

    let targetValue;
    let suffix = '';

    if (isRate) {
        targetValue = parseFloat(originalText);
        suffix = originalText.substring(originalText.indexOf('/'));
    } else {
        targetValue = parseFloat(originalText.replace(/,/g, ''));
        if (isK) {
            targetValue *= 1000;
        }
        suffix = originalText.replace(/[\d.,k]/gi, '');
    }

    if (isNaN(targetValue)) {
        element.textContent = originalText; // Restore original if parsing fails
        return;
    }

    const numericValue = targetValue;
    const hasDecimal = originalText.includes('.');

    let current = 0;
    const increment = numericValue / 60; // 60 frames for smooth animation

    const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
            element.textContent = originalText;
            clearInterval(timer);
        } else {
            const displayValue = hasDecimal ? current.toFixed(1) : Math.floor(current).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            element.textContent = displayValue + suffix;
        }
    }, 16); // ~60fps
}

// Enhanced GitHub URL validation with more features
function setupGitHubValidation() {
    const githubUrlInput = document.getElementById('githubUrl');
    const githubStatus = document.getElementById('githubStatus');
    if (!githubUrlInput || !githubStatus) return;

    let debounceTimer;
    githubUrlInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        const url = githubUrlInput.value.trim();

        if (!url) {
            githubStatus.innerHTML = '';
            return;
        }

        githubStatus.innerHTML = '<div class="spinner-border spinner-border-sm text-secondary" role="status"></div>';

        debounceTimer = setTimeout(() => {
            const isValid = /^https:\/\/github\.com\/[a-zA-Z0-9-._]+\/[a-zA-Z0-9-._]+\/?$/.test(url);

            if (isValid) {
                githubStatus.innerHTML = '<i class="bi bi-check-circle-fill text-success" title="Valid GitHub URL"></i>';
                showToast('Valid GitHub repository URL detected!', 'info');

                // Auto-populate project name if empty
                const projectNameInput = document.getElementById('projectName');
                if (!projectNameInput.value) {
                    const repoName = url.split('/').pop().replace('.git', '');
                    projectNameInput.value = repoName.replace(/[-_]/g, ' ')
                        .replace(/\b\w/g, l => l.toUpperCase());
                }
            } else {
                githubStatus.innerHTML = '<i class="bi bi-x-circle-fill text-danger" title="Invalid GitHub URL"></i>';
            }
        }, 800);
    });
}

/**
 * Attaches event listeners to the interactive elements of the generator.
 */
function setupEventListeners() {
    // Form submission
    document.getElementById('readmeForm')?.addEventListener('submit', (event) => {
        event.preventDefault();
        generateReadme();
    });

    // Navigation buttons
    document.getElementById('nextStep1')?.addEventListener('click', nextStep);
    document.getElementById('nextStep2')?.addEventListener('click', nextStep);
    document.getElementById('prevStep2')?.addEventListener('click', prevStep);
    document.getElementById('prevStep3')?.addEventListener('click', prevStep);

    // Action buttons in step 4
    document.getElementById('copyReadmeBtn')?.addEventListener('click', copyReadme);
    document.getElementById('downloadReadmeBtn')?.addEventListener('click', downloadReadme);
    document.getElementById('editReadmeBtn')?.addEventListener('click', editReadme);
    document.getElementById('startOverBtn')?.addEventListener('click', startOver);
    document.getElementById('shareReadmeBtn')?.addEventListener('click', shareReadme);
}
// --- Initialization Functions ---

/**
 * Initializes the entire application after the DOM is loaded.
 */
function initializeApp() {
    // Initialize dark mode first as it affects the whole page
    initializeDarkMode();

    // Listen for system theme changes to auto-update if no preference is set
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (localStorage.getItem('darkMode') === null) {
            darkMode = e.matches;
            updateTheme(darkMode);
        }
    });

    // --- Page-specific initializations ---
    // Check if we are on the main page by looking for a unique element.
    // If so, run the initializers for the main page's complex components.
    if (document.getElementById('tool-switcher')) {
        initializeMainPage();
    } else {
        // If it's not the main portal page, it must be a tool page.
        // We can directly initialize the generator scripts.
        initializeGeneratorScripts();
    }
}

function initializeMainPage() {
    // Setup the tool switcher and load the default tool
    initializeToolSwitcher();
    // Initialize scroll-triggered animations for sections
    initializeScrollAnimations();

    // Initialize scroll-triggered effects (back-to-top button, navbar shrink)
    initializeScrollEffects();

    // Initialize analytics counter animation
    setTimeout(animateCounters, 500); // Slight delay to ensure DOM is ready

    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]:not([data-bs-toggle])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Ensure the href is more than just a '#' to avoid errors and scroll-to-top behavior
            if (href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    console.log('Enhanced README Pro initialized successfully');
}
/**
 * Sets up the tool switching tabs and loads the default tool.
 */
function initializeToolSwitcher() {
    const toolSwitcher = document.getElementById('tool-switcher');
    if (!toolSwitcher) return;

    const tabs = toolSwitcher.querySelectorAll('[data-bs-toggle="tab"]');

    tabs.forEach(tab => {
        tab.addEventListener('shown.bs.tab', event => {
            const templateId = event.target.dataset.toolTemplate;
            const initFunction = event.target.dataset.toolInit;
            if (templateId) {
                loadTool(templateId, initFunction);
            }
        });
    });

    // Load the default tool initially
    const activeTab = toolSwitcher.querySelector('.nav-link.active');
    if (activeTab) {
        const templateId = activeTab.dataset.toolTemplate;
        const initFunction = activeTab.dataset.toolInit;
        if (templateId) {
            loadTool(templateId, initFunction);
        }
    }
}

/**
 * Loads a tool from a template into the main content area.
 * @param {string} templateId The ID of the <template> element to load.
 * @param {string} initFunctionName The name of the function to call to initialize the tool's scripts.
 */
function loadTool(templateId, initFunctionName) {
    const toolContentArea = document.getElementById('tool-content-area');
    const template = document.getElementById(templateId);

    if (!toolContentArea || !template) {
        console.error(`Tool content area or template with id '${templateId}' not found!`);
        toolContentArea.innerHTML = `<div class="alert alert-danger" role="alert"><strong>Error:</strong> Could not load the tool. Template is missing.</div>`;
        return;
    }

    const templateContent = template.content.cloneNode(true);
    toolContentArea.innerHTML = ''; // Clear previous tool or spinner
    toolContentArea.appendChild(templateContent);

    if (initFunctionName && typeof window[initFunctionName] === 'function') {
        window[initFunctionName]();
    }
}

/**
 * Initializes JavaScript functionality specific to the generator form.
 */
function initializeGeneratorScripts() {
    updateStepAndProgress();
    setupGitHubValidation();
    setupEventListeners();
}

/**
 * Initializes animations for elements that should fade in on scroll.
 */
function initializeScrollAnimations() {
    const scrollElements = document.querySelectorAll('.scroll-fade');

    if (!scrollElements.length) return;

    // Apply staggered delay to feature cards specifically
    const featureCards = document.querySelectorAll('#features .row .scroll-fade');
    featureCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 100}ms`;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // When the element is in view, add the 'is-visible' class to trigger the animation
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Stop observing the element after it has become visible
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Start animation a bit before it's fully in view
    });

    scrollElements.forEach(el => observer.observe(el));
}

/**
 * Initializes effects that trigger on scroll, like the back-to-top button and navbar shrinking.
 */
function initializeScrollEffects() {
    const backToTopBtn = document.getElementById('backToTopBtn');
    const navbar = document.querySelector('.navbar');
    if (!navbar && !backToTopBtn) return;

    // Handle scroll events
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Back to top button visibility
        if (backToTopBtn) {
            if (scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }

        // Navbar shrink effect
        if (navbar) {
            if (scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        }
    });
}

/**
 * Initializes JavaScript functionality specific to the DID Manager tool.
 */
function initializeDidManagerScripts() {
    console.log('DID Manager tool placeholder initialized.');
    // Future JS for this tool will go here.
}

document.addEventListener('DOMContentLoaded', initializeApp);