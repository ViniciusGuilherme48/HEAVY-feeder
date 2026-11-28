// meus-treinos.js
// Mostra o treino escolhido em um carrossel semanal (igual ao das páginas Força e Emagrecimento).

// ----- 1. Os dados dos treinos -----
// Cada treino tem: nome, intro, nota e 7 dias (segunda a domingo).
// Cada dia tem: titulo, e pode ter:
//   itens       -> lista de exercícios
//   destaque    -> começo em negrito do parágrafo (ex: "Aeróbico:")
//   texto       -> parágrafo
//   recuperacao -> true deixa o card com borda tracejada (dia de descanso)
const treinos = {

    // Força: copiado da página força.html
    forca: {
        nome: "Força",
        intro: "Esta rotina combina Push / Pull / Legs + Upper / Lower com foco nos movimentos básicos do powerlifting: agachamento, supino e levantamento terra. Use cargas que permitam manter a técnica; evite testar cargas máximas sem preparação e supervisão adequada.",
        nota: "Descanse cerca de 2–4 minutos nas séries principais e 1–3 minutos nos exercícios auxiliares, conforme a necessidade. A seleção, as cargas e a frequência devem ser ajustadas ao nível individual, de preferência com orientação de um profissional de Educação Física.",
        dias: [
            { titulo: "Segunda — Push (ênfase no supino)", itens: ["Supino reto com barra — 4 × 4–6", "Supino pausado leve — 3 × 5–6", "Desenvolvimento com halteres — 3 × 6–8", "Supino fechado ou tríceps na polia — 3 × 8–10", "Elevação lateral — 2 × 12–15"] },
            { titulo: "Terça — Pull (costas e cadeia posterior)", itens: ["Levantamento terra técnico — 3 × 3–5", "Remada com apoio — 4 × 6–8", "Puxada alta — 3 × 8–10", "Extensão lombar leve ou bird-dog — 2–3 séries controladas", "Rosca bíceps — 2–3 × 8–12"] },
            { titulo: "Quarta — Legs (ênfase no agachamento)", itens: ["Agachamento com barra — 4 × 3–6", "Agachamento com pausa leve — 3 × 4–6", "Leg press — 3 × 8–10", "Mesa flexora — 3 × 8–12", "Panturrilhas — 3 × 10–15"] },
            { titulo: "Quinta — Upper (técnica e volume moderado)", itens: ["Supino com carga moderada — 3 × 6–8", "Remada baixa — 3 × 6–10", "Desenvolvimento leve — 2–3 × 8–10", "Puxada neutra — 3 × 8–10", "Face pull — 2 × 12–15"] },
            { titulo: "Sexta — Lower (terra e assistência)", itens: ["Levantamento terra — 3 × 3–5, com técnica estável", "Agachamento frontal ou goblet — 3 × 6–8", "Hip thrust — 3 × 6–10", "Mesa flexora — 3 × 8–12", "Abdominal com controle — 3 séries"] },
            { titulo: "Sábado — Recuperação ativa opcional", texto: "Caminhada leve e mobilidade confortável. Evite transformar o dia em outra sessão pesada.", recuperacao: true },
            { titulo: "Domingo — Descanso", texto: "Priorize sono e recuperação. Ajuste o plano se o desempenho cair ou o cansaço se acumular.", recuperacao: true }
        ]
    },

    // Emagrecimento: copiado da página emagrecimento.html
    emagrecimento: {
        nome: "Emagrecimento",
        intro: "A musculação ajuda a manter força e massa muscular; atividades aeróbicas complementam a rotina e favorecem o condicionamento. O emagrecimento depende do conjunto de hábitos e não de um exercício isolado. Ajuste duração e intensidade ao seu nível atual.",
        nota: "Não é necessário fazer cardio exaustivo nem treinar todos os dias. Se estiver começando, reduza o número de séries e a duração do aeróbico e progrida aos poucos. Dor incomum, tontura ou mal-estar são sinais para interromper a atividade e buscar orientação adequada.",
        dias: [
            { titulo: "Segunda — Push + aeróbico leve", itens: ["Supino máquina ou com halteres — 3 × 8–12", "Supino inclinado — 2–3 × 10–12", "Desenvolvimento de ombros — 3 × 8–12", "Elevação lateral — 2 × 12–15", "Tríceps na polia — 2–3 × 10–15"], destaque: "Aeróbico:", texto: " 15–20 minutos de caminhada, bicicleta ou elíptico em ritmo confortável." },
            { titulo: "Terça — Pull + aeróbico", itens: ["Puxada alta — 3 × 8–12", "Remada baixa — 3 × 8–12", "Remada com halteres — 2 × 10–12", "Crucifixo inverso — 2 × 12–15", "Rosca direta — 2–3 × 10–12"], destaque: "Aeróbico:", texto: " 20–25 minutos em intensidade moderada, se estiver confortável." },
            { titulo: "Quarta — Legs", itens: ["Leg press ou agachamento guiado — 3 × 8–12", "Levantamento romeno com halteres — 3 × 8–12", "Cadeira extensora — 2–3 × 10–15", "Mesa flexora — 2–3 × 10–15", "Panturrilhas — 3 × 12–20"], texto: "Faça o treino de força com pausas suficientes para manter a execução segura." },
            { titulo: "Quinta — Upper + aeróbico leve", itens: ["Supino máquina — 3 × 8–12", "Remada com apoio — 3 × 8–12", "Puxada neutra — 2–3 × 10–12", "Elevação lateral — 2 × 12–15", "Rosca e tríceps na polia — 2 × 10–15 cada"], destaque: "Aeróbico:", texto: " 20–30 minutos de caminhada acelerada ou bicicleta, conforme o condicionamento." },
            { titulo: "Sexta — Lower + core", itens: ["Agachamento no banco ou leg press — 3 × 10–12", "Hip thrust — 3 × 8–12", "Afundo assistido — 2 × 8–10 por perna", "Mesa flexora — 3 × 10–15", "Prancha — 3 séries de 20–40 segundos, conforme tolerância"], texto: "Priorize controle e boa técnica, não a velocidade para terminar o treino." },
            { titulo: "Sábado — Atividade aeróbica opcional", texto: "Escolha uma atividade que goste: caminhada, bicicleta, natação ou dança. Comece com uma duração confortável e aumente aos poucos, se estiver recuperado." },
            { titulo: "Domingo — Descanso", texto: "Recuperação também faz parte do plano. Mantenha sono regular e alimentação compatível com suas necessidades.", recuperacao: true }
        ]
    },

    // Hipertrofia: EXEMPLO (a página hipertrofia.html não foi enviada). Troque pelo conteúdo real.
    hipertrofia: {
        nome: "Hipertrofia",
        intro: "Foco em ganho de massa muscular, com progressão de carga, boa alimentação e recuperação.",
        nota: "Aumente a carga aos poucos e respeite o descanso entre as séries. Ajuste o treino ao seu nível, de preferência com orientação de um profissional de Educação Física.",
        dias: [
            { titulo: "Segunda — Treino A: Peito e tríceps", itens: ["Supino reto — 4 × 8–12", "Supino inclinado — 3 × 8–12", "Crucifixo — 3 × 10–12", "Tríceps na polia — 3 × 10–12"] },
            { titulo: "Terça — Treino B: Costas e bíceps", itens: ["Puxada na frente — 4 × 8–12", "Remada curvada — 3 × 8–12", "Rosca direta — 3 × 10–12", "Rosca martelo — 3 × 10–12"] },
            { titulo: "Quarta — Treino C: Pernas", itens: ["Agachamento — 4 × 8–12", "Leg press — 3 × 10–12", "Cadeira extensora — 3 × 12–15", "Panturrilha em pé — 4 × 15–20"] },
            { titulo: "Quinta — Descanso", texto: "Dia de recuperação. Priorize sono e alimentação.", recuperacao: true },
            { titulo: "Sexta — Treino A: Peito e tríceps", itens: ["Supino reto — 4 × 8–12", "Supino inclinado — 3 × 8–12", "Crucifixo — 3 × 10–12", "Tríceps na polia — 3 × 10–12"] },
            { titulo: "Sábado — Treino B: Costas e bíceps", itens: ["Puxada na frente — 4 × 8–12", "Remada curvada — 3 × 8–12", "Rosca direta — 3 × 10–12", "Rosca martelo — 3 × 10–12"] },
            { titulo: "Domingo — Descanso", texto: "Dia de recuperação. Priorize sono e alimentação.", recuperacao: true }
        ]
    },

    // Personalizado: EXEMPLO (o formulário ainda não salva as respostas).
    personalizado: {
        nome: "Personalizado",
        intro: "Treino montado de acordo com o seu objetivo e a sua rotina. (Exemplo: quando o formulário salvar as respostas, este treino pode ser trocado pelo treino real do usuário.)",
        nota: "Ainda não montou o seu? Responda o questionário para receber um treino feito para você.",
        dias: [
            { titulo: "Segunda — Superiores", itens: ["Supino com halteres — 3 × 10", "Remada baixa — 3 × 10", "Desenvolvimento — 3 × 10"] },
            { titulo: "Terça — Inferiores", itens: ["Agachamento — 3 × 10", "Stiff — 3 × 10", "Panturrilha — 3 × 15"] },
            { titulo: "Quarta — Descanso", texto: "Dia de recuperação.", recuperacao: true },
            { titulo: "Quinta — Superiores", itens: ["Supino com halteres — 3 × 10", "Remada baixa — 3 × 10", "Desenvolvimento — 3 × 10"] },
            { titulo: "Sexta — Inferiores", itens: ["Agachamento — 3 × 10", "Stiff — 3 × 10", "Panturrilha — 3 × 15"] },
            { titulo: "Sábado — Descanso", texto: "Dia de recuperação.", recuperacao: true },
            { titulo: "Domingo — Descanso", texto: "Dia de recuperação.", recuperacao: true }
        ]
    }
};

// ----- 2. Pegar os elementos da página -----
const seletorTreinos = document.getElementById("seletor-treinos");
const titulo = document.getElementById("titulo-plano");
const intro = document.getElementById("intro-plano");
const nota = document.getElementById("nota-plano");
const linkQuestionario = document.getElementById("link-questionario");
const trilha = document.getElementById("trilha-semanal");
const botoesDias = Array.from(document.querySelectorAll("[data-dia-index]"));
const anterior = document.querySelector("[data-anterior]");
const proximo = document.querySelector("[data-proximo]");
const progresso = document.querySelector(".progresso-semanal");
const nomesDias = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];

// getDay() vai de 0 (domingo) a 6; esta conta deixa 0 = segunda
const hoje = (new Date().getDay() + 6) % 7;
let indice = hoje;       // dia que está aberto
let treinoAtual = "";    // treino que está aberto

// ----- 3. Mostrar o treino escolhido -----
function mostrarTreino(chave) {
    treinoAtual = chave;
    const treino = treinos[chave];

    titulo.textContent = treino.nome;
    intro.textContent = treino.intro;
    nota.textContent = treino.nota;
    linkQuestionario.hidden = chave !== "personalizado"; // botão só no treino personalizado
    trilha.innerHTML = ""; // limpa os dias do treino anterior

    // Cria um card para cada dia (mesmas classes das outras páginas)
    treino.dias.forEach(function (dia) {
        const card = document.createElement("article");
        card.className = "dia-treino" + (dia.recuperacao ? " dia-recuperacao" : "");

        const h3 = document.createElement("h3");
        h3.textContent = dia.titulo;
        card.appendChild(h3);

        if (dia.itens) {
            const ul = document.createElement("ul");
            dia.itens.forEach(function (item) {
                const li = document.createElement("li");
                li.textContent = item;
                ul.appendChild(li);
            });
            card.appendChild(ul);
        }

        if (dia.texto) {
            const p = document.createElement("p");
            if (dia.destaque) {
                const forte = document.createElement("strong");
                forte.textContent = dia.destaque;
                p.appendChild(forte);
            }
            p.appendChild(document.createTextNode(dia.texto));
            card.appendChild(p);
        }

        trilha.appendChild(card);
    });

    // Marca o botão do treino aberto
    Array.from(seletorTreinos.children).forEach(function (botao) {
        botao.setAttribute("aria-pressed", botao.dataset.treino === chave ? "true" : "false");
    });

    atualizar();
}

// ----- 4. Carrossel dos dias da semana -----
function atualizar() {
    // Move a trilha para mostrar só o dia escolhido
    trilha.style.transform = "translateX(-" + (indice * 100) + "%)";
    botoesDias.forEach(function (botao, i) {
        botao.setAttribute("aria-pressed", i === indice ? "true" : "false");
    });
    progresso.textContent = nomesDias[indice];
    anterior.disabled = indice === 0;
    proximo.disabled = indice === nomesDias.length - 1;
}

botoesDias.forEach(function (botao, i) {
    botao.addEventListener("click", function () {
        indice = i;
        atualizar();
    });
});

anterior.addEventListener("click", function () {
    if (indice > 0) {
        indice--;
        atualizar();
    }
});

proximo.addEventListener("click", function () {
    if (indice < nomesDias.length - 1) {
        indice++;
        atualizar();
    }
});

// Etiqueta "HOJE" no botão do dia atual
const indicador = document.createElement("span");
indicador.className = "indicador-hoje";
indicador.textContent = "HOJE";
botoesDias[hoje].appendChild(indicador);

// ----- 5. Botões para escolher o treino -----
Object.keys(treinos).forEach(function (chave) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "seletor-dia";
    botao.textContent = treinos[chave].nome;
    botao.dataset.treino = chave;
    botao.setAttribute("aria-pressed", "false");
    botao.addEventListener("click", function () {
        mostrarTreino(chave);
    });
    seletorTreinos.appendChild(botao);
});

// ----- 6. Ao abrir a página -----
mostrarTreino("hipertrofia");

// ----- 7. Treinos anteriores -----
// Lê o mesmo histórico que a página de perfil salva (localStorage, chave "historicoTreinos").
function mostrarTreinosAnteriores() {
    const lista = document.getElementById("lista-anteriores");
    const vazio = document.getElementById("vazio-anteriores");

    // Se não tiver nada salvo (ou der erro ao ler), usa lista vazia
    let anteriores = [];
    try {
        anteriores = JSON.parse(localStorage.getItem("historicoTreinos")) || [];
    } catch (erro) {
        anteriores = [];
    }

    // Mais recente primeiro
    anteriores.sort(function (a, b) {
        return b.data.localeCompare(a.data);
    });

    vazio.hidden = anteriores.length > 0;

    anteriores.forEach(function (treino) {
        const card = document.createElement("article");
        card.className = "dia-treino";

        const h3 = document.createElement("h3");
        h3.textContent = treino.nome;

        // "2026-10-10" vira "10/10/2026"
        const partes = treino.data.split("-");
        const p = document.createElement("p");
        p.textContent = treino.duracao + " min · " + partes[2] + "/" + partes[1] + "/" + partes[0];

        card.appendChild(h3);
        card.appendChild(p);
        lista.appendChild(card);
    });
}

mostrarTreinosAnteriores();