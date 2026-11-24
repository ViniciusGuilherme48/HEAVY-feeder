// ============================================================
// GASTO ENERGÉTICO - calcula e abre a segunda tela com o resultado
// ============================================================

function calcularGasto() {
    // Passo 1: conferir se todos os campos foram preenchidos
    const campos = ["idade", "peso", "altura"];

    for (let i = 0; i < campos.length; i++) {
        if (document.getElementById(campos[i]).value === "") {
            alert("Preencha todos os campos.");
            return;
        }
    }

    // Passo 2: pegar os valores digitados
    const sexo = document.getElementById("sexo").value;
    const idade = Number(document.getElementById("idade").value);
    const peso = Number(document.getElementById("peso").value);
    const altura = Number(document.getElementById("altura").value);
    const atividade = Number(document.getElementById("atividade").value); // já é o fator (1.2, 1.375...)

    // Passo 3: TMB / BMR (Mifflin-St Jeor) - muda conforme o sexo
    let bmr;
    if (sexo === "masculino") {
        bmr = 10 * peso + 6.25 * altura - 5 * idade + 5;
    } else {
        bmr = 10 * peso + 6.25 * altura - 5 * idade - 161;
    }

    // Passo 4: gasto do dia todo (TDEE) = BMR x fator de atividade
    const tdee = bmr * atividade;

    // Passo 5: abrir a segunda tela levando os resultados
    window.location.href =
        "resultado-gasto-energetico.html" +
        "?bmr=" + bmr.toFixed(0) +
        "&tdee=" + tdee.toFixed(0);
}