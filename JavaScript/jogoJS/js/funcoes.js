(function () {
  const cnv = document.querySelector('#canvas');
  const ctx = cnv.getContext('2d');

  //Movimentos para o primeiro robô (Wall-E)
  let moveLeft = false;
  let moveUp = false;
  let moveRight = false;
  let moveDown = false;

  //Movimentos para o segundo robô (Eva)
  let goLeft = false;
  let goUp = false;
  let goRight = false;
  let goDown = false;
  
  //Algoritmos para os obstáculos
  let colisaoEsquerda = false;
  let colisaoDireita = false;
  let colisaoCima = false;
  let colisaoBaixo = false;

  //Vida para os robôs
  let vidaQuadrado1 = Math.round(Math.random() * 100)
  let vidaQuadrado2 = Math.round(Math.random() * 100)

  //Algoritmos para as colisões
  const maxColisoes = 5; 
  let colisoes = 0;

  let jogoBloqueado = false;


  document.getElementById("vida-quadrado1").innerHTML = "Vida do WALL-E: " + vidaQuadrado1;
  document.getElementById("vida-quadrado2").innerHTML = "Vida da EVA: " + vidaQuadrado2;



  // arrays
  const quadrados = [];

  // quadrados
  //Primeiro quadrado
  const quadrado1 = new quadrado(0, 0, 50, 70, "#008000", 5);
  quadrados.push(quadrado1);

  const imagemQuadrado1 = new Image();
  imagemQuadrado1.src = './images/walle2.jpg';

  //Segundo quadrado
  const quadrado2 = new quadrado(1000, 900, 50, 70, "008000", 5);
  quadrados.push(quadrado2);

  const imagemQuadrado2 = new Image();
  imagemQuadrado2.src = './images/eva.jpg';

  //Obstáculos
  const quadrado3 = new quadrado(400, 350, 500, 40, "#000", 0);
  quadrados.push(quadrado3);

  const quadrado4 = new quadrado(100, 120, 550, 40, "#000", 0);
  quadrados.push(quadrado4);

  // pressionar as teclas
  window.addEventListener('keydown', function (e) {
    const nomeKey = e.key;
    console.log(nomeKey);
    switch (nomeKey) {
      case 'ArrowLeft':
        moveLeft = true;
        break;
      case 'ArrowUp':
        moveUp = true;
        break;
      case 'ArrowRight':
        moveRight = true;
        break;
      case 'ArrowDown':
        moveDown = true;
        break;
    }
  });

  //Teclas W A S D para o segundo quadrado
  window.addEventListener('keydown', function (d) {
    const Key = d.key;
    console.log(Key);
    switch (Key) {
      case 'a':
        goLeft = true;
        break;
      case 'w':
        goUp = true;
        break;
      case 'd':
        goRight = true;
        break;
      case 's':
        goDown = true;
        break;
    }
  });

  //soltar as teclas  
  window.addEventListener('keyup', (e) => {
    const key = e.key;
    switch (key) {
      case 'ArrowLeft':
        moveLeft = false;
        break;
      case 'ArrowUp':
        moveUp = false;
        break;
      case 'ArrowRight':
        moveRight = false;
        break;
      case 'ArrowDown':
        moveDown = false;
        break;
    }
  });

  //Parar de movimentar o segundo quadrado
  window.addEventListener('keyup', (d) => {
    const Segkey = d.key;
    switch (Segkey) {
      case 'a':
        goLeft = false;
        break;
      case 'w':
        goUp = false;
        break;
      case 'd':
        goRight = false;
        break;
      case 's':
        goDown = false;
        break;
    }
  });

  function moverQuadrados() {
    //Verificar colisão
    verificarColisao();
    //Verificar se o jogo já acabou
    if (jogoBloqueado) {
      return;
    }

    // Movimento para a esquerda do robô 1
    if (moveLeft && !colisaoEsquerda) {
      if (quadrado1.posX > 0) {
        quadrado1.posX -= quadrado1.velocidade;
      }
    }
  
    // Movimento para a direita do robô 1
    if (moveRight && !colisaoDireita) {
      if (quadrado1.posX + quadrado1.width < cnv.width) {
        quadrado1.posX += quadrado1.velocidade;
      }
    }
  
    // Movimento para cima do robô 1
    if (moveUp && !colisaoCima) {
      if (quadrado1.posY > 0) {
        quadrado1.posY -= quadrado1.velocidade;
      }
    }
  
    // Movimento para baixo do robô 1
    if (moveDown && !colisaoBaixo) {
      if (quadrado1.posY + quadrado1.height < cnv.height) {
        quadrado1.posY += quadrado1.velocidade;
      }
    }

    // Movimento para a esquerda do robô 2
    if (goLeft && !colisaoEsquerda) {
      if (quadrado2.posX > 0) {
        quadrado2.posX -= quadrado2.velocidade;
      }
    }
  
    // Movimento para a direita do robô 2
    if (goRight && !colisaoDireita) {
      if (quadrado2.posX + quadrado2.width < cnv.width) {
        quadrado2.posX += quadrado2.velocidade;
      }
    }
  
    // Movimento para cima do robô 2
    if (goUp && !colisaoCima) {
      if (quadrado2.posY > 0) {
        quadrado2.posY -= quadrado2.velocidade;
      }
    }
  
    // Movimento para baixo do robô 2
    if (goDown && !colisaoBaixo) {
      if (quadrado2.posY + quadrado2.height < cnv.height) {
        quadrado2.posY += quadrado2.velocidade;
      }
    }

    diminuirVida();

    //fiixar na tela - NÃO SAI DO CANVAS - Precisa pensar em como fazer isso com o obstáculo
    quadrado1.posX = Math.max(0, Math.min(cnv.width - quadrado1.width, quadrado1.posX));

    quadrado1.posY = Math.max(0, Math.min(cnv.height - quadrado1.height, quadrado1.posY));

    quadrado2.posX = Math.max(0, Math.min(cnv.width - quadrado2.width, quadrado2.posX));

    quadrado2.posY = Math.max(0, Math.min(cnv.height - quadrado2.height, quadrado2.posY));
  }

  function verificarColisao() {
    //Offset para evitar colisões nas bordas
    const offset = 5;
  
    //Verificar colisão nos dois robôs
    if (
      quadrado1.posX + quadrado1.width > quadrado4.posX + offset &&
      quadrado1.posX < quadrado4.posX + quadrado4.width + offset &&
      quadrado1.posY + quadrado1.height > quadrado4.posY + offset &&
      quadrado1.posY < quadrado4.posY + quadrado4.height - offset ||
      quadrado1.posX + quadrado1.width > quadrado3.posX + offset &&
      quadrado1.posX < quadrado3.posX + quadrado3.width + offset &&
      quadrado1.posY + quadrado1.height > quadrado3.posY + offset &&
      quadrado1.posY < quadrado3.posY + quadrado3.height - offset ||
      quadrado2.posX + quadrado2.width > quadrado4.posX + offset &&
      quadrado2.posX < quadrado4.posX + quadrado4.width + offset &&
      quadrado2.posY + quadrado2.height > quadrado4.posY + offset &&
      quadrado2.posY < quadrado4.posY + quadrado4.height - offset ||
      quadrado2.posX + quadrado2.width > quadrado3.posX + offset &&
      quadrado2.posX < quadrado3.posX + quadrado3.width + offset &&
      quadrado2.posY + quadrado2.height > quadrado3.posY + offset &&
      quadrado2.posY < quadrado3.posY + quadrado3.height - offset
    ) {
      colisaoEsquerda = true;
    } else {
      colisaoEsquerda = false;
    }
  
    //Verificar colisão nos dois robôs 
    if (
      quadrado1.posX + quadrado1.width > quadrado4.posX - offset &&
      quadrado1.posX < quadrado4.posX + quadrado4.width - offset &&
      quadrado1.posY + quadrado1.height > quadrado4.posY + offset &&
      quadrado1.posY < quadrado4.posY + quadrado4.height - offset ||
      quadrado1.posX + quadrado1.width > quadrado3.posX - offset &&
      quadrado1.posX < quadrado3.posX + quadrado3.width - offset &&
      quadrado1.posY + quadrado1.height > quadrado3.posY + offset &&
      quadrado1.posY < quadrado3.posY + quadrado3.height - offset ||
      quadrado2.posX + quadrado2.width > quadrado4.posX - offset &&
      quadrado2.posX < quadrado4.posX + quadrado4.width - offset &&
      quadrado2.posY + quadrado2.height > quadrado4.posY + offset &&
      quadrado2.posY < quadrado4.posY + quadrado4.height - offset ||
      quadrado2.posX + quadrado2.width > quadrado3.posX - offset &&
      quadrado2.posX < quadrado3.posX + quadrado3.width - offset &&
      quadrado2.posY + quadrado2.height > quadrado3.posY + offset &&
      quadrado2.posY < quadrado3.posY + quadrado3.height - offset
    ) {
      colisaoDireita = true;
    } else {
      colisaoDireita = false;
    }

    //Verificar colisão nos dois robôs
  if (
    quadrado1.posX + quadrado1.width > quadrado4.posX + offset &&
    quadrado1.posX < quadrado4.posX + quadrado4.width - offset &&
    quadrado1.posY + quadrado1.height > quadrado4.posY + offset &&
    quadrado1.posY < quadrado4.posY + quadrado4.height + offset ||
    quadrado1.posX + quadrado1.width > quadrado3.posX + offset &&
    quadrado1.posX < quadrado3.posX + quadrado3.width - offset &&
    quadrado1.posY + quadrado1.height > quadrado3.posY + offset &&
    quadrado1.posY < quadrado3.posY + quadrado3.height + offset ||
    quadrado2.posX + quadrado2.width > quadrado4.posX + offset &&
    quadrado2.posX < quadrado4.posX + quadrado4.width - offset &&
    quadrado2.posY + quadrado2.height > quadrado4.posY + offset &&
    quadrado2.posY < quadrado4.posY + quadrado4.height + offset ||
    quadrado2.posX + quadrado1.width > quadrado3.posX + offset &&
    quadrado2.posX < quadrado3.posX + quadrado3.width - offset &&
    quadrado2.posY + quadrado2.height > quadrado3.posY + offset &&
    quadrado2.posY < quadrado3.posY + quadrado3.height + offset 
  ) {
    colisaoCima = true;
  } else {
    colisaoCima = false;
  }

   //Verificar colisão nos dois robôs
   if (
    quadrado1.posX + quadrado1.width > quadrado4.posX + offset &&
    quadrado1.posX < quadrado4.posX + quadrado4.width - offset &&
    quadrado1.posY < quadrado4.posY + quadrado4.height - offset &&
    quadrado1.posY + quadrado1.height > quadrado4.posY - offset ||
    quadrado1.posX + quadrado1.width > quadrado3.posX + offset &&
    quadrado1.posX < quadrado3.posX + quadrado3.width - offset &&
    quadrado1.posY < quadrado3.posY + quadrado3.height - offset &&
    quadrado1.posY + quadrado1.height > quadrado3.posY - offset ||
    quadrado2.posX + quadrado2.width > quadrado4.posX + offset &&
    quadrado2.posX < quadrado4.posX + quadrado4.width - offset &&
    quadrado2.posY < quadrado4.posY + quadrado4.height - offset &&
    quadrado2.posY + quadrado2.height > quadrado4.posY - offset ||
    quadrado2.posX + quadrado2.width > quadrado3.posX + offset &&
    quadrado2.posX < quadrado3.posX + quadrado3.width - offset &&
    quadrado2.posY < quadrado3.posY + quadrado3.height - offset &&
    quadrado2.posY + quadrado2.height > quadrado3.posY - offset 
   ) {
     colisaoBaixo = true;
   } else {
     colisaoBaixo = false;
   }

  } //Fim da função colisão

  function colisaoEntreQuadrados() {
    return (
      quadrado1.posX < quadrado2.posX + quadrado2.width &&
      quadrado1.posX + quadrado1.width > quadrado2.posX &&
      quadrado1.posY < quadrado2.posY + quadrado2.height &&
      quadrado1.posY + quadrado1.height > quadrado2.posY
    );
  }


  function diminuirVida() {
    if (colisaoEntreQuadrados()) {
      const dano = Math.floor(Math.random() * 21);
      vidaQuadrado1 -= dano;
      vidaQuadrado2 -= dano;
      colisoes++;
      reiniciarJogo();

      vidaQuadrado1 = Math.max(0, vidaQuadrado1);
      vidaQuadrado2 = Math.max(0, vidaQuadrado2);

  
      //Atualizar as barras de vida no HTML e mostrar na página 

      document.getElementById("vida-quadrado1").innerHTML = "Vida do WALL-E: " + vidaQuadrado1;
      document.getElementById("vida-quadrado2").innerHTML = "Vida da EVA: " + vidaQuadrado2;
  
  
      if (colisoes == maxColisoes) {
        jogoBloqueado = true; 
        //Determine o vencedor
        let vencedor = "";
        if (vidaQuadrado1 > vidaQuadrado2) {
          vencedor = "WALL-E";
        } else if (vidaQuadrado2 > vidaQuadrado1) {
          vencedor = "EVA";
        } else {
          vencedor = "Empate";
        }
        document.getElementById("resultado").innerHTML = "Vencedor: " + vencedor;
      }
    }
  }
  
  function reiniciarJogo() {
  quadrado1.posX = 0;
  quadrado1.posY = 0;
  quadrado2.posX = 1000;
  quadrado2.posY = 900;
  moveLeft = false;
  moveUp = false;
  moveRight = false;
  moveDown = false;
  goLeft = false;
  goUp = false;
  goRight = false;
  goDown = false;
  } 


  function exibirQuadrados() {
    ctx.fillRect(0, 0, cnv.width, cnv.height);

    //Fundo desenhado
    ctx.fillStyle = '#008000'; 
    ctx.fillRect(3, 3, cnv.width - 6, cnv.height - 6);
    ctx.strokeStyle = '#00FF00'; 
    ctx.lineWidth = 2; 
    const espacamento = 50;

  //Linhas paralelas horizontais
    for (let i = espacamento; i < cnv.height - 6; i += espacamento) {
    ctx.beginPath();
    ctx.moveTo(3, i);
    ctx.lineTo(cnv.width - 3, i);
    ctx.stroke();
  }
  //Linhas paralelas verticais
    for (let i = espacamento; i < cnv.width - 6; i += espacamento) {
    ctx.beginPath();
    ctx.moveTo(i, 3);
    ctx.lineTo(i, cnv.height - 3);
    ctx.stroke();
  }
  //Robôs(quadrados) sendo desenhados
    for (const i in quadrados) {
      const spr = quadrados[i];
      ctx.drawImage(imagemQuadrado1, quadrado1.posX, quadrado1.posY, quadrado1.width, quadrado1.height);
      ctx.drawImage(imagemQuadrado2, quadrado2.posX, quadrado2.posY, quadrado2.width, quadrado2.height);
      ctx.fillStyle = spr.color
      ctx.fillRect(spr.posX, spr.posY, spr.width, spr.height);
    }
  }

  //solicitar uma animação ao browser e chamar a função
  //que é a propria função atualizarTela
  function atualizarTela() {
    window.requestAnimationFrame(atualizarTela, cnv);
    moverQuadrados();
    exibirQuadrados();
  }
  atualizarTela();

}());