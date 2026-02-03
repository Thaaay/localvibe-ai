import { Elysia, t } from 'elysia'
import { cors } from '@elysiajs/cors'

const app = new Elysia()
    .use(cors())
    .get("/analisar", async ({ query, set }) => {
        try {
            const { bairro, lang = 'pt' } = query;
            const TOMTOM_KEY = Bun.env.TOMTOM_API_KEY?.trim();
            const GROQ_KEY = Bun.env.GROQ_API_KEY?.trim();

            if (!TOMTOM_KEY || !GROQ_KEY) {
                set.status = 500;
                return { success: false, error: "Configuração de API pendente." };
            }

            const tomtomUrl = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(bairro)}.json?key=${TOMTOM_KEY}&limit=10`;
            const ttRes = await fetch(tomtomUrl);
            
            if (!ttRes.ok) {
                set.status = 502;
                return { success: false, error: "Falha na comunicação com serviço de mapas." };
            }

            const ttData: any = await ttRes.json();

            // Validação de localização vazia
            if (!ttData.results || ttData.results.length === 0) {
                set.status = 404;
                return { success: false, error: "Localização não encontrada. Tente um nome mais específico." };
            }

            const locais = ttData.results.map((r: any) => r.poi?.name || r.address?.freeformAddress).join(", ");
            const pos = ttData.results[0].position;

            const promptIA = `Analise o bairro "${bairro}" baseado em: ${locais}. Idioma: ${lang}. Retorne JSON: vibe, pontos_fortes (array), scores (objeto).`;

            const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_KEY}` },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { role: "system", content: "Expert urbanista. Saída apenas JSON puro." },
                        { role: "user", content: promptIA }
                    ],
                    response_format: { type: "json_object" },
                    temperature: 0.1
                })
            });

            const aiData: any = await aiRes.json();
            const analiseIA = JSON.parse(aiData.choices[0].message.content);

            // Resposta de sucesso
            return {
                success: true,
                bairro,
                vibe: analiseIA.vibe,
                pontos_fortes: analiseIA.pontos_fortes,
                scores: analiseIA.scores,
                centro: { lat: pos.lat, lng: pos.lon },
                lugares_reais: ttData.results.map((l: any) => ({
                    name: l.poi?.name || l.address?.freeformAddress || "Local",
                    address: l.address?.freeformAddress,
                    lat: l.position.lat,
                    lng: l.position.lon,
                    category: l.poi?.categories?.[0] || "Ponto de Interesse"
                }))
            };

        } catch (error: any) {
            set.status = 500;
            return { success: false, error: "Erro interno no processamento." };
        }
    }, {
        query: t.Object({ bairro: t.String(), lang: t.Optional(t.String()) })
    })
    .listen(3000)