// perfil.js
// Tudo que é interativo na página de perfil fica neste arquivo.
// Os dados ficam salvos no navegador (localStorage), então não somem ao recarregar.
//
// Como o arquivo está organizado:
//   1. Dados            -> o que é salvo e os valores de exemplo
//   2. Utilidades       -> funções pequenas usadas em vários lugares
//   3. Favoritos        -> a estrela ☆/★
//   4. Desenhar         -> uma função para cada parte da tela
//   5. Ações            -> o que acontece ao clicar (remover, concluir...)
//   6. Formulários      -> ligar cada formulário
//   7. Abas e início    -> trocar de aba e abrir a página

// ============================================================
// 1. DADOS
// ============================================================

// Nome com que cada dado é guardado no navegador.
// "treinos" usa o mesmo nome que a página Meus treinos lê.
const CHAVES = {
    usuario: "perfilUsuario",
    objetivos: "perfilObjetivos",
    dieta: "perfilDieta",
    medidas: "perfilMedidas",
    treinos: "historicoTreinos",
    favoritos: "favoritos",
    dietasAnteriores: "dietasAnteriores",
    objetivosAnteriores: "objetivosAnteriores"
};

// Valores de exemplo: aparecem até o usuário mexer em algo.
// (Quando houver banco de dados, estes dados virão do servidor.)
const PADRAO = {
    usuario: { nome: "Nome do Usuário", email: "usuario@email.com", altura: 178, metaTreinos: 16, desde: "março de 2026" },
    objetivos: [
        { id: 1, nome: "Chegar a 82 kg", progresso: 75 },
        { id: 2, nome: "Treinar 4x por semana", progresso: 88 },
        { id: 3, nome: "Cintura abaixo de 82 cm", progresso: 40 }
    ],
    dieta: { nome: "Dieta de superávit", kcal: 2900, proteina: 160, carbo: 380, gordura: 80 },
    medidas: [
        { id: 1, data: "2026-03-01", peso: 74.0, cintura: 86 },
        { id: 2, data: "2026-04-01", peso: 76.8, cintura: 85 },
        { id: 3, data: "2026-05-01", peso: 77.9, cintura: 84 },
        { id: 4, data: "2026-06-01", peso: 78.5, cintura: 84 }
    ],
    treinos: [
        { id: 1, nome: "Treino A: Peito e tríceps", duracao: 55, data: "2026-10-10" },
        { id: 2, nome: "Treino B: Costas e bíceps", duracao: 60, data: "2026-10-08" },
        { id: 3, nome: "Treino C: Pernas", duracao: 65, data: "2026-10-06" }
    ],
    favoritos: [],
    dietasAnteriores: [
        { id: 1, nome: "Dieta de manutenção", extra: "2800", mes: "2026-05" }
    ],
    objetivosAnteriores: [
        { id: 1, nome: "Chegar a 78 kg", extra: "Concluído", mes: "2026-06" },
        { id: 2, nome: "Correr 5 km", extra: "Não concluído", mes: "2026-03" }
    ]
};

// Lê um dado salvo. Se ainda não existe, salva o exemplo e usa ele.
function ler(chave, padrao) {
    try {
        const salvo = localStorage.getItem(chave);
        if (salvo !== null) {
            return JSON.parse(salvo);
        }
    } catch (erro) {
        // dado quebrado ou armazenamento bloqueado: usa o exemplo
    }
    gravar(chave, padrao);
    return padrao;
}

function gravar(chave, valor) {
    try {
        localStorage.setItem(chave, JSON.stringify(valor));
    } catch (erro) {
        // armazenamento bloqueado: a página continua funcionando, só não salva
    }
}

// "estado" guarda todos os dados da página na memória
const estado = {};
Object.keys(PADRAO).forEach(function (nome) {
    estado[nome] = ler(CHAVES[nome], PADRAO[nome]);
});

// Salva no navegador um dado do "estado"
function salvar(nome) {
    gravar(CHAVES[nome], estado[nome]);
}

// ============================================================
// 2. UTILIDADES
// ============================================================

// Atalho para document.getElementById
const $ = function (id) {
    return document.getElementById(id);
};

// Cria um elemento HTML: el("p", "info", "texto")
function el(tag, classe, texto) {
    const elemento = document.createElement(tag);
    if (classe) elemento.className = classe;
    if (texto !== undefined) elemento.textContent = texto;
    return elemento;
}

// Cria um botão que executa uma função ao clicar
function botao(texto, classe, aoClicar) {
    const b = el("button", classe, texto);
    b.type = "button";
    b.addEventListener("click", aoClicar);
    return b;
}

// Data de hoje no formato do input date: "2026-11-23" (usa o fuso do usuário)
function hojeISO() {
    const d = new Date();
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + mes + "-" + dia;
}

// Mês atual no formato do input month: "2026-11"
function mesAtual() {
    return hojeISO().slice(0, 7);
}

// "2026-10-10" -> "10/10/2026"
function dataBR(iso) {
    const p = iso.split("-");
    return p[2] + "/" + p[1] + "/" + p[0];
}

// "2026-10" -> "10/2026"
function mesBR(mes) {
    const p = mes.split("-");
    return p[1] + "/" + p[0];
}

// 2900 -> "2.900"  |  78.5 -> "78,5"
function numeroBR(numero, minimo, maximo) {
    return Number(numero).toLocaleString("pt-BR", {
        minimumFractionDigits: minimo,
        maximumFractionDigits: maximo === undefined ? minimo : maximo
    });
}

// Devolve uma cópia da lista com o mais recente primeiro
function maisRecentesPrimeiro(lista, campo) {
    return lista.slice().sort(function (a, b) {
        return b[campo].localeCompare(a[campo]);
    });
}

// Um id novo, que não repete (baseado na hora atual)
function novoId() {
    return Date.now();
}

function classificarImc(imc) {
    if (imc < 18.5) return "Abaixo do peso";
    if (imc < 25) return "Peso normal";
    if (imc < 30) return "Sobrepeso";
    return "Obesidade";
}

// 0.6 -> "+0,6 kg"  |  -1.2 -> "-1,2 kg"
function formatarVariacao(diferenca) {
    const arredondado = Math.round(diferenca * 10) / 10;
    return (arredondado > 0 ? "+" : "") + numeroBR(arredondado, 1) + " kg";
}

// ============================================================
// 3. FAVORITOS (a estrela ☆/★)
// ============================================================

const ROTULOS = { treino: "Treino", dieta: "Dieta", objetivo: "Objetivo" };

function ehFavorito(tipo, id) {
    return estado.favoritos.some(function (fav) {
        return fav.tipo === tipo && fav.id === id;
    });
}

// Tira da lista de favoritos (usada também quando o item é apagado)
function tirarFavorito(tipo, id) {
    estado.favoritos = estado.favoritos.filter(function (fav) {
        return !(fav.tipo === tipo && fav.id === id);
    });
    salvar("favoritos");
}

// Cria o botão de estrela de um item
function criarEstrela(tipo, id, nome) {
    const favorito = ehFavorito(tipo, id);
    const estrela = botao(favorito ? "★" : "☆", "botao-favorito", function () {
        if (favorito) {
            tirarFavorito(tipo, id);
        } else {
            estado.favoritos.push({ tipo: tipo, id: id, nome: nome });
            salvar("favoritos");
        }
        desenhar();
    });
    estrela.setAttribute("aria-pressed", String(favorito));
    estrela.setAttribute("aria-label", (favorito ? "Remover dos favoritos: " : "Favoritar: ") + nome);
    return estrela;
}

// ============================================================
// 4. DESENHAR (uma função para cada parte da tela)
// ============================================================

// ----- Topo -----
function desenharUsuario() {
    const u = estado.usuario;
    $("usuario-nome").textContent = u.nome;
    $("usuario-email").textContent = u.email;
    $("usuario-desde").textContent = "Membro desde " + u.desde;
}

// ----- Cards de resumo (tudo calculado a partir dos dados) -----
function desenharResumo() {
    const medidas = maisRecentesPrimeiro(estado.medidas, "data");
    const atual = medidas[0];
    const inicio = medidas[medidas.length - 1];
    const altura = estado.usuario.altura;

    // Peso
    $("resumo-peso").textContent = atual ? numeroBR(atual.peso, 1) + " kg" : "—";
    $("resumo-peso-detalhe").textContent = inicio ? "Início: " + numeroBR(inicio.peso, 1) + " kg" : "Registre sua primeira medida";

    // IMC = peso / (altura em metros)²
    if (atual && altura) {
        const imc = atual.peso / Math.pow(altura / 100, 2);
        $("resumo-imc").textContent = numeroBR(imc, 1);
        $("resumo-imc-detalhe").textContent = classificarImc(imc);
    } else {
        $("resumo-imc").textContent = "—";
        $("resumo-imc-detalhe").textContent = altura ? "Registre seu peso" : "Informe sua altura";
    }

    // Treinos feitos neste mês
    const mes = mesAtual();
    const feitos = estado.treinos.filter(function (t) {
        return t.data.startsWith(mes);
    }).length;
    $("resumo-treinos").textContent = feitos;
    $("resumo-treinos-detalhe").textContent = "Meta: " + estado.usuario.metaTreinos;
}

// ----- Objetivos atuais -----
function desenharObjetivos() {
    const lista = $("lista-objetivos");
    lista.innerHTML = "";
    $("vazio-objetivos").hidden = estado.objetivos.length > 0;

    estado.objetivos.forEach(function (obj) {
        const li = el("li");

        // Linha com estrela + nome e a porcentagem
        const linha = el("div", "linha");
        const nome = el("span");
        nome.appendChild(criarEstrela("objetivo", "obj-" + obj.id, obj.nome));
        nome.appendChild(document.createTextNode(obj.nome));
        linha.appendChild(nome);
        linha.appendChild(el("span", "percentual", obj.progresso + "%"));

        // Barra de progresso
        const barra = el("div", "barra");
        barra.setAttribute("role", "progressbar");
        barra.setAttribute("aria-valuenow", obj.progresso);
        barra.setAttribute("aria-valuemin", "0");
        barra.setAttribute("aria-valuemax", "100");
        const preenchimento = el("div", "progresso");
        preenchimento.style.width = obj.progresso + "%";
        barra.appendChild(preenchimento);

        // Botões do objetivo
        const acoes = el("div", "item-acoes");
        acoes.appendChild(botao("− 10%", "botao-pequeno", function () { mudarProgresso(obj, -10); }));
        acoes.appendChild(botao("+ 10%", "botao-pequeno", function () { mudarProgresso(obj, 10); }));
        acoes.appendChild(botao("Concluir", "botao-pequeno", function () { concluirObjetivo(obj); }));
        acoes.appendChild(botao("Remover", "botao-remover", function () { removerObjetivo(obj); }));

        li.appendChild(linha);
        li.appendChild(barra);
        li.appendChild(acoes);
        lista.appendChild(li);
    });
}

// ----- Dieta atual -----
function desenharDieta() {
    const dieta = estado.dieta;
    const titulo = $("titulo-dieta");
    const area = $("area-dieta");

    // Título com a estrela (só se existe dieta)
    titulo.innerHTML = "";
    if (dieta) {
        titulo.appendChild(criarEstrela("dieta", "dieta-atual", "Dieta atual: " + dieta.nome));
    }
    titulo.appendChild(document.createTextNode("Dieta atual"));

    $("abrir-dieta").textContent = dieta ? "Editar dieta" : "Definir dieta";

    area.innerHTML = "";
    if (!dieta) {
        area.appendChild(el("p", "mensagem-vazio", "Nenhuma dieta ativa. Defina a sua ou escolha uma em “Ver dietas”."));
        return;
    }

    area.appendChild(el("p", "nome-dieta", dieta.nome));

    // Quatro quadradinhos: calorias e macronutrientes
    const quadros = el("div", "dieta");
    [
        [numeroBR(dieta.kcal, 0), "kcal por dia"],
        [dieta.proteina + " g", "Proteínas"],
        [dieta.carbo + " g", "Carboidratos"],
        [dieta.gordura + " g", "Gorduras"]
    ].forEach(function (item) {
        const quadro = el("div");
        quadro.appendChild(el("strong", null, item[0]));
        quadro.appendChild(el("span", null, item[1]));
        quadros.appendChild(quadro);
    });
    area.appendChild(quadros);

    const acoes = el("div", "item-acoes");
    acoes.appendChild(botao("Encerrar dieta", "botao-pequeno", encerrarDieta));
    area.appendChild(acoes);
}

// ----- Evolução: gráfico + tabela -----
function criarSvg(tag, atributos) {
    const e = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.keys(atributos).forEach(function (nome) {
        e.setAttribute(nome, atributos[nome]);
    });
    return e;
}

// Recebe as medidas da mais antiga para a mais nova
function desenharGrafico(medidas) {
    const area = $("grafico-peso");
    area.innerHTML = "";

    if (medidas.length < 2) {
        area.appendChild(el("p", "mensagem-vazio", "Registre pelo menos duas medidas para ver o gráfico de peso."));
        return;
    }

    const largura = 600;
    const altura = 220;
    const margem = { topo: 20, direita: 24, baixo: 32, esquerda: 48 };

    // Limites do eixo vertical (com uma folga em cima e embaixo)
    const pesos = medidas.map(function (m) { return m.peso; });
    let minimo = Math.min.apply(null, pesos);
    let maximo = Math.max.apply(null, pesos);
    if (minimo === maximo) {
        minimo -= 1;
        maximo += 1;
    }
    const folga = (maximo - minimo) * 0.15;
    minimo -= folga;
    maximo += folga;

    // Transformam a medida em posição (x, y) dentro do desenho
    function posicaoX(indice) {
        return margem.esquerda + indice * (largura - margem.esquerda - margem.direita) / (medidas.length - 1);
    }
    function posicaoY(peso) {
        return margem.topo + (maximo - peso) * (altura - margem.topo - margem.baixo) / (maximo - minimo);
    }

    const svg = criarSvg("svg", {
        viewBox: "0 0 " + largura + " " + altura,
        class: "grafico",
        role: "img",
        "aria-label": "Gráfico da evolução do peso"
    });

    // Três linhas de grade com os valores de peso
    [0, 0.5, 1].forEach(function (fracao) {
        const valor = minimo + (maximo - minimo) * fracao;
        const y = posicaoY(valor);
        svg.appendChild(criarSvg("line", { x1: margem.esquerda, x2: largura - margem.direita, y1: y, y2: y, class: "grafico-grade" }));
        const texto = criarSvg("text", { x: margem.esquerda - 8, y: y + 4, "text-anchor": "end", class: "grafico-texto" });
        texto.textContent = numeroBR(valor, 1);
        svg.appendChild(texto);
    });

    // A linha do gráfico
    const pontos = medidas.map(function (m, i) {
        return posicaoX(i) + "," + posicaoY(m.peso);
    }).join(" ");
    svg.appendChild(criarSvg("polyline", { points: pontos, class: "grafico-linha" }));

    // Uma bolinha por medida (passando o mouse mostra o valor)
    medidas.forEach(function (m, i) {
        const ponto = criarSvg("circle", { cx: posicaoX(i), cy: posicaoY(m.peso), r: 4.5, class: "grafico-ponto" });
        const dica = criarSvg("title", {});
        dica.textContent = dataBR(m.data) + ": " + numeroBR(m.peso, 1) + " kg";
        ponto.appendChild(dica);
        svg.appendChild(ponto);
    });

    // Datas da primeira e da última medida
    const primeira = criarSvg("text", { x: posicaoX(0), y: altura - 8, "text-anchor": "start", class: "grafico-texto" });
    primeira.textContent = dataBR(medidas[0].data);
    const ultima = criarSvg("text", { x: posicaoX(medidas.length - 1), y: altura - 8, "text-anchor": "end", class: "grafico-texto" });
    ultima.textContent = dataBR(medidas[medidas.length - 1].data);
    svg.appendChild(primeira);
    svg.appendChild(ultima);

    area.appendChild(svg);
}

function desenharEvolucao() {
    const recentesPrimeiro = maisRecentesPrimeiro(estado.medidas, "data");

    desenharGrafico(recentesPrimeiro.slice().reverse());

    $("vazio-medidas").hidden = recentesPrimeiro.length > 0;
    $("tabela-medidas").hidden = recentesPrimeiro.length === 0;

    const corpo = $("corpo-medidas");
    corpo.innerHTML = "";
    recentesPrimeiro.forEach(function (medida, i) {
        const anterior = recentesPrimeiro[i + 1]; // a medida logo antes desta
        const linha = el("tr");
        linha.appendChild(el("td", null, dataBR(medida.data)));
        linha.appendChild(el("td", null, numeroBR(medida.peso, 1) + " kg"));
        linha.appendChild(el("td", null, anterior ? formatarVariacao(medida.peso - anterior.peso) : "—"));
        linha.appendChild(el("td", null, medida.cintura ? numeroBR(medida.cintura, 0, 1) + " cm" : "—"));
        const acao = el("td");
        acao.appendChild(botao("Remover", "botao-remover", function () { removerMedida(medida); }));
        linha.appendChild(acao);
        corpo.appendChild(linha);
    });
}

// ----- Histórico de treinos -----
function desenharTreinos() {
    const lista = $("lista-treinos");
    lista.innerHTML = "";
    $("vazio-treinos").hidden = estado.treinos.length > 0;

    maisRecentesPrimeiro(estado.treinos, "data").forEach(function (treino) {
        const li = el("li");

        const info = el("div");
        info.appendChild(el("p", null, treino.nome));
        info.appendChild(el("small", null, treino.duracao + " min"));

        const direita = el("div", "historico-direita");
        direita.appendChild(el("span", "data", dataBR(treino.data)));
        direita.appendChild(criarEstrela("treino", "treino-" + treino.id, treino.nome));
        direita.appendChild(botao("Remover", "botao-remover", function () { removerTreino(treino); }));

        li.appendChild(info);
        li.appendChild(direita);
        lista.appendChild(li);
    });
}

// ----- Lista de favoritos -----
function desenharFavoritos() {
    const lista = $("lista-favoritos");
    lista.innerHTML = "";
    $("vazio-favoritos").hidden = estado.favoritos.length > 0;

    estado.favoritos.forEach(function (fav) {
        const li = el("li");

        const info = el("div");
        info.appendChild(el("p", null, fav.nome));
        info.appendChild(el("small", null, ROTULOS[fav.tipo]));

        li.appendChild(info);
        li.appendChild(criarEstrela(fav.tipo, fav.id, fav.nome));
        lista.appendChild(li);
    });
}

// ----- Dietas e objetivos anteriores (as duas listas usam o mesmo código) -----
const LISTAS_ANTERIORES = [
    {
        estado: "dietasAnteriores",
        prefixo: "dietas",
        tipoFavorito: "dieta",
        idFavorito: "dieta-ant-",
        detalhe: function (item) { return numeroBR(item.extra, 0) + " kcal por dia"; }
    },
    {
        estado: "objetivosAnteriores",
        prefixo: "objetivos",
        tipoFavorito: "objetivo",
        idFavorito: "obj-ant-",
        detalhe: function (item) { return item.extra; }
    }
];

function desenharAnteriores(config) {
    const itens = estado[config.estado];
    const lista = $("lista-ant-" + config.prefixo);
    lista.innerHTML = "";
    $("vazio-ant-" + config.prefixo).hidden = itens.length > 0;

    maisRecentesPrimeiro(itens, "mes").forEach(function (item) {
        const li = el("li");

        const info = el("div");
        info.appendChild(el("p", null, item.nome));
        info.appendChild(el("small", null, config.detalhe(item)));

        const direita = el("div", "historico-direita");
        direita.appendChild(el("span", "data", mesBR(item.mes)));
        direita.appendChild(criarEstrela(config.tipoFavorito, config.idFavorito + item.id, item.nome));
        direita.appendChild(botao("Remover", "botao-remover", function () { removerAnterior(config, item); }));

        li.appendChild(info);
        li.appendChild(direita);
        lista.appendChild(li);
    });
}

// Redesenha a página inteira (chamada depois de qualquer mudança)
function desenhar() {
    desenharUsuario();
    desenharResumo();
    desenharObjetivos();
    desenharDieta();
    desenharEvolucao();
    desenharTreinos();
    desenharFavoritos();
    LISTAS_ANTERIORES.forEach(desenharAnteriores);
}

// ============================================================
// 5. AÇÕES (o que acontece ao clicar nos botões)
// ============================================================

function confirmar(mensagem) {
    return window.confirm(mensagem);
}

// ----- Objetivos -----
function mudarProgresso(objetivo, diferenca) {
    objetivo.progresso = Math.min(100, Math.max(0, objetivo.progresso + diferenca));
    salvar("objetivos");
    desenhar();
}

// Concluir: sai dos objetivos atuais e vai para "Objetivos anteriores"
function concluirObjetivo(objetivo) {
    estado.objetivos = estado.objetivos.filter(function (o) { return o !== objetivo; });
    estado.objetivosAnteriores.push({ id: novoId(), nome: objetivo.nome, extra: "Concluído", mes: mesAtual() });
    tirarFavorito("objetivo", "obj-" + objetivo.id);
    salvar("objetivos");
    salvar("objetivosAnteriores");
    desenhar();
}

function removerObjetivo(objetivo) {
    if (!confirmar("Remover o objetivo “" + objetivo.nome + "”?")) return;
    estado.objetivos = estado.objetivos.filter(function (o) { return o !== objetivo; });
    tirarFavorito("objetivo", "obj-" + objetivo.id);
    salvar("objetivos");
    desenhar();
}

// ----- Dieta -----
// Encerrar: a dieta atual vai para "Dietas anteriores"
function encerrarDieta() {
    if (!confirmar("Encerrar a dieta atual? Ela vai para “Dietas anteriores”.")) return;
    estado.dietasAnteriores.push({ id: novoId(), nome: estado.dieta.nome, extra: String(estado.dieta.kcal), mes: mesAtual() });
    tirarFavorito("dieta", "dieta-atual");
    estado.dieta = null;
    salvar("dieta");
    salvar("dietasAnteriores");
    desenhar();
}

// ----- Medidas, treinos e anteriores -----
function removerMedida(medida) {
    if (!confirmar("Remover a medida de " + dataBR(medida.data) + "?")) return;
    estado.medidas = estado.medidas.filter(function (m) { return m !== medida; });
    salvar("medidas");
    desenhar();
}

function removerTreino(treino) {
    if (!confirmar("Remover o treino “" + treino.nome + "”?")) return;
    estado.treinos = estado.treinos.filter(function (t) { return t !== treino; });
    tirarFavorito("treino", "treino-" + treino.id);
    salvar("treinos");
    desenhar();
}

function removerAnterior(config, item) {
    if (!confirmar("Remover “" + item.nome + "”?")) return;
    estado[config.estado] = estado[config.estado].filter(function (i) { return i !== item; });
    tirarFavorito(config.tipoFavorito, config.idFavorito + item.id);
    salvar(config.estado);
    desenhar();
}

// ============================================================
// 6. FORMULÁRIOS
// ============================================================

// Liga um formulário ao seu botão de abrir e ao botão cancelar.
// opcoes: { form, abrir, cancelar, aoAbrir, aoSalvar }
// Se aoSalvar devolver false, o formulário continua aberto.
function ligarFormulario(opcoes) {
    opcoes.abrir.addEventListener("click", function () {
        const vaiAbrir = opcoes.form.hidden;
        opcoes.form.hidden = !vaiAbrir;
        if (vaiAbrir && opcoes.aoAbrir) opcoes.aoAbrir();
    });

    opcoes.cancelar.addEventListener("click", function () {
        opcoes.form.reset();
        opcoes.form.hidden = true;
    });

    opcoes.form.addEventListener("submit", function (evento) {
        evento.preventDefault(); // não deixa a página recarregar
        if (opcoes.aoSalvar() === false) return;
        opcoes.form.reset();
        opcoes.form.hidden = true;
    });
}

// ----- Editar perfil -----
ligarFormulario({
    form: $("form-usuario"),
    abrir: $("abrir-usuario"),
    cancelar: $("cancelar-usuario"),
    aoAbrir: function () {
        $("nome-usuario").value = estado.usuario.nome;
        $("email-usuario").value = estado.usuario.email;
        $("altura-usuario").value = estado.usuario.altura;
        $("meta-usuario").value = estado.usuario.metaTreinos;
    },
    aoSalvar: function () {
        const nome = $("nome-usuario").value.trim();
        const email = $("email-usuario").value.trim();
        if (!nome || !email) return false;
        estado.usuario.nome = nome;
        estado.usuario.email = email;
        estado.usuario.altura = Number($("altura-usuario").value);
        estado.usuario.metaTreinos = Number($("meta-usuario").value);
        salvar("usuario");
        desenhar();
    }
});

// ----- Novo objetivo -----
ligarFormulario({
    form: $("form-objetivo"),
    abrir: $("abrir-objetivo"),
    cancelar: $("cancelar-objetivo"),
    aoSalvar: function () {
        const nome = $("nome-objetivo").value.trim();
        if (!nome) return false;
        estado.objetivos.push({ id: novoId(), nome: nome, progresso: 0 });
        salvar("objetivos");
        desenhar();
    }
});

// ----- Definir / editar dieta -----
ligarFormulario({
    form: $("form-dieta"),
    abrir: $("abrir-dieta"),
    cancelar: $("cancelar-dieta"),
    aoAbrir: function () {
        const d = estado.dieta || { nome: "", kcal: "", proteina: "", carbo: "", gordura: "" };
        $("nome-dieta").value = d.nome;
        $("kcal-dieta").value = d.kcal;
        $("proteina-dieta").value = d.proteina;
        $("carbo-dieta").value = d.carbo;
        $("gordura-dieta").value = d.gordura;
    },
    aoSalvar: function () {
        const nome = $("nome-dieta").value.trim();
        if (!nome) return false;
        estado.dieta = {
            nome: nome,
            kcal: Number($("kcal-dieta").value),
            proteina: Number($("proteina-dieta").value),
            carbo: Number($("carbo-dieta").value),
            gordura: Number($("gordura-dieta").value)
        };
        // Se a dieta estava favoritada, atualiza o nome no favorito
        estado.favoritos.forEach(function (fav) {
            if (fav.tipo === "dieta" && fav.id === "dieta-atual") fav.nome = "Dieta atual: " + nome;
        });
        salvar("dieta");
        salvar("favoritos");
        desenhar();
    }
});

// ----- Registrar medidas -----
ligarFormulario({
    form: $("form-medida"),
    abrir: $("abrir-medida"),
    cancelar: $("cancelar-medida"),
    aoAbrir: function () {
        $("data-medida").value = hojeISO();
    },
    aoSalvar: function () {
        const cintura = $("cintura-medida").value;
        estado.medidas.push({
            id: novoId(),
            data: $("data-medida").value,
            peso: Number($("peso-medida").value),
            cintura: cintura ? Number(cintura) : null
        });
        salvar("medidas");
        desenhar();
    }
});

// ----- Registrar treino -----
ligarFormulario({
    form: $("form-treino"),
    abrir: $("abrir-treino"),
    cancelar: $("cancelar-treino"),
    aoAbrir: function () {
        $("data-treino").value = hojeISO();
    },
    aoSalvar: function () {
        const nome = $("nome-treino").value.trim();
        if (!nome) return false;
        estado.treinos.push({
            id: novoId(),
            nome: nome,
            duracao: Number($("duracao-treino").value),
            data: $("data-treino").value
        });
        salvar("treinos");
        desenhar();
    }
});

// ----- Registrar dieta / objetivo anterior -----
LISTAS_ANTERIORES.forEach(function (config) {
    const p = config.prefixo;
    ligarFormulario({
        form: $("form-ant-" + p),
        abrir: $("abrir-ant-" + p),
        cancelar: $("cancelar-ant-" + p),
        aoAbrir: function () {
            $("mes-ant-" + p).value = mesAtual();
        },
        aoSalvar: function () {
            const nome = $("nome-ant-" + p).value.trim();
            if (!nome) return false;
            estado[config.estado].push({
                id: novoId(),
                nome: nome,
                extra: $("extra-ant-" + p).value,
                mes: $("mes-ant-" + p).value
            });
            salvar(config.estado);
            desenhar();
        }
    });
});

// ============================================================
// 7. ABAS E INÍCIO
// ============================================================

const abas = Array.from(document.querySelectorAll("[data-aba]"));
const paineis = Array.from(document.querySelectorAll("[data-painel]"));

// Mostra só o painel da aba escolhida
function abrirAba(nome) {
    abas.forEach(function (aba) {
        aba.setAttribute("aria-selected", String(aba.dataset.aba === nome));
    });
    paineis.forEach(function (painel) {
        painel.hidden = painel.dataset.painel !== nome;
    });
}

abas.forEach(function (aba) {
    aba.addEventListener("click", function () {
        abrirAba(aba.dataset.aba);
        history.replaceState(null, "", "#" + aba.dataset.aba); // permite abrir direto: perfil.html#favoritos
    });
});

// Abre a aba que está no endereço (ex: perfil.html#favoritos) ou a primeira
function abrirAbaDoEndereco() {
    const nome = location.hash.slice(1);
    const existe = abas.some(function (aba) { return aba.dataset.aba === nome; });
    abrirAba(existe ? nome : "objetivos");
}

abrirAbaDoEndereco();
window.addEventListener("hashchange", abrirAbaDoEndereco); // se o endereço mudar com a página aberta

desenhar();