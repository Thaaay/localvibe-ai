# 📍 LocalVibe AI
> **Urban insight powered by LLMs.** > An intelligent dashboard that analyzes neighborhood vibes using real-time data from Google Places and processing via Llama 3 on Groq Cloud.

![LocalVibe Banner](https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=1200&h=400)

---

## Project Vision
LocalVibe AI was developed to solve the "where to live/visit" dilemma. By combining raw geolocation data with the reasoning capabilities of Large Language Models (LLMs), it transforms a simple list of bars and parks into a nuanced "Vibe Score".

## 🚀 Tech Stack

### Frontend
- **React 18** + **Vite** (Ultra-fast HMR)
- **Tailwind CSS v4** (Modern utility-first styling)
- **Leaflet.js** (Interactive mapping)
- **i18next** (Full Internationalization: PT/EN)
- **Lucide React** (Consistent iconography)

### Backend
- **Bun** (Fastest JavaScript runtime)
- **ElysiaJS** (High-performance web framework)
- **Groq Cloud API** (Llama-3.3-70b-versatile model)
- **Google Places API** (Point of Interest source)

### Infrastructure
- **Docker** & **Docker Compose** (Containerized environment)
- **Fedora Linux** (Optimized development host)

---

## 🏗️ Architecture



1. **Client**: User searches for a neighborhood and chooses a language.
2. **Backend**: Fetches POIs from **Google Places API**.
3. **AI Layer**: Sends POIs and neighborhood names to **Groq**. The model analyzes the data and generates a structured JSON response (Vibe, Scores, Highlights).
4. **Photo Proxy**: Backend acts as a secure proxy to fetch Google photos without exposing API keys to the browser.
5. **Dashboard**: Frontend renders a Glassmorphic UI with animated progress bars and interactive maps.

---

## 🛠️ Getting Started

### Prerequisites
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- Google Cloud API Key (Places API enabled)
- Groq Cloud API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/your-username/localvibe-ai.git](https://github.com/your-username/localvibe-ai.git)
   cd localvibe-ai
Configure Environment Variables Create a .env file in the root directory:

Snippet de código

GROQ_API_KEY=gsk_your_key_here
GOOGLE_MAPS_API_KEY=AIzaSy_your_key_here
Launch with Docker

Bash

docker compose up --build
Access the App

Frontend: http://localhost:5173

Backend API: http://localhost:3000

🛡️ Key Features
Vibe Score: Automated ratings for Safety, Cost of Living, Nightlife, and Culture.

Photo Privacy: Secure image loading through an internal proxy.

Multilingual Support: Real-time toggle between Portuguese and English, including AI-translated insights.

Glassmorphism UI: High-end modern design with blur effects and dark mode.

Interactive Radar: Real-time POI display with star ratings.

📄 License
Distributed under the MIT License. See LICENSE for more information.

Developed with ❤️ on Fedora Linux.