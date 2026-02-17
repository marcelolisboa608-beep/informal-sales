
//Autocomplete para procurar produtos na hora de registrar venda
//////////////////////////////////////////

function salvarNoLocalStorage(chave, dados) {
	localStorage.setItem(chave, JSON.stringify(dados));
}

function lerDoLocalStorage(chave) {
	const dados = localStorage.getItem(chave);
	return dados ? JSON.parse(dados) : null;
}

// 📦 Salvar Categorias no LocalStorage
let categoriasF = lerDoLocalStorage("categoriasF");

if (!categoriasF) {
	categoriasF = [
		"Bebidas",
		"Alimentação",
		"Roupas & Acessórios",
		"Frescos",
		"Higiene e Limpeza",
		"Eletrônicos & Acessórios",
		"Lanches e Doces",
		"Beleza e Cuidados Pessoais",
		"Farmácia",
		"Outro"
	];

	salvarNoLocalStorage("categoriasF", categoriasF);
}

// 📦 Salvar Produtos no LocalStorage
let produtos = lerDoLocalStorage("produtos");

if (!produtos) {

	produtos = [
		{
			nome: "Fanta Laranja 1L",
			precoUnit: 450,
			codigo: "7891000000001",
			dataHora: "01-10-2023 10:15",
			categoria: "Bebidas",
			img: "img/fanta-laranja-1l.png",
			ativo: true
		},
		{
			nome: "Arroz 5Kg",
			precoUnit: 6500,
			codigo: "7891000000004",
			dataHora: "02-10-2023 10:00",
			categoria: "Alimentação",
			img: "img/arroz-5kg.jpg",
			ativo: true
		},
		{
			nome: "Camiseta Básica Algodão M",
			precoUnit: 1500,
			codigo: "7891000000007",
			dataHora: "03-10-2023 11:10",
			categoria: "Roupas & Acessórios",
			img: "img/camiseta-algodao.webp",
			ativo: true
		},
		{
			nome: "Frango Fresco 1Kg",
			precoUnit: 2500,
			codigo: "7891000000009",
			dataHora: "04-10-2023 09:50",
			categoria: "Frescos",
			img: "img/frango-fresco.webp",
			ativo: true
		},
		{
			nome: "Sabão em Pó 1Kg",
			precoUnit: 1200,
			codigo: "7891000000011",
			dataHora: "05-10-2023 11:20",
			categoria: "Higiene e Limpeza",
			img: "img/sabao-po.jpg",
			ativo: true
		},
		{
			nome: "Carregador USB",
			precoUnit: 1500,
			codigo: "7891000000013",
			dataHora: "10-10-2023 11:15",
			categoria: "Eletrônicos & Acessórios",
			img: "img/carregador-usb.avif",
			ativo: true
		},
		{
			nome: "Bolacha Maria 200g",
			precoUnit: 350,
			codigo: "7891000000015",
			dataHora: "11-10-2023 10:35",
			categoria: "Lanches e Doces",
			img: "img/bolacha-maria.png",
			ativo: true
		},
		{
			nome: "Creme Hidratante 200ml",
			precoUnit: 1200,
			codigo: "7891000000017",
			dataHora: "12-10-2023 11:05",
			categoria: "Beleza e Cuidados Pessoais",
			img: "img/creme-hidratante.webp",
			ativo: true
		},
		{
			nome: "Paracetamol 500mg 10 comp",
			precoUnit: 300,
			codigo: "7891000000019",
			dataHora: "13-10-2023 09:55",
			categoria: "Farmácia",
			img: "img/paracetamol.png",
			ativo: true
		},
		{
			nome: "Coca-Cola 1L",
			precoUnit: 500,
			codigo: "7891000000002",
			dataHora: "14-10-2023 11:00",
			categoria: "Bebidas",
			img: "img/coca-cola.webp",
			ativo: true
		},
		{
			nome: "Macarrão 500g",
			precoUnit: 850,
			codigo: "7891000000005",
			dataHora: "15-10-2023 10:20",
			categoria: "Alimentação",
			img: "img/macarrao.jpg",
			ativo: true
		},
		{
			nome: "Boné Aba Curva",
			precoUnit: 800,
			codigo: "7891000000008",
			dataHora: "16-10-2023 11:30",
			categoria: "Roupas & Acessórios",
			img: "img/bone-aba-curva.webp",
			ativo: true
		},
		{
			nome: "Ovos Brancos 12 unidades",
			precoUnit: 850,
			codigo: "7891000000010",
			dataHora: "17-10-2023 09:40",
			categoria: "Frescos",
			img: "img/ovos-brancos.jpg",
			ativo: true
		},
		{
			nome: "Pasta de Dentes 90g",
			precoUnit: 500,
			codigo: "7891000000012",
			dataHora: "18-10-2023 10:50",
			categoria: "Higiene e Limpeza",
			img: "img/pasta-de-dentes.jpg",
			ativo: true
		},
		{
			nome: "Fone de Ouvido P2",
			precoUnit: 2000,
			codigo: "7891000000014",
			dataHora: "19-10-2023 11:40",
			categoria: "Eletrônicos & Acessórios",
			img: "img/fone-ouvido-p2.webp",
			ativo: true
		},
		{
			nome: "Chocolate Ao Leite 100g",
			precoUnit: 400,
			codigo: "7891000000016",
			dataHora: "20-10-2023 10:25",
			categoria: "Lanches e Doces",
			img: "img/chocolate-leite.webp",
			ativo: true
		},
		{
			nome: "Perfume Feminino 50ml",
			precoUnit: 3500,
			codigo: "7891000000018",
			dataHora: "21-10-2023 11:25",
			categoria: "Beleza e Cuidados Pessoais",
			img: "img/perfume-feminino.webp",
			ativo: true
		},
		{
			nome: "Máscara Descartável 10 un",
			precoUnit: 400,
			codigo: "7891000000020",
			dataHora: "22-10-2023 10:05",
			categoria: "Farmácia",
			img: "img/mascara-descartavel.jpg",
			ativo: true
		},
		{
			nome: "Pão Francês 1 unidade",
			precoUnit: 120,
			codigo: "7891000000006",
			dataHora: "23-10-2023 10:45",
			categoria: "Alimentação",
			img: "img/pao-frances.avif",
			ativo: true
		},
		{
			nome: "Água Mineral 500ml",
			precoUnit: 150,
			codigo: "7891000000003",
			dataHora: "24-10-2023 09:30",
			categoria: "Bebidas",
			img: "img/agua-mineral.jpg",
			ativo: true
		}
	];

	salvarNoLocalStorage("produtos", produtos);
}

function generateShortAlphaID(length = 8) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let id = '';
	for (let i = 0; i < length; i++) {
		id += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return id;
}

function generateUniqueSaleID(vendas, length = 8) {
	let id;
	do {
		id = generateShortAlphaID(length);
	} while (vendas.some(v => v.ID === id));
	return id;
}


// 📦 Salvar Vendas no LocalStorage
let vendas = lerDoLocalStorage("vendas");

if (!vendas) {

	vendas = [
		{
			codigoProduto: "7891000000001",
			nomeProduto: "Fanta Laranja 1L",
			img: "img/fanta-laranja-1l.png",
			categoria: "Bebidas",
			quantidade: 2,
			precoUnit: 450,
			precoTotal: 900,
			dataHora: "09-02-2026 09:00",
			tipoPagamento: "Dinheiro"
		},
		{
			codigoProduto: "7891000000004",
			nomeProduto: "Arroz 5Kg",
			img: "img/arroz-5kg.jpg",
			categoria: "Alimentação",
			quantidade: 1,
			precoUnit: 6500,
			precoTotal: 6500,
			dataHora: "09-02-2026 09:30",
			tipoPagamento: "Transferência"
		},
		{
			codigoProduto: "7891000000007",
			nomeProduto: "Camiseta Básica Algodão M",
			img: "img/camiseta-algodao.webp",
			categoria: "Roupas & Acessórios",
			quantidade: 3,
			precoUnit: 1500,
			precoTotal: 4500,
			dataHora: "09-02-2026 10:00",
			tipoPagamento: "TPA"
		},
		{
			codigoProduto: "7891000000009",
			nomeProduto: "Frango Fresco 1Kg",
			img: "img/frango-fresco.webp",
			categoria: "Frescos",
			quantidade: 2,
			precoUnit: 2500,
			precoTotal: 5000,
			dataHora: "09-02-2026 10:30",
			tipoPagamento: "Mobile Money"
		},
		{
			codigoProduto: "7891000000011",
			nomeProduto: "Sabão em Pó 1Kg",
			img: "img/sabao-po.jpg",
			categoria: "Higiene e Limpeza",
			quantidade: 5,
			precoUnit: 1200,
			precoTotal: 6000,
			dataHora: "09-02-2026 11:00",
			tipoPagamento: "Dinheiro"
		},
		{
			codigoProduto: "7891000000013",
			nomeProduto: "Carregador USB",
			categoria: "Eletrônicos & Acessórios",
			img: "img/carregador-usb.avif",
			quantidade: 1,
			precoUnit: 1500,
			precoTotal: 1500,
			dataHora: "09-02-2026 11:30",
			tipoPagamento: "TPA"
		},
		{
			codigoProduto: "7891000000015",
			nomeProduto: "Bolacha Maria 200g",
			categoria: "Lanches e Doces",
			img: "img/bolacha-maria.png",
			quantidade: 4,
			precoUnit: 350,
			precoTotal: 1400,
			dataHora: "09-02-2026 12:00",
			tipoPagamento: "Transferência"
		},
		{
			codigoProduto: "7891000000017",
			nomeProduto: "Creme Hidratante 200ml",
			categoria: "Beleza e Cuidados Pessoais",
			img: "img/creme-hidratante.webp",
			quantidade: 2,
			precoUnit: 1200,
			precoTotal: 2400,
			dataHora: "09-02-2026 12:30",
			tipoPagamento: "Dinheiro"
		},
		{
			codigoProduto: "7891000000019",
			nomeProduto: "Paracetamol 500mg 10 comp",
			img: "img/paracetamol.png",
			categoria: "Farmácia",
			quantidade: 1,
			precoUnit: 300,
			precoTotal: 300,
			dataHora: "09-02-2026 13:00",
			tipoPagamento: "Mobile Money"
		},
		{
			codigoProduto: "7891000000002",
			nomeProduto: "Coca-Cola 1L",
			categoria: "Bebidas",
			img: "img/coca-cola.webp",
			quantidade: 6,
			precoUnit: 500,
			precoTotal: 3000,
			dataHora: "09-02-2026 13:30",
			tipoPagamento: "TPA"
		},
		{
			codigoProduto: "7891000000005",
			nomeProduto: "Macarrão 500g",
			categoria: "Alimentação",
			img: "img/macarrao.jpg",
			quantidade: 2,
			precoUnit: 850,
			precoTotal: 1700,
			dataHora: "09-02-2026 14:00",
			tipoPagamento: "Dinheiro"
		},
		{
			codigoProduto: "7891000000008",
			nomeProduto: "Boné Aba Curva",
			categoria: "Roupas & Acessórios",
			img: "img/bone-aba-curva.webp",
			quantidade: 1,
			precoUnit: 800,
			precoTotal: 800,
			dataHora: "09-02-2026 14:30",
			tipoPagamento: "Transferência"
		},
		{
			codigoProduto: "7891000000010",
			nomeProduto: "Ovos Brancos 12 unidades",
			categoria: "Frescos",
			img: "img/ovos-brancos.jpg",
			quantidade: 3,
			precoUnit: 850,
			precoTotal: 2550,
			dataHora: "09-02-2026 15:00",
			tipoPagamento: "TPA"
		},
		{
			codigoProduto: "7891000000012",
			nomeProduto: "Pasta de Dentes 90g",
			categoria: "Higiene e Limpeza",
			img: "img/pasta-de-dentes.jpg",
			quantidade: 2,
			precoUnit: 500,
			precoTotal: 1000,
			dataHora: "09-02-2026 15:30",
			tipoPagamento: "Mobile Money"
		},
		{
			codigoProduto: "7891000000014",
			nomeProduto: "Fone de Ouvido P2",
			categoria: "Eletrônicos & Acessórios",
			img: "img/fone-ouvido-p2.webp",
			quantidade: 1,
			precoUnit: 2000,
			precoTotal: 2000,
			dataHora: "09-02-2026 16:00",
			tipoPagamento: "Dinheiro"
		},
		{
			codigoProduto: "7891000000016",
			nomeProduto: "Chocolate Ao Leite 100g",
			categoria: "Lanches e Doces",
			img: "img/chocolate-leite.webp",
			quantidade: 5,
			precoUnit: 400,
			precoTotal: 2000,
			dataHora: "09-02-2026 16:30",
			tipoPagamento: "TPA"
		},
		{
			codigoProduto: "7891000000018",
			nomeProduto: "Perfume Feminino 50ml",
			categoria: "Beleza e Cuidados Pessoais",
			img: "img/perfume-feminino.webp",
			quantidade: 1,
			precoUnit: 3500,
			precoTotal: 3500,
			dataHora: "10-02-2026 17:00",
			tipoPagamento: "Transferência"
		},
		{
			codigoProduto: "7891000000020",
			nomeProduto: "Máscara Descartável 10 un",
			categoria: "Farmácia",
			img: "img/mascara-descartavel.jpg",
			quantidade: 10,
			precoUnit: 400,
			precoTotal: 4000,
			dataHora: "10-02-2026 17:30",
			tipoPagamento: "Dinheiro"
		},
		{
			codigoProduto: "7891000000006",
			nomeProduto: "Pão Francês 1 unidade",
			categoria: "Alimentação",
			img: "img/pao-frances.avif",
			quantidade: 6,
			precoUnit: 120,
			precoTotal: 720,
			dataHora: "10-02-2026 18:00",
			tipoPagamento: "Mobile Money"
		},
		{
			codigoProduto: "7891000000003",
			nomeProduto: "Água Mineral 500ml",
			categoria: "Bebidas",
			img: "img/agua-mineral.jpg",
			quantidade: 4,
			precoUnit: 150,
			precoTotal: 600,
			dataHora: "10-02-2026 18:30",
			tipoPagamento: "TPA"
		}
	];

	vendas.forEach(venda => {
		venda.ID = generateShortAlphaID(); // ou generateShortAlphaID()
	});

	salvarNoLocalStorage("vendas", vendas);
}

//localStorage.removeItem("vendasDetectadas");
// 📦 Salvar Vendas no LocalStorage
let vendasDetectadas = lerDoLocalStorage("vendasDetectadas");

if (!vendasDetectadas) {

	vendasDetectadas = [
		{
			codigoProduto: "7891000000001",
			nomeProduto: "Fanta Laranja 1L",
			img: "img/fanta-laranja-1l.png",
			categoria: "Bebidas",
			quantidade: 2,
			precoUnit: 450,
			precoTotal: 900,
			dataHora: "25-01-2026 21:12",
			tipoPagamento: "Dinheiro"
		},
		{
			codigoProduto: "7891000000004",
			nomeProduto: "Arroz 5Kg",
			img: "img/arroz-5kg.jpg",
			categoria: "Alimentação",
			quantidade: 1,
			precoUnit: 6500,
			precoTotal: 6500,
			dataHora: "25-01-2026 21:12",
			tipoPagamento: "Transferência"
		}

	];

	vendasDetectadas.forEach(vendasDetectadas => {
		vendasDetectadas.ID = generateShortAlphaID(); // ou generateShortAlphaID()
	});

	salvarNoLocalStorage("vendasDetectadas", vendasDetectadas);
}


function getTipoPagamentoClass(tipo) {
	switch (tipo.toLowerCase()) {
		case "tpa":
			return "tpa";
		case "dinheiro":
			return "dinheiro";
		case "transferência":
			return "transferencia";
		case "mobile money":
			return "mobile";
		default:
			return "";
	}
}

function getCategoriaClass(categoria) {
	const mapping = {
		"Bebidas": "bebidas",
		"Alimentação": "alimentacao",
		"Roupas & Acessórios": "roupas-acessorios",
		"Frescos": "frescos",
		"Higiene e Limpeza": "higiene-limpeza",
		"Eletrônicos & Acessórios": "eletronicos-acessorios",
		"Lanches e Doces": "lanches-doces",
		"Beleza e Cuidados Pessoais": "beleza-cuidados",
		"Farmácia": "farmacia",
		"Outro": "outro"
	};

	return mapping[categoria] || "outro"; // padrão caso a categoria não exista
}


// TOGGLE SIDEBAR
//////////////////////////////////////////
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

const rightIcons = document.querySelector('.right-icons');
const head = document.querySelector('.head');
const sidebarWidth = 250; // largura do sidebar quando aberto


menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
	rightIcons.classList.toggle('shifted', sidebar.classList.contains('hide'));
})



const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
	if (window.innerWidth < 576) {
		e.preventDefault();
		searchForm.classList.toggle('show');
		if (searchForm.classList.contains('show')) {
			searchButtonIcon.classList.replace('bx-search', 'bx-x');
		} else {
			searchButtonIcon.classList.replace('bx-x', 'bx-search');
		}
	}
})


if (window.innerWidth < 768) {
	sidebar.classList.add('hide');
} else if (window.innerWidth > 576) {
	searchButtonIcon.classList.replace('bx-x', 'bx-search');
	searchForm.classList.remove('show');
}


window.addEventListener('resize', function () {
	if (this.innerWidth > 576) {
		searchButtonIcon.classList.replace('bx-x', 'bx-search');
		searchForm.classList.remove('show');
	}
})


const switchMode = document.getElementById('switch-mode');

/* switchMode.addEventListener('change', function () {
	if (this.checked) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
}) */


//Efeito para a paginação
//////////////////////////////////////////
//------------------------------------------------------------------
let link = document.getElementsByClassName("link");

let currentValue = 1;

function activeLink() {
	for (let l of link) {
		l.classList.remove("active");
	}
	event.target.classList.add("active");
	currentValue = event.target.value;

}

// ATIVAR MENU DA SIDEBAR BASEADO NA PÁGINA ATUAL
//////////////////////////////////////////
// ---------------------------------------------
const sideMenuLinks = document.querySelectorAll('#sidebar .side-menu.top li a');
const currentPage = window.location.pathname.split('/').pop();

sideMenuLinks.forEach(link => {
	const li = link.parentElement;
	const href = link.getAttribute('href');


	if (href === currentPage) {
		li.classList.add('active');
		return;
	}


	if (
		href === 'graficos.html' &&
		currentPage.startsWith('graficos-')
	) {
		li.classList.add('active');
	}

	if (
		href === 'vendas.html' &&
		currentPage.startsWith('vendas-')
	) {
		li.classList.add('active');
	}




});


// -------------------------


//filto dropdown
//---------------------------------------------------------------------

const filterBtn = document.getElementById("filterBtn");
const filterDropdown = document.getElementById("filterDropdown");
const filterBtn2 = document.getElementById("filterBtn2");
const filterDropdown2 = document.getElementById("filterDropdown2");

filterBtn.addEventListener("click", () => {
	filterDropdown.style.display =
		filterDropdown.style.display === "block" ? "none" : "block";
});

// Fechar quando clicar fora
document.addEventListener("click", function (e) {
	if (!filterDropdown.contains(e.target) && !filterBtn.contains(e.target)) {
		filterDropdown.style.display = "none";
	}
});

filterBtn2.addEventListener("click", () => {
	filterDropdown2.style.display =
		filterDropdown2.style.display === "block" ? "none" : "block";
});

// Fechar quando clicar fora
document.addEventListener("click", function (e) {
	if (!filterDropdown2.contains(e.target) && !filterBtn2.contains(e.target)) {
		filterDropdown2.style.display = "none";
	}
});

// Abrir Modal do registo de produtos
function toggleProductModal() {
	document.getElementById("productModal")
		.classList.toggle("active");
}

// Abrir Modal do registo de produtos
function toggleSaleModal() {
	document.getElementById("saleModal")
		.classList.toggle("active");
}

//Fechar Modais clicando fora do modal
function closeOnOverlay(event) {
	if (event.target.id === "productModal") {
		toggleProductModal();
	}

	if (event.target.id === "saleModal") {
		toggleSaleModal();
	}

	if (event.target.id === "editModal") {
		toggleProductEditModal();
	}

}



