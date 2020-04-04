/*
	Nesta pasta está a base para o funcionamento do algoritmo que é o jogo simples em que o usuario controla uma galinha para a travessar a rua sem tocar nos carros parados (ooh no)
*/

var debug = false;
//Configurações das ruas
var roadsQTD = 8; //Quantidade de faixas (Linhas horizontais)
var startY = 50; //Distancia do inicio das faixas com carros até o topo da tela
var roadWidth = 640; //Comprimento da faixa horizontalmente, aqui ela esta igual à largura do canvas
var roadHeight = 20; //Largura da faixa (tamanho vertical)
var roadColor = "#bfbfbf"; //Cor da faixa (preenchimento)
var bRoadColor = "#7a7a7a"; //Borda das faixas

//Configurações dos 'carros', como quantidade por via
var carsPerRoad = 8; //Quantidade total de carros em cada faixa
var carWidth = 20; //A largura dos carros
var carColor = "#ff6a6a"; //A cor dos carros

//Configuração para o(s) jogadores
var charPlayingColor = "#303300"; //Enquanto estiver em jogo
var charExhaustedColor = "#f8ff6f"; //Quando se esgotar a quantidade de movimentos
var charDiedColor = "rgba(255, 130, 130, 0.1)"; //Quando morrer
var charPlayingSprite = {
    src: "img/chk1.png",
    up: { x: 0, y: 144, s: 48 },
    right: { x: 0, y: 96, s: 48 },
    left: { x: 0, y: 48, s: 48 },
    down: { x: 0, y: 0, s: 48 }
};

var carSprite = { src: "img/cars.png", x: 490, y: 157, w: 100, h: 65 };
//Canvas do documento html, setado em init()
var canvas;
//Contexto do canvas...
var ctx;

//Variáveis para guardar as faixas com os carros e o personagem que se locomove
var roads;
var characters;
var character;

function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    roads = new Array();
    characters = new Array();

    var nextY = startY;
    for (var i = 0; i < roadsQTD; i++) {
        var dir = i % 2;
        var road = new Road(dir, roadWidth, roadHeight, nextY, roadColor, bRoadColor, carWidth);
        roads.push(road);

        nextY += roadHeight;
    }
    if (debug) console.log(roads);

    initCars();
    //Cria um novo personagem e o adiciona ao array de personagens (o seu indice no array de personagens é adicionado como ID), caso se queira ter mais de um personagem no jogo ao mesmo tempo... Testes?
    characters.push(
        new Char(
            320,
            roadHeight * roads.length + startY,
            roadHeight,
            roadHeight,
            "green",
            characters.length
        )
    );
    character = characters[0];

    update();
    character.draw(ctx);
    //requestAnimationFrame(loop);
    document.onkeypress = function(e) {
        if (e.key == "ArrowUp") {
            character.up(roadHeight);
        } else if (e.key == "ArrowDown") {
            character.down(roadHeight);
        } else if (e.key == "ArrowLeft") {
            character.left(carWidth);
        } else if (e.key == "ArrowRight") {
            character.right(carWidth);
        }
        update();
    };
}

function update() {
    clearCanvas();
    updateRoads();
    character.draw(ctx);

    for (var i = 0; i < population.length; i++) {
        //if(population[i].stats=="playing")
        population[i].draw(ctx);
    }
}

function initCars() {
    //Vê quantos carros cabém através do tamanho da road e o tamanho dos carros, (Quantas 'células' para inserir carros existem)
    var carsCells = roadWidth / carWidth;
    //Uma matriz que guardará as posições que já existem carros, assim é possível verificar se um lugar já esta ocupado quando for adicionar um novo carro

    for (var i = 0; i < roads.length; i++) {
        for (var j = 0; j < carsPerRoad; j++) {
            var pos = Math.floor(Math.random() * (carsCells + 1));
            //console.log("sorteou " + pos);
            if (debug) console.log("RAND: posicao " + pos + " da via " + i);

            while (!roads[i].addCar(pos * carWidth, carColor)) {
                pos = Math.floor(Math.random() * (carsCells + 1));
                if (debug) console.log("RAND: RE-Sorteio: posicao " + pos + " da via " + i);
            }
            //updateRoads();
        }
    }
}

function updateRoads() {
    for (var i = 0; i < roads.length; i++) {
        roads[i].update(ctx);
    }
}

function clearCanvas() {
    ctx.save();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 640, 400);
    ctx.fill();
    ctx.restore();
}
