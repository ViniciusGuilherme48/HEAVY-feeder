/* carrossel-semanal.js
   Seletor de dias da semana (com destaque de "HOJE") dos planos de treino: Hipertrofia, Emagrecimento e Força.
   Marcação: [data-carrossel-semanal] > .seletor-dias, .trilha-semanal, [data-anterior], [data-proximo].
   Estilos: CSS/style-cards.css */
document.querySelectorAll("[data-carrossel-semanal]").forEach(function (carrossel) {
    const trilha = carrossel.querySelector(".trilha-semanal");
    const slides = Array.from(trilha.children);
    const botoesDias = Array.from(carrossel.querySelectorAll("[data-dia-index]"));
    const anterior = carrossel.querySelector("[data-anterior]");
    const proximo = carrossel.querySelector("[data-proximo]");
    const progresso = carrossel.querySelector(".progresso-semanal");
    const nomes = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];
    const hoje = (new Date().getDay() + 6) % 7;
    let indice = hoje;

    const indicador = document.createElement("span");
    indicador.className = "indicador-hoje";
    indicador.textContent = "HOJE";
    botoesDias[hoje].appendChild(indicador);

    function atualizar() {
        trilha.style.transform = "translateX(-" + (indice * 100) + "%)";
        botoesDias.forEach(function (botao, i) {
            botao.setAttribute("aria-pressed", i === indice ? "true" : "false");
        });
        progresso.textContent = nomes[indice];
        anterior.disabled = indice === 0;
        proximo.disabled = indice === slides.length - 1;
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
        if (indice < slides.length - 1) {
            indice++;
            atualizar();
        }
    });

    atualizar();
});
