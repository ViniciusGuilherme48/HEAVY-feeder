// favoritos.js
// Favoritos do perfil: treinos, dietas e objetivos.
// Os favoritos ficam salvos no navegador (localStorage), como o histórico de treinos.

// ----- 1. Dados e elementos -----
const CHAVE_FAVORITOS = "favoritos";
const ROTULOS = { treino: "Treino", dieta: "Dieta", objetivo: "Objetivo" };

const listaFavoritos = document.getElementById("lista-favoritos");
const vazioFavoritos = document.getElementById("vazio-favoritos");

// Cada favorito é um objeto: { tipo: "treino", id: 1, nome: "Treino C: Pernas" }
function carregarFavoritos() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE_FAVORITOS)) || [];
    } catch (erro) {
        return []; // se der erro ao ler, começa vazio
    }
}

let favoritos = carregarFavoritos();

function salvarFavoritos() {
    localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(favoritos));
}

// ----- 2. Funções de apoio -----
// Diz se um item já está nos favoritos
function ehFavorito(tipo, id) {
    return favoritos.some(function (fav) {
        return fav.tipo === tipo && String(fav.id) === String(id);
    });
}

// Favorita se ainda não é favorito; desfavorita se já é
function alternarFavorito(tipo, id, nome) {
    if (ehFavorito(tipo, id)) {
        removerFavorito(tipo, id);
    } else {
        favoritos.push({ tipo: tipo, id: id, nome: nome });
        salvarFavoritos();
        atualizarTela();
    }
}

// Tira um item dos favoritos (também usada pelo historico.js quando um treino é apagado)
function removerFavorito(tipo, id) {
    favoritos = favoritos.filter(function (fav) {
        return !(fav.tipo === tipo && String(fav.id) === String(id));
    });
    salvarFavoritos();
    atualizarTela();
}

// ----- 3. O botão da estrela -----
// Cria o botão ☆/★ (usada aqui e no historico.js)
function criarBotaoFavorito(tipo, id, nome) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "botao-favorito";
    botao.dataset.tipo = tipo;
    botao.dataset.id = id;
    botao.dataset.nome = nome;
    botao.addEventListener("click", function () {
        alternarFavorito(tipo, id, nome);
    });
    atualizarBotao(botao);
    return botao;
}

// Deixa o botão ★ (favorito) ou ☆ (não favorito)
function atualizarBotao(botao) {
    const favorito = ehFavorito(botao.dataset.tipo, botao.dataset.id);
    botao.textContent = favorito ? "★" : "☆";
    botao.setAttribute("aria-pressed", favorito ? "true" : "false");
    botao.setAttribute("aria-label", (favorito ? "Remover dos favoritos: " : "Favoritar: ") + botao.dataset.nome);
}

// ----- 4. Mostrar a lista de favoritos -----
function mostrarFavoritos() {
    listaFavoritos.innerHTML = "";
    vazioFavoritos.hidden = favoritos.length > 0;

    favoritos.forEach(function (fav) {
        const li = document.createElement("li");

        const info = document.createElement("div");
        const nome = document.createElement("p");
        nome.textContent = fav.nome;
        const tipo = document.createElement("small");
        tipo.textContent = ROTULOS[fav.tipo];
        info.appendChild(nome);
        info.appendChild(tipo);

        li.appendChild(info);
        li.appendChild(criarBotaoFavorito(fav.tipo, fav.id, fav.nome));
        listaFavoritos.appendChild(li);
    });
}

// Redesenha a lista e atualiza todas as estrelas da página
function atualizarTela() {
    mostrarFavoritos();
    document.querySelectorAll(".botao-favorito").forEach(atualizarBotao);
}

// ----- 5. Ao abrir a página -----
// Coloca a estrela nos objetivos e na dieta (marcados com .favorito-slot no HTML)
document.querySelectorAll(".favorito-slot").forEach(function (slot) {
    slot.appendChild(criarBotaoFavorito(slot.dataset.tipo, slot.dataset.id, slot.dataset.nome));
});

mostrarFavoritos();