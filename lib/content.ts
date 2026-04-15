export const logs = [
  {
    id: "attempt-1-url-shortener",
    slug: "attempt-1-url-shortener",
    title: "Attempt 1: The Naive URL Shortener",
    date: "2026-04-22",
    project: "URL Shortener",
    status: "planned" as const,
    tags: ["node.js", "sqlite", "load-testing", "first-attempt"],
    summary: "Built a single-node URL shortener with SQLite. It worked perfectly — until it didn't. Broke at 180 concurrent requests.",
    content: `
## The Goal
Build the simplest possible URL shortener. No caching, no clustering, no magic. Just Node.js + SQLite and see what happens under real load.

## Architecture (v0.1)
Single Node.js server → SQLite database. That's it. No Redis, no clusters, no load balancer.

## What I Built
\`\`\`
POST /shorten  → generates a 6-char code, stores in SQLite
GET /:code     → looks up the code, redirects to original URL
\`\`\`

## The Load Test
Ran k6 with 200 virtual users for 30 seconds.

\`\`\`bash
k6 run --vus 200 --duration 30s script.js
\`\`\`

## Results
| Metric | Result |
|--------|--------|
| Requests/sec | ~180 |
| P95 Latency | 890ms |
| Error Rate | 34% |
| Broke at | ~180 concurrent users |

## Why It Broke
SQLite doesn't support concurrent writes. Every redirect (even a read!) was locking the database. Node.js event loop started queuing everything. Classic bottleneck.

## What I Learned
- SQLite is not meant for concurrent access
- The event loop doesn't magically handle I/O — blocking operations destroy throughput
- Load testing early reveals problems you'd never see in development

## Next Attempt
Migrating to PostgreSQL. A proper database with connection pooling.
`,
  },
  {
    id: "attempt-2-url-shortener",
    slug: "attempt-2-url-shortener",
    title: "Attempt 2: Switching to PostgreSQL",
    date: "2026-04-29",
    project: "URL Shortener",
    status: "planned" as const,
    tags: ["node.js", "postgresql", "connection-pooling"],
    summary: "SQLite couldn't handle concurrent writes. Time to bring in a real database and learn about connection pooling.",
    content: `Coming soon — working on this now.`,
  },
  {
    id: "attempt-3-url-shortener",
    slug: "attempt-3-url-shortener",
    title: "Attempt 3: Adding Redis Cache",
    date: "2026-05-06",
    project: "URL Shortener",
    status: "planned" as const,
    tags: ["redis", "caching", "postgresql"],
    summary: "PostgreSQL helped with writes but reads are still hitting the DB every time. Time to add Redis.",
    content: `Coming soon.`,
  },
];

export const projects = [
  {
    id: "url-shortener",
    name: "URL Shortener",
    description: "Building and rebuilding a URL shortener — from naive SQLite to Redis-cached, load-balanced production system.",
    status: "active" as const,
    tech: ["Node.js", "PostgreSQL", "Redis", "Docker", "k6"],
    logs: 1,
    startDate: "2026-04-22",
    what_im_learning: [
      "How databases handle concurrent requests",
      "Why caching exists and when to use it",
      "Load testing and reading metrics",
      "Docker containerization",
    ],
  },
  {
    id: "real-time-chat",
    name: "Real-time Chat App",
    description: "After the URL shortener, this will be the second rebuild — understanding WebSockets and horizontal scaling.",
    status: "planned" as const,
    tech: ["Node.js", "Socket.io", "Redis Pub/Sub", "Docker"],
    logs: 0,
    startDate: "2026-05-20",
    what_im_learning: [
      "WebSocket connections vs HTTP",
      "Redis Pub/Sub for cross-server messaging",
      "Stateful vs stateless servers",
      "Horizontal scaling challenges",
    ],
  },
  {
    id: "job-queue",
    name: "Background Job Queue",
    description: "Building a task queue system to learn async processing, worker pools, and failure handling.",
    status: "planned" as const,
    tech: ["Node.js", "BullMQ", "Redis", "PostgreSQL"],
    logs: 0,
    startDate: "2026-06-17",
    what_im_learning: [
      "Why background jobs exist",
      "Retry logic and failure handling",
      "Worker concurrency",
      "Job prioritization",
    ],
  },
];

export const articles = [
  {
    id: "vibe-coding-url-shortener",
    title: "I Broke My URL Shortener at 180 Requests. Here's What I Learned.",
    date: "2026-05-10",
    status: "planned" as const,
    tags: ["systems", "load-testing", "beginners", "learning-in-public"],
    summary: "I built a URL shortener in a weekend. Then I load tested it and it died. This is the story of why — and what SQLite, connection pools, and the Node.js event loop actually mean.",
    externalLink: null,
  },
  {
    id: "redis-vs-postgresql",
    title: "Redis vs PostgreSQL: When Do You Actually Need a Cache?",
    date: "2026-05-24",
    status: "planned" as const,
    tags: ["redis", "postgresql", "caching", "systems"],
    summary: "After adding Redis to my URL shortener, I finally understood why it exists. It's not just 'faster' — it's a completely different tool for a different job.",
    externalLink: null,
  },
  {
    id: "k6-load-testing-guide",
    title: "k6 Load Testing for People Who've Never Load Tested",
    date: "2026-06-07",
    status: "planned" as const,
    tags: ["k6", "load-testing", "beginners"],
    summary: "A practical guide to k6 for CS students who build things but have no idea if they'd survive real traffic.",
    externalLink: null,
  },
];

export const work = [
  {
    id: "collabboard",
    name: "CollabBoard",
    description: "Real-time collaborative project management app with Kanban boards, drag-and-drop tasks, an infinite canvas whiteboard, activity feeds, and analytics dashboards.",
    tech: ["React 18", "TypeScript", "Node.js", "Socket.io", "PostgreSQL", "Prisma", "Tailwind CSS", "JWT"],
    github: "https://github.com/dhairya-soni/CollabBoard",
    live: "https://collab-board-pink.vercel.app/",
    note: "Uses Socket.io internally — currently studying how this scales horizontally as part of Phase 2.",
    category: "fullstack",
  },
  {
    id: "codesync",
    name: "CodeSync — Collaborative Cloud IDE",
    description: "Production-grade real-time collaborative development environment. Synchronized multi-user editing via WebSockets, secure containerized code execution with Docker, and automated static analysis for algorithmic efficiency.",
    tech: ["React", "Node.js", "WebSocket", "Docker", "Flask"],
    github: "https://github.com/dhairya-soni/CodeSync-Collaborative-Cloud-IDE",
    live: null,
    note: null,
    category: "fullstack",
  },
  {
    id: "inidars",
    name: "INIDARS — Intrusion Detection & Response System",
    description: "Real-time network security system using Isolation Forest anomaly detection and rule-based classification to catch DDoS, brute force, and malware. Surfaces threat severity on an interactive React dashboard.",
    tech: ["Python", "Flask", "scikit-learn", "React", "REST API"],
    github: "https://github.com/dhairya-soni/Intelligent-Network-Intrusion-Detection-and-Automated-Response-System",
    live: null,
    note: null,
    category: "ml",
  },
  {
    id: "adaptive-vqc",
    name: "Adaptive VQCs for Hybrid Learning in NISQ Environments",
    description: "Benchmarked fixed vs adaptive Variational Quantum Circuits in Qiskit on the Iris dataset. The adaptive model achieved comparable accuracy (0.567 vs 0.600) while significantly reducing circuit depth — demonstrating viability on near-term quantum hardware.",
    tech: ["Qiskit", "PyTorch", "Python", "NumPy", "Quantum ML"],
    github: "https://github.com/dhairya-soni/Adaptive-Variational-Quantum-Circuits-for-Resource-Efficient-Hybrid-Learning-in-NISQ-Environments",
    live: null,
    note: "Research project — quantum computing meets ML.",
    category: "research",
  },
];

export const roadmap = [
  {
    phase: "Phase 1",
    label: "Systems Foundations",
    duration: "Weeks 1–4",
    status: "active" as const,
    items: ["URL Shortener (rebuild x4)", "PostgreSQL deep dive", "Redis fundamentals", "Docker basics", "k6 load testing"],
  },
  {
    phase: "Phase 2",
    label: "Distributed Systems",
    duration: "Weeks 5–8",
    status: "planned" as const,
    items: ["Real-time Chat App", "Redis Pub/Sub", "WebSocket scaling", "Horizontal vs vertical scaling", "Load balancer concepts"],
  },
  {
    phase: "Phase 3",
    label: "Production Patterns",
    duration: "Weeks 9–12",
    status: "planned" as const,
    items: ["Background Job Queue", "BullMQ + worker pools", "Monitoring with Winston", "Kubernetes intro", "System design interview prep"],
  },
];
