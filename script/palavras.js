const substantivos = ["Viva", "Miguel", "Abuela", "Muertos", "Caveira", "Destino", "Alegria"];
const adjetivos = ["Loco", "Feliz", "Doido", "Triste", "Colorido", "Escuro", "Perdido"];
const palavrasQueNaoTrocam = ["a", "as", "das", "uma", "umas", "o", "os", "dos", "um", "uns", "que", "e", "é"];

function categoriaDaPalavra(palavra) {
    if (palavra[0] === palavra[0].toUpperCase()) return "substantivo";
    if (palavra.endsWith("o") || palavra.endsWith("a")) return "adjetivo";
    return "outro";
}

function trocaPalavras() {
    const filme = document.getElementById("filme").value.trim();

    if (filme === "") {
        alert("Insira o nome do filme!");
        document.getElementById("resultado").innerHTML = "...";
        return;
    }

    const palavrasDoFilme = filme.split(' ');
    let substituiu = false;
    let tentativas = 0;

    while (!substituiu && tentativas < 20) {
        let i = Math.floor(Math.random() * palavrasDoFilme.length);
        let palavraOriginal = palavrasDoFilme[i];
        let palavraMinuscula = palavraOriginal.toLowerCase();

        if (!palavrasQueNaoTrocam.includes(palavraMinuscula)) {
            const categoria = categoriaDaPalavra(palavraOriginal);
            let novaPalavra = null;

            if (categoria === "substantivo") {
                novaPalavra = substantivos[Math.floor(Math.random() * substantivos.length)];
            } else if (categoria === "adjetivo") {
                novaPalavra = adjetivos[Math.floor(Math.random() * adjetivos.length)];
            }

            if (novaPalavra) {
                palavrasDoFilme[i] = novaPalavra;
                substituiu = true;
            }
        }

        tentativas++;
    }

    const resultado = palavrasDoFilme.join(' ');
    document.getElementById("resultado").innerHTML = resultado;
}

function limpar() {
    document.getElementById("filme").value = "";
    document.getElementById("resultado").innerHTML = "...";
}
