/* botao-voltar.js
   Botão "Voltar" das páginas de treino (Hipertrofia, Emagrecimento, Força e Treino personalizado).
   Volta para a página anterior; se não houver histórico, abre treinos.html.
   Atua somente em <button class="botao-voltar"> (os links .botao-voltar das calculadoras não são afetados).
   Estilos: CSS/style-global.css */
document.querySelectorAll('button.botao-voltar').forEach((botao) => {
    botao.addEventListener('click', () => {
        if (window.history.length > 1) { window.history.back(); } else { window.location.href = 'treinos.html'; }
    });
});
