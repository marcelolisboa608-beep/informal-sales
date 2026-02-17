
// Código Referente ao Autocomplete do Modal do Registro das Vendas
//////////////////////////////////////////
// ---------------------------------------------

const input = document.getElementById("input");
const list = document.querySelector(".list");
const salePreviewImg = document.getElementById("salePreviewImg");
const precoUnitInput = document.querySelectorAll(".sale-form input[type='number']")[1];


// Ordenar produtos pelo nome
let produtosOrdenados = produtos
    .filter(p => p.ativo) // filtra apenas ativos
    .slice()
    .sort((a, b) => a.nome.localeCompare(b.nome));

if (input) {

    input.addEventListener("keyup", () => {
        removeElements(); // limpa sugestões

        const query = input.value.toLowerCase();

        produtosOrdenados.forEach(produto => {
            const nomeMatch = produto.nome.toLowerCase().startsWith(query);
            const codigoMatch = produto.codigo.toLowerCase().startsWith(query);

            if (query === "" || nomeMatch || codigoMatch) {

                const listItem = document.createElement("li");
                listItem.classList.add("list-items");
                listItem.style.cursor = "pointer";

                // Destacar parte correspondente
                if (query !== "") {
                    let highlighted;
                    if (nomeMatch) {
                        highlighted = `<b>${produto.nome.substr(0, query.length)}</b>${produto.nome.substr(query.length)}`;
                    } else if (codigoMatch) {
                        highlighted = `<b>${produto.codigo.substr(0, query.length)}</b>${produto.codigo.substr(query.length)}`;
                    }
                    listItem.innerHTML = highlighted;
                } else {
                    listItem.textContent = produto.nome;
                }

                // Ao clicar, seleciona o produto
                listItem.addEventListener("mousedown", () => {
                    selectProduto(produto);
                });

                list.appendChild(listItem);
            }
        });
    });

    input.addEventListener("focus", () => {
        list.style.display = "block";
        input.dispatchEvent(new Event("keyup")); // atualiza sugestões
    });

    input.addEventListener("blur", () => {
        setTimeout(() => {
            list.style.display = "none";
        }, 150);
    });
}

// Selecionar produto
function selectProduto(produto) {
    input.value = produto.nome;             // coloca nome no input
    input.dataset.codigo = produto.codigo;  // armazena código
    input.dataset.categoria = produto.categoria;
    salePreviewImg.src = produto.img;       // atualiza imagem

    // 👉 PREÇO UNITÁRIO AUTOMÁTICO
    precoUnitInput.value = produto.precoUnit;

    removeElements();
}

// Limpa sugestões
function removeElements() {
    const items = document.querySelectorAll(".list-items");
    items.forEach(item => item.remove());
}

// ---------------------------------------------
// RENDERIZAR VENDAS (mais recentes primeiro)
// ---------------------------------------------

// 📌 Configurações
let vendasPorPagina = 6;
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
            <td data-label="Ações" class="acoes">
                <button class="action-btn delete" data-id="${venda.ID}">
                    <i class="bx bx-trash"></i>
                </button>
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


//----------------------------------------------------------
//Registrar Venda
//----------------------------------------------------------


function formatarDataHora(data = new Date()) {
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();

    const hora = String(data.getHours()).padStart(2, "0");
    const minutos = String(data.getMinutes()).padStart(2, "0");

    return `${dia}-${mes}-${ano} ${hora}:${minutos}`;
}

// Selecionar o formulário
const saleForm = document.querySelector(".sale-form");

saleForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const produtoNome = input.value.trim();
    const produtoCodigo = input.dataset.codigo;          // já vem do autocomplete
    const produtoImg = salePreviewImg.src;               // já atualizado no autocomplete
    const quantidade = parseInt(document.querySelector(".sale-form input[type='number']").value);
    const precoUnit = parseFloat(document.querySelectorAll(".sale-form input[type='number']")[1].value);
    const tipoPagamento = document.querySelector(".sale-form select").value;
    let dataHora = document.querySelector(".sale-form input[type='datetime-local']").value;


    // Validação
    if (!produtoNome || !produtoCodigo || !quantidade || !precoUnit || !tipoPagamento || !dataHora) {
        alert("Todos os campos são obrigatórios!");
        return;
    }

    if (quantidade <= 0 || precoUnit <= 0) {
        alert("Quantidade e preço unitário devem ser maiores que zero!");
        return;
    }

    // ✅ Validação de produto válido
    const produtoSelecionado = produtosOrdenados.find(p => p.nome.toLowerCase() === produtoNome.toLowerCase());
    if (!produtoSelecionado) {
        alert("❌ Produto inválido! Por favor, selecione um produto da lista.");
        return;
    }

    dataHora = formatarDataHora(new Date(dataHora));

    // Criar objeto da venda
    const novaVenda = {
        ID: generateUniqueSaleID(vendas),
        codigoProduto: produtoCodigo,
        nomeProduto: produtoNome,
        img: produtoImg,
        categoria: input.dataset.categoria || "Outro", // opcional: você pode armazenar categoria no autocomplete também
        quantidade: quantidade,
        precoUnit: precoUnit,
        precoTotal: quantidade * precoUnit,
        dataHora: dataHora,
        tipoPagamento: tipoPagamento,
        status: "ativa"
    };

    // Salvar no LocalStorage
    vendas.push(novaVenda);
    salvarNoLocalStorage("vendas", vendas);

    // ✅ Feedback de sucesso
    alert("✅ Venda registrada com sucesso!");


    // Atualizar tabela e paginação
    // -----------------------------------------------------
    // 🔄 Reordenar vendas
    const vendasOrdenadas = getVendasOrdenadasPorData();

    // 🔍 Encontrar a posição da nova venda
    const indexNovaVenda = vendasOrdenadas.findIndex(
        venda => venda.ID === novaVenda.ID
    );

    // 📄 Calcular a página onde ela está
    currentValueVendas = Math.floor(indexNovaVenda / vendasPorPagina) + 1;
    // -----------------------------------------------------
    renderVendas(currentValueVendas);
    renderVendasPagination();


    // Fechar modal e resetar formulário
    toggleSaleModal();
    saleForm.reset();
    salePreviewImg.src = "img/no-product-image.jpg";
});



//----------------------------------------------------------
//Remover Venda
//----------------------------------------------------------


function removerVenda(vendaID) {

    // Filtrar removendo a venda
    vendas = vendas.filter(v => v.ID !== vendaID);

    // Atualizar LocalStorage
    salvarNoLocalStorage("vendas", vendas);

    // Corrigir página atual se ficar vazia
    const totalPages = Math.ceil(vendas.length / vendasPorPagina);
    if (currentValueVendas > totalPages) {
        currentValueVendas = totalPages || 1;
    }

    // Re-renderizar
    renderVendas(currentValueVendas);
    renderVendasPagination();

    alert("🗑️ Venda eliminada com sucesso!");

}

tbodyVendas.addEventListener("click", function (e) {

    const btnDelete = e.target.closest(".delete");
    if (!btnDelete) return;

    const vendaID = btnDelete.dataset.id;

    const confirmar = confirm("Tem certeza que deseja eliminar esta venda?");
    if (!confirmar) return;

    removerVenda(vendaID);

});

