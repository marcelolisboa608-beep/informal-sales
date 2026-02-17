
// ---------------------------------------------
// RENDERIZAR VENDAS (mais recentes primeiro)
// ---------------------------------------------

// 📌 Configurações
let vendasPorPagina = 4;
let currentValueVendas = 1;

// 📌 Referências
const tbodyVendas = document.querySelector(".order table tbody");
const paginationUL = document.querySelector(".pagination ul");

// 📌 Converter "DD-MM-YYYY HH:MM" → Date
function parseDataHora(dataHoraStr) {
    const [data, hora] = dataHoraStr.split(" ");
    const [dia, mes, ano] = data.split("-").map(Number);
    const [horas, minutos] = hora.split(":").map(Number);
    return new Date(ano, mes - 1, dia, horas, minutos);
}

// 📌 Ordenar vendas por data (mais recentes primeiro)
function getVendasOrdenadasPorData() {
    return [...vendas].sort((a, b) => {
        return parseDataHora(b.dataHora) - parseDataHora(a.dataHora);
    });
}


// 📌 Renderizar vendas
function renderVendas(page = 1) {
    tbodyVendas.innerHTML = "";

    const vendasOrdenadas = getVendasOrdenadasPorData();

    const start = (page - 1) * vendasPorPagina;
    const end = start + vendasPorPagina;

    const vendasPagina = vendasOrdenadas.slice(start, end);

    vendasPagina.forEach(venda => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td data-label="Produto">
                <img src="${venda.img}" alt="${venda.nomeProduto}">
                <p>${venda.nomeProduto}</p>
            </td>
            <td data-label="ID da Venda"><span class="codigo-produto">${venda.ID}</span></td>
            <td data-label="Tipo de Pag">
                <span class="pagamento ${getTipoPagamentoClass(venda.tipoPagamento)}">
                    ${venda.tipoPagamento}
                </span>
            </td>
            <td data-label="Qtd">${venda.quantidade}</td>
            <td data-label="Preço Unit">${venda.precoUnit.toLocaleString()} Kz</td>
            <td data-label="Total">
                <span class="codigo-produto">
                    ${venda.precoTotal.toLocaleString()} Kz
                </span>
            </td>
            <td data-label="Data/Hora">${venda.dataHora}</td>
            <td data-label="Categoria">
                <span class="category ${getCategoriaClass(venda.categoria)}">
                    ${venda.categoria}
                </span>
            </td>
        `;
        tbodyVendas.appendChild(tr);
    });
}


// 📌 Paginação
function renderVendasPagination() {
    paginationUL.innerHTML = "";

    const totalPages = Math.ceil(vendas.length / vendasPorPagina);

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement("li");
        li.classList.add("link");
        if (i === currentValueVendas) li.classList.add("active");
        li.textContent = i;

        li.addEventListener("click", () => {
            currentValueVendas = i;
            renderVendas(currentValueVendas);
            renderVendasPagination();
        });

        paginationUL.appendChild(li);
    }
}

// 📌 Botões Prev / Next
document.querySelector(".btn1").addEventListener("click", () => {
    if (currentValueVendas > 1) {
        currentValueVendas--;
        renderVendas(currentValueVendas);
        renderVendasPagination();
    }
});

document.querySelector(".btn2").addEventListener("click", () => {
    const totalPages = Math.ceil(
        getVendasOrdenadasPorData().length / vendasPorPagina
    );

    if (currentValueVendas < totalPages) {
        currentValueVendas++;
        renderVendas(currentValueVendas);
        renderVendasPagination();
    }
});


// 📌 Inicialização
renderVendas(currentValueVendas);
renderVendasPagination();




// ---------------------------------------------
// Vendas diárias (Últimos 7 dias) - LLM
// ---------------------------------------------

function gerarVendasUltimos7DiasAux(vendas) {
    const hoje = new Date();
    const diasLabels = [];
    const ganhos = [];

    // Criar um mapa para somar vendas por data exata
    const vendasPorData = {};

    vendas.forEach(v => {
        const [data] = v.dataHora.split(" "); // "DD-MM-YYYY"
        vendasPorData[data] = (vendasPorData[data] || 0) + v.precoTotal;
    });

    // Gerar últimos 7 dias (hoje até 6 dias atrás)
    for (let i = 6; i >= 0; i--) {
        const data = new Date(hoje);
        data.setDate(hoje.getDate() - i);

        const dia = String(data.getDate()).padStart(2, "0");
        const mes = String(data.getMonth() + 1).padStart(2, "0");
        const ano = data.getFullYear();

        const dataStr = `${dia}-${mes}-${ano}`;
        diasLabels.push(getDiaSemanaAbreviado(dataStr + " 00:00")); // Dia abreviado
        ganhos.push(vendasPorData[dataStr] || 0); // Soma total do dia ou 0
    }

    return { labels1: diasLabels, data1: ganhos };
}


function gerarResumoVendasUltimos7Dias(labels, data) {
    const total = data.reduce((a, b) => a + b, 0);

    const crescimento = data[0] === 0
        ? ((data[data.length - 1]) * 100 / 1).toFixed(1) // evita divisão por 0
        : (((data[data.length - 1] - data[0]) / data[0]) * 100).toFixed(1);

    const melhorDiaIndex = data.indexOf(Math.max(...data));
    const piorDiaIndex = data.indexOf(Math.min(...data));

    return {
        labels,    // dias abreviados
        data,      // ganhos diários
        total,
        crescimento: crescimento + "%",
        melhorDia: labels[melhorDiaIndex],
        piorDia: labels[piorDiaIndex]
    };
}


let { labels1, data1 } = gerarVendasUltimos7DiasAux(vendas);
const resumoIA = gerarResumoVendasUltimos7Dias(labels1, data1);
console.log(resumoIA);

async function gerarExplicacao(resumo) {
    const res = await fetch("https://api1-informal-sales.onrender.com/api/explicacao-vendas-ultimos-7-dias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumo)
    });

    const data = await res.json();
    return data.texto;
}

(async () => {
    try {
        const textoIA = await gerarExplicacao(resumoIA);

        // 1️⃣ Selecionar o card do recomendado
        const cardDesc = document.querySelector(".recommend-card.pricing .desc");

        // 2️⃣ Preencher com o texto gerado pela IA
        if (cardDesc) {
            cardDesc.textContent = textoIA;
        }

    } catch (err) {
        console.error("Erro ao gerar explicação:", err);
    }
})();


// ---------------------------------------------
// TOP 5 PRODUTOS MAIS VENDIDOS
// ---------------------------------------------

function gerarTop5ProdutosAux(vendas) {
    const quantidadePorProduto = {};

    // Somar quantidade de cada produto
    vendas.forEach(v => {
        quantidadePorProduto[v.nomeProduto] = (quantidadePorProduto[v.nomeProduto] || 0) + v.quantidade;
    });

    // Ordenar por quantidade decrescente e pegar os top 5
    const top5 = Object.entries(quantidadePorProduto)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    // Separar nomes e quantidades
    const labels2 = top5.map(item => item[0]);
    const data2 = top5.map(item => item[1]);

    return { labels2, data2 };
}

function gerarResumoTop5Produtos(labels, data) {
    const totalVendido = data.reduce((a, b) => a + b, 0);

    return {
        produtos: labels.map((nome, i) => ({
            nome,
            quantidade: data[i]
        })),
        totalVendido,
        produtoMaisVendido: labels[data.indexOf(Math.max(...data))],
        produtoMenosVendido: labels[data.indexOf(Math.min(...data))]
    };
}

const { labels2, data2 } = gerarTop5ProdutosAux(vendas);

const resumoIA1 = gerarResumoTop5Produtos(labels2, data2);
console.log(resumoIA1);


async function gerarExplicacao1(resumo) {
    const res = await fetch("https://api1-informal-sales.onrender.com/api/explicacao-top5-produtos-mais-vendidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumo)
    });

    const data = await res.json();
    return data.texto;
}

(async () => {
    try {
        const textoIA = await gerarExplicacao1(resumoIA1);

        // 1️⃣ Selecionar o card do recomendado
        const cardDesc = document.querySelector(".recommend-card.weather .desc");

        // 2️⃣ Preencher com o texto gerado pela IA
        if (cardDesc) {
            cardDesc.textContent = textoIA;
        }

    } catch (err) {
        console.error("Erro ao gerar explicação:", err);
    }
})();



// ---------------------------------------------
// TOP 5 PRODUTOS MAIS LUCRATIVOS
// ---------------------------------------------

function gerarTop5ProdutosMaisLucrativosAux(vendas) {
    // Somar lucro total por produto
    const lucroPorProduto = {};

    vendas.forEach(v => {
        lucroPorProduto[v.nomeProduto] = (lucroPorProduto[v.nomeProduto] || 0) + v.precoTotal;
    });

    // Ordenar os produtos pelo lucro e pegar os 5 primeiros
    const top5 = Object.entries(lucroPorProduto)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    // Separar nomes e valores para o gráfico
    const labels3 = top5.map(item => item[0]);
    const data3 = top5.map(item => item[1]);

    return { labels3, data3 };
}

function gerarResumoTop5ProdutosLucrativos(labels, data) {
    const totalLucro = data.reduce((a, b) => a + b, 0);

    return {
        produtos: labels.map((nome, i) => ({
            nome,
            lucro: data[i]
        })),
        totalLucro,
        produtoMaisLucrativo: labels[data.indexOf(Math.max(...data))],
        produtoMenosLucrativo: labels[data.indexOf(Math.min(...data))]
    };
}


const { labels3, data3 } = gerarTop5ProdutosMaisLucrativosAux(vendas);
const resumoIA2 = gerarResumoTop5ProdutosLucrativos(labels3, data3);
console.log(resumoIA2);


async function gerarExplicacao2(resumo) {
    const res = await fetch("https://api1-informal-sales.onrender.com/api/explicacao-top5-produtos-mais-lucrativos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumo)
    });

    const data = await res.json();
    return data.texto;
}

(async () => {
    try {
        const textoIA = await gerarExplicacao2(resumoIA2);

        // 1️⃣ Selecionar o card do recomendado
        const cardDesc = document.querySelector(".recommend-card.stock .desc");

        // 2️⃣ Preencher com o texto gerado pela IA
        if (cardDesc) {
            cardDesc.textContent = textoIA;
        }

    } catch (err) {
        console.error("Erro ao gerar explicação:", err);
    }
})();



// ---------------------------------------------
// TOP 5 CATEGORIAS MAIS LUCRATIVAS
// ---------------------------------------------

// Função para gerar Top 5 categorias mais lucrativas
function gerarTop5CategoriasMaisLucrativasAux(vendas) {
    const lucroPorCategoria = {};

    // Somar lucro por categoria
    vendas.forEach(v => {
        lucroPorCategoria[v.categoria] = (lucroPorCategoria[v.categoria] || 0) + v.precoTotal;
    });

    // Ordenar por lucro decrescente e pegar as 5 primeiras
    const top5 = Object.entries(lucroPorCategoria)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const labels4 = top5.map(item => item[0]);
    const data4 = top5.map(item => item[1]);

    return { labels4, data4 };
}

function gerarResumoTop5CategoriasLucrativas(labels, data) {
    const totalLucro = data.reduce((a, b) => a + b, 0);

    return {
        categorias: labels.map((nome, i) => ({
            nome,
            lucro: data[i]
        })),
        totalLucro,
        categoriaMaisLucrativa: labels[data.indexOf(Math.max(...data))],
        categoriaMenosLucrativa: labels[data.indexOf(Math.min(...data))]
    };
}


const { labels4, data4 } = gerarTop5CategoriasMaisLucrativasAux(vendas);
const resumoIA3 = gerarResumoTop5CategoriasLucrativas(labels4, data4);
console.log(resumoIA3);

async function gerarExplicacao3(resumo) {
    const res = await fetch("https://api1-informal-sales.onrender.com/api/explicacao-top5-categorias-mais-lucrativas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumo)
    });

    const data = await res.json();
    return data.texto;
}

(async () => {
    try {
        const textoIA = await gerarExplicacao3(resumoIA3);

        // 1️⃣ Selecionar o card do recomendado
        const cardDesc = document.querySelector(".recommend-card.trending .desc");

        // 2️⃣ Preencher com o texto gerado pela IA
        if (cardDesc) {
            cardDesc.textContent = textoIA;
        }

    } catch (err) {
        console.error("Erro ao gerar explicação:", err);
    }
})();