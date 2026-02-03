LocalVibe AI 🌍✨

LocalVibe AI is a full-stack application that uses Artificial Intelligence to analyze the "vibe" and infrastructure of neighborhoods around the world. The project integrates real geographic data with large-scale language models (LLM) to provide instant urban insights.

🛠️ Technology Stack
Frontend: React.js, Tailwind CSS, Lucide React, Leaflet (Maps).
Backend: Elysia.js (High-performance framework for Bun).
Runtime: Bun (Focused on speed and efficiency).
AI: Groq Cloud (Llama 3.3-70b model) for urban analysis.
Geocoding: TomTom Search API.
Infrastructure: Docker & Docker Compose.

🏗️ Architecture and Technical Decisions
During development, I prioritized resilience and performance:

Elysia + Bun: Chosen for its very low latency in request processing and native typing with TypeScript.
Error Handling: Implementation of fail-fast logic in the backend to validate geographic coordinates before processing AI calls, saving tokens and response time.
Network Resilience: Custom DNS configuration in Docker to ensure stability in Linux environments (Fedora/RHEL), resolving common name resolution bottlenecks in containers.
Data Normalization: Mapping of proprietary schemas (TomTom lon vs Leaflet lng) ensuring integrity in map rendering.

🚀 How to Run
Prerequisites
Docker & Docker Compose installed.
API keys (TomTom and Groq).

Installation
Clone the repository:
git clone [https://github.com/your-username/localvibe-ai.git](https://github.com/your-username/localvibe-ai.git)
Configure the .env file in the /backend folder:

Code snippet

TOMTOM_API_KEY=your_key_here GROQ_API_KEY=your_key_here Start the containers:

Bash

docker compose up --build Access the frontend at http://localhost:5173.

Developed by Thaynara - Systems Development Graduate.


---
<img width="1436" height="687" alt="Screenshot_20260203_115433" src="https://github.com/user-attachments/assets/e51596ce-6514-4ae5-bceb-093ed5df64e0" />


<img width="1719" height="893" alt="Screenshot_20260203_115511" src="https://github.com/user-attachments/assets/a0381fba-d626-463a-90a4-d485e6d9eabe" />




