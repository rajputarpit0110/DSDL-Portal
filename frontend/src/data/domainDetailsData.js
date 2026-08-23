export const domainDetailsData = {
  'machine-learning': {
    id: 'machine-learning',
    slug: 'machine-learning',
    name: 'Machine Learning',
    tagline: 'Teaching machines to discover patterns, make predictions, and adapt from real-world data.',
    badge: 'Core Intelligence',
    icon: 'Brain',
    coverImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1400&q=80',
    description: 'Machine Learning (ML) is the science of training statistical algorithms to parse data, learn underlying distributions, and execute intelligent decisions without explicit step-by-step programming.',
    keyTerms: [
      {
        term: 'Supervised Learning',
        explanation: 'Training models on labeled datasets (input-output pairs) to predict labels for unseen data, including Regression (continuous values) and Classification (discrete categories).'
      },
      {
        term: 'Unsupervised Learning',
        explanation: 'Discovering hidden structures, groupings, or anomaly patterns in unlabeled datasets using techniques like K-Means Clustering and PCA (Principal Component Analysis).'
      },
      {
        term: 'Overfitting & Regularization',
        explanation: 'Overfitting occurs when a model memorizes noise instead of generalizing. Regularization methods (L1/L2, Dropout) penalize complexity to boost generalization on unseen test data.'
      },
      {
        term: 'Evaluation Metrics',
        explanation: 'Crucial performance benchmarks including Precision, Recall, F1-Score, ROC-AUC, and Mean Squared Error (MSE) tailored to balance false positives vs false negatives.'
      },
      {
        term: 'Feature Engineering',
        explanation: 'The process of selecting, transforming, and extracting informative attributes from raw datasets to maximize model predictive capability.'
      }
    ],
    techStack: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy', 'XGBoost', 'LightGBM', 'Matplotlib', 'Seaborn'],
    roadmap: [
      { stage: '1. Foundations', description: 'Linear algebra, multivariate calculus, probability & statistics, Python data structures.' },
      { stage: '2. Exploratory Data Analysis', description: 'Data cleaning, normalization, feature scaling, outlier detection, and statistical plotting.' },
      { stage: '3. Classical ML Algorithms', description: 'Linear/Logistic regression, Decision Trees, Random Forests, SVMs, and Ensemble models.' },
      { stage: '4. Model Deployment', description: 'Serializing models (Pickle/ONNX), building REST APIs with FastAPI/Flask, and containerizing with Docker.' }
    ],
    whyJoin: [
      'Comprehensive hands-on projects working with Kaggle and real-world tabular/time-series datasets',
      'Peer-led Kaggle competition teams and research paper reading groups',
      'End-to-end pipeline creation from data extraction to live cloud inference APIs',
      'Mentorship from seniors who have cracked ML internships and hackathons'
    ],
    examples: [
      'Predictive Customer Churn & Retention Engine for SaaS Platforms',
      'Automated Credit Risk & Fraud Detection System',
      'Personalized Recommendation Engine using Collaborative Filtering',
      'Algorithmic Stock Trend Analysis with Time-Series Forecasting'
    ]
  },

  'web-development': {
    id: 'web-development',
    slug: 'web-development',
    name: 'Web Development',
    tagline: 'Engineering scalable, responsive, and high-performance modern web platforms & distributed systems.',
    badge: 'Full-Stack Architecture',
    icon: 'Monitor',
    coverImage: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1400&q=80',
    description: 'Web Development spans full-stack software engineering—crafting intuitive, reactive user interfaces and robust, scalable backend services connected via robust APIs and databases.',
    keyTerms: [
      {
        term: 'Frontend & Reactive UI',
        explanation: 'The client-side layer executed in browsers using modern frameworks (React, Next.js, Vue) to deliver reactive state management, seamless routing, and component lifecycles.'
      },
      {
        term: 'Backend & REST / GraphQL APIs',
        explanation: 'Server-side application logic and services (Node.js, Express, Go, Django) managing business rules, validation, and data serialization protocols.'
      },
      {
        term: 'Database Architecture (SQL vs NoSQL)',
        explanation: 'Relational data stores (PostgreSQL, MySQL) enforcing ACID compliance and schema integrity alongside Document stores (MongoDB) and in-memory caches (Redis).'
      },
      {
        term: 'Authentication & Session Management',
        explanation: 'Securing web applications using JWTs, HTTP-only secure cookies, OAuth2 social logins, Role-Based Access Control (RBAC), and bcrypt password hashing.'
      },
      {
        term: 'SSR, SSG & Hydration',
        explanation: 'Server-Side Rendering and Static Site Generation for sub-second page loads, enhanced SEO crawling, and smooth client hydration.'
      }
    ],
    techStack: ['React', 'Next.js', 'Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'TailwindCSS'],
    roadmap: [
      { stage: '1. Frontend Mastery', description: 'Semantic HTML5, CSS layout engines (Flexbox, Grid), modern JavaScript (ES6+), DOM architecture.' },
      { stage: '2. Component Frameworks', description: 'React ecosystem, custom hooks, global state (Zustand/Redux), component styling systems.' },
      { stage: '3. Backend & API Engineering', description: 'RESTful architectures, authentication protocols, middleware, relational schemas, indexing.' },
      { stage: '4. Production DevOps & Scaling', description: 'Docker containerization, CI/CD GitHub Actions, Redis caching, cloud deployment on AWS/Vercel.' }
    ],
    whyJoin: [
      'Collaborate on the official DSDL portal and college production software used by thousands of students',
      'Build rich, interactive web apps and portfolio-defining full-stack projects',
      'Learn industry-standard clean architecture, Git team workflows, and code review standards',
      'Fast-track preparation for full-stack, frontend, and backend software engineering roles'
    ],
    examples: [
      'Real-Time Collaborative Code Editor with WebSockets & WebRTC',
      'DSDL Portal & Community Event Ticket Booking Management Platform',
      'High-Concurrency E-Commerce Microservices Engine with Redis Caching',
      'Interactive Student Portfolio & Resume Builder with Live Previews'
    ]
  },

  'dsa': {
    id: 'dsa',
    slug: 'dsa',
    name: 'Data Structures & Algorithms',
    tagline: 'Mastering problem-solving paradigms, computational efficiency, and technical interview mastery.',
    badge: 'Core Problem Solving',
    icon: 'Sparkles',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=80',
    description: 'Data Structures & Algorithms (DSA) form the mathematical and computational bedrock of computer science. Master how data is organized, stored, and operated on with minimal time and memory overhead.',
    keyTerms: [
      {
        term: 'Asymptotic Time & Space Complexity (Big-O)',
        explanation: 'The mathematical notation used to describe the limiting behavior and scalability of algorithms as input size N scales to infinity (e.g. O(1), O(log N), O(N), O(N log N), O(N²)).'
      },
      {
        term: 'Dynamic Programming (DP)',
        explanation: 'Breaking complex problems into overlapping subproblems with optimal substructure, solving each once and caching results via Memoization (top-down) or Tabulation (bottom-up).'
      },
      {
        term: 'Graph Algorithms & Traversals',
        explanation: 'Modeling connected networks with vertices and edges, executing BFS/DFS traversals, Dijkstra shortest paths, Minimum Spanning Trees (Kruskal/Prim), and Topological Sort.'
      },
      {
        term: 'Tree Data Structures & Tries',
        explanation: 'Hierarchical non-linear data structures including Binary Search Trees (BST), AVL/Red-Black self-balancing trees, Segment Trees, and prefix Tries for fast string matching.'
      },
      {
        term: 'Two Pointers & Sliding Window',
        explanation: 'High-frequency algorithmic optimization patterns that reduce brute-force O(N²) quadratic nested loops down to linear O(N) execution.'
      }
    ],
    techStack: ['C++', 'Java', 'Python', 'LeetCode', 'Codeforces', 'GDB Debugger', 'STL / Collections'],
    roadmap: [
      { stage: '1. Language & Basic Structures', description: 'C++/Java pointers/references, arrays, strings, bit manipulation, recursion, math fundamentals.' },
      { stage: '2. Linear & Non-Linear Structures', description: 'Linked lists, stacks, queues, hash maps, heaps, binary trees, BST.' },
      { stage: '3. Advanced Problem Paradigms', description: 'Greedy, divide & conquer, backtracking, dynamic programming, segment trees.' },
      { stage: '4. Graphs & Competitive Programming', description: 'Disjoint Set Union (DSU), shortest path algorithms, flow networks, contest strategies.' }
    ],
    whyJoin: [
      'Targeted problem-solving sprints and mock interview rooms for FAANG/product company placements',
      'Weekly LeetCode contest discussions, editorial breakdowns, and optimization deep-dives',
      'Learn competitive coding techniques directly from high-rated Codeforces/CodeChef club seniors',
      'Master the theoretical intuition behind complex algorithms to ace technical interviews'
    ],
    examples: [
      'Custom In-Memory Key-Value Store with LRU Cache & O(1) Operations',
      'Autonomous Pathfinding Visualizer (A*, Dijkstra, BFS, DFS)',
      'High-Speed Prefix Auto-Complete Engine using Compressed Tries',
      'Interval Scheduling & Network Packet Routing Simulation'
    ]
  },

  'deep-learning': {
    id: 'deep-learning',
    slug: 'deep-learning',
    name: 'Deep Learning',
    tagline: 'Architecting multi-layered neural networks for computer vision, generative AI, and LLMs.',
    badge: 'Neural Architectures',
    icon: 'Brain',
    coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1400&q=80',
    description: 'Deep Learning leverages deep neural architectures with millions to billions of parameters to learn hierarchical feature representations directly from raw perceptual data such as images, audio, video, and text.',
    keyTerms: [
      {
        term: 'Backpropagation & Gradient Descent',
        explanation: 'The mathematical engine of neural training: computing partial derivatives of loss with respect to weights via the chain rule, updated through optimizers like AdamW or SGD.'
      },
      {
        term: 'Convolutional Neural Networks (CNNs)',
        explanation: 'Spatial feature extractors utilizing sliding kernels, pooling, and receptive fields for image classification, object detection (YOLO), and segmentation (U-Net).'
      },
      {
        term: 'Transformers & Self-Attention',
        explanation: 'The foundation of modern LLMs (GPT, Claude, LLaMA) enabling parallel sequence processing by calculating how strongly each token attends to all other tokens.'
      },
      {
        term: 'Generative AI & Diffusion Models',
        explanation: 'Probabilistic generative frameworks that iteratively denoise Gaussian noise into photorealistic images, audio syntheses, or 3D assets.'
      },
      {
        term: 'Fine-Tuning & Quantization (LoRA / QLoRA)',
        explanation: 'Techniques for adapting massive pre-trained open-source LLMs to specific domains with minimal compute by updating low-rank parameter matrices.'
      }
    ],
    techStack: ['PyTorch', 'TensorFlow', 'Hugging Face', 'CUDA', 'TorchVision', 'LangChain', 'Ollama', 'Weights & Biases'],
    roadmap: [
      { stage: '1. Neural Foundations', description: 'Perceptrons, multi-layer perceptrons (MLP), activation functions (ReLU, GELU), loss functions.' },
      { stage: '2. Computer Vision', description: 'CNN architectures (ResNet, EfficientNet), data augmentation, transfer learning, object detection.' },
      { stage: '3. NLP & Sequence Models', description: 'Embeddings, RNNs/LSTMs, Transformer attention mechanisms, encoder-decoder models.' },
      { stage: '4. Modern Generative AI & MLOps', description: 'Diffusion models, LLM fine-tuning, RAG (Retrieval Augmented Generation), GPU acceleration with CUDA.' }
    ],
    whyJoin: [
      'Access to GPU compute workflows and deep-learning lab resources for large model training',
      'Build real-world GenAI products, RAG assistants, and vision pipelines',
      'Read and implement landmark papers from CVPR, NeurIPS, and ICLR',
      'Hands-on experience fine-tuning open-source LLMs (LLaMA, Mistral) and deploying inference pipelines'
    ],
    examples: [
      'Domain-Specific Multi-Modal AI Assistant with Retrieval-Augmented Generation (RAG)',
      'Real-Time Autonomous Drone Vision & Obstacle Avoidance using YOLOv8',
      'Medical Image Pathology Classifier with Grad-CAM Explainable AI',
      'Low-Latency Neural Speech Synthesis & Voice Cloning Engine'
    ]
  },

  'android-development': {
    id: 'android-development',
    slug: 'android-development',
    name: 'Android Development',
    tagline: 'Crafting fluid native mobile applications, reactive Jetpack Compose UIs, and connected Android experiences.',
    badge: 'Native Mobile Engineering',
    icon: 'Monitor',
    coverImage: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1400&q=80',
    description: 'Android Development focuses on creating high-performance, native mobile applications for the billions of devices running Android OS worldwide, utilizing modern declarative UI, coroutines, and Clean Architecture.',
    keyTerms: [
      {
        term: 'Jetpack Compose',
        explanation: 'Android’s modern declarative UI toolkit that accelerates and simplifies native UI design with Kotlin functions that dynamically describe app states.'
      },
      {
        term: 'Kotlin Coroutines & Flow',
        explanation: 'Lightweight asynchronous execution threads for non-blocking network calls, background computations, and reactive cold/hot stream processing.'
      },
      {
        term: 'MVVM & Clean Architecture',
        explanation: 'Separation of concerns into Presentation (UI/ViewModel), Domain (UseCases), and Data (Repository/Room/Retrofit) layers to ensure scalability and testability.'
      },
      {
        term: 'Room Database & Local Persistence',
        explanation: 'An abstraction layer over SQLite providing compile-time SQL verification, observable query streams with Flow, and offline-first cache synchronization.'
      },
      {
        term: 'Dependency Injection (Hilt / Dagger)',
        explanation: 'Standardized container injection patterns that decouple component lifecycles, simplify unit testing, and manage singleton services across Android components.'
      }
    ],
    techStack: ['Kotlin', 'Jetpack Compose', 'Android SDK', 'Coroutines & Flow', 'Retrofit', 'Room DB', 'Hilt / Koin', 'Firebase'],
    roadmap: [
      { stage: '1. Kotlin Fundamentals', description: 'Object-oriented & functional Kotlin, null safety, extension functions, lambdas, generics.' },
      { stage: '2. Declarative UI with Compose', description: 'Layouts, modifiers, state hoisting, animations, theme customization, navigation component.' },
      { stage: '3. Data & Networking Layer', description: 'REST API integration with Retrofit/Ktor, offline caching with Room DB, DataStore preferences.' },
      { stage: '4. Advanced Architecture & Play Store', description: 'Hilt dependency injection, background WorkManager, Firebase push notifications, APK release & profiling.' }
    ],
    whyJoin: [
      'Build and publish polished, production-grade Android apps to the Google Play Store',
      'Learn modern industry standard: Kotlin + Jetpack Compose + Clean Architecture',
      'Develop offline-first apps with hardware sensor integrations, Bluetooth, and notifications',
      'Prepare for native Android engineer positions at top product startups and enterprises'
    ],
    examples: [
      'Offline-First Campus Utility & Class Schedule Hub with Smart Reminders',
      'Real-Time Health & Fitness Tracker with Sensor Telemetry and Charts',
      'End-to-End Encrypted Peer-to-Peer Messaging Client via WebSockets',
      'Campus Food Ordering App with Real-Time Order Tracking & Payment Integration'
    ]
  }
};
