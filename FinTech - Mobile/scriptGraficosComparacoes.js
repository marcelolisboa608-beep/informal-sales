
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



//------------------------------------------------------------------------------------------

function gerarResumoComparacaoSemanal(ganhosAtual, ganhosPassado) {
    const dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];

    const totalAtual = ganhosAtual.reduce((a, b) => a + b, 0);
    const totalPassado = ganhosPassado.reduce((a, b) => a + b, 0);

    const crescimento = totalPassado === 0
        ? 100
        : ((totalAtual - totalPassado) / totalPassado) * 100;

    const melhorDiaIndex = ganhosAtual.indexOf(Math.max(...ganhosAtual));
    const piorDiaIndex = ganhosAtual.indexOf(Math.min(...ganhosAtual));

    return {
        semanaAtual: dias.map((dia, i) => ({
            dia,
            valor: ganhosAtual[i]
        })),

        semanaPassada: dias.map((dia, i) => ({
            dia,
            valor: ganhosPassado[i]
        })),

        totalAtual,
        totalPassado,
        crescimento: crescimento.toFixed(1) + "%",
        melhorDia: dias[melhorDiaIndex],
        piorDia: dias[piorDiaIndex]
    };
}


// Para semana passada, subtrair 7 dias
const semanaPassada = new Date();
semanaPassada.setDate(hoje.getDate() - 7);

const ganhosSemanaAtual = gerarGanhosSemana(vendas, hoje);
const ganhosSemanaPassada = gerarGanhosSemana(vendas, semanaPassada);

const resumoIA = gerarResumoComparacaoSemanal(
    ganhosSemanaAtual,
    ganhosSemanaPassada
);

async function gerarExplicacao(resumo) {
    const res = await fetch("https://api1-informal-sales.onrender.com/api/explicar-semana", {
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
        const cardDesc = document.querySelector(".recommend-card.stock .desc");

        // 2️⃣ Preencher com o texto gerado pela IA
        if (cardDesc) {
            cardDesc.textContent = textoIA;
        }

    } catch (err) {
        console.error("Erro ao gerar explicação:", err);
    }
})();


//------------------------------------------------------------------------------------------

function gerarResumoComparacaoMensal(mediasAtual, mediasPassado) {
    // total do mês
    const totalAtual = mediasAtual.reduce((a, b) => a + b, 0);
    const totalPassado = mediasPassado.reduce((a, b) => a + b, 0);

    // crescimento percentual
    const crescimento = totalPassado === 0
        ? 100
        : ((totalAtual - totalPassado) / totalPassado) * 100;

    // melhor semana do mês atual
    const melhorSemanaIndex = mediasAtual.indexOf(Math.max(...mediasAtual));
    const piorSemanaIndex = mediasAtual.indexOf(Math.min(...mediasAtual));

    return {
        mediasAtual,
        mediasPassado,
        totalAtual,
        totalPassado,
        crescimento: crescimento.toFixed(1) + "%",
        melhorSemana: `Sem ${melhorSemanaIndex + 1}`,
        piorSemana: `Sem ${piorSemanaIndex + 1}`
    };
}


const resumoIA1 = gerarResumoComparacaoMensal(mediasAtual,mediasPassado);
console.log(resumoIA1);


async function gerarExplicacaoComparacaoMensal(resumo) {
    const res = await fetch("https://api1-informal-sales.onrender.com/api/explicacao-mes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumo)
    });

    const data = await res.json();
    return data.texto;
}

(async () => {
    try {
        const textoIA = await gerarExplicacaoComparacaoMensal(resumoIA1);

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


//------------------------------------------------------------------------------------------

function gerarResumoCrescimentoCategoria(todasCategorias, mesAtualCategoria, mesAnteriorCategoria, crescimento) {
    const resumoCategorias = todasCategorias.map((cat, i) => ({
        categoria: cat,
        mesAtual: mesAtualCategoria[i],
        mesPassado: mesAnteriorCategoria[i],
        crescimento: crescimento[i]
    }));

    const categoriasPositivas = resumoCategorias.filter(c => c.crescimento > 0);
    const categoriasNegativas = resumoCategorias.filter(c => c.crescimento < 0);

    return {
        resumoCategorias,
        categoriasPositivas: categoriasPositivas.map(c => c.categoria),
        categoriasNegativas: categoriasNegativas.map(c => c.categoria),
        totalMesAtual: mesAtualCategoria.reduce((a,b)=>a+b,0),
        totalMesPassado: mesAnteriorCategoria.reduce((a,b)=>a+b,0),
        crescimentoTotal: Number(((mesAtualCategoria.reduce((a,b)=>a+b,0) - mesAnteriorCategoria.reduce((a,b)=>a+b,0)) / (mesAnteriorCategoria.reduce((a,b)=>a+b,0) || 1) * 100).toFixed(2))
    };
}


const resumoIA2 = gerarResumoCrescimentoCategoria(todasCategorias, mesAtualCategoria, mesAnteriorCategoria, crescimento);
console.log(resumoIA2);


async function gerarExplicacaoCrescimentoCategoria(resumo) {
    const res = await fetch("https://api1-informal-sales.onrender.com/api/explicacao-crescimento-categoria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumo)
    });

    const data = await res.json();
    return data.texto;
}

(async () => {
    try {
        const textoIA = await gerarExplicacaoCrescimentoCategoria(resumoIA2);

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