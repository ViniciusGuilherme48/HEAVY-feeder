// ============================================================
// 7 DOBRAS - calcula e abre a segunda tela com o resultado
// ============================================================

function calcular7dobras() {
    // Passo 1: conferir se todos os campos foram preenchidos
    const campos = ["idade", "peso", "peitoral", "axilar", "triceps",
                    "subescapular", "abdominal", "suprailiaca", "coxa"];

    for (let i = 0; i < campos.length; i++) {
        if (document.getElementById(campos[i]).value === "") {
            alert("Preencha todos os campos.");
            return; // para a função aqui
        }
    }

    // Passo 2: pegar os valores digitados (Number transforma texto em número)
    const sexo = document.getElementById("sexo").value;
    const idade = Number(document.getElementById("idade").value);
    const peso = Number(document.getElementById("peso").value);

    // Passo 3: somar as 7 dobras
    const soma =
        Number(document.getElementById("peitoral").value) +
        Number(document.getElementById("axilar").value) +
        Number(document.getElementById("triceps").value) +
        Number(document.getElementById("subescapular").value) +
        Number(document.getElementById("abdominal").value) +
        Number(document.getElementById("suprailiaca").value) +
        Number(document.getElementById("coxa").value);

    // Passo 4: densidade corporal (Jackson & Pollock) - muda conforme o sexo
    let densidade;
    if (sexo === "masculino") {
        densidade = 1.112 - 0.00043499 * soma + 0.00000055 * soma * soma - 0.00028826 * idade;
    } else {
        densidade = 1.097 - 0.00046971 * soma + 0.00000056 * soma * soma - 0.00012828 * idade;
    }

    // Passo 5: % de gordura (equação de Siri)
    const gordura = 495 / densidade - 450;

    // Passo 6: massa gorda e massa magra em kg
    const massaGorda = peso * (gordura / 100);
    const massaMagra = peso - massaGorda;

    // Passo 7: abrir a segunda tela levando os resultados no endereço (?nome=valor&...)
    window.location.href =
        "resultado-7dobras.html" +
        "?gordura=" + gordura.toFixed(1) +
        "&massaGorda=" + massaGorda.toFixed(1) +
        "&massaMagra=" + massaMagra.toFixed(1);
}