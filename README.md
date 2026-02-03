# LocalVibe AI 🌍✨

O **LocalVibe AI** é uma aplicação Fullstack que utiliza Inteligência Artificial para analisar a "vibe" e a infraestrutura de bairros ao redor do mundo. O projeto integra dados geográficos reais com modelos de linguagem de larga escala (LLM) para fornecer insights urbanos instantâneos.

## 🛠️ Stack Tecnológica

- **Frontend:** React.js, Tailwind CSS, Lucide React, Leaflet (Mapas).
- **Backend:** Elysia.js (Framework de alta performance para Bun).
- **Runtime:** Bun (Focado em velocidade e eficiência).
- **IA:** Groq Cloud (Modelo Llama 3.3-70b) para análise urbana.
- **Geocoding:** TomTom Search API.
- **Infraestrutura:** Docker & Docker Compose.

## 🏗️ Arquitetura e Decisões Técnicas

Durante o desenvolvimento, priorizei a **resiliência** e a **performance**:

1. **Elysia + Bun:** Escolhido pela baixíssima latência no processamento de requisições e tipagem nativa com TypeScript.
2. **Tratamento de Erros:** Implementação de lógica *fail-fast* no backend para validar coordenadas geográficas antes de processar chamadas de IA, economizando tokens e tempo de resposta.
3. **Resiliência de Rede:** Configuração customizada de DNS no Docker para garantir estabilidade em ambientes Linux (Fedora/RHEL), resolvendo gargalos comuns de resolução de nomes em containers.
4. **Normalização de Dados:** Mapeamento de esquemas proprietários (TomTom `lon` vs Leaflet `lng`) garantindo integridade na renderização do mapa.



## 🚀 Como Executar

### Pré-requisitos
- Docker & Docker Compose instalados.
- Chaves de API (TomTom e Groq).

### Instalação
1. Clone o repositório:
   ```bash
   git clone [https://github.com/seu-usuario/localvibe-ai.git](https://github.com/seu-usuario/localvibe-ai.git)
Configure o arquivo .env na pasta /backend:

Snippet de código

TOMTOM_API_KEY=sua_chave_aqui
GROQ_API_KEY=sua_chave_aqui
Inicie os containers:

Bash

docker compose up --build
Acesse o frontend em http://localhost:5173.

Desenvolvido por Thaynara - Systems Development Graduate.


---
<img width="1436" height="687" alt="Screenshot_20260203_115433" src="https://github.com/user-attachments/assets/e51596ce-6514-4ae5-bceb-093ed5df64e0" />


<img width="1719" height="893" alt="Screenshot_20260203_115511" src="https://github.com/user-attachments/assets/a0381fba-d626-463a-90a4-d485e6d9eabe" />




