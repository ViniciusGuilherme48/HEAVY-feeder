// ============================================================
// MACRONUTRIENTES - calcula e abre a segunda tela com o resultado
// ============================================================

function calcularMacro() {
    // Passo 1: conferir se todos os campos foram preenchidos
    const campos = ["peso", "calorias"];

    for (let i = 0; i < campos.length; i++) {
        if (document.getElementById(campos[i]).value === "") {
            alert("Preencha todos os campos.");
            return;
        }
    }

    // Passo 2: pegar os valores digitados
    const peso = Number(document.getElementById("peso").value);
    const objetivo = document.getElementById("objetivo").value;
    let calorias = Number(document.getElementById("calorias").value);

    // Passo 3: ajustar as calorias de acordo com o objetivo
    if (objetivo === "emagrecimento") {
        calorias = calorias - 500; // come menos do que gasta
    } else if (objetivo === "ganho") {
        calorias = calorias + 300; // come mais do que gasta
    }
    // na "manutencao" as calorias ficam iguais

    // Passo 4: proteína e gordura por kg de peso
    const proteina = peso * 2; // 2 g por kg
    const gordura = peso * 1;  // 1 g por kg

    // Passo 5: o que sobrar das calorias vira carboidrato
    // Proteína = 4 kcal/g | Carboidrato = 4 kcal/g | Gordura = 9 kcal/g
    const carboidrato = (calorias - proteina * 4 - gordura * 9) / 4;

    // Passo 6: abrir a segunda tela levando os resultados
    window.location.href =
        "resultado-macronutrientes.html" +
        "?proteina=" + proteina.toFixed(0) +
        "&carboidrato=" + carboidrato.toFixed(0) +
        "&gordura=" + gordura.toFixed(0);
}