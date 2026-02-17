
// ---------------------------------------------
// RENDERIZAR PRODUTOS (mais recentes primeiro)
// ---------------------------------------------

// 📌 Configurações
let produtosPorPagina = 6;
currentValue = 1;

// 📌 Referências
const tbody = document.querySelector(".order table tbody");
const paginationUL = document.querySelector(".pagination ul");

// 📌 Converter "DD-MM-YYYY HH:MM" → Date
function parseDataHoraProduto(dataHoraStr) {
    const [data, hora] = dataHoraStr.split(" ");
    const [dia, mes, ano] = data.split("-").map(Number);
    const [horas, minutos] = hora.split(":").map(Number);
    return new Date(ano, mes - 1, dia, horas, minutos);
}

// 📌 Ordenar produtos por data (mais recentes primeiro)
function getProdutosOrdenadosPorData() {
    return [...produtos].sort((a, b) => {
        return parseDataHoraProduto(b.dataHora) - parseDataHoraProduto(a.dataHora);
    });
}

// 📌 Renderizar produtos
function renderProdutos(page = 1) {
    tbody.innerHTML = "";

    const produtosOrdenados = getProdutosOrdenadosPorData();

    const start = (page - 1) * produtosPorPagina;
    const end = start + produtosPorPagina;

    const produtosPagina = produtosOrdenados.slice(start, end);

    produtosPagina.forEach(produto => {
        const tr = document.createElement("tr");

        if (!produto.ativo) tr.classList.add("inativo");

        tr.innerHTML = `
            <td data-label="Produto">
                <img src="${produto.img}" alt="${produto.nome}">
                <p>${produto.nome}</p>
            </td>

            <td data-label="Código"><span class="codigo-produto">${produto.codigo}</span></td>
            <td data-label="Preço Unit">${produto.precoUnit.toLocaleString()} Kz</td>

            <td data-label="Data/Hora">${produto.dataHora}</td>

            <td data-label="Categoria">
                <span class="category ${getCategoriaClass(produto.categoria)}">
                    ${produto.categoria}
                </span>
            </td>

            <td>
                <span data-label="Ativo" class="status ${produto.ativo ? 'ativo' : 'inativo'}">
                    <span data-label="Ativo" class="dot"></span>
                </span>
            </td>

            <td data-label="Ações" class="acoes">
                <button class="action-btn edit" data-codigo="${produto.codigo}">
                    <i class="bx bx-edit"></i>
                </button>

                <button onclick="toggleProdutoAtivo(event)"
                    class="action-btn ${produto.ativo ? 'delete' : 'ativar'}"
                    data-codigo="${produto.codigo}">
                    <i class="bx ${produto.ativo ? 'bx-lock' : 'bx-lock-open'}"></i>
                </button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

// 📌 Paginação
function renderPagination() {
    paginationUL.innerHTML = "";

    const totalPages = Math.ceil(
        getProdutosOrdenadosPorData().length / produtosPorPagina
    );

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement("li");
        li.classList.add("link");
        if (i === currentValue) li.classList.add("active");
        li.textContent = i;

        li.addEventListener("click", () => {
            currentValue = i;
            renderProdutos(currentValue);
            renderPagination();
        });

        paginationUL.appendChild(li);
    }
}

// 📌 Botões Prev / Next
document.querySelector(".btn1").addEventListener("click", () => {
    if (currentValue > 1) {
        currentValue--;
        renderProdutos(currentValue);
        renderPagination();
    }
});

document.querySelector(".btn2").addEventListener("click", () => {
    const totalPages = Math.ceil(
        getProdutosOrdenadosPorData().length / produtosPorPagina
    );

    if (currentValue < totalPages) {
        currentValue++;
        renderProdutos(currentValue);
        renderPagination();
    }
});

// 📌 Inicialização
renderProdutos(currentValue);
renderPagination();



//Agora Processo para Abrir Modal de Editar Produto
//----------------------------------------------------------
const editModal = document.getElementById("editModal");

const editForm = editModal.querySelector(".product-edit-form");
const editNome = editForm.querySelector('input[type="text"]');
const editCategoria = editForm.querySelector("select");
const editCodigo = editForm.querySelectorAll('input[type="text"]')[1];
const editPreco = editForm.querySelector('input[type="number"]');
const editPreviewImg = document.getElementById("editPreviewImg");

let produtoEmEdicaoIndex = null;


function toggleProductEditModal() {
    document.getElementById("editModal")
        .classList.toggle("active");
}

tbody.addEventListener("click", function (e) {
    const btnEdit = e.target.closest(".edit");

    if (!btnEdit) return;

    const codigo = btnEdit.dataset.codigo;
    abrirModalEdicao(codigo);
});

function abrirModalEdicao(codigo) {
    const indexReal = produtos.findIndex(
        p => p.codigo === codigo
    );

    if (indexReal === -1) return;

    produtoEmEdicaoIndex = indexReal;
    const produto = produtos[indexReal];

    editNome.value = produto.nome;
    editCategoria.value = produto.categoria;
    editCodigo.value = produto.codigo;
    editPreco.value = produto.precoUnit;
    editPreviewImg.src = produto.img;

    toggleProductEditModal();
}



//----------------------------------------------------------
//Editar Produto
//----------------------------------------------------------


// Função para salvar edição do produto
editForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (produtoEmEdicaoIndex === null) return;

    const indexEdit = Number(produtoEmEdicaoIndex);

    const nome = editNome.value.trim();
    const categoria = editCategoria.value;
    let codigo = editCodigo.value.trim();
    const preco = parseFloat(editPreco.value);

    // 1️⃣ Validar campos
    if (!nome || !categoria || isNaN(preco)) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    if (!codigo) {
        codigo = produtos[produtoEmEdicaoIndex].codigo;
    }


    // 2️⃣ Preço não pode ser negativo
    if (preco < 0) {
        alert("O preço unitário não pode ser negativo.");
        return;
    }

    // 3️⃣ Código não pode ser negativo (opcional, só se for numérico)
    if (!isNaN(codigo) && Number(codigo) < 0) {
        alert("O código não pode ser negativo.");
        return;
    }

    // 4️⃣ Código único (exceto o próprio produto)
    const codigoDuplicado = produtos.some(
        (p, idx) => p.codigo === codigo && idx !== indexEdit
    );

    if (codigoDuplicado) {
        alert("Já existe um produto com este código. Escolha outro código.");
        return;
    }

    // 5️⃣ Atualizar produto
    const produto = produtos[indexEdit];
    produto.nome = nome;
    produto.categoria = categoria;
    produto.categoryClass = gerarCategoryClass(categoria);
    produto.codigo = codigo;
    produto.precoUnit = preco;
    produto.img = editPreviewImg.src || produto.img;

    // 💾 SALVAR NO LOCAL STORAGE
    salvarNoLocalStorage("produtos", produtos);

    // 6️⃣ Feedback
    alert(`Produto "${produto.nome}" atualizado com sucesso!`);

    // 7️⃣ Re-render
    renderProdutos(currentValue);
    renderPagination();

    // 8️⃣ Fechar modal
    toggleProductEditModal();
    produtoEmEdicaoIndex = null;
});



//----------------------------------------------------------
//Registrar Produto
//----------------------------------------------------------
const productModal = document.getElementById("productModal");
const productForm = productModal.querySelector(".product-form");

const addNome = productForm.querySelector('input[type="text"]');
const addCategoria = productForm.querySelector("select");
const addCodigo = productForm.querySelectorAll('input[type="text"]')[1];
const addPreco = productForm.querySelector('input[type="number"]');

const addPreviewImg = document.getElementById("addPreviewImg");


function previewImage(event, tipo) {
    const input = event.target;

    if (!input.files || !input.files[0]) return;

    const file = input.files[0];

    // Aceitar apenas imagens
    if (!file.type.startsWith("image/")) {
        alert("⚠️ Por favor selecione um ficheiro de imagem.");
        input.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        let previewImg;

        if (tipo === "add") {
            previewImg = document.getElementById("addPreviewImg");
        } else if (tipo === "edit") {
            previewImg = document.getElementById("editPreviewImg");
        }

        if (previewImg) {
            previewImg.src = e.target.result;
        }
    };

    reader.readAsDataURL(file);
}



function gerarCategoryClass(categoria) {

    switch (categoria) {
        case "Bebidas":
            return "bebidas";
        case "Alimentação":
            return "alimentacao";
        case "Roupas & Acessórios":
            return "roupas-acessorios";
        case "Frescos":
            return "frescos";
        case "Higiene e Limpeza":
            return "higiene-limpeza";
        case "Eletrônicos & Acessórios":
            return "eletronicos-acessorios";
        case "Lanches e Doces":
            return "lanches-doces";
        case "Beleza e Cuidados Pessoais":
            return "beleza-cuidados";
        case "Farmácia":
            return "farmacia";
        case "Outro":
            return "outro";
    }

}

function formatarDataHora(data = new Date()) {
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();

    const hora = String(data.getHours()).padStart(2, "0");
    const minutos = String(data.getMinutes()).padStart(2, "0");

    return `${dia}-${mes}-${ano} ${hora}:${minutos}`;
}


productForm.addEventListener("submit", function (e) {
    e.preventDefault(); // não recarregar página

    const nome = addNome.value.trim();
    const categoria = addCategoria.value;
    let codigo = addCodigo.value.trim();
    const preco = parseFloat(addPreco.value);

    // 1️⃣ Verificar campos vazios
    if (!nome || !categoria || isNaN(preco)) {
        alert("⚠️ Preencha todos os campos.");
        return;
    }

    if (!codigo) {
        codigo = generateUniqueSaleID(produtos);
    }

    // 2️⃣ Preço não pode ser negativo ou zero
    if (preco <= 0) {
        alert("⚠️ O preço unitário deve ser maior que zero.");
        return;
    }

    if (Number(codigo) <= 0) {
        alert("⚠️ O código do produto deve ser maior que zero.");
        return;
    }

    // 3️⃣ Código deve ser único
    const codigoExiste = produtos.some(p => p.codigo === codigo);
    if (codigoExiste) {
        alert("⚠️ Já existe um produto com esse código.");
        return;
    }

    // 4️⃣ Criar novo produto
    const novoProduto = {
        nome: nome,
        categoria: categoria,
        categoryClass: gerarCategoryClass(categoria),
        codigo: codigo,
        precoUnit: preco,
        img: addPreviewImg.src || "img/people.png",
        dataHora: formatarDataHora(),
        ativo: true
    };

    // 5️⃣ Adicionar ao array
    produtos.push(novoProduto);

    // ✅ SALVAR NO LOCAL STORAGE
    salvarNoLocalStorage("produtos", produtos);

    // ✅ Feedback de sucesso
    alert("✅ Produto adicionado com sucesso!");

    // 6️⃣ Resetar formulário
    productForm.reset();
    addPreviewImg.src = "img/no-product-image.jpg";

    // 7️⃣ Fechar modal
    toggleProductModal();

    // 8️⃣ Atualizar tabela e paginação
    currentValue = 1;
    renderProdutos(currentValue);
    renderPagination();
});


//----------------------------------------------------------
//Desativar Produto
//----------------------------------------------------------

// Função para alternar ativo/inativo de um produto
function toggleProdutoAtivo(event) {
    const btn = event.currentTarget;
    const codigo = btn.dataset.codigo; // pega o código

    // Encontrar o índice real no array pelo código
    const index = produtos.findIndex(p => p.codigo === codigo);
    if (index === -1) return;

    const produto = produtos[index];

    if (produto.ativo) {
        const confirmacao = confirm(`Tem certeza que deseja desativar o produto "${produto.nome}"?`);
        if (!confirmacao) return;
    }

    produto.ativo = !produto.ativo;

    salvarNoLocalStorage("produtos", produtos);
    alert(`Produto "${produto.nome}" foi ${produto.ativo ? 'ativado' : 'desativado'}.`);

    renderProdutos(currentValue);
    renderPagination();
}

