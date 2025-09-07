window.APP_DATA = {
    suggestions: {
        "Web Application": {
            "techStack": "JavaScript, TypeScript, React, Next.js, Vue.js, Node.js, Express, Python, Django, PostgreSQL, Tailwind CSS",
            "tools": "VS Code, Git, npm/yarn, Vite, Webpack, Docker, Postman, ESLint, Prettier",
            "setup": "1. Clone the repo: `git clone ...`\n2. Navigate to the project directory: `cd <project-name>`\n3. Install dependencies: `npm install` (or `yarn install`)\n4. Set up environment variables in a `.env` file (see `.env.example`).\n5. Start the development server: `npm run dev` (or `yarn dev`)",
            "features": "User Authentication (JWT, OAuth)\nResponsive Design (Mobile-First)\nRESTful or GraphQL API\nDatabase Integration (e.g., PostgreSQL, MongoDB)\nServer-Side Rendering (SSR) or Static Site Generation (SSG)\nState Management (e.g., Redux, Zustand, Pinia)\nUnit & Integration Testing\nCI/CD Pipeline"
        },
        "API / Backend": {
            "techStack": "Node.js, Express, TypeScript, Python, Django, Flask, Go, Gin, Rust, Axum, PostgreSQL, MongoDB, Redis",
            "tools": "VS Code, Git, Docker, Docker Compose, Postman, Insomnia, ngrok",
            "setup": "1. Clone the repo: `git clone ...`\n2. Install dependencies (e.g., `npm install`, `pip install -r requirements.txt`).\n3. Set up environment variables in a `.env` file.\n4. Run database migrations.\n5. Start the server: `npm run start` or `python app.py`",
            "features": "Secure RESTful or GraphQL endpoints\nAuthentication & Authorization (JWT, OAuth2)\nDatabase ORM (e.g., Prisma, SQLAlchemy, GORM)\nRate Limiting\nLogging and Monitoring\nComprehensive API Documentation (e.g., Swagger, OpenAPI)\nContainerization with Docker\nRobust Error Handling"
        },
        "Mobile Application": {
            "techStack": "Kotlin, Swift, Jetpack Compose, SwiftUI, React Native, Flutter, Firebase",
            "tools": "Android Studio, Xcode, VS Code, Git, Gradle, CocoaPods, Expo CLI",
            "setup": "### For React Native/Expo:\n1. Install dependencies: `npm install`\n2. Run on iOS: `npx react-native run-ios` or `expo start --ios`\n3. Run on Android: `npx react-native run-android` or `expo start --android`\n\n### For Flutter:\n1. Get packages: `flutter pub get`\n2. Run the app: `flutter run`",
            "features": "Push Notifications (FCM, APNS)\nOffline First with local database (e.g., Room, SwiftData, Realm)\nIn-App Purchases & Subscriptions\nBiometric Authentication (Face/Touch ID)\nLocation-Based Services\nDeep Linking\nState Management (e.g., Redux, Provider, BLoC)\nAnalytics & Crash Reporting"
        },
        "Desktop Application": {
            "techStack": "Electron, Tauri, C#, .NET MAUI, WPF, Swift, SwiftUI, Qt",
            "tools": "VS Code, Visual Studio, Git, npm, Cargo, Electron Builder, WiX",
            "setup": "### For Electron/Tauri:\n1. Install dependencies: `npm install`\n2. Run in development mode: `npm run dev`\n3. Build for production: `npm run build`\n\n### For .NET:\n1. Open the solution in Visual Studio.\n2. Restore NuGet packages.\n3. Build and run the project (F5).",
            "features": "Cross-Platform Support (Windows, macOS, Linux)\nAuto-Updates\nNative OS Integration (Tray, Notifications, File Dialogs)\nFile System Access\nCustomizable Theming (Light/Dark Mode)\nMulti-Window Management\nSettings Persistence\nInstaller Generation"
        },
        "CLI Tool": {
            "techStack": "Node.js, TypeScript, Python, Go, Rust, Commander.js, Typer, Cobra, Clap",
            "tools": "VS Code, Git, npm, Pip, Go Modules, Cargo, Jest",
            "setup": "### For Node.js:\n1. Install dependencies: `npm install`\n2. Link for global use: `npm link`\n\n### For Python:\n1. Create a virtual environment and install dependencies: `pip install -e .`\n\n### For Go/Rust:\n1. Build the binary: `go build` or `cargo build --release`",
            "features": "Argument and Flag Parsing\nInteractive Prompts\nPiped Input/Output Support\nColorized and Formatted Output\nConfiguration File Support (`.json`, `.toml`, `.yaml`)\nPlugin or Extension System\nAutomated Help Generation\nCross-Platform Compatibility"
        },
        "Library / Framework": {
            "techStack": "TypeScript, JavaScript, Python, C++, Rollup.js, Vite, Jest",
            "tools": "VS Code, Git, npm/yarn, Jest, ESLint, Prettier, Storybook, Doxygen",
            "setup": "1. Install the package: `npm install your-library`\n2. Import and use in your project.\n\n### For Development:\n1. Clone the repo and install dependencies: `npm install`\n2. Run tests: `npm test`\n3. Build the distributable files: `npm run build`",
            "features": "Extensible Plugin Architecture\nComprehensive Test Suite (100% Coverage Goal)\nZero-Dependency (or minimal dependencies)\nType-Safe API with TypeScript\nDetailed Documentation with Examples\nTree-Shakable for smaller bundle sizes\nContinuous Integration (CI) Setup\nPublished to a package manager (npm, PyPI, etc.)"
        },
        "Data Science Project": {
            "techStack": "Python, Pandas, NumPy, Scikit-learn, PyTorch, TensorFlow, Matplotlib, Seaborn, Jupyter",
            "tools": "JupyterLab, VS Code, Git, Pip, Conda, Docker, DVC, MLflow",
            "setup": "1. Clone the repo: `git clone ...`\n2. Create a virtual environment: `python -m venv .venv` & `source .venv/bin/activate`\n3. Install dependencies: `pip install -r requirements.txt`\n4. Download the dataset (provide instructions or a script).\n5. Launch Jupyter: `jupyter lab`",
            "features": "Data Cleaning and Preprocessing\nExploratory Data Analysis (EDA)\nFeature Engineering\nModel Training, Evaluation, and Tuning\nInteractive Visualizations\nExperiment Tracking with MLflow/DVC\nJupyter Notebooks for Reproducibility\nModel Deployment API (Optional)"
        },
        "Game": {
            "techStack": "C#, Unity, C++, Unreal Engine, GDScript, Godot, Blender",
            "tools": "Unity Editor, Unreal Editor, Godot Editor, VS Code, Visual Studio, Git, FMOD",
            "setup": "### For Unity/Godot:\n1. Clone the repo: `git clone ...`\n2. Open the project folder using the appropriate editor version.\n3. Let the editor import assets.\n\n### For Unreal Engine:\n1. Clone the repo.\n2. Right-click the `.uproject` file and select 'Generate Visual Studio project files'.\n3. Open the `.sln` file and build the project.",
            "features": "Core Gameplay Loop\nPhysics and Collision System\n2D/3D Graphics Rendering\nProcedural Content Generation\nAI for NPCs\nSave/Load System\nAudio Engine Integration\nUI/HUD System\nMultiplayer Functionality (Optional)"
        },
        "Browser Extension": {
            "techStack": "HTML, CSS, JavaScript, TypeScript, React, Plasmo",
            "tools": "VS Code, Git, npm/yarn, Webpack, Vite",
            "setup": "1. Clone the repository: `git clone ...`\n2. Install dependencies: `npm install`\n3. Build the extension: `npm run build`\n4. Open your browser's extension page (e.g., `chrome://extensions`).\n5. Enable 'Developer mode'.\n6. Click 'Load unpacked' and select the `dist` or `build` folder.",
            "features": "Content Script for page manipulation\nBackground Script for long-running tasks\nPopup UI for user interaction\nOptions Page for settings\nCross-browser compatibility (Chrome, Firefox, Edge)\nCommunication between extension components\nStorage API for data persistence"
        },
        "Discord Bot": {
            "techStack": "JavaScript, Node.js, TypeScript, Python, discord.js, discord.py",
            "tools": "VS Code, Git, npm, Pip, Docker, PM2",
            "setup": "1. Clone the repository: `git clone ...`\n2. Install dependencies: `npm install` or `pip install -r requirements.txt`\n3. Create a `.env` file and add your `DISCORD_TOKEN` and other variables.\n4. Register slash commands: `node deploy-commands.js`\n5. Start the bot: `npm start` or `python bot.py`",
            "features": "Slash Command Handling\nEvent Listeners (e.g., member join, message sent)\nDatabase Integration for user data\nModeration Tools (kick, ban, mute)\nMusic Playback\nCustomizable Prefix or Slash Commands\nRole Management\nLogging"
        },
        "Other": {
            "techStack": "Specify your stack here (e.g., Go, Rust, PHP, etc.)",
            "tools": "Specify your tools here (e.g., Docker, Jenkins, etc.)",
            "setup": "Describe the setup steps for your project.",
            "features": "List the main features of your project."
        }
    },
    templates: {
        'Professional': `# {{projectTitle}}\n\n{{license}}\n\n## Description\n\n{{projectDescription}}\n\n{{#if liveDemoUrl}}\n## Live Demo\n\nYou can view a live demo of the project here: {{liveDemoUrl}}\n{{/if}}\n\n## Features\n\n{{features}}\n\n## Tech Stack\n\n{{techStack}}\n\n### Development Tools\n\n{{projectTools}}\n\n## Getting Started\n\n### Installation\n\n{{installation}}\n\n## Usage\n\n{{usage}}\n\n## Contributing\n\n{{contributing}}\n\n{{#if githubUsername}}\n## Contact\n\nCreated by @{{githubUsername}} - feel free to contact me!\n{{/if}}\n`,
        'Friendly': `# 👋 Welcome to {{projectTitle}}!\n\n{{license}}\n\nHey there! Thanks for checking out **{{projectTitle}}**.\n\n{{projectDescription}}\n\n{{#if liveDemoUrl}}\n### ✨ Check it out live!\n\nWant to see it in action? Head over to the live demo: {{liveDemoUrl}}\n{{/if}}\n\n### 🚀 What can it do?\n\nHere are some of the cool things this project can do:\n\n{{features}}\n\n### 🛠️ Built With\n\nThis project was brought to life with these awesome technologies:\n\n{{techStack}}\n\nAnd these tools helped along the way:\n\n{{projectTools}}\n\n### ⚙️ Getting it running\n\nReady to get your hands dirty? Here's how you can set it up:\n\n{{installation}}\n\n### 🎮 How to use it\n\n{{usage}}\n\n### 🤝 Want to contribute?\n\nWe love contributions! If you have an idea, a bug fix, or just want to help out, please check out our contributing guidelines.\n\n{{contributing}}\n\n{{#if githubUsername}}\n### 📬 Get in touch\n\nThis project was created by me, @{{githubUsername}}. I'd love to hear from you!\n{{/if}}\n`,
        'Concise': `# {{projectTitle}}\n\n> {{projectDescription}}\n\n{{license}}\n\n{{#if liveDemoUrl}}\n**Live Demo:** {{liveDemoUrl}}\n{{/if}}\n\n## Features\n\n{{features}}\n\n## Tech\n\n{{techStack}}\n\n## Installation\n\n{{installation}}\n\n## Usage\n\n{{usage}}\n\n{{#if contributing}}\n## Contributing\n\n{{contributing}}\n{{/if}}\n`
    }
};