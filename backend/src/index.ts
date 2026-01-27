
import { Elysia, t } from 'elysia'
import { cors } from '@elysiajs/cors'

const app = new Elysia()
    .use(cors())
    .get("/analisar", async ({ query, set }) => {
        try {
          
            const { bairro, lang = 'pt' } = query;
            const GROQ_KEY = Bun.env.GROQ_API_KEY;
            const GOOGLE_KEY = Bun.env.GOOGLE_MAPS_API_KEY;

            if (!GROQ_KEY || !GOOGLE_KEY) {
                set.status = 500;
                return { error: "Chaves de API não configuradas corretamente no .env" };
            }

            // 1. Busca no Google Places
            const googleRes = await fetch(
                `https://maps.googleapis.com/maps/api/place/textsearch/json?query=pontos+de+interesse+em+${bairro}&key=${GOOGLE_KEY}`
            );
            const googleData: any = await googleRes.json();
            
            if (googleData.status === "REQUEST_DENIED") {
                set.status = 500;
                return { error: "Google API Error", details: googleData.error_message };
            }

            const locais = googleData.results?.slice(0, 10).map((p: any) => p.name).join(", ") || "informação local limitada";

            // 2. Prompt Dinâmico (IA traduz de acordo com o parâmetro 'lang')
            const promptIA = `Analise o bairro "${bairro}" baseado nestes pontos de interesse: ${locais}.
            Sua resposta DEVE ser obrigatoriamente no idioma: ${lang === 'en' ? 'Inglês (English)' : 'Português do Brasil'}.
            
            Retorne APENAS um JSON puro no seguinte formato:
            {
              "vibe": "uma frase curta e impactante descrevendo o bairro",
              "pontos_fortes": ["item 1", "item 2", "item 3"],
              "scores": {
                "seguranca": 1-10,
                "custo_vida": 1-10,
                "vida_noturna": 1-10,
                "cultura": 1-10
              }
            }`;

            // 3. Chamada para a GROQ
            const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${GROQ_KEY}`
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { role: "system", content: "Você é um urbanista expert que analisa bairros. Responda APENAS com JSON." },
                        { role: "user", content: promptIA }
                    ],
                    response_format: { type: "json_object" },
                    temperature: 0.7
                })
            });

            const aiData: any = await aiRes.json();
            
            if (aiData.error) {
                set.status = 500;
                return { error: "Groq API Error", details: aiData.error.message };
            }

            const analiseIA = JSON.parse(aiData.choices[0].message.content);

            // 4. Retorno Final
            return {
                bairro,
                vibe: analiseIA.vibe,
                pontos_fortes: analiseIA.pontos_fortes,
                scores: analiseIA.scores,
                centro: googleData.results?.[0]?.geometry?.location || { lat: -23.5505, lng: -46.6333 },
                lugares_reais: googleData.results?.slice(0, 8).map((l: any) => ({
                    name: l.name,
                    rating: l.rating,
                    address: l.vicinity,
                    lat: l.geometry.location.lat,
                    lng: l.geometry.location.lng,
                    photo: l.photos?.[0]?.photo_reference
                }))
            };

        } catch (error: any) {
            set.status = 500;
            console.error("ERRO BACKEND:", error.message);
            return { error: "Erro interno no servidor", details: error.message };
        }
    }, {
        // Validação dos parâmetros de busca
        query: t.Object({
            bairro: t.String(),
            lang: t.Optional(t.String())
        })
    })

    // ROTA DE FOTOS (Proxy seguro)
    .get("/foto", async ({ query, set }) => {
        try {
            const { ref } = query;
            const GOOGLE_KEY = Bun.env.GOOGLE_MAPS_API_KEY;

            if (!ref) return { error: "Referência da foto necessária" };

            const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=${GOOGLE_KEY}`;

            const response = await fetch(url);
            
            if (!response.ok) throw new Error("Falha ao buscar imagem no Google");

            const imageBuffer = await response.arrayBuffer();
            set.headers['content-type'] = 'image/jpeg';
            return imageBuffer;
        } catch (e: any) {
            set.status = 404;
            return { error: "Imagem não encontrada" };
        }
    }, {
        query: t.Object({ ref: t.String() })
    })
    .listen(3000)

console.log("🚀 LocalVibe Backend rodando na porta 3000");