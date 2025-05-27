const CONFIG = {
    velocidade_jogador: 25,
    velocidade_inicial: 3,
    velocidade_maxima: 12,
    incremento: 0.5,
    intervalo_faixas: 200,
    intervalo_inimigos: 1500,
    margem_colisao: 45,
    incremento_distancia: 1,
    pistas: [20, 35, 50, 65, 80]
};

// Gerenciamento do Estado do Jogo
class EstadoJogo {
    constructor() {
        this.reiniciar();
        this.carroSelecionado = null;
    }

    reiniciar() {
        this.pontuacao = 0;
        this.velocidade = CONFIG.velocidade_inicial;
        this.rodando = false;
        this.tempoInicio = 0;
        this.posicaoJogador = 50;
        this.inimigos = [];
        this.faixasEstrada = [];
        this.posicaoAlvo = 50;
    }

    incrementarPontuacao() {
        this.pontuacao += CONFIG.incremento_distancia;
        // A cada 500 pontos a velocidade aumenta
        if (this.pontuacao % 500 === 0 && this.velocidade < CONFIG.velocidade_maxima) {
            this.velocidade += CONFIG.incremento;
        }
    }

    getTempoJogo() {
        return this.tempoInicio ? Math.floor((Date.now() - this.tempoInicio) / 1000) : 0;
    }

    setCarroSelecionado(tipoCarro) {
        this.carroSelecionado = tipoCarro;
    }
}

// Motor do Jogo
class JogoCorridaVeloz {
    constructor() {
        this.estado = new EstadoJogo();
        this.elementos = this.inicializarElementos();
        this.intervalos = {};
        this.idAnimacao = null;
        this.configurarEventos();
        this.configurarSelecaoCarro();
    }

    inicializarElementos() {
        return {
            containerJogo: document.getElementById('containerJogo'),
            telaInicio: document.getElementById('telaInicio'),
            telaGameOver: document.getElementById('telaGameOver'),
            jogador: document.getElementById('jogador'),
            mostradorPontuacao: document.getElementById('mostradorPontuacao'),
            mostradorVelocidade: document.getElementById('mostradorVelocidade'),
            botaoEsquerda: document.getElementById('botaoEsquerda'),
            botaoDireita: document.getElementById('botaoDireita'),
            pontuacaoFinal: document.getElementById('pontuacaoFinal'),
            tempoFinal: document.getElementById('tempoFinal'),
            botaoIniciar: document.getElementById('botaoIniciar')
        };
    }

    configurarSelecaoCarro() {
        const opcoesCarros = document.querySelectorAll('.opcoes img');

        opcoesCarros.forEach(img => {
            img.addEventListener('click', () => {
                // Remove seleção anterior
                opcoesCarros.forEach(opcao => opcao.classList.remove('selecionado'));

                // Adiciona seleção ao carro clicado
                img.classList.add('selecionado');

                // Armazena carro selecionado
                const tipoCarro = img.getAttribute('data-personagem');
                this.estado.setCarroSelecionado(tipoCarro);

                // Atualiza aparência do carro do jogador
                this.atualizarAparenciaCarroJogador(tipoCarro);

                // Habilita botão de iniciar
                this.elementos.botaoIniciar.disabled = false;
                this.elementos.botaoIniciar.textContent = 'INICIAR JOGO';
            });
        });
    }

    atualizarAparenciaCarroJogador(tipoCarro) {
        // Remove todas as classes de tipo de carro
        this.elementos.jogador.className = 'jogador';

        // Adiciona classe do tipo de carro selecionado
        if (tipoCarro) {
            this.elementos.jogador.classList.add(tipoCarro);
        }
    }

    configurarEventos() {
        // Controles de toque
        this.elementos.botaoEsquerda.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.moverJogador('esquerda');
        });

        this.elementos.botaoDireita.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.moverJogador('direita');
        });

        // Controles de clique para desktop
        this.elementos.botaoEsquerda.addEventListener('click', () => this.moverJogador('esquerda'));
        this.elementos.botaoDireita.addEventListener('click', () => this.moverJogador('direita'));

        // Controles de teclado
        document.addEventListener('keydown', (e) => {
            if (!this.estado.rodando) return;

            switch (e.key) {
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault();
                    this.moverJogador('esquerda');
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault();
                    this.moverJogador('direita');
                    break;
            }
        });

        // Previne menu de contexto no mobile
        document.addEventListener('contextmenu', e => e.preventDefault());
    }

    iniciar() {
        if (!this.estado.carroSelecionado) {
            alert('Por favor, selecione um carro primeiro!');
            return;
        }

        this.estado.reiniciar();
        this.estado.rodando = true;
        this.estado.tempoInicio = Date.now();

        // Mantém a aparência do carro selecionado
        this.atualizarAparenciaCarroJogador(this.estado.carroSelecionado);

        this.elementos.telaInicio.classList.add('oculto');
        this.elementos.telaGameOver.classList.add('oculto');

        this.iniciarLoopsJogo();
    }

    iniciarLoopsJogo() {
        // Atualização da pontuação
        this.intervalos.pontuacao = setInterval(() => {
            this.estado.incrementarPontuacao();
            this.atualizarHUD();
        }, 50);

        // Linhas da estrada
        this.intervalos.faixasEstrada = setInterval(() => {
            this.criarFaixaEstrada();
        }, CONFIG.intervalo_faixas);

        // Carros inimigos (frequência reduzida)
        this.intervalos.inimigos = setInterval(() => {
            this.criarCarroInimigo();
        }, CONFIG.intervalo_inimigos);

        // Movimento suave
        this.intervalos.movimentoSuave = setInterval(() => {
            this.atualizarMovimentoSuave();
        }, 16); // ~60fps

        // Loop principal do jogo
        this.loopJogo();
    }

    atualizarMovimentoSuave() {
        if (!this.estado.rodando) return;

        this.estado.posicaoJogador = this.estado.posicaoAlvo;
        this.elementos.jogador.style.left = `${this.estado.posicaoJogador}%`;
    }

    loopJogo() {
        if (!this.estado.rodando) return;

        this.atualizarFaixasEstrada();
        this.atualizarInimigos();
        this.verificarColisoes();

        this.idAnimacao = requestAnimationFrame(() => this.loopJogo());
    }

    moverJogador(direcao) {
        if (!this.estado.rodando) return;

        const indicePistaAtual = CONFIG.pistas.findIndex(pista =>
            Math.abs(pista - this.estado.posicaoAlvo) < 8
        );

        let novoIndicePista = indicePistaAtual;

        if (direcao === 'esquerda' && indicePistaAtual > 0) {
            novoIndicePista = indicePistaAtual - 1;
        } else if (direcao === 'direita' && indicePistaAtual < CONFIG.pistas.length - 1) {
            novoIndicePista = indicePistaAtual + 1;
        }

        if (novoIndicePista !== indicePistaAtual) {
            this.estado.posicaoAlvo = CONFIG.pistas[novoIndicePista];

            this.estado.posicaoJogador = this.estado.posicaoAlvo;
            this.elementos.jogador.style.left = `${this.estado.posicaoJogador}%`;

            // Efeito de movimento
            this.elementos.jogador.classList.add('movendo');
            setTimeout(() => {
                this.elementos.jogador.classList.remove('movendo');
            }, 300);
        }
    }

    criarFaixaEstrada() {
        const faixa = document.createElement('div');
        faixa.className = 'linha-estrada';
        faixa.style.top = '-60px';
        faixa.style.animation = `movimentoEstrada ${2000 / this.estado.velocidade}ms linear`;

        this.elementos.containerJogo.appendChild(faixa);
        this.estado.faixasEstrada.push(faixa);

        // Remove após animação
        setTimeout(() => {
            if (faixa.parentNode) {
                faixa.parentNode.removeChild(faixa);
                this.estado.faixasEstrada = this.estado.faixasEstrada.filter(linha => linha !== faixa);
            }
        }, 2000 / this.estado.velocidade);
    }

    criarCarroInimigo() {
        const inimigo = document.createElement('div');
        const tipoCarro = Math.floor(Math.random() * 4) + 1;

        // Evita spawn muito perto do jogador
        let pistasDisponiveis = CONFIG.pistas.filter(pista =>
            Math.abs(pista - this.estado.posicaoJogador) > 15
        );

        if (pistasDisponiveis.length === 0) {
            pistasDisponiveis = CONFIG.pistas;
        }

        const pista = pistasDisponiveis[Math.floor(Math.random() * pistasDisponiveis.length)];

        inimigo.className = `carro-inimigo tipo-${tipoCarro}`;
        inimigo.style.left = `${pista}%`;
        inimigo.style.top = '-120px';
        inimigo.style.transform = 'translateX(-50%)';

        this.elementos.containerJogo.appendChild(inimigo);
        this.estado.inimigos.push({
            elemento: inimigo,
            x: pista,
            y: -120
        });
    }

    atualizarInimigos() {
        this.estado.inimigos = this.estado.inimigos.filter(inimigo => {
            inimigo.y += this.estado.velocidade;
            inimigo.elemento.style.top = `${inimigo.y}px`;

            if (inimigo.y > window.innerHeight) {
                if (inimigo.elemento.parentNode) {
                    inimigo.elemento.parentNode.removeChild(inimigo.elemento);
                }
                return false;
            }
            return true;
        });
    }

    atualizarFaixasEstrada() {
        // As faixas da estrada são controladas por animações CSS
    }

    verificarColisoes() {
        const retanguloJogador = this.elementos.jogador.getBoundingClientRect();

        this.estado.inimigos.forEach(inimigo => {
            const retanguloInimigo = inimigo.elemento.getBoundingClientRect();

            if (this.estaColidindo(retanguloJogador, retanguloInimigo)) {
                this.gameOver();
            }
        });
    }

    estaColidindo(ret1, ret2) {
        return !(ret1.right < ret2.left + CONFIG.margem_colisao ||
            ret1.left > ret2.right - CONFIG.margem_colisao ||
            ret1.bottom < ret2.top + CONFIG.margem_colisao ||
            ret1.top > ret2.bottom - CONFIG.margem_colisao);
    }

    atualizarHUD() {
        this.elementos.mostradorPontuacao.textContent =
            `DISTÂNCIA: ${this.estado.pontuacao.toString().padStart(5, '0')}m`;
        this.elementos.mostradorVelocidade.textContent =
            `VELOCIDADE: ${Math.floor(this.estado.velocidade * 20)} km/h`;
    }

    gameOver() {
        this.estado.rodando = false;

        // Limpa intervalos
        Object.values(this.intervalos).forEach(intervalo => clearInterval(intervalo));

        // Cancela animação
        if (this.idAnimacao) {
            cancelAnimationFrame(this.idAnimacao);
        }

        // Efeito de colisão
        this.elementos.jogador.classList.add('colisao');

        // Limpa inimigos e faixas da estrada
        setTimeout(() => {
            this.limparElementosJogo();
            this.mostrarTelaGameOver();
        }, 500);
    }

    limparElementosJogo() {
        // Remove todos os inimigos
        this.estado.inimigos.forEach(inimigo => {
            if (inimigo.elemento.parentNode) {
                inimigo.elemento.parentNode.removeChild(inimigo.elemento);
            }
        });

        // Remove todas as faixas da estrada
        this.estado.faixasEstrada.forEach(faixa => {
            if (faixa.parentNode) {
                faixa.parentNode.removeChild(faixa);
            }
        });

        // Reseta arrays
        this.estado.inimigos = [];
        this.estado.faixasEstrada = [];
    }

    mostrarTelaGameOver() {
        this.elementos.pontuacaoFinal.textContent = `Sua distância: ${this.estado.pontuacao}m`;
        this.elementos.tempoFinal.textContent = `Tempo de jogo: ${this.estado.getTempoJogo()}s`;
        this.elementos.telaGameOver.classList.remove('oculto');
    }

    reiniciar() {
        // Reseta carro do jogador
        this.elementos.jogador.classList.remove('colisao');
        this.estado.posicaoJogador = 50;
        this.estado.posicaoAlvo = 50;
        this.elementos.jogador.style.left = '50%';

        // Mostra tela de início novamente
        this.elementos.telaGameOver.classList.add('oculto');
        this.elementos.telaInicio.classList.remove('oculto');
    }
}

// Inicializa o Jogo
const jogo = new JogoCorridaVeloz();