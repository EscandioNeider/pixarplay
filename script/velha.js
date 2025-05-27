const slot = document.getElementsByClassName("slot");
let isX = true;
let jogando = false;
let jogada = 0;
let pontuacaoX = 0;
let pontuacaoO = 0;

function jogar() {
    if (jogando) return;
    reiniciar();
}

function reiniciar() {
    for (let i = 0; i < slot.length; i++) {
        slot[i].innerHTML = "";
    }
    jogada = 0;
    jogando = true;
    isX = true;
    document.getElementById("quemJoga").innerHTML = "Vez do Wall-E jogar!";
    document.getElementById("btnJogar").disabled = true;
    document.getElementById("btnReiniciar").disabled = false;
}

function clicar(nChild) {
    if (!jogando) return;

    const element = slot[nChild];
    if (element.innerHTML == "") {
        if (isX) {
            element.innerHTML = "<img src='img/walle.svg'>";
            document.getElementById("quemJoga").innerHTML = "Vez da Eva jogar!";
        } else {
            element.innerHTML = "<img src='img/eva.svg'>";
            document.getElementById("quemJoga").innerHTML =
                "Vez do Wall-E jogar!";
        }

        verificarX();
        verificarY();
        verificarDiagonal();

        isX = !isX;
        jogada++;

        if (jogada === 9 && jogando) {
            empate();
        }
    }
}

function verificarX() {
    for (let i = 0; i < 9; i += 3) {
        let texto = slot[i].innerHTML;
        if (
            texto &&
            slot[i + 1].innerHTML === texto &&
            slot[i + 2].innerHTML === texto
        ) {
            quemGanhou();
        }
    }
}

function verificarY() {
    for (let i = 0; i < 3; i++) {
        let texto = slot[i].innerHTML;
        if (
            texto &&
            slot[i + 3].innerHTML === texto &&
            slot[i + 6].innerHTML === texto
        ) {
            quemGanhou();
        }
    }
}

function verificarDiagonal() {
    let texto1 = slot[0].innerHTML;
    if (
        texto1 &&
        slot[4].innerHTML === texto1 &&
        slot[8].innerHTML === texto1
    ) {
        quemGanhou();
        return;
    }

    let texto2 = slot[2].innerHTML;
    if (
        texto2 &&
        slot[4].innerHTML === texto2 &&
        slot[6].innerHTML === texto2
    ) {
        quemGanhou();
    }
}

function quemGanhou() {
    if (isX) {
        document.getElementById("audioWallE").play();
        Swal.fire({
            title: "Wall-e Venceu!",
            text: "Ta-Dahhhhh",
            imageUrl: "img/walle-tadah.jpg",
            imageWidth: 400,
            imageHeight: 400,
        });
        pontuacaoX++;
    } else {
        document.getElementById("audioEva").play();
        Swal.fire({
            title: "Eva Venceu!",
            text: "Hahahahahaaaa!",
            imageUrl: "img/eva-laugh.png",
            imageWidth: 400,
            imageHeight: 400,
        });
        pontuacaoO++;
    }
    atualizarPontuacao();
    jogando = false;
    document.getElementById("btnJogar").disabled = false;
    document.getElementById("btnReiniciar").disabled = true;
}

function empate() {
    Swal.fire({
        title: "Deu velha!",
        text: "Dessa vez, o amor venceu...",
        imageUrl: "img/deu-velha.jpg",
        imageWidth: 400,
        imageHeight: 400,
    });
    jogando = false;
    document.getElementById("btnJogar").disabled = false;
    document.getElementById("btnReiniciar").disabled = true;
    document.getElementById("quemJoga").innerHTML = "";
}

function atualizarPontuacao() {
    document.getElementById(
        "pontuacao"
    ).innerHTML = `${pontuacaoX} - ${pontuacaoO}`;
}