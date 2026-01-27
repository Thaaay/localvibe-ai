import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  lng: 'pt', // Idioma padrão
  fallbackLng: 'pt',
  interpolation: { escapeValue: false },
  resources: {
    pt: {
      translation: {
        search_placeholder: "Digite um bairro (ex: Leblon)...",
        explore_btn: "Explorar",
        vibe_title: "A Vibe do Bairro",
        score_title: "Vibe Score",
        radar_title: "Locais Reais",
        safety: "🛡️ Segurança",
        cost: "💰 Custo de Vida",
        nightlife: "🍸 Vida Noturna",
        culture: "🎨 Cultura & Lazer"
      }
    },
    en: {
      translation: {
        search_placeholder: "Enter a neighborhood (e.g. Brooklyn)...",
        explore_btn: "Explore",
        vibe_title: "Neighborhood Vibe",
        score_title: "Vibe Score",
        radar_title: "Real Places",
        safety: "🛡️ Safety",
        cost: "💰 Cost of Living",
        nightlife: "🍸 Nightlife",
        culture: "🎨 Culture & Leisure"
      }
    }
  }
});

export default i18n;