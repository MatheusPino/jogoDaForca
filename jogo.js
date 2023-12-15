const readlineSync = require('readline-sync');

class Partida {
  constructor(palavrasEDicas) {
    this.palavrasEDicas = palavrasEDicas;
    this.letrasCorretas = [];
    this.palavraSecreta = "";
    this.dica = "";
    this.tentativas = 7;
    this.pontuacao = 0;
  }

  sortearPalavra() {
    const palavras = Object.keys(this.palavrasEDicas);
    const dicas = Object.values(this.palavrasEDicas);
    const indice = Math.floor(Math.random() * palavras.length);
    this.palavraSecreta = palavras[indice];
    this.dica = dicas[indice];
  }

  esconderPalavra() {
    let palavraEscondida = "";
    for (const letra of this.palavraSecreta) { // percorre cada letra da string palavraSecreta
      if (this.letrasCorretas.includes(letra.toLowerCase()) || letra === "-" || letra === " ") {  // confere se a letra ja foi acertada ou se é hifen ou espaço e os mantem caso true.
        palavraEscondida += letra;
      }
      else { // esconde as letras que ainda não foram acertadas
        palavraEscondida += "_"
      }
    }
    return palavraEscondida;
  }

  adicionarLetraCorreta(letra) {
    const letraMinuscula = letra.toLowerCase();  // Converte a letra para minúscula antes de verificar ou adicionar

    if (!this.letrasCorretas.includes(letraMinuscula)) { // Verifica se a letra já foi adicionada antes de adicionar novamente
      this.letrasCorretas.push(letraMinuscula);
    }
  }

  resetarLetrasCorretas() {
    this.letrasCorretas = [];
  }

  verificarSeGanhou() {
    return !this.esconderPalavra().includes("_");
  }

  verificarSePerdeu() {
    return this.tentativas === 0;
  }
}

class Jogador {
  constructor() { }

  realizarJogada(partida) {
    // Consoles da partida
    console.log(`\nDica: ${partida.dica}`);
    console.log(`Tentativas restantes: ${partida.tentativas}`);
    console.log(partida.esconderPalavra());

    // Recebe palpite
    const palpite = readlineSync.question('\nChute uma letra ou palavra: ').toLowerCase();

    // confere se é letra ou palavra
    if (palpite.length === 1) {
      this.chutarLetra(palpite, partida);
    } else {
      this.chutarPalavra(palpite, partida);
    }
  }

  chutarLetra(letra, partida) {
    // ACERTOU
    if (partida.palavraSecreta.toLowerCase().includes(letra)) {
      partida.adicionarLetraCorreta(letra);
    }
    // ERROU
    else {
      partida.tentativas--;
    }
  }

  chutarPalavra(palavra, partida) {
    // ACERTOU
    if (palavra.toLowerCase() === partida.palavraSecreta.toLowerCase()) {
      for (const letra of partida.palavraSecreta) {
        partida.adicionarLetraCorreta(letra);
      }
    }
    // ERROU
    else {
      partida.tentativas--;
    }
  }
}

class ControladorDePartida {
  constructor(partida, jogador) {
    this.partida = partida;
    this.jogador = jogador;
  }

  iniciarJogo() {
    console.log("\nBem vindo ao Jogo da Forca!");
    this.criarPartidaNova();
    this.realizarJogada();
  }

  realizarJogada() {
    this.jogador.realizarJogada(this.partida);
    this.verificarResultado();
  }

  verificarResultado() {
    // GANHOU
    if (this.partida.verificarSeGanhou()) {
      this.partida.pontuacao++;
      console.log(`\nVocê acertou! A Palavra secreta é: ${this.partida.palavraSecreta}`);
      console.log(`Pontuação: ${this.partida.pontuacao}`);
      this.jogarNovamente();
    }
    // PERDEU
    else if (this.partida.verificarSePerdeu()) {
      console.log("\nAcabaram suas chances, você perdeu.");
      console.log(`Pontuação: ${this.partida.pontuacao}`);
      this.jogarNovamente();
    }
    // Jogo não acabou
    else {
      this.realizarJogada();
    }
  }

  jogarNovamente() {
    // Recebe input
    const resposta = readlineSync.question("\nDeseja jogar novamente? (s/n)\n");
    // caso SIM
    if (resposta.toLowerCase() === 's') {
      this.criarPartidaNova();
      this.realizarJogada();
    }
    // caso NÃO
    else if (resposta.toLowerCase() === 'n') {
      this.encerrarJogo();
    }
    // caso Comando inválido
    else {
      console.error("Comando inválido.");
      this.jogarNovamente()
    }
  }

  criarPartidaNova() {
    this.partida.sortearPalavra();
    this.partida.tentativas = 7;
    this.partida.resetarLetrasCorretas();
  }

  encerrarJogo() {
    console.log("Obrigado por jogar, volte sempre!");
    process.exit();
  }
}

// Palavras e dicas
const palavrasEDicas = {
  node: "Ambiente de execução para JavaScript no lado do servidor.",
  react: "Biblioteca JavaScript para construção de interfaces de usuário.",
  git: "Sistema de controle de versão distribuído.",
  cachorro: "Um animal de estimação comum conhecido por sua lealdade.",
  floresta: "Uma extensa área coberta por árvores e vegetação.",
  "Bem-te-vi": "Pássaro brasileiro reconhecido pelo seu canto alegre e pelo contraste de suas cores, com predominância de amarelo e preto.",
  "Johnny Depp": "Ator conhecido por suas performances excêntricas em filmes como Piratas do Caribe, Edward Mãos de Tesoura e Alice no País das Maravilhas.",
  "Leonardo Dicaprio": "Ator vencedor do Oscar conhecido por seus papéis em filmes como Titanic e O Regresso."
};

// Instanciando classes
const partida = new Partida(palavrasEDicas);
const jogador = new Jogador();
const controlador = new ControladorDePartida(partida, jogador);

// Se divirta
controlador.iniciarJogo();
