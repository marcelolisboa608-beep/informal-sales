import dotenv from "dotenv";
dotenv.config();

import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

console.log("Minha chave Groq:", process.env.GROQ_API_KEY);


app.post("/api/explicar-semana", async (req, res) => {
    try {
        const {
            semanaAtual,
            semanaPassada,
            totalAtual,
            totalPassado,
            crescimento,
            melhorDia,
            piorDia
        } = req.body;

        const prompt = `
Você é um assistente de análise de dados para um painel de vendas.

Explique de forma simples e clara os dados abaixo para um gestor que
não entende gráficos (Estamos em Angola a moeda é Kz) :

SEMANA ATUAL - GANHOS POR DIA (COM OS DIAS SEG A DOM):
${semanaAtual.map(d => `- ${d.dia}: ${d.valor} Kz`).join("\n")}

SEMANA PASSADA - GANHOS POR DIA (COM OS DIAS SEG A DOM):
${semanaPassada.map(d => `- ${d.dia}: ${d.valor} Kz`).join("\n")}

OBS: onde tem 0 significa que naquele dia faturou-se 0Kz.

Resumo:
- Total semana atual: ${totalAtual} Kz
- Total semana passada: ${totalPassado} Kz
- Crescimento: ${crescimento}
- Melhor dia da semana atual: ${melhorDia}
- Pior dia da semana atual: ${piorDia}

Gere uma explicação curta (máx. 3 frases),
em português simples, tom profissional e amigável.
Não use termos técnicos.
`;

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.5
                })
            }
        );

        const data = await response.json();

        res.json({
            texto: data.choices[0].message.content
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro interno" });
    }
});



// ----------------------
// Endpoint: explicação mensal
// ----------------------
app.post("/api/explicacao-mes", async (req, res) => {
    try {
        const {
            mediasAtual,
            mediasPassado,
            totalAtual,
            totalPassado,
            crescimento,
            melhorSemana,
            piorSemana
        } = req.body;

        const prompt = `
Você é um assistente de análise de dados para um painel de vendas.

Explique de forma simples e clara os dados abaixo para um gestor que
não entende gráficos (Estamos em Angola a moeda é Kz) :

MÉDIAS SEMANAIS DO MÊS ATUAL:
${mediasAtual.map((v, i) => `- Sem ${i + 1}: ${v.toFixed(0)} Kz`).join("\n")}

MÉDIAS SEMANAIS DO MÊS PASSADO:
${mediasPassado.map((v, i) => `- Sem ${i + 1}: ${v.toFixed(0)} Kz`).join("\n")}

Resumo:
- Total mês atual: ${totalAtual.toFixed(0)} Kz
- Total mês passado: ${totalPassado.toFixed(0)} Kz
- Crescimento: ${crescimento}
- Melhor semana do mês atual: ${melhorSemana} com média ${mediasAtual[melhorSemana.replace("Sem ", "") - 1].toFixed(0)} Kz
- Pior semana do mês atual: ${piorSemana} com média ${mediasAtual[piorSemana.replace("Sem ", "") - 1].toFixed(0)} Kz

Gere uma explicação curta (máx. 3 frases),
em português simples, tom profissional e amigável.
Não use termos técnicos.
`;

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.5
                })
            }
        );

        const data = await response.json();

        res.json({ texto: data.choices[0].message.content });

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro interno" });
    }
});


// ----------------------
// Endpoint: explicação categoria crescimento
// ----------------------

app.post("/api/explicacao-crescimento-categoria", async (req, res) => {
    try {
        const { resumoCategorias, totalMesAtual, totalMesPassado, crescimentoTotal } = req.body;

        const prompt = `
Você é um assistente de análise de dados para um painel de vendas.

Explique de forma simples e clara os dados abaixo para um gestor que não entende gráficos.
(Estamos em Angola, a moeda é Kz).

CRESCIMENTO POR CATEGORIA - MÊS ATUAL VS MÊS PASSADO:
${resumoCategorias.map(c => `- ${c.categoria}: Mês Passado ${c.mesPassado} Kz, Mês Atual ${c.mesAtual} Kz, Crescimento ${c.crescimento}%`).join("\n")}

Resumo Geral:
- Total Mês Atual: ${totalMesAtual} Kz
- Total Mês Passado: ${totalMesPassado} Kz
- Crescimento Total: ${crescimentoTotal}%

Gere uma explicação curta (máx. 3 frases), em português simples, tom profissional e amigável.
Não use termos técnicos.
`;

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.5
                })
            }
        );

        const data = await response.json();

        res.json({
            texto: data.choices[0].message.content
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro interno" });
    }
});


// ----------------------
// Endpoint: explicação vendas últimos 7 dias
// ----------------------

app.post("/api/explicacao-vendas-ultimos-7-dias", async (req, res) => {
    try {
        const { labels, data, total, crescimento, melhorDia, piorDia } = req.body;

        const prompt = `
Você é um assistente de análise de dados para um painel de vendas.

Explique de forma simples e clara os dados abaixo para um gestor que
não entende gráficos. (Estamos em Angola, a moeda é Kz)

VENDAS ÚLTIMOS 7 DIAS:
${labels.map((dia, i) => `- ${dia}: ${data[i]} Kz`).join("\n")}

Resumo:
- Total nos últimos 7 dias: ${total} Kz
- Crescimento do primeiro para o último dia: ${crescimento}
- Melhor dia: ${melhorDia}
- Pior dia: ${piorDia}

Gere uma explicação curta (máx. 3 frases), em português simples, tom profissional e amigável.
Não use termos técnicos.
`;

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.5
                })
            }
        );

        const dataLLM = await response.json();

        res.json({
            texto: dataLLM.choices[0].message.content
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro interno" });
    }
});




// ----------------------
// TOP 5 PRODUTOS MAIS VENDIDOS
// ----------------------

app.post("/api/explicacao-top5-produtos-mais-vendidos", async (req, res) => {
    try {
        const { produtos, totalVendido, produtoMaisVendido, produtoMenosVendido } = req.body;

        const prompt = `
Você é um assistente de análise de dados para um painel de vendas.

Explique de forma simples e clara os dados abaixo para um gestor que
não entende gráficos. (Estamos em Angola, a moeda é Kz)

TOP 5 PRODUTOS MAIS VENDIDOS:
${produtos.map(p => `- ${p.nome}: ${p.quantidade} unidades`).join("\n")}

Resumo:
- Total de unidades vendidas: ${totalVendido}
- Produto mais vendido: ${produtoMaisVendido}
- Produto menos vendido: ${produtoMenosVendido}

Gere uma explicação curta (máx. 3 frases), em português simples, tom profissional e amigável.
Não use termos técnicos.
`;

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.5
                })
            }
        );

        const dataLLM = await response.json();

        res.json({
            texto: dataLLM.choices[0].message.content
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro interno" });
    }
});



// ----------------------
// TOP 5 PRODUTOS MAIS LUCRATIVOS
// ----------------------

app.post("/api/explicacao-top5-produtos-mais-lucrativos", async (req, res) => {
    try {
        const { produtos, totalLucro, produtoMaisLucrativo, produtoMenosLucrativo } = req.body;

        const prompt = `
Você é um assistente de análise de dados para um painel de vendas.

Explique de forma simples e clara os dados abaixo para um gestor que
não entende gráficos. (Estamos em Angola, a moeda é Kz)

TOP 5 PRODUTOS MAIS LUCRATIVOS:
${produtos.map(p => `- ${p.nome}: ${p.lucro} Kz`).join("\n")}

Resumo:
- Lucro total dos top 5 produtos: ${totalLucro} Kz
- Produto mais lucrativo: ${produtoMaisLucrativo}
- Produto menos lucrativo: ${produtoMenosLucrativo}

Gere uma explicação curta (máx. 3 frases), em português simples, tom profissional e amigável.
Não use termos técnicos.
`;

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.5
                })
            }
        );

        const dataLLM = await response.json();

        res.json({
            texto: dataLLM.choices[0].message.content
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro interno" });
    }
});



// ----------------------
// TOP 5 CATEGORIAS MAIS LUCRATIVAS
// ----------------------

app.post("/api/explicacao-top5-categorias-mais-lucrativas", async (req, res) => {
    try {
        const { categorias, totalLucro, categoriaMaisLucrativa, categoriaMenosLucrativa } = req.body;

        const prompt = `
Você é um assistente de análise de dados para um painel de vendas.

Explique de forma simples e clara os dados abaixo para um gestor que
não entende gráficos. (Estamos em Angola, a moeda é Kz)

TOP 5 CATEGORIAS MAIS LUCRATIVAS:
${categorias.map(c => `- ${c.nome}: ${c.lucro} Kz`).join("\n")}

Resumo:
- Lucro total das top 5 categorias: ${totalLucro} Kz
- Categoria mais lucrativa: ${categoriaMaisLucrativa}
- Categoria menos lucrativa: ${categoriaMenosLucrativa}

Gere uma explicação curta (máx. 3 frases), em português simples, tom profissional e amigável.
Não use termos técnicos.
`;

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.5
                })
            }
        );

        const dataLLM = await response.json();

        res.json({
            texto: dataLLM.choices[0].message.content
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro interno" });
    }
});



// ----------------------
// RECOMENDAÇÕES GERAIS
// ----------------------


app.post("/api/recomendacoes-gerais", async (req, res) => {
    try {
        const {
            resumoSemana,
            resumoMes,
            resumoVendas7Dias,
            resumoTop5Produtos,
            resumoTop5ProdutosLucrativos,
            resumoTop5CategoriasLucrativas,
            resumoCrescimentoCategoria
        } = req.body;

        const headers = {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json"
        };

        // ------------------------------------------------
        // 1️⃣ Recomendação baseada nas vendas recentes
        // ------------------------------------------------
        const promptVendas = `
Você é um consultor de vendas.

Dados dos últimos 7 dias (Kz):
${resumoVendas7Dias.labels.map((d, i) => `- ${d}: ${resumoVendas7Dias.data[i]} Kz`).join("\n")}

Resumo:
- Total: ${resumoVendas7Dias.total} Kz
- Crescimento: ${resumoVendas7Dias.crescimento}
- Melhor dia: ${resumoVendas7Dias.melhorDia}
- Pior dia: ${resumoVendas7Dias.piorDia}

Dê uma recomendação prática (máx. 2 frases) para melhorar as vendas nos próximos dias.
Português simples, tom profissional.
`;

        // ------------------------------------------------
        // 2️⃣ Recomendação baseada em produtos
        // ------------------------------------------------
        const promptProdutos = `
Você é um consultor de estoque e produtos.

Top 5 produtos mais vendidos:
${resumoTop5Produtos.produtos.map(p => `- ${p.nome}: ${p.quantidade} unidades`).join("\n")}

Top 5 produtos mais lucrativos:
${resumoTop5ProdutosLucrativos.produtos.map(p => `- ${p.nome}: ${p.lucro} Kz`).join("\n")}

Crie uma recomendação curta sobre:
- aumentar, reduzir ou promover produtos.
Máx. 2 frases, linguagem simples.
`;

        // ------------------------------------------------
        // 3️⃣ Recomendação baseada em categorias
        // ------------------------------------------------
        const promptCategorias = `
Você é um analista de desempenho por categoria.

Categorias que cresceram:
${resumoCrescimentoCategoria.categoriasPositivas.join(", ")}

Categorias que caíram:
${resumoCrescimentoCategoria.categoriasNegativas.join(", ")}

Top categorias mais lucrativas:
${resumoTop5CategoriasLucrativas.categorias.map(c => `- ${c.nome}: ${c.lucro} Kz`).join("\n")}

Dê uma recomendação estratégica sobre foco em categorias.
Máx. 2 frases.
`;

        // ------------------------------------------------
        // 4️⃣ Recomendação estratégica geral
        // ------------------------------------------------
        const promptEstrategia = `
Você é um gestor experiente de negócios.

Resumo geral:
- Crescimento semanal: ${resumoSemana.crescimento}
- Crescimento mensal: ${resumoMes.crescimento}
- Total mês atual: ${resumoMes.totalAtual} Kz

Com base nisso, dê uma recomendação geral
(ex: operação, horários, promoções, clima, planeamento).
Máx. 2 frases, tom executivo e claro.
`;

        async function chamarLLM(prompt) {
            const response = await fetch(
                "https://api.groq.com/openai/v1/chat/completions",
                {
                    method: "POST",
                    headers,
                    body: JSON.stringify({
                        model: "llama-3.1-8b-instant",
                        messages: [{ role: "user", content: prompt }],
                        temperature: 0.5
                    })
                }
            );
            const data = await response.json();
            return data.choices[0].message.content.trim();
        }

        // 🚀 Executar as 4 chamadas
        const [
            recomendacaoVendas,
            recomendacaoProdutos,
            recomendacaoCategorias,
            recomendacaoOperacional
        ] = await Promise.all([
            chamarLLM(promptVendas),
            chamarLLM(promptProdutos),
            chamarLLM(promptCategorias),
            chamarLLM(promptEstrategia)
        ]);

        res.json({
            recomendacaoVendas,
            recomendacaoProdutos,
            recomendacaoCategorias,
            recomendacaoOperacional
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao gerar recomendações" });
    }
});



app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});

