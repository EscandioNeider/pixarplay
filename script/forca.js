//Matriz com a palavra e o tema
var sPerguntas = [

    // personagens pessoas
    ["SID", "PESSOA"],
    ["ANDY", "PESSOA"],
    ["MOLLY", "PESSOA"],
    ["HANNAH", "PESSOA"],
    ["BONNIE", "PESSOA"],


    // Personagens marcantes mas sem referência expecífica
    ["ZURG", "BRINQUEDO"],
    ["BARBIE GUIA", "BRINQUEDO"],
    ["AL TOY BARN", "TOY STORY 2"],
    ["AL MCWHIGGING", "TOY STORY 2"],
    ["PETE FEDORENTO", "GANGUE ROUNDUP"],


    // Brinquedos do Andy
    ["REX", "BRINQUEDO DO ANDY"],
    ["ABEL", "BRINQUEDO DO ANDY"],
    ["WOODY", "BRINQUEDO DO ANDY"],
    ["BETTY", "BRINQUEDO DO ANDY"],
    ["LENNY", "BRINQUEDO DO ANDY"],
    ["MURIEL", "BRINQUEDO DO ANDY"],
    ["MARIEL", "BRINQUEDO DO ANDY"],
    ["BOLA OITO", "BRINQUEDO DO ANDY"],
    ["JESSIE", "BRINQUEDO DO ANDY"],
    ["WHEEZY", "BRINQUEDO DO ANDY"],
    ["SARGENTO", "BRINQUEDO DO ANDY"],
    ["PORQUINHO", "BRINQUEDO DO ANDY"],
    ["BAL  NO ALVO", "BRINQUEDO DO ANDY"],
    ["BUZZ LIGHTEAR", "BRINQUEDO DO ANDY"],
    ["BARRIL DE MACACOS", "BRINQUEDO DO ANDY"],
    ["SENHOR CABEÇA DE BATATA", "BRINQUEDO DO ANDY"],
    ["SENHORA CABEÇA DE BATATA", "BRINQUEDO DO ANDY"],


    // Relacionados ao Pizza Plannet
    ["PIZZA", "PIZZA PLANET"],
    ["ESPAÇO", "PIZZA PLANET"],
    ["ALIENS", "PIZZA PLANET"],
    ["FOGUETE", "PIZZA PLANET"],
    ["PIZZA PLANNET", "RESTAURANTE"],


    // Brinquedos da Bonnie
    ["DOLLY", "BRINQUEDO DA BONNIE"],
    ["TOTORO", "BRINQUEDO DA BONNIE"],
    ["ESPETO", "BRINQUEDO DA BONNIE"],
    ["TRIXIE", "BRINQUEDO DA BONNIE"],
    ["ERVILHAS", "BRINQUEDO DA BONNIE"],
    ["GARFINHO", "BRINQUEDO DA BONNIE"],
    ["CHUCKLES", "BRINQUEDO DA BONNIE"],


    // Brinquedos da irmã do Sid
    ["SALLY", "BRINQUEDO DA HANNAH"],
    ["SRA. MAROCAS", "BRINQUEDO DA HANNAH"],
    ["MARIA ANTONIETA", "BRINQUEDO DA HANNAH"],


    // Relacionados á Escola Sunnyside
    ["KEN", "ESCOLA SUNNYSIDE"],
    ["LOTSO", "ESCOLA SUNNYSIDE"],
    ["BARBIE", "ESCOLA SUNNYSIDE"],
    ["CAIXOTE", "ESCOLA SUNNYSIDE"],
    ["BEBEZÃO", "ESCOLA SUNNYSIDE"],
    ["JACK NA CAIXA", "ESCOLA SUNNYSIDE"],
    ["CAIXA DE AREIA", "ESCOLA SUNNYSIDE"],
    ["MACACO JOLLY CHIMP", "ESCOLA SUNNYSIDE"],


    // Personagens de Toy Story 4
    ["BENSON", "TOY STORY 4"],
    ["VIAGEM", "TOY STORY 4"],
    ["TRAILER", "TOY STORY 4"],
    ["DUKE CABOOM", "TOY STORY 4"],
    ["GABBY GABBY", "TOY STORY 4"],
    ["GIGGLE MCDIMPLES", "TOY STORY 4"],
    ["PARQUE DE DIVERSÕES", "TOY STORY 4"],


    // Músicas do filme
    ["QUANDO EU ERA AMADA", "MÚSICA"],
    ["AMIGO ESTOU AQUI", "MÚSICA"],
]

//Matriz para fazer o shuffle
var iSorteados = [];
//Conta a quantidade de jogadas feitas para buscar no vetor de Sorteados
var iJogada = 0;
//Armazena a palavra da vez
var sPalavraSorteada;
//Conta as letras certas
var iAcertos = 0;
//Conta as letras erradas
var iErros = 0;
//Guarda a letra clicada para poder desabilitá-la
var cLetraClicada = "";
//Vetor com as letras do teclado para facilitar a busca do Id
var sLetras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
    'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '-'];
//Variáveis que contam os acertos e erros
var iCertas = 0, iErradas = 0;

//Função para criar os espaços das letras
function criaLetras(sPalavra) {
    var formula = document.getElementById("tenta");
    formula.innerHTML = ''; // Limpa os campos anteriores
    var j = 0;

    for (var i = 0; i < sPalavra.length; i++) {
        if (sPalavra[i].charCodeAt(0) != 32) {
            var letra = document.createElement("input");
            letra.setAttribute("type", "text");
            letra.setAttribute("name", "tenta" + j);
            letra.setAttribute("id", "tenta" + j);
            letra.setAttribute("maxlength", 1);
            letra.setAttribute("size", "1");
            letra.setAttribute("disabled", true);
            letra.classList.add("form-control", "d-inline-block", "text-center", "mx-1");
            letra.style.width = "40px";
            letra.style.fontSize = "1.5rem";
            letra.style.fontWeight = "bold";
            formula.appendChild(letra);
            j++;
        } else {
            var space = document.createElement("span");
            space.style.width = "30px";
            space.style.display = "inline-block";
            formula.appendChild(space);
        }
    }

    sPalavraSorteada = limpa(sPalavra);
    document.getElementById("tema").innerHTML = "TEMA: " + sPerguntas[iSorteados[iJogada]][1]
        + " (" + sPalavraSorteada.length + " letras)";
}

//Função que confere a letra clicada
function sorteia() {
    // Verifica se já foram sorteadas todas as palavras
    if (iSorteados.length === 0) {
        for (var m = 0; m < sPerguntas.length; m++) {
            iSorteados.push(m);
        }
        iSorteados = shuffleArray(iSorteados);
    }

    // Verifica se ainda há palavras para sortear
    if (iJogada < sPerguntas.length) {
        criaLetras(sPerguntas[iSorteados[iJogada]][0]);
    } else {
        Swal.fire({
            title: 'Fim do jogo!',
            text: 'Você completou todas as palavras!',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    }
}

//Função que confere a letra clicada
function Confere(cLetra) {
    cLetraClicada = cLetra;
    var LAchou = false;
    for (var i = 0; i < sPalavraSorteada.length; i++) {
        if (cLetra == sPalavraSorteada.charAt(i)) {
            document.getElementById("tenta" + i).value = cLetra;
            iAcertos++;
            document.getElementById("acerto").innerHTML = "ACERTOS: " + iAcertos;
            LAchou = true;
        }
    }

    if (LAchou == false) {
        iErros++;
        document.getElementById("imagem").src = "img/forca" + (iErros + 1) + ".png";
    }
}

function acabou() {
    var LAacabou = false;

    if (iAcertos == sPalavraSorteada.length) {
        LAacabou = true;
        Swal.fire({
            position: "center",
            icon: "success",
            title: "PARABÉNS, VOCÊ CONSEGUIU!!!!",
            showConfirmButton: false,
            timer: 1500
        });
        iCertas++;
    } else if (iErros == 6) {
        LAacabou = true;
        Swal.fire({
            position: "center",
            icon: "error",
            title: "ENFORCADO!!!!!!",
            showConfirmButton: false,
            timer: 1500
        });
        iErradas++;
    }

    document.getElementById(cLetraClicada).disabled = true;
    document.getElementById(cLetraClicada).classList.remove("btn-light");
    document.getElementById(cLetraClicada).classList.add(LAacabou && iAcertos == sPalavraSorteada.length ? "btn-success" : "btn-danger");

    if (LAacabou) {
        // Limpa os campos de tentativa
        document.getElementById("tenta").innerHTML = '';

        // Atualiza o placar
        document.getElementById("palcerta").innerHTML =
            "CERTAS: " + iCertas + "<br>ERRADAS: " + iErradas;

        // Prepara próxima jogada
        iJogada++;
        iAcertos = 0;
        iErros = 0;
        document.getElementById("acerto").innerHTML = "ACERTOS: " + iAcertos;
        document.getElementById("imagem").src = "img/forca" + (iErros + 1) + ".png";

        // Reativa todas as letras
        for (var i = 0; i < sLetras.length; i++) {
            var btn = document.getElementById(sLetras[i]);
            if (btn) {
                btn.disabled = false;
                btn.classList.remove("btn-success", "btn-danger");
                btn.classList.add("btn-light");
            }
        }

        // Sorteia nova palavra
        setTimeout(sorteia, 1500);
    }
}

function shuffleArray(d) {
    for (var c = d.length - 1; c > 0; c--) {
        var b = Math.floor(Math.random() * (c + 1));
        var a = d[c];
        d[c] = d[b];
        d[b] = a;
    }
    return d;
}

function limpa(sltem) {
    var sResultado = sltem;
    sResultado = replaceAll(sResultado, " ", "");
    sResultado = sResultado.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    return sResultado;
}

function replaceAll(str, de, para) {
    var pos = str.indexOf(de);
    while (pos > -1) {
        str = str.replace(de, para);
        pos = str.indexOf(de);
    }
    return (str);
}

function shake(e, oncomlete, distance, time) {
    var time = 500;
    var distance = 5;

    var start = (new Date()).getTime();
    animate();

    function animate() {
        var now = (new Date()).getTime();
        var elapsed = now - start;
        var fraction = elapsed / time;

        if (fraction < 1) {
            var x = distance * Math.min(fraction * 4 * Math.PI);
            e.style.left = x + 'px';
            setTimeout(animate, Math.min(25, time - elapsed));
        } else {
            if (oncomlete) oncomlete(e);
        }
    }
}

function shakeme(event1) {
    shake(event1.target);
}
