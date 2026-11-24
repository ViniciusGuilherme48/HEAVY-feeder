// historico.js
// Histórico de treinos da página de perfil.
// Os treinos ficam salvos no navegador (localStorage), então não somem ao recarregar.

// ----- 1. Pegar os elementos da página -----
const botaoNovo = document.getElementById("botao-novo-treino");
const botaoCancelar = document.getElementById("botao-cancelar");
const formulario = document.getElementById("form-treino");
const campoNome = document.getElementById("nome-treino");
const campoDuracao = document.getElementById("duracao-treino");
const campoData = document.getElementById("data-treino");
const lista = document.getElementById("lista-historico");
const mensagemVazio = document.getElementById("mensagem-vazio");

// Nome usado para guardar os dados no navegador
const CHAVE = "historicoTreinos";

// ----- 2. Carregar os treinos salvos -----
// Se ainda não existe nada salvo, começa com os 3 treinos de exemplo.
function carregarTreinos() {
    const salvo = localStorage.getItem(CHAVE);
    if (salvo) {
        return JSON.parse(salvo); // transforma o texto de volta em lista
    }
    return [
        { id: 1, nome: "Treino A: Peito e tríceps", duracao: 55, data: "2026-10-10" },
        { id: 2, nome: "Treino B: Costas e bíceps", duracao: 60, data: "2026-10-08" },
        { id: 3, nome: "Treino C: Pernas", duracao: 65, data: "2026-10-06" }
    ];
}

// Salva a lista no navegador (precisa virar texto com JSON.stringify)
function salvarTreinos() {
    localStorage.setItem(CHAVE, JSON.stringify(treinos));
}

let treinos = carregarTreinos();

// ----- 3. Mostrar os treinos na tela -----
// Converte "2026-10-10" em "10/10/2026"
function formatarData(data) {
    const partes = data.split("-"); // ["2026", "10", "10"]
    return partes[2] + "/" + partes[1] + "/" + partes[0];
}

function mostrarTreinos() {
    lista.innerHTML = ""; // limpa a lista antes de desenhar de novo

    // Ordena do mais recente para o mais antigo
    treinos.sort(function (a, b) {
        return b.data.localeCompare(a.data);
    });

    // Se não tem nenhum treino, mostra a mensagem
    mensagemVazio.hidden = treinos.length > 0;

    // Para cada treino, cria um <li> igual ao que já existia no HTML
    treinos.forEach(function (treino) {
        const li = document.createElement("li");

        const info = document.createElement("div");
        const nome = document.createElement("p");
        nome.textContent = treino.nome;
        const duracao = document.createElement("small");
        duracao.textContent = treino.duracao + " min";
        info.appendChild(nome);
        info.appendChild(duracao);

        const direita = document.createElement("div");
        direita.className = "historico-direita";

        const data = document.createElement("span");
        data.className = "data";
        data.textContent = formatarData(treino.data);

        const remover = document.createElement("button");
        remover.type = "button";
        remover.className = "botao-remover";
        remover.textContent = "Remover";
        remover.addEventListener("click", function () {
            removerTreino(treino.id);
        });

        direita.appendChild(data);
        direita.appendChild(criarBotaoFavorito("treino", treino.id, treino.nome)); // estrela de favoritar
        direita.appendChild(remover);
        li.appendChild(info);
        li.appendChild(direita);
        lista.appendChild(li);
    });
}

// ----- 4. Remover um treino -----
function removerTreino(id) {
    // filter mantém só os treinos com id diferente do que foi clicado
    treinos = treinos.filter(function (treino) {
        return treino.id !== id;
    });
    salvarTreinos();
    removerFavorito("treino", id); // se era favorito, sai dos favoritos também
    mostrarTreinos();
}

// ----- 5. Abrir e fechar o formulário -----
botaoNovo.addEventListener("click", function () {
    formulario.hidden = !formulario.hidden; // alterna entre mostrar e esconder
    campoData.value = new Date().toISOString().slice(0, 10); // data de hoje
});

botaoCancelar.addEventListener("click", function () {
    formulario.reset();
    formulario.hidden = true;
});

// ----- 6. Adicionar um treino novo -----
formulario.addEventListener("submit", function (evento) {
    evento.preventDefault(); // evita a página recarregar

    const novoTreino = {
        id: Date.now(), // número único baseado na hora atual
        nome: campoNome.value,
        duracao: Number(campoDuracao.value),
        data: campoData.value
    };

    treinos.push(novoTreino);
    salvarTreinos();
    mostrarTreinos();

    formulario.reset();
    formulario.hidden = true;
});

// ----- 7. Desenhar a lista quando a página abrir -----
mostrarTreinos();