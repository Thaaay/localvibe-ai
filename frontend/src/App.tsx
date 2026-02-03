import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { Search, MapPin, Star, Sparkles, Layers, Image as ImageIcon, Navigation, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import 'leaflet/dist/leaflet.css'



function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 15, { animate: true });
  return null;
}

function ProgressBar({ label, score, color }: { label: string, score: number, color: string }) {
  const width = (score / 10) * 100;
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1 text-sm font-medium">
        <span className="text-slate-300">{label}</span>
        <span className={color}>{score}/10</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ${color.replace('text', 'bg')}`}
          style={{ width: `${width}%` }}
        ></div>
      </div>
    </div>
  );
}


export default function App() {

  const { t, i18n } = useTranslation();

  const [bairro, setBairro] = useState('')
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState<any>(null)

  const toggleLanguage = () => {
    const newLang = i18n.language === 'pt' ? 'en' : 'pt';
    i18n.changeLanguage(newLang);
  };

  // Localize a função buscarVibe dentro do seu App() e substitua por esta:

  const buscarVibe = async () => {
    if (!bairro) return;
    setLoading(true);
    setResultado(null); // Limpa o resultado anterior antes de começar

    try {
      const res = await fetch(`http://localhost:3000/analisar?bairro=${bairro}&lang=${i18n.language}`);
      const data = await res.json();

      // Se o backend retornou erro (404, 500, etc)
      if (!res.ok || data.success === false) {
        alert(data.error || "Não foi possível carregar os dados desta localização.");
        setResultado(null); // Garante que o dashboard suma
        return;
      }

      // Sucesso: popula o dashboard
      setResultado(data);
    } catch (error) {
      console.error("Erro de conexão:", error);
      alert("Erro ao conectar com o servidor. Verifique se o backend está rodando.");
      setResultado(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-screen">

      {/* HEADER & BUSCA */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
        <div className="text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
              <Navigation size={48} className="text-blue-400" />
              LocalVibe AI
            </h1>
            {/* Botão de Troca de Idioma */}
            <button
              onClick={toggleLanguage}
              className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
            >
              {i18n.language === 'pt' ? '🇧🇷 PT' : '🇺🇸 EN'}
            </button>
          </div>

        </div>

        <div className="w-full md:w-[500px] relative group">
          <div className="relative flex bg-slate-900/90 backdrop-blur-xl border border-white/10 p-2 rounded-2xl items-center shadow-2xl">
            <Search className="text-slate-400 ml-3" size={24} />
            <input
              className="bg-transparent border-none outline-none px-4 py-2 w-full text-lg text-white placeholder-slate-500"
              placeholder={t('search_placeholder')}
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && buscarVibe()}
            />
            <button
              onClick={buscarVibe}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-3 px-6 rounded-xl transition-all font-bold shadow-lg disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent" /> : <Sparkles size={20} />}
              <span>{loading ? '...' : t('explore_btn')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* DASHBOARD */}
      {resultado && (
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-3xl border border-white/20 shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4 text-indigo-100 opacity-80">
                <Sparkles size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">{t('vibe_title')}</span>
              </div>
              <p className="text-3xl font-serif italic text-white leading-tight">"{resultado.vibe}"</p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-xl border-l-4 border-l-emerald-500">
              <div className="flex items-center gap-3 mb-6 text-emerald-400">
                <Zap size={24} />
                <h3 className="text-lg font-bold uppercase tracking-wider">{t('score_title')}</h3>
              </div>

              <ProgressBar label={t('safety')} score={resultado.scores?.seguranca || 0} color="text-emerald-400" />
              <ProgressBar label={t('cost')} score={resultado.scores?.custo_vida || 0} color="text-yellow-400" />
              <ProgressBar label={t('nightlife')} score={resultado.scores?.vida_noturna || 0} color="text-purple-400" />
              <ProgressBar label={t('culture')} score={resultado.scores?.cultura || 0} color="text-blue-400" />
            </div>
          </div>

          <div className="lg:col-span-5 min-h-[500px] bg-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <MapContainer center={[resultado.centro.lat, resultado.centro.lng]} zoom={15}>
              <ChangeView center={[resultado.centro.lat, resultado.centro.lng]} />
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
              {resultado.lugares_reais?.map((l: any, i: number) => (
                <Marker key={i} position={[l.lat, l.lng]}>
                  <Popup>{l.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div className="lg:col-span-3 flex flex-col gap-4 bg-slate-900/80 p-6 rounded-3xl border border-white/10 overflow-hidden">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4 px-2">
              <MapPin size={22} className="text-blue-500" /> {t('radar_title')}
            </h3>
            <div className="space-y-4 overflow-y-auto pr-2">
              {resultado.lugares_reais?.map((l: any, i: number) => (
                <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/[0.08] transition-all">
                  <div className="w-16 h-16 bg-slate-800 rounded-xl overflow-hidden shrink-0">
                    {l.photo ? (
                      <img src={`http://localhost:3000/foto?ref=${l.photo}`} className="w-full h-full object-cover" alt="" />
                    ) : <div className="w-full h-full flex items-center justify-center text-slate-600"><ImageIcon size={20} /></div>}
                  </div>
                  <div className="min-w-0 flex flex-col justify-center">
                    <h4 className="font-bold text-sm text-slate-200 truncate">{l.name}</h4>
                    <div className="flex items-center gap-1 text-yellow-500 text-xs mt-1">
                      <Star size={12} fill="currentColor" /> <span>{l.rating || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}
    </div>
  )
}