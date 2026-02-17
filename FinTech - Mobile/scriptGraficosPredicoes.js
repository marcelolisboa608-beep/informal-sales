
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

//------------------------------------------------
