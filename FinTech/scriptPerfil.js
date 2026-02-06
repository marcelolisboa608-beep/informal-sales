
//LUCRO DIÁRIO
//_______________________________________________________________

// Extrai a data (DD-MM-YYYY) de uma venda
function getVendaDate(venda) {
    return venda.dataHora.split(" ")[0];
}

// Soma total de vendas por data
function getTotalVendasPorData(vendas, data) {
    return vendas
        .filter(v => getVendaDate(v) === data)
        .reduce((total, v) => total + v.precoTotal, 0);
}

// Formatar moeda Kz
function formatKz(valor) {
    return valor.toLocaleString("pt-PT") + " Kz";
}

function getHojeEOntem() {
    const hoje = new Date();
    const ontem = new Date();
    ontem.setDate(hoje.getDate() - 1);

    const format = d =>
        String(d.getDate()).padStart(2, "0") + "-" +
        String(d.getMonth() + 1).padStart(2, "0") + "-" +
        d.getFullYear();

    return {
        hoje: format(hoje),
        ontem: format(ontem)
    };
}

function atualizarVendasHoje() {

    const { hoje, ontem } = getHojeEOntem();

    const totalHoje = getTotalVendasPorData(vendas, hoje);
    const totalOntem = getTotalVendasPorData(vendas, ontem);

    // Atualizar valor principal
    document.querySelector(".sales h1").textContent = formatKz(totalHoje);

    // Calcular percentagem
    let percent = 0;

    if (totalOntem > 0) {
        percent = ((totalHoje - totalOntem) / totalOntem) * 100;
    }

    const percentEl = document.querySelector(".sales .number");
    const infoEl = document.querySelector(".sales small");

    const sinal = percent >= 0 ? "+" : "";
    percentEl.textContent = `${sinal}${percent.toFixed(1)}%`;

    // Texto e ícone
    if (percent >= 0) {
        infoEl.innerHTML = `<i class="bx bxs-chevron-up"></i> Em relação à ontem`;
    } else {
        infoEl.innerHTML = `<i class="bx bxs-chevron-down"></i> Em relação à ontem`;
    }


    // --------------------
    // Atualizar círculo
    // --------------------
    const circle = document.querySelector(".sales svg circle");
    // Perímetro real do círculo
    const radius = circle.r.baseVal.value;
    const perimeter = 2 * Math.PI * radius;

    // Limitar percentagem entre 0 e 100
    const percentAbs = Math.min(Math.abs(percent), 100);

    // Calcular offset do stroke baseado no perímetro real
    const offset = perimeter - (percentAbs / 100) * perimeter;

    circle.style.strokeDasharray = perimeter;
    circle.style.strokeDashoffset = offset;

    // Cor do círculo
    circle.style.stroke = percent >= 0 ? "rgb(31, 191, 31)" : "rgb(255, 0, 0)";

}


atualizarVendasHoje();


//LUCRO SEMANAL
//_______________________________________________________________

function parseDataHora(dataHora) {
    const [data, hora] = dataHora.split(" ");
    const [dia, mes, ano] = data.split("-");
    return new Date(ano, mes - 1, dia, ...hora.split(":"));
}


function getIntervalosSemana() {
    const hoje = new Date();
    const diaSemana = hoje.getDay(); // 0 = Domingo

    const diffSegunda = diaSemana === 0 ? -6 : 1 - diaSemana;

    const inicioSemanaAtual = new Date(hoje);
    inicioSemanaAtual.setDate(hoje.getDate() + diffSegunda);
    inicioSemanaAtual.setHours(0, 0, 0, 0);

    const fimSemanaAtual = new Date(inicioSemanaAtual);
    fimSemanaAtual.setDate(inicioSemanaAtual.getDate() + 6);
    fimSemanaAtual.setHours(23, 59, 59, 999);

    const inicioSemanaAnterior = new Date(inicioSemanaAtual);
    inicioSemanaAnterior.setDate(inicioSemanaAtual.getDate() - 7);

    const fimSemanaAnterior = new Date(fimSemanaAtual);
    fimSemanaAnterior.setDate(fimSemanaAtual.getDate() - 7);

    return {
        inicioSemanaAtual,
        fimSemanaAtual,
        inicioSemanaAnterior,
        fimSemanaAnterior
    };
}

function totalVendasPeriodo(vendas, inicio, fim) {
    return vendas
        .filter(v => {
            const dataVenda = parseDataHora(v.dataHora);
            return dataVenda >= inicio && dataVenda <= fim;
        })
        .reduce((total, v) => total + v.precoTotal, 0);
}


function atualizarLucroSemanal() {

    const {
        inicioSemanaAtual,
        fimSemanaAtual,
        inicioSemanaAnterior,
        fimSemanaAnterior
    } = getIntervalosSemana();

    const totalSemanaAtual = totalVendasPeriodo(
        vendas,
        inicioSemanaAtual,
        fimSemanaAtual
    );

    const totalSemanaAnterior = totalVendasPeriodo(
        vendas,
        inicioSemanaAnterior,
        fimSemanaAnterior
    );

    console.log(totalSemanaAnterior);
    console.log(totalSemanaAtual);

    // 🟢 Valor principal
    document.querySelector(".expenses h1").textContent =
        totalSemanaAtual.toLocaleString("pt-AO") + " Kz";

    // 📊 Percentagem
    let percent = 0;
    if (totalSemanaAnterior > 0) {
        percent = ((totalSemanaAtual - totalSemanaAnterior) / totalSemanaAnterior) * 100;
    }

    const numberEl = document.querySelector(".expenses .number");
    const smallEl = document.querySelector(".expenses small");

    const sinal = percent >= 0 ? "+" : "";
    numberEl.textContent = `${sinal}${percent.toFixed(1)}%`;

    // Texto + ícone
    if (percent >= 0) {
        smallEl.innerHTML =
            `<i class="bx bxs-chevron-up"></i> Em relação à semana anterior`;
    } else {
        smallEl.innerHTML =
            `<i class="bx bxs-chevron-down"></i> Em relação à semana anterior`;
    }

    // 🔵 Círculo SVG
    const circle = document.querySelector(".expenses svg circle");
    // Perímetro real do círculo
    const radius = circle.r.baseVal.value;
    const perimeter = 2 * Math.PI * radius;

    // Limitar percentagem entre 0 e 100
    const percentAbs = Math.min(Math.abs(percent), 100);

    // Calcular offset do stroke baseado no perímetro real
    const offset = perimeter - (percentAbs / 100) * perimeter;

    circle.style.strokeDasharray = perimeter;
    circle.style.strokeDashoffset = offset;

    // Cor do círculo
    circle.style.stroke = percent >= 0 ? "rgb(31, 191, 31)" : "rgb(255, 0, 0)";
}

atualizarLucroSemanal();


//LUCRO MENSAL
//_______________________________________________________________

// Função para obter intervalos do mês atual e anterior
function getIntervalosMes() {
    const hoje = new Date();

    // Mês atual
    const inicioMesAtual = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMesAtual = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    // Mês anterior
    const inicioMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
    const fimMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth(), 0);

    // Formatar DD-MM-YYYY
    const format = d =>
        String(d.getDate()).padStart(2, "0") + "-" +
        String(d.getMonth() + 1).padStart(2, "0") + "-" +
        d.getFullYear();

    return {
        inicioMesAtual: format(inicioMesAtual),
        fimMesAtual: format(fimMesAtual),
        inicioMesAnterior: format(inicioMesAnterior),
        fimMesAnterior: format(fimMesAnterior)
    };
}

// Função para calcular total de vendas entre duas datas
function totalVendasPeriodoParaMes(vendas, inicio, fim) {
    const [diaIni, mesIni, anoIni] = inicio.split("-").map(Number);
    const [diaFim, mesFim, anoFim] = fim.split("-").map(Number);

    const dataInicio = new Date(anoIni, mesIni - 1, diaIni);
    const dataFim = new Date(anoFim, mesFim - 1, diaFim, 23, 59, 59); // incluir todo o dia

    return vendas
        .filter(v => {
            const [d, m, a] = v.dataHora.split(" ")[0].split("-").map(Number);
            const dataVenda = new Date(a, m - 1, d);
            return dataVenda >= dataInicio && dataVenda <= dataFim;
        })
        .reduce((total, v) => total + v.precoTotal, 0);
}

// Atualizar Vendas Mensais
function atualizarVendasMensais() {
    const {
        inicioMesAtual,
        fimMesAtual,
        inicioMesAnterior,
        fimMesAnterior
    } = getIntervalosMes();

    const totalMesAtual = totalVendasPeriodoParaMes(vendas, inicioMesAtual, fimMesAtual);
    const totalMesAnterior = totalVendasPeriodoParaMes(vendas, inicioMesAnterior, fimMesAnterior);

    console.log("Mês anterior:", totalMesAnterior);
    console.log("Mês atual:", totalMesAtual);

    // Valor principal
    document.querySelector(".income h1").textContent =
        totalMesAtual.toLocaleString("pt-AO") + " Kz";

    // Percentagem
    let percent = 0;
    if (totalMesAnterior > 0) {
        percent = ((totalMesAtual - totalMesAnterior) / totalMesAnterior) * 100;
    }

    const numberEl = document.querySelector(".income .number");
    const smallEl = document.querySelector(".income small");

    const sinal = percent >= 0 ? "+" : "";
    numberEl.textContent = `${sinal}${percent.toFixed(1)}%`;

    // Texto + ícone
    if (percent >= 0) {
        smallEl.innerHTML = `<i class="bx bxs-chevron-up"></i> Em relação ao mês anterior`;
    } else {
        smallEl.innerHTML = `<i class="bx bxs-chevron-down"></i> Em relação ao mês anterior`;
    }

    // 🔵 Círculo SVG
    const circle = document.querySelector(".income svg circle");

    // Perímetro real do círculo
    const radius = circle.r.baseVal.value;
    const perimeter = 2 * Math.PI * radius;

    // Limitar percentagem entre 0 e 100
    const percentAbs = Math.min(Math.abs(percent), 100);

    // Calcular offset do stroke baseado no perímetro real
    const offset = perimeter - (percentAbs / 100) * perimeter;

    circle.style.strokeDasharray = perimeter;
    circle.style.strokeDashoffset = offset;

    // Cor do círculo
    circle.style.stroke = percent >= 0 ? "rgb(31, 191, 31)" : "rgb(255, 0, 0)";
}

// Chamar função
atualizarVendasMensais();


//EXTRAIR DIA DA SEMANA MAIS LUCRATIVO , PRODUTO MAIS VENDIDO E PRODUTO MAIS LUCRATIVO
//_______________________________________________________________

// Converter data da venda em objeto Date
function parseDataVenda(dataHora) {
    const [data, hora] = dataHora.split(" ");
    const [dia, mes, ano] = data.split("-");
    return new Date(`${ano}-${mes}-${dia}T${hora}:00`);
}

// Obter dia da semana em português
function getDiaSemana(data) {
    const dias = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
    return dias[data.getDay()];
}

// Obter intervalo da semana atual (segunda → domingo)
function getIntervaloSemanaAtual() {
    const hoje = new Date();
    const diaSemana = hoje.getDay(); // 0 = domingo, 1 = segunda, ..., 6 = sábado
    const segunda = new Date(hoje);
    segunda.setDate(hoje.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1)); // Ajuste para segunda
    segunda.setHours(0, 0, 0, 0); // início do dia
    const domingo = new Date(segunda);
    domingo.setDate(segunda.getDate() + 6);
    domingo.setHours(23, 59, 59, 999); // fim do dia
    return { inicio: segunda, fim: domingo };
}

function atualizarInsightsSemana(vendas) {
    const { inicio, fim } = getIntervaloSemanaAtual();

    // Filtrar vendas da semana atual
    const vendasSemana = vendas.filter(v => {
        const dataVenda = parseDataVenda(v.dataHora);
        return dataVenda >= inicio && dataVenda <= fim;
    });

    // ---------- DIA MAIS LUCRATIVO ----------
    const lucroPorDia = {};
    vendasSemana.forEach(v => {
        const dia = getDiaSemana(parseDataVenda(v.dataHora));
        lucroPorDia[dia] = (lucroPorDia[dia] || 0) + v.precoTotal;
    });
    const diaMaisLucrativo = Object.entries(lucroPorDia)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

    // ---------- PRODUTO MAIS VENDIDO ----------
    const quantidadePorProduto = {};
    vendas.forEach(v => { // aqui usamos todas as vendas
        quantidadePorProduto[v.nomeProduto] = (quantidadePorProduto[v.nomeProduto] || 0) + v.quantidade;
    });
    const produtoMaisVendido = Object.entries(quantidadePorProduto)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

    // ---------- PRODUTO MAIS LUCRATIVO ----------
    const lucroPorProduto = {};
    vendas.forEach(v => { // todas as vendas
        lucroPorProduto[v.nomeProduto] = (lucroPorProduto[v.nomeProduto] || 0) + v.precoTotal;
    });
    const produtoMaisLucrativo = Object.entries(lucroPorProduto)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

    // ---------- ATUALIZAR HTML ----------
    const boxInfo = document.querySelectorAll(".box-info li");
    if (boxInfo.length >= 3) {
        boxInfo[0].querySelector("h3").textContent = diaMaisLucrativo;
        boxInfo[1].querySelector("h3").textContent = produtoMaisVendido;
        boxInfo[2].querySelector("h3").textContent = produtoMaisLucrativo;
    }
}


atualizarInsightsSemana(vendas);



//Renderizar Vendas
//////////////////////////////////////////
// ---------------------------------------------

// Referência ao tbody da tabela
const tbodyVendasRecentes = document.querySelector(".order table tbody");

// Função para renderizar as 4 vendas mais lucrativas
function renderVendasMaisLucrativas() {
    tbodyVendasRecentes.innerHTML = ""; // limpa tabela

    // Ordenar vendas pelo precoTotal (mais lucrativas primeiro)
    const vendasOrdenadas = [...vendas].sort((a, b) => b.precoTotal - a.precoTotal);

    // Pegar apenas os 4 primeiros (mais lucrativos)
    const topLucrativas = vendasOrdenadas.slice(0, 4);

    topLucrativas.forEach(venda => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <img src="${venda.img}" alt="${venda.nomeProduto}">
                <p>${venda.nomeProduto}</p>
            </td>
            <td><span class="codigo-produto">${venda.ID}</span></td>
            <td>
                <span class="pagamento ${getTipoPagamentoClass(venda.tipoPagamento)}">${venda.tipoPagamento}</span>
            </td>
            <td>${venda.quantidade}</td>
            <td>${venda.precoUnit.toLocaleString()} Kz</td>
            <td><span class="codigo-produto">${venda.precoTotal.toLocaleString()} Kz</span></td>
            <td>${venda.dataHora}</td>
            <td><span class="category ${getCategoriaClass(venda.categoria)}">${venda.categoria}</span></td>
        `;
        tbodyVendasRecentes.appendChild(tr);
    });
}

// Inicializa as 4 vendas mais lucrativas
renderVendasMaisLucrativas();





//Recomendações Inteligentes
//////////////////////////////////////////
// ---------------------------------------------
/////////////////////////////////////////
// ---------------------------------------------
/////////////////////////////////////////
// ---------------------------------------------

async function gerarRecomendacoesGerais(payload) {
    const res = await fetch("http://localhost:3000/api/recomendacoes-gerais", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        throw new Error("Erro ao buscar recomendações gerais");
    }

    return await res.json();
}


//ResumoSemana
//---------------------------------------------------------------
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

const resumoSemana = gerarResumoComparacaoSemanal(
    ganhosSemanaAtual,
    ganhosSemanaPassada
);
//---------------------------------------------------------------


//ResumoMes
//---------------------------------------------------------------
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


const resumoMes = gerarResumoComparacaoMensal(mediasAtual,mediasPassado);
//---------------------------------------------------------------

//ResumoVendas7Dias
//---------------------------------------------------------------


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
const resumoVendas7Dias = gerarResumoVendasUltimos7Dias(labels1, data1);
//---------------------------------------------------------------


//resumoTop5Produtos
//---------------------------------------------------------------

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

const resumoTop5Produtos = gerarResumoTop5Produtos(labels2, data2);

//---------------------------------------------------------------


//resumoTop5ProdutosLucrativos
//---------------------------------------------------------------


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
const resumoTop5ProdutosLucrativos = gerarResumoTop5ProdutosLucrativos(labels3, data3);


//---------------------------------------------------------------



//resumoTop5CategoriasLucrativas
//---------------------------------------------------------------

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
const resumoTop5CategoriasLucrativas  = gerarResumoTop5CategoriasLucrativas(labels4, data4);

//---------------------------------------------------------------



//resumoCrescimentoCategoria
//---------------------------------------------------------------

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


const resumoCrescimentoCategoria = gerarResumoCrescimentoCategoria(todasCategorias, mesAtualCategoria, mesAnteriorCategoria, crescimento);
//---------------------------------------------------------------



const payloadRecomendacoes = {
    resumoSemana: resumoSemana, // semanal
    resumoMes: resumoMes,   // mensal
    resumoVendas7Dias: resumoVendas7Dias, // vendas últimos 7 dias
    resumoTop5Produtos: resumoTop5Produtos,
    resumoTop5ProdutosLucrativos: resumoTop5ProdutosLucrativos,
    resumoTop5CategoriasLucrativas: resumoTop5CategoriasLucrativas,
    resumoCrescimentoCategoria: resumoCrescimentoCategoria
};


(async () => {
    try {
        const {
            recomendacaoVendas,
            recomendacaoProdutos,
            recomendacaoCategorias,
            recomendacaoOperacional
        } = await gerarRecomendacoesGerais(payloadRecomendacoes);

        // 🔹 Card 1 – Vendas / tendência
        const cardVendas = document.querySelector(".recommend-card.weather .desc");
        if (cardVendas) cardVendas.textContent = recomendacaoVendas;

        // 🔹 Card 2 – Produtos / estoque
        const cardProdutos = document.querySelector(".recommend-card.stock .desc");
        if (cardProdutos) cardProdutos.textContent = recomendacaoProdutos;

        // 🔹 Card 3 – Categorias
        const cardCategorias = document.querySelector(".recommend-card.trending .desc");
        if (cardCategorias) cardCategorias.textContent = recomendacaoCategorias;

        // 🔹 Card 4 – Estratégia geral
        const cardEstrategia = document.querySelector(".recommend-card.pricing .desc");
        if (cardEstrategia) cardEstrategia.textContent = recomendacaoOperacional;

    } catch (err) {
        console.error("Erro ao gerar recomendações gerais:", err);
    }
})();








