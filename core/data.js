window.APP_DATA = {
    defaultContributingText: "Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.\n\nIf you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag \"enhancement\".\n\n1. Fork the Project\n2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)\n3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)\n4. Push to the Branch (`git push origin feature/AmazingFeature`)\n5. Open a Pull Request",
    suggestions: {
        "Web Application": {
            "techStack": "JavaScript, TypeScript, React, Next.js, Vue.js, Node.js, Express, Python, Django, PostgreSQL, Tailwind CSS",
            "tools": "VS Code, Git, npm/yarn, Vite, Webpack, Docker, Postman, ESLint, Prettier",
            "setup": "1. Clone the repo: `git clone ...`\n2. Navigate to the project directory: `cd <project-name>`\n3. Install dependencies: `npm install` (or `yarn install`)\n4. Set up environment variables in a `.env` file (see `.env.example`).\n5. Start the development server: `npm run dev` (or `yarn dev`)",
            "features": "User Authentication (JWT, OAuth)\nResponsive Design (Mobile-First)\nRESTful or GraphQL API\nDatabase Integration (e.g., PostgreSQL, MongoDB)\nServer-Side Rendering (SSR) or Static Site Generation (SSG)\nState Management (e.g., Redux, Zustand, Pinia)\nUnit & Integration Testing\nCI/CD Pipeline for automated deployments (e.g., Vercel, Netlify, AWS)"
        },
        "Static Web Application": {
            "techStack": "HTML, CSS, JavaScript",
            "tools": "VS Code, Git, Live Server",
            "setup": "1. Clone the repository: `git clone ...`\n2. Navigate to the project directory: `cd <project-name>`\n3. This project needs to be run from a web server due to browser security policies (CORS). You cannot open `index.html` directly as a file.\n   - **Using VS Code:** Use the Live Server extension.\n   - **Using Python:** Run `python -m http.server` in the project directory and open `http://localhost:8000`.\n   - **Using Node.js:** Install a simple server like `npm install -g serve` and run `serve`.",
            "features": "Responsive Design\nInteractive UI with JavaScript\nPurely client-side, no build step required\nOptimized for fast loading",
            "usage": "Once the application is running on your local server, you can start generating your README.\n\n1. **(Optional)** Use the GitHub analysis tool to pre-fill fields from a public repository.\n2. Fill out the form fields step-by-step.\n3. On the final step, click 'Finish' to see your generated README.\n4. Use the 'Copy' or 'Download' buttons to get your file."
        },
        "React Web Application": {
            "techStack": "React, JavaScript, TypeScript, CSS, HTML, Vite",
            "tools": "VS Code, Git, npm/yarn, Vite, ESLint, Prettier",
            "setup": "1. Clone the repo: `git clone ...`\n2. Install dependencies: `npm install`\n3. Start the development server: `npm run dev`",
            "features": "Component-based architecture\nVirtual DOM for high performance\nState management (e.g., Context API, Redux)\nClient-side routing with React Router\nReusable UI components"
        },
        "Next.js Web Application": {
            "techStack": "Next.js, React, TypeScript, Tailwind CSS",
            "tools": "VS Code, Git, npm/yarn, Vercel, ESLint, Prettier",
            "setup": "1. Clone the repo: `git clone ...`\n2. Install dependencies: `npm install`\n3. Start the development server: `npm run dev`",
            "features": "Server-Side Rendering (SSR) and Static Site Generation (SSG)\nFile-based routing\nAPI Routes for backend functionality\nImage Optimization\nFast Refresh for a great developer experience"
        },
        "Vue.js Web Application": {
            "techStack": "Vue.js, JavaScript, TypeScript, Vite, Pinia",
            "tools": "VS Code, Git, npm/yarn, Vite, Vue DevTools, ESLint",
            "setup": "1. Clone the repo: `git clone ...`\n2. Install dependencies: `npm install`\n3. Start the development server: `npm run dev`",
            "features": "Approachable and progressive framework\nComponent-based architecture\nReactive data binding\nState management with Pinia\nSingle File Components (.vue files)"
        },
        "Angular Web Application": {
            "techStack": "Angular, TypeScript, RxJS",
            "tools": "VS Code, Git, npm/yarn, Angular CLI, ESLint",
            "setup": "1. Clone the repo: `git clone ...`\n2. Install dependencies: `npm install`\n3. Start the development server: `ng serve`",
            "features": "Comprehensive and opinionated framework\nTwo-way data binding\nDependency Injection\nModular architecture with NgModules\nPowerful CLI for code generation and builds"
        },
        "API / Backend": {
            "techStack": "Node.js, Express, TypeScript, Python, Django, Flask, Go, Gin, Rust, Axum, PostgreSQL, MongoDB, Redis",
            "tools": "VS Code, Git, Docker, Docker Compose, Postman, Insomnia, ngrok",
            "setup": "1. Clone the repo: `git clone ...`\n2. Install dependencies (e.g., `npm install`, `pip install -r requirements.txt`).\n3. Set up environment variables in a `.env` file.\n4. Run database migrations.\n5. Start the server: `npm run start` or `python app.py`",
            "features": "Secure RESTful or GraphQL endpoints\nAuthentication & Authorization (JWT, OAuth2)\nDatabase ORM (e.g., Prisma, SQLAlchemy, GORM)\nRate Limiting\nLogging and Monitoring\nComprehensive API Documentation (e.g., Swagger, OpenAPI, Postman Docs)\nContainerization with Docker\nRobust Error Handling"
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
        "DevOps / Infrastructure": {
            "techStack": "Terraform, Ansible, Docker, Kubernetes, Python, Go, Bash, PowerShell",
            "tools": "VS Code, Git, Jenkins, GitHub Actions, CircleCI, AWS CLI, Azure CLI, gcloud",
            "setup": "1. Clone the repository.\n2. Configure cloud provider credentials (e.g., `aws configure`).\n3. Initialize the configuration (e.g., `terraform init`).\n4. Review the execution plan (e.g., `terraform plan`).\n5. Apply the configuration (e.g., `terraform apply`).",
            "features": "Infrastructure as Code (IaC)\nAutomated CI/CD Pipelines\nContainer Orchestration with Kubernetes\nConfiguration Management\nCloud Agnostic (or specific to AWS/Azure/GCP)\nMonitoring and Alerting Setup\nSecure Secrets Management (e.g., Vault, AWS Secrets Manager)"
        },
        "Smart Contract / Blockchain": {
            "techStack": "Solidity, Rust, JavaScript, TypeScript, Hardhat, Truffle, Ethers.js, Web3.js",
            "tools": "VS Code, Git, npm/yarn, Remix IDE, Ganache, Infura, Alchemy",
            "setup": "1. Clone the repository.\n2. Install dependencies: `npm install`\n3. Compile the smart contracts: `npx hardhat compile`\n4. Run tests on a local network: `npx hardhat test`\n5. Deploy to a testnet (e.g., Rinkeby, Goerli): `npx hardhat run scripts/deploy.js --network goerli`",
            "features": "Decentralized Application (dApp) logic\nERC20/ERC721/ERC1155 token standards\nOn-chain data storage\nInteraction with other smart contracts\nUpgradable contracts (e.g., using OpenZeppelin proxies)\nGas optimization\nSecurity best practices (e.g., Reentrancy Guard)"
        },
        "Other": {
            "techStack": "Specify your stack here (e.g., Go, Rust, PHP, etc.)",
            "tools": "Specify your tools here (e.g., Docker, Jenkins, etc.)",
            "setup": "Describe the setup steps for your project.",
            "features": "List the main features of your project."
        }
    },
    // The 'templates' and 'examples' objects will be populated dynamically
    // by the initialization logic in main.js.
    templates: {},
    examples: {}
};