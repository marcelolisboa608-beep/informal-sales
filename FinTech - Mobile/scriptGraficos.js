
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
    segunda.setHours(0,0,0,0); // início do dia
    const domingo = new Date(segunda);
    domingo.setDate(segunda.getDate() + 6);
    domingo.setHours(23,59,59,999); // fim do dia
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
        .sort((a,b) => b[1] - a[1])[0]?.[0] || "-";

    // ---------- PRODUTO MAIS VENDIDO ----------
    const quantidadePorProduto = {};
    vendas.forEach(v => { // aqui usamos todas as vendas
        quantidadePorProduto[v.nomeProduto] = (quantidadePorProduto[v.nomeProduto] || 0) + v.quantidade;
    });
    const produtoMaisVendido = Object.entries(quantidadePorProduto)
        .sort((a,b) => b[1] - a[1])[0]?.[0] || "-";

    // ---------- PRODUTO MAIS LUCRATIVO ----------
    const lucroPorProduto = {};
    vendas.forEach(v => { // todas as vendas
        lucroPorProduto[v.nomeProduto] = (lucroPorProduto[v.nomeProduto] || 0) + v.precoTotal;
    });
    const produtoMaisLucrativo = Object.entries(lucroPorProduto)
        .sort((a,b) => b[1] - a[1])[0]?.[0] || "-";

    // ---------- ATUALIZAR HTML ----------
    const boxInfo = document.querySelectorAll(".box-info li");
    if(boxInfo.length >= 3) {
        boxInfo[0].querySelector("h3").textContent = diaMaisLucrativo;
        boxInfo[1].querySelector("h3").textContent = produtoMaisVendido;
        boxInfo[2].querySelector("h3").textContent = produtoMaisLucrativo;
    }
}


atualizarInsightsSemana(vendas);





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
function parseDataHora2(dataHoraStr) {
    const [data, hora] = dataHoraStr.split(" ");
    const [dia, mes, ano] = data.split("-").map(Number);
    const [horas, minutos] = hora.split(":").map(Number);
    return new Date(ano, mes - 1, dia, horas, minutos);
}

// 📌 Ordenar vendas por data (mais recentes primeiro)
function getVendasOrdenadasPorData() {
    return [...vendas].sort((a, b) => {
        return parseDataHora2(b.dataHora) - parseDataHora2(a.dataHora);
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
