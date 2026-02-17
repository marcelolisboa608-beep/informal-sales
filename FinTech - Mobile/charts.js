const ctx = document.getElementById('doughnut-chart');
const ctx1 = document.getElementById('line-chart');
const ctx2 = document.getElementById('vendas-periodo-estipulado');
const ctx3 = document.getElementById('5-produtos-mais-vendidos');
const ctx4 = document.getElementById('5-produtos-mais-lucrativos');
const ctx5 = document.getElementById('5-categorias-mais-lucrativas');
const ctx6 = document.getElementById('comparacao-semanas');
const ctx7 = document.getElementById('comparacao-meses');
const ctx8 = document.getElementById('crescimento-categoria-comparacao-meses');
const ctx9 = document.getElementById('proximos-7-dias');
const ctx10 = document.getElementById('produtos-variacao-prevista');
const ctx11 = document.getElementById('produtos-3-mais-potencial');

// ======================================
// CALCULAR TOP 5 PRODUTOS MAIS VENDIDOS
// ======================================
function gerarTop5Produtos(vendas) {
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
    const labels = top5.map(item => item[0]);
    const data = top5.map(item => item[1]);

    return { labels, data };
}

if (ctx) {
    const { labels, data } = gerarTop5Produtos(vendas);

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Quantidade vendida',
                data: data,
                backgroundColor: [
                    'rgba(41,155,99,1)',
                    'rgba(54,162,235,1)',
                    'rgba(255,206,86,1)',
                    'rgba(120,46,139,1)',
                    'rgba(244, 155, 0, 1)'
                ],
                borderColor: [
                    'rgba(41,155,99,1)',
                    'rgba(54,162,235,1)',
                    'rgba(255,206,86,1)',
                    'rgba(120,46,139,1)',
                    'rgba(244, 155, 0, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}


// ======================================
// CALCULAR ÚLTIMOS 7 DIAS
// ======================================

// Função para obter dia da semana abreviado em português
function getDiaSemanaAbreviado(dataStr) {
    const [data, hora] = dataStr.split(" ");
    const [dia, mes, ano] = data.split("-");
    const d = new Date(`${ano}-${mes}-${dia}T${hora}:00`);
    const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
    return dias[d.getDay()];
}

// Função para gerar os últimos 7 dias e os ganhos por dia
function gerarVendasUltimos7Dias(vendas) {
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

    return { labels: diasLabels, data: ganhos };
}


if (ctx1) {
    let { labels, data } = gerarVendasUltimos7Dias(vendas);

    new Chart(ctx1, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ganhos em Kz',
                data: data,
                backgroundColor: 'rgba(41,155,99,0.2)',
                borderColor: 'rgba(41,155,99,1)',
                borderWidth: 2,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // ⚡ permite ajustar altura no container
            plugins: {
                legend: {
                    position: 'bottom', // mais espaço em telas pequenas
                    labels: {
                        font: { size: 12 } // diminui fonte para mobile
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                x: {
                    ticks: { font: { size: 12 } } // reduz tamanho do texto eixo X
                },
                y: {
                    ticks: { font: { size: 12 } } // reduz tamanho do texto eixo Y
                }
            }
        }
    });
}


if (ctx2) {
    const { labels, data } = gerarVendasUltimos7Dias(vendas);

    new Chart(ctx2, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ganhos em Kz',
                data: data,
                backgroundColor: 'rgba(41,155,99,0.2)',
                borderColor: 'rgba(41,155,99,1)',
                borderWidth: 2,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // ⚡ permite ajustar altura no container
            plugins: {
                legend: {
                    position: 'bottom', // mais espaço em telas pequenas
                    labels: {
                        font: { size: 12 } // diminui fonte para mobile
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                x: {
                    ticks: { font: { size: 12 } } // reduz tamanho do texto eixo X
                },
                y: {
                    ticks: { font: { size: 12 } } // reduz tamanho do texto eixo Y
                }
            }
        }
    });
}


if (ctx3) {
    const { labels, data } = gerarTop5Produtos(vendas);

    new Chart(ctx3, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Quantidade vendida',
                data: data,
                backgroundColor: [
                    'rgba(41,155,99,1)',
                    'rgba(54,162,235,1)',
                    'rgba(255,206,86,1)',
                    'rgba(120,46,139,1)',
                    'rgba(244, 155, 0, 1)'
                ],
                borderColor: [
                    'rgba(41,155,99,1)',
                    'rgba(54,162,235,1)',
                    'rgba(255,206,86,1)',
                    'rgba(120,46,139,1)',
                    'rgba(244, 155, 0, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}


// ======================================
// CALCULAR TOP 5 PRODUTOS MAIS LUCRATIVOS
// ======================================

// Função para gerar top 5 produtos mais lucrativos
function gerarTop5ProdutosMaisLucrativos(vendas) {
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
    const labels = top5.map(item => item[0]);
    const data = top5.map(item => item[1]);

    return { labels, data };
}

if (ctx4) {
    const { labels, data } = gerarTop5ProdutosMaisLucrativos(vendas);

    new Chart(ctx4, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Lucro Total (Kz)',
                data: data,
                backgroundColor: [
                    'rgba(41,155,99,1)',
                    'rgba(54,162,235,1)',
                    'rgba(255,206,86,1)',
                    'rgba(120,46,139,1)',
                    'rgba(244, 155, 0, 1)'
                ],
                borderColor: [
                    'rgba(41,155,99,1)',
                    'rgba(54,162,235,1)',
                    'rgba(255,206,86,1)',
                    'rgba(120,46,139,1)',
                    'rgba(244, 155, 0, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false, // ⚡ permite ajustar altura no container
            plugins: {
                legend: {
                    position: 'bottom', // mais espaço em telas pequenas
                    labels: {
                        font: { size: 12 } // diminui fonte para mobile
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                x: {
                    ticks: { font: { size: 9 } } // reduz tamanho do texto eixo X
                },
                y: {
                    ticks: { font: { size: 9 } } // reduz tamanho do texto eixo Y
                }
            }
        }
    });
}


// ======================================
// CALCULAR TOP 5 CATEGORIAS MAIS LUCRATIVAS
// ======================================

// Função para gerar Top 5 categorias mais lucrativas
function gerarTop5CategoriasMaisLucrativas(vendas) {
    const lucroPorCategoria = {};

    // Somar lucro por categoria
    vendas.forEach(v => {
        lucroPorCategoria[v.categoria] = (lucroPorCategoria[v.categoria] || 0) + v.precoTotal;
    });

    // Ordenar por lucro decrescente e pegar as 5 primeiras
    const top5 = Object.entries(lucroPorCategoria)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const labels = top5.map(item => item[0]);
    const data = top5.map(item => item[1]);

    return { labels, data };
}

if (ctx5) {
    const { labels, data } = gerarTop5CategoriasMaisLucrativas(vendas);

    new Chart(ctx5, {
        type: 'polarArea',
        data: {
            labels: labels,
            datasets: [{
                label: 'Lucro Total (Kz)',
                data: data,
                backgroundColor: [
                    'rgba(41,155,99,1)',
                    'rgba(54,162,235,1)',
                    'rgba(255,206,86,1)',
                    'rgba(120,46,139,1)',
                    'rgba(244, 155, 0, 1)'
                ],
                borderColor: [
                    'rgba(41,155,99,1)',
                    'rgba(54,162,235,1)',
                    'rgba(255,206,86,1)',
                    'rgba(120,46,139,1)',
                    'rgba(244, 155, 0, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}


// ======================================
// SEMANA ACTUAL VS SEMANA PASSADA
// ======================================

// Função para obter dia da semana abreviado em português
function getDiaSemanaAbreviado(dataStr) {
    const [data, hora] = dataStr.split(" ");
    const [dia, mes, ano] = data.split("-");
    const d = new Date(`${ano}-${mes}-${dia}T${hora}:00`);
    const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
    return dias[d.getDay()];
}

// Função para gerar ganhos diários de uma semana específica
function gerarGanhosSemana(vendas, dataReferencia) {
    // dataReferencia é qualquer dia da semana que queremos calcular (Date)
    const ganhosPorDia = { "Seg": 0, "Ter": 0, "Qua": 0, "Qui": 0, "Sex": 0, "Sab": 0, "Dom": 0 };

    // Descobrir segunda-feira da semana de dataReferencia
    const segunda = new Date(dataReferencia);
    segunda.setDate(segunda.getDate() - ((segunda.getDay() + 6) % 7)); // Segunda da semana

    // Criar mapa de datas (DD-MM-YYYY) para cada dia da semana
    const datasDaSemana = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(segunda);
        d.setDate(segunda.getDate() + i);
        const dia = String(d.getDate()).padStart(2, "0");
        const mes = String(d.getMonth() + 1).padStart(2, "0");
        const ano = d.getFullYear();
        datasDaSemana.push(`${dia}-${mes}-${ano}`);
    }

    // Somar vendas de cada dia
    vendas.forEach(v => {
        const [data] = v.dataHora.split(" ");
        const indice = datasDaSemana.indexOf(data);
        if (indice !== -1) {
            const diaSemana = getDiaSemanaAbreviado(v.dataHora);
            ganhosPorDia[diaSemana] += v.precoTotal;
        }
    });

    // Retornar array de ganhos na ordem Seg -> Dom
    return ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"].map(d => ganhosPorDia[d]);
}


if (ctx6) {
    const hoje = new Date();

    const ganhosSemanaAtual = gerarGanhosSemana(vendas, hoje);

    // Para semana passada, subtrair 7 dias
    const semanaPassada = new Date();
    semanaPassada.setDate(hoje.getDate() - 7);
    const ganhosSemanaPassada = gerarGanhosSemana(vendas, semanaPassada);

    new Chart(ctx6, {
        type: 'line',
        data: {
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
            datasets: [
                {
                    label: 'Ganhos na Semana Actual (Kz)',
                    data: ganhosSemanaAtual,
                    backgroundColor: 'rgba(41,155,99,0.2)',
                    borderColor: 'rgba(41,155,99,1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3
                },
                {
                    label: 'Ganhos na Semana Passada (Kz)',
                    data: ganhosSemanaPassada,
                    backgroundColor: 'rgba(54,162,235,0.2)',
                    borderColor: 'rgba(54,162,235,1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // ⚡ permite ajustar altura no container
            plugins: {
                legend: {
                    position: 'bottom', // mais espaço em telas pequenas
                    labels: {
                        font: { size: 12 } // diminui fonte para mobile
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                x: {
                    ticks: { font: { size: 9 } } // reduz tamanho do texto eixo X
                },
                y: {
                    ticks: { font: { size: 9 } } // reduz tamanho do texto eixo Y
                }
            }
        }
    });
}




//_________________________________________________________________________
// ======================================
// MÊS ACTUAL VS MÊS PASSADO
// ======================================

// Função para obter lucro total por dia
function lucroPorDia(vendas) {
    const lucro = {};
    vendas.forEach(v => {
        const [data] = v.dataHora.split(" "); // "DD-MM-YYYY"
        lucro[data] = (lucro[data] || 0) + v.precoTotal;
    });
    return lucro;
}

// Função para calcular médias semanais de um mês específico
function mediasSemanaisDoMes(vendas, ano, mes) {
    const lucroDia = lucroPorDia(vendas);
    const semanas = [[], [], [], []]; // 4 semanas
    // Percorrer todos os dias do mês
    const ultimoDia = new Date(ano, mes, 0).getDate(); // último dia do mês
    for (let d = 1; d <= ultimoDia; d++) {
        const diaStr = String(d).padStart(2, "0");
        const mesStr = String(mes).padStart(2, "0");
        const dataStr = `${diaStr}-${mesStr}-${ano}`;
        const valor = lucroDia[dataStr] || 0;

        if (d <= 7) semanas[0].push(valor);
        else if (d <= 14) semanas[1].push(valor);
        else if (d <= 21) semanas[2].push(valor);
        else semanas[3].push(valor);
    }

    // Calcular médias
    return semanas.map(sem => sem.reduce((a, b) => a + b, 0) / sem.length);
}

// ---------------------
// Gerar dados para gráfico
// ---------------------
const hoje = new Date();
const anoAtual = hoje.getFullYear();
const mesAtual = hoje.getMonth() + 1; // getMonth() é 0-indexado

let mesAnterior = mesAtual - 1;
let anoAnterior = anoAtual;
if (mesAnterior === 0) { // Janeiro -> Dezembro do ano anterior
    mesAnterior = 12;
    anoAnterior--;
}

const mediasAtual = mediasSemanaisDoMes(vendas, anoAtual, mesAtual);
const mediasPassado = mediasSemanaisDoMes(vendas, anoAnterior, mesAnterior);

if (ctx7) {
    new Chart(ctx7, {
        type: 'bar',
        data: {
            labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
            datasets: [
                {
                    label: 'Média da Semana - Mês Passado (Kz)',
                    data: mediasPassado,
                    backgroundColor: [
                        'rgba(37, 107, 73, 1)',
                        'rgba(45, 109, 152, 1)',
                        'rgba(186, 151, 61, 1)',
                        'rgba(87, 43, 98, 1)'
                    ],
                    borderColor: [
                        'rgba(37, 107, 73, 1)',
                        'rgba(45, 109, 152, 1)',
                        'rgba(186, 151, 61, 1)',
                        'rgba(87, 43, 98, 1)'
                    ],
                    borderWidth: 1
                },
                {
                    label: 'Média da Semana - Mês Actual (Kz)',
                    data: mediasAtual,
                    backgroundColor: [
                        'rgba(41,155,99,1)',
                        'rgba(54,162,235,1)',
                        'rgba(255,206,86,1)',
                        'rgba(120,46,139,1)'
                    ],
                    borderColor: [
                        'rgba(41,155,99,1)',
                        'rgba(54,162,235,1)',
                        'rgba(255,206,86,1)',
                        'rgba(120,46,139,1)'
                    ],
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // ⚡ permite ajustar altura no container
            plugins: {
                legend: {
                    position: 'bottom', // mais espaço em telas pequenas
                    labels: {
                        font: { size: 12 } // diminui fonte para mobile
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                x: {
                    ticks: { font: { size: 9 } } // reduz tamanho do texto eixo X
                },
                y: {
                    ticks: { font: { size: 9 } } // reduz tamanho do texto eixo Y
                }
            }
        }
    });
}


// ======================================
// CRESCIMENTO POR CATEGORIA - MÊS ACTUAL VS MÊS PASSADO
// ======================================
//_____________________________________________________________________________

// Função para agrupar vendas por categoria em um determinado mês e ano
function vendasPorCategoriaNoMes(vendas, ano, mes) {
    const categoriasMap = {}; // categoria => soma precoTotal

    vendas.forEach(v => {
        const [data] = v.dataHora.split(" "); // "DD-MM-YYYY"
        const [diaStr, mesStr, anoStr] = data.split("-");
        const vendaAno = parseInt(anoStr);
        const vendaMes = parseInt(mesStr);

        if (vendaAno === ano && vendaMes === mes) {
            categoriasMap[v.categoria] = (categoriasMap[v.categoria] || 0) + v.precoTotal;
        }
    });

    return categoriasMap;
}

// Obter meses
const hoje2 = new Date();
const anoAtual2 = hoje2.getFullYear();
let mesAtual2 = hoje2.getMonth() + 1; // Janeiro = 1
let mesPassado = mesAtual2 - 1;
let anoPassado = anoAtual2;
if (mesPassado === 0) {
    mesPassado = 12;
    anoPassado--;
}

// Todas as categorias presentes nas vendas
const todasCategorias = [...new Set(vendas.map(v => v.categoria))];

// Função para criar array com valores das categorias (mesmo ordem)
function criarArrayCategorias(categorias, mapa) {
    return categorias.map(cat => mapa[cat] || 0);
}

// Lucro por categoria em cada mês
const lucroAtual = vendasPorCategoriaNoMes(vendas, anoAtual2, mesAtual2);
const lucroPassado = vendasPorCategoriaNoMes(vendas, anoPassado, mesPassado);

// Arrays alinhados por categoria
const mesAtualCategoria = criarArrayCategorias(todasCategorias, lucroAtual);
const mesAnteriorCategoria = criarArrayCategorias(todasCategorias, lucroPassado);

// Calcular crescimento percentual
const crescimento = mesAnteriorCategoria.map((valor, i) => {
    if (valor === 0 && mesAtualCategoria[i] > 0) return 100; // novo crescimento
    if (valor === 0 && mesAtualCategoria[i] === 0) return 0;   // sem vendas
    return Number(((mesAtualCategoria[i] - valor) / valor * 100).toFixed(2));
});

// Definir cores: verde se positivo, vermelho se negativo
const cores = crescimento.map(valor => valor >= 0 ? 'rgba(41,155,99,0.9)' : 'rgba(255,99,132,0.9)');

if (ctx8) {
    new Chart(ctx8, {
        type: 'bar',
        data: {
            labels: todasCategorias,
            datasets: [{
                label: 'Crescimento (%) por Categoria',
                data: crescimento,
                backgroundColor: cores,
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y', // barras horizontais
            responsive: true,
            maintainAspectRatio: false, // ⚡ permite ajustar altura no container
            layout: {
                padding: {
                    top: 10,
                    bottom: 10,
                    left: 10,
                    right: 20
                }
            },
            plugins: {
                legend: {
                    position: 'bottom', // mais espaço em telas pequenas
                    labels: {
                        font: { size: 12 } // diminui fonte para mobile
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: context => context.raw + "%"
                    }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: "Crescimento (%)" },
                    ticks: {
                        font: { size: 9 }, // reduz tamanho do texto eixo X
                        callback: value => value + "%"
                    },
                    beginAtZero: true
                },
                y: {
                    title: { display: true, text: "Categorias" },
                    ticks: { font: { size: 9 } } // reduz tamanho do texto eixo Y
                }
            }
        }
    });
}


//______________________________________________________________________________


// Próximos 7 dias
const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

// Valores previstos (em Kz)
const vendasPrevistas = [120000, 135000, 128000, 140000, 150000, 145000, 155000];

// Faixa de confiança: margem superior e inferior
const margemSuperior = vendasPrevistas.map(v => v * 1.1); // +10%
const margemInferior = vendasPrevistas.map(v => v * 0.9); // -10%

if (ctx9) {
    new Chart(ctx9, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                // Linha de previsão
                {
                    label: 'Previsão de Vendas (Kz)',
                    data: vendasPrevistas,
                    borderColor: 'rgba(41,155,99,1)',
                    backgroundColor: 'rgba(41,155,99,0.2)',
                    tension: 0.4, // linhas suavizadas
                    fill: '+1',   // preencher até o próximo dataset (sombra da confiança)
                    pointRadius: 5,
                },
                // Linha superior da faixa de confiança
                {
                    label: 'Margem Superior',
                    data: margemSuperior,
                    borderColor: 'transparent',
                    backgroundColor: 'rgba(54,162,235,0.2)',
                    fill: '-1', // preenche até o dataset anterior
                },
                // Linha inferior da faixa de confiança
                {
                    label: 'Margem Inferior',
                    data: margemInferior,
                    borderColor: 'transparent',
                    backgroundColor: 'rgba(54,162,235,0.2)',
                    fill: +1,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // ⚡ permite ajustar altura no container
            plugins: {
                legend: {
                    position: 'bottom', // mais espaço em telas pequenas
                    labels: {
                        font: { size: 12 } // diminui fonte para mobile
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Dias' },
                    ticks: { font: { size: 9 } } // reduz tamanho do texto eixo X
                },
                y: {
                    title: { display: true, text: 'Vendas (Kz)' },
                    beginAtZero: false,
                    ticks: { font: { size: 9 } } // reduz tamanho do texto eixo Y
                }
            }
        }
    });
}


//______________________________________________________________________________


const categoriasP = ['Bebidas', 'Snacks', 'Higiene', 'Limpeza', 'Alimentação', 'Outros'];

// Valores históricos (último período)
const historico = [120, 80, 50, 60, 200, 40];

// Previsão do próximo período
const previsao = [150, 92, 43, 61, 240, 42];

// Calcula variação percentual e define cor da barra da previsão
const coresPrevisao = previsao.map((v, i) => v >= historico[i] ? 'rgba(41,155,99,0.7)' : 'rgba(255,99,132,0.7)');

// Calcula variação percentual
const variacaoPercentual = previsao.map((v, i) => {
    const diff = v - historico[i];
    return ((diff / historico[i]) * 100).toFixed(1); // 1 casa decimal
});

if (ctx10) {
    new Chart(ctx10, {
        type: 'bar',
        data: {
            labels: categoriasP,
            datasets: [
                {
                    label: 'Histórico recente',
                    data: historico,
                    backgroundColor: 'rgba(54,162,235,0.7)',
                    borderColor: 'rgba(54,162,235,1)',
                    borderWidth: 1
                },
                {
                    label: 'Previsão próxima',
                    data: previsao,
                    backgroundColor: coresPrevisao,
                    borderColor: (ctx) => ctx.dataset.backgroundColor,
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // ⚡ ajusta altura no container
            plugins: {
                legend: {
                    position: 'bottom', // mais espaço em telas pequenas
                    labels: { font: { size: 12 } } // fonte menor para mobile
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function (context) {
                            const i = context.dataIndex;
                            const valor = context.raw;
                            if (context.dataset.label === 'Previsão próxima') {
                                const diff = valor - historico[i];
                                const sinal = diff >= 0 ? '+' : '';
                                return `${context.dataset.label}: ${valor} (${sinal}${variacaoPercentual[i]}%)`;
                            } else {
                                return `${context.dataset.label}: ${valor}`;
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Quantidade / Receita prevista' },
                    ticks: { font: { size: 9 } } // reduz tamanho do texto eixo Y
                },
                x: {
                    title: { display: true, text: 'Produtos / Categorias' },
                    ticks: { font: { size: 9 } } // reduz tamanho do texto eixo X
                }
            }
        }
    });
}


//______________________________________________________________________________
// Top 3 produtos com maior potencial
const produtosTop3 = ['Bebidas', 'Alimentação', 'Snacks'];

// Potencial de crescimento previsto (%) para cada produto
const crescimentoPotencial = [85, 70, 60]; // valores fictícios

// Intervalo de confiança
const margemSuperiorP = crescimentoPotencial.map(v => v + 10); // +10%
const margemInferiorP = crescimentoPotencial.map(v => v - 10); // -10%

if (ctx11) {
    new Chart(ctx11, {
        type: 'radar',
        data: {
            labels: produtosTop3,
            datasets: [
                {
                    label: 'Potencial de Crescimento (%)',
                    data: crescimentoPotencial,
                    fill: true,
                    backgroundColor: 'rgba(41,155,99,0.25)',
                    borderColor: 'rgba(41,155,99,1)',
                    pointBackgroundColor: 'rgba(41,155,99,1)',
                    pointRadius: 4,
                    tension: 0.3
                },
                {
                    label: 'Margem Superior (+10%)',
                    data: margemSuperiorP,
                    fill: true,
                    backgroundColor: 'rgba(54,162,235,0.15)',   // azul claro
                    borderColor: 'rgba(54,162,235,1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(54,162,235,1)',
                    pointRadius: 3,
                    tension: 0.3
                },
                {
                    label: 'Margem Inferior (-10%)',
                    data: margemInferiorP,
                    fill: true,
                    backgroundColor: 'rgba(255,99,132,0.15)',   // vermelho claro
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(255,99,132,1)',
                    pointRadius: 3,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // ⚡ ajusta altura no container
            plugins: {
                legend: {
                    position: 'bottom', // mais espaço em telas pequenas
                    labels: { font: { size: 12 } } // diminui fonte para mobile
                },
                tooltip: {
                    mode: 'nearest', // radar usa nearest em vez de index
                    intersect: false,
                    callbacks: {
                        label: context => context.dataset.label + ': ' + context.raw + '%'
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        font: { size: 9 }, // reduz tamanho do texto radial
                        callback: value => value + '%'
                    }
                }
            }
        }
    });
}

//______________________________________________________________________________