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
    return [...vendasDetectadas].sort((a, b) => {
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

                <button class="action-btn ativar" data-id="${venda.ID}">
                    <i class="bx bx-check"></i>
                </button>

                <button class="action-btn edit" data-id="${venda.ID}">
                    <i class="bx bx-edit"></i>
                </button>

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

    const totalPages = Math.ceil(vendasDetectadas.length / vendasPorPagina);

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
//Remover Venda
//----------------------------------------------------------


function removerVenda(vendaID) {

    // Filtrar removendo a venda
    vendasDetectadas = vendasDetectadas.filter(v => v.ID !== vendaID);

    // Atualizar LocalStorage
    salvarNoLocalStorage("vendasDetectadas", vendasDetectadas);

    // Corrigir página atual se ficar vazia
    const totalPages = Math.ceil(vendasDetectadas.length / vendasPorPagina);
    if (currentValueVendas > totalPages) {
        currentValueVendas = totalPages || 1;
    }

    // Re-renderizar
    renderVendas(currentValueVendas);
    renderVendasPagination();

    alert("🗑️ Venda eliminada com sucesso!");

}

tbodyVendas.addEventListener("click", function (e) {

    // 👉 CONFIRMAR
    const btnAtivar = e.target.closest(".ativar");
    if (btnAtivar) {
        const vendaID = btnAtivar.dataset.id;

        const confirmar = confirm("Deseja confirmar esta venda?");
        if (!confirmar) return;

        confirmarVenda(vendaID);
        return;
    }

    // 👉 ELIMINAR
    const btnDelete = e.target.closest(".delete");
    if (!btnDelete) return;

    const vendaID = btnDelete.dataset.id;

    const confirmar = confirm("Tem certeza que deseja eliminar esta venda?");
    if (!confirmar) return;

    removerVenda(vendaID);

});

//----------------------------------------------------------
// Confirmar / Ativar Venda
//----------------------------------------------------------

function confirmarVenda(vendaID) {

    // Encontrar a venda
    const venda = vendasDetectadas.find(v => v.ID === vendaID);
    if (!venda) return;

    // Adicionar em vendas
    vendas.push(venda);

    // Remover de vendasDetectadas
    vendasDetectadas = vendasDetectadas.filter(v => v.ID !== vendaID);

    // Atualizar LocalStorage
    salvarNoLocalStorage("vendas", vendas);
    salvarNoLocalStorage("vendasDetectadas", vendasDetectadas);

    // Ajustar paginação se necessário
    const totalPages = Math.ceil(vendasDetectadas.length / vendasPorPagina);
    if (currentValueVendas > totalPages) {
        currentValueVendas = totalPages || 1;
    }

    // Re-renderizar
    renderVendas(currentValueVendas);
    renderVendasPagination();

    alert("✅ Venda confirmada com sucesso!");
}



//----------------------------------------------------------
// Atualizar Vendas Detectadas
//----------------------------------------------------------

function normalizarTipoPagamento(valor) {
    if (!valor) return "Dinheiro";

    const v = valor.toLowerCase();

    if (v.includes("tpa") || v.includes("multicaixa") || v.includes("pos")) {
        return "TPA";
    }

    if (
        v.includes("mobile") ||
        v.includes("money") ||
        v.includes("mpesa") ||
        v.includes("unitel")
    ) {
        return "Mobile Money";
    }

    if (
        v.includes("transfer") ||
        v.includes("transf") ||
        v.includes("banco")
    ) {
        return "Transferência";
    }

    return "Dinheiro";
}


// 🔄 Botão Atualizar / Refresh
document.querySelector(".btn-download").addEventListener("click", buscarPedidos);

async function buscarPedidos() {
    try {
        alert("ℹ️ Aguarde um momento.");
        console.log("🔄 A buscar vendas detectadas...");

        const res = await fetch(
            "https://unequine-juan-ascosporic.ngrok-free.dev/webhook/pedidos",
            {
                headers: {
                    "ngrok-skip-browser-warning": "true"
                }
            }
        );

        const data = await res.json();

        const pedidos = data?.[0]?.pedidos || [];
        console.log(data[0].pedidos);

        // 👉 Se não houver pedidos, não faz nada
        if (!pedidos.length) {
            alert("ℹ️ Nenhuma venda detectada.");
            console.log("ℹ️ Nenhuma venda detectada.");
            return;
        }

        let vendasAdicionadas = 0; // ← contador de vendas realmente adicionadas

        pedidos.forEach(pedido => {

            const nomePedido = pedido.nomeProduto?.toLowerCase().trim();
            if (!nomePedido) return;

            const quantidade = pedido.quantidade || 1;
            //const tipoPagamento = pedido.tipoPagamento ?? "Dinheiro";
            const tipoPagamento = normalizarTipoPagamento(pedido.tipoPagamento);


            // 🔍 Procurar produto por subpalavra ou nome igual
            const produtoEncontrado = produtos.find(p =>
                p.nome.toLowerCase().includes(nomePedido)
            );

            if (!produtoEncontrado) {
                console.warn(`⚠️ Produto não encontrado: ${pedido.nomeProduto}`);
                return;
            }

            //----------------------------------------------------------------
            const agora = new Date();

            const dia = String(agora.getDate()).padStart(2, "0");
            const mes = String(agora.getMonth() + 1).padStart(2, "0");
            const ano = agora.getFullYear();

            const horas = String(agora.getHours()).padStart(2, "0");
            const minutos = String(agora.getMinutes()).padStart(2, "0");

            const dataHora = `${dia}-${mes}-${ano} ${horas}:${minutos}`;
            //------------------------------------------------------------------------

            const precoTotal = quantidade * produtoEncontrado.precoUnit;


            // 🧾 Estrutura final da venda
            const venda = {
                ID: generateUniqueSaleID(vendasDetectadas),
                codigoProduto: produtoEncontrado.codigo,
                nomeProduto: produtoEncontrado.nome,
                img: produtoEncontrado.img,
                categoria: produtoEncontrado.categoria,
                quantidade: quantidade,
                precoUnit: produtoEncontrado.precoUnit,
                precoTotal: precoTotal,
                dataHora: dataHora,
                tipoPagamento: tipoPagamento
            };

            vendasDetectadas.push(venda);
            vendasAdicionadas++; // ← incrementa a flag
            console.log("✅ Venda adicionada:", venda);
        });


        if (vendasAdicionadas === 0) {
            alert("ℹ️ Nenhuma venda detectada.");
        }

        salvarNoLocalStorage("vendasDetectadas", vendasDetectadas);

        // Re-renderizar
        renderVendas(currentValueVendas);
        renderVendasPagination();

        console.log("📦 Vendas detectadas atualizadas com sucesso.");

    } catch (err) {
        alert("ℹ️ Nenhuma venda detectada.");
        console.error("❌ Erro ao buscar pedidos:", err);
    }
}


//----------------------------------------------------------
// Abrir Modal de Edição de Venda
//----------------------------------------------------------

// Referência do modal
const saleEditModal = document.getElementById("saleEditModal");

// Campos do modal
const inputProduto = document.querySelector("#saleEditModal #input");
const inputQuantidade = document.querySelector("#saleEditModal input[type='number']");
const inputPrecoUnit = document.querySelector("#saleEditModal input[readonly]");
const selectTipoPagamento = document.querySelector("#saleEditModal select");
const inputDataHora = document.querySelector("#saleEditModal input[type='datetime-local']");

// Função para abrir modal
function toggleSaleModal() {
    saleEditModal.classList.toggle("active");
}

// Fechar modal clicando fora do card
function closeOnOverlay(e) {
    if (e.target === saleEditModal) {
        toggleSaleModal();
    }
}


// Variável global para armazenar a venda atual sendo editada
let vendaAtualEditandoID = null;

// Função para preencher modal com a venda
function preencherModalVenda(venda) {
    vendaAtualEditandoID = venda.ID; // ← salvar ID da venda que estamos editando
    // Imagem
    salePreviewImg.src = venda.img || "img/no-product-image.jpg";
    
    // Produto
    inputProduto.value = venda.nomeProduto;

    // Quantidade
    inputQuantidade.value = venda.quantidade;

    // Preço unitário
    inputPrecoUnit.value = venda.precoUnit;

    // Tipo de pagamento
    selectTipoPagamento.value = venda.tipoPagamento;

    // Data e hora → converter "DD-MM-YYYY HH:MM" → "YYYY-MM-DDTHH:MM"
    const [data, hora] = venda.dataHora.split(" ");
    const [dia, mes, ano] = data.split("-");
    inputDataHora.value = `${ano}-${mes}-${dia}T${hora}`;
}

// Capturar clique no botão editar de cada venda
tbodyVendas.addEventListener("click", function (e) {
    const btnEdit = e.target.closest(".edit");
    if (!btnEdit) return;

    const vendaID = btnEdit.dataset.id;
    const venda = vendasDetectadas.find(v => v.ID === vendaID);
    if (!venda) return;

    preencherModalVenda(venda);
    toggleSaleModal();
});


//----------------------------------------------------------
// Editar Venda Detectada
//----------------------------------------------------------

// Referência ao form do modal
const saleForm = document.querySelector(".sale-form");

// Capturar submit do formulário
saleForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!vendaAtualEditandoID) return;

    // Encontrar a venda no array
    const venda = vendasDetectadas.find(v => v.ID === vendaAtualEditandoID);
    if (!venda) return;

    // Capturar valores
    const produtoNome = inputProduto.value.trim();
    const quantidade = Number(inputQuantidade.value);
    const precoUnit = Number(inputPrecoUnit.value);
    const tipoPagamento = selectTipoPagamento.value;
    const dataHoraInput = inputDataHora.value;
    const produtoImg = salePreviewImg.src;

    // Validação obrigatória
    if (!produtoNome || !quantidade || !precoUnit || !tipoPagamento || !dataHoraInput) {
        alert("Todos os campos são obrigatórios!");
        return;
    }

    // Validação de valores positivos
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

    // Atualizar os campos da venda
    venda.nomeProduto = produtoNome;
    venda.quantidade = quantidade;
    venda.precoUnit = precoUnit;
    venda.precoTotal = quantidade * precoUnit;
    venda.tipoPagamento = tipoPagamento;
    venda.img = produtoImg;

    // Atualizar dataHora → converter "YYYY-MM-DDTHH:MM" → "DD-MM-YYYY HH:MM"
    const [ano, mes, dia] = dataHoraInput.split("T")[0].split("-");
    const hora = dataHoraInput.split("T")[1];
    venda.dataHora = `${dia}-${mes}-${ano} ${hora}`;

    // Salvar no localStorage
    salvarNoLocalStorage("vendasDetectadas", vendasDetectadas);

    // Re-renderizar
    renderVendas(currentValueVendas);
    renderVendasPagination();

    // Fechar modal
    toggleSaleModal();

    alert("✅ Venda editada com sucesso!");
});