//Máximo de movimentos por elemento da população
var maxMoves=50;
//População máxima;
var maxPopulation = 30;
//Taxa de mutação
var mutRation = 0.01;
//Porcentagem de individuos que passaram para a próxima geração
var elitePercent = 0.5;
//Tempo de espera entre um ciclo e o outro em milisegundos
var delay = 250;
//Guarda a população atual
var population = new Array();
//var newPopulation = new Array();
//Contador de gerações, começa na geração 0 (inicio)
var generation = 0;

var topPontuation = 0;
var bestScores;

var mediaAt = 0;
var medias;
var completed = 0;
//var countTester = 0;

//Variável usada para contar quantos elementos já tiveram seu teste finalizado, assim é possível saber quando as tarefas assíncronas de teste para todos os elementos forem finalizadas
var countTester = 0;

function startAI(){
	generation = 0;
	mediaAt = 0;
	medias = new Array();
	bestScores = new Array();
	completed = 0;
	topPontuation = 0;
	elementTestCounter = 0;
	initPopulation();
	topElement = population[0];
	//Redesenha a tela
	update();
	
	cycle1();
}

function cycle1(){
	generation+=1;
	update();
	console.log("---------------1. COMEÇANDO UM NOVO CICLO...------------------------------");
	updateStatistics();
	//media = 0;
	testPopulation();
}
function cycle2(){
	console.log("---------------2. O TESTE TERMIJNOU EM TODOS OS ELEMENTOS-----------------");
	//console.log(population);
	console.log("ALGORITMO: Ranqueando os elementos da população...");
	
	//Durante o teste, media vai sendo incrementada pela pontuação dos individuos, agora basta dividir pela quantidade para se ter a média
	mediaAt = calcMedia(population);
	console.log(mediaAt);
	medias.push({"Geracao": generation, "media":mediaAt});

	
	population = selection(population);
	
	console.log(population);
	
	population = crossOver(population);
	console.log("LOGO APOS O Cruzamento");
	console.log(population);
	//cycle();
	updateStatistics();
	
	cycle1();
}
//Cria a população inicial enchendo o array population
function initPopulation(){
	population.splice(0,population.length);
	while(population.length < maxPopulation){
		population.push( newValidElement() );
	}
	console.log("ALGORITMO: População inicial criada.");
}

function updateStatistics(){
	document.getElementById("ger").innerHTML="Geração atual: " + generation;
	document.getElementById("totalPop").innerHTML="População atual: " + population.length;
	document.getElementById("mediaAt").innerHTML="Media atual da população: " + mediaAt;
	document.getElementById("topPont").innerHTML="Maior pontuação: " + topPontuation;
	
	document.getElementById("completed").innerHTML="Completaram: " + completed;
}

//Classifica os elementos da population atribuindo notas a eles
function testPopulation(){
	console.log("ALGORITMO: Teste de aptidão da população iniciado.");
	topPontuation = 0;
	countTester = 0;
	completed = 0;
	var totalMoves = maxMoves;
	console.log("Tamanho da população na hora do teste: " + population.length);
	Ticker.start(delay, function(){
		nextStep();
		countTester++;
		if(countTester >= totalMoves){
			Ticker.stop();
			for(var i = 0; i < population.length; i++){
				if(population[i].stats == "winner")
					completed++;
				testElement(population[i]);
			}
			//Começa a parte dois do ciclo, não há um loop normal devido a parte dos testes que precisa ser esperada até o fim e vista o passo a passo...
			cycle2();
		}
	});	
}
function nextStep(){
	var finished = true;
	for(var i = 0; i < population.length; i++){
		finished = !population[i].move();
	}
	update();
	if(finished)
		return false;
	else
		return true;
}
//Faz a seleção dos mais aptos, sendo que estes já estão ordenados
function selection(pop){
	console.log("ALGORITMO: Seleção dos mais aptos iniciada");
	//Ordena os individuos da população do de maior pontuação para o de menor
	pop = insertionSort(pop);
	//var eliteDelimiter = (pop.length*elitePercent);
	var eliteDelimiter = (maxPopulation*elitePercent);

	var newPopulation = pop.splice(0,eliteDelimiter);
	
	return newPopulation;
}
function crossOver(pop) {
    var size = pop.length;
	console.log("ALGORITMO: Cruzamento da população restante iniciado");
	for (var i = 0; i < size; i++) {
	    for (var j = 0; j < size; j++) {
			//Melhor os individuos não serem...
			if(i!= j)
			{
				var child = crossElements(pop[i], pop[j])
				pop.push(child);
			}
		}

		pop[i].reset();
	}
	console.log("ALGORITMO: Cruzamento da população finalizado!");
	return pop;
	
}

function crossElements(el1, el2){
	var moves = new Array();
	for(var i = 0; i < maxMoves; i++){
		//50% de chance de escolher um gene de cada um
		var random = Math.floor(Math.random() * 1000);
		
		var direction;
		
		if (random < 500) {
			if(debug)
		   		console.log("I = " + i +" Herdou " + direction + " de + ID:" + el1.id);
			
			var mut = mutation();
			if(mut == false)
				direction = el1.moveset[i];
			else{
				console.log("Mutação!!");
				direction = mut;
			}
		}
		else {
			if(debug)
		   		console.log("I = " + i +"Herdou " + direction + " de + ID:" + el2.id);
			var mut = mutation();
			if(mut == false)
				direction = el2.moveset[i];
			else{
				console.log("Mutação!!");
				direction = mut
			}
		}
		
		moves.push(direction);
	}
	//QUAL É, MELHORAR ESSA CRIAÇÃO QUE USA UM ZILHÃO DE PARÂMETROS
	//O mesmo codigo de criação de personagens
	return new Automaton(320,roadHeight*roads.length+startY, roadHeight, roadHeight, charPlayingColor, population.length, moves);
}
//Função que dado um elemento executa um teste nele, ela é executada de forma assíncrona
function testElement(e){
	e.pontuation = (startY + (roadHeight*roadsQTD)) - calcDistanceToWin(e);

	//e.pontuation += 0.3*(e.atMoveIndex-1);

	if(e.pontuation > topPontuation){
		console.log("Elemento ID:" + e.id + " é o novo no topo da elite.");
		topPontuation = e.pontuation;
	}
	if(debug)
		console.log("Pontuação personagem ID:" + e.id + ": " + e.pontuation);
	
	elementTestCounter++;
	if(elementTestCounter >= population.length){
		elementTestCounter = 0;
		console.log("Zerou o contador de testes, população:" + population.length);
	}
	
	//e.reset();
	return e.pontuation;
}


function calcMedia(pop){
	var media = 0;
	for(var i = 0; i<pop.length; i++){
		media += pop[i].pontuation;
	}
	//alert(pop);
	return media/pop.length;
}

function calcDistanceToWin(e){
	//Calcula a distância entre o indivíduo e o fim da rua
	return e.y - (startY + e.height);
}
//Retorna um novo indivíduo aleatório 'válido' para a população, falta otimizar o processo para individuos mais úteis e variados
function newValidElement(){
	var moves = new Array();
	for(var i = 0; i < maxMoves; i++){
		//1 = up, 2 = down, 3 = right 4 = left
		var direction = getRandDir();
		
		moves.push(direction);
	}
//QUAL É, MELHORAR ESSA CRIAÇÃO QUE USA UM ZILHÃO DE PARÂMETROS
	//O mesmo codigo de criação de personagens
	return new Automaton(320,roadHeight*roads.length+startY, roadHeight, roadHeight, charPlayingColor, population.length, moves);
}
function getRandDir(){
	var directionNumber = Math.floor(Math.random() * 4)+1;
	var direction;
	
	switch(directionNumber){
		case 1:
			direction = "up";
			break;
		case 2:
			direction = "down";
			break;
		case 3:
			direction = "right";
			break;
		case 4:
			direction = "left";
			break;
		default:
			console.log("ERRO: O Número sorteado não é válido, por algum motivo... Numero: " + directionNumber);
			alert("Ocorreu um erro na função de geração de novos elementos aleatórios iniciais.");
	}
	return direction;
}
function mutation(){
	var random = Math.random();

	if(mutRation > random){
		return  getRandDir();
	}
	else return false;
}

//Algoritmo para ordenar a população, código do insertionSort copiado e adaptado(para ordenar de trás para frente) de: http://codingmiles.com/sorting-algorithms-insertion-sort-using-javascript/
function insertionSort(unsortedList) {
    var len = unsortedList.length;
    for (var i = 0; i < len; i++) {
        var tmp = unsortedList[i]; //Copy of the current element. 
        /*Check through the sorted part and compare with the number in tmp. If large, shift the number*/
        for (var j = i - 1; j >= 0 && (unsortedList[j].pontuation < tmp.pontuation); j--) {
            //Shift the number
            unsortedList[j + 1] = unsortedList[j];
        }
        //Insert the copied number at the correct position
        //in sorted part. 
        unsortedList[j + 1] = tmp;
    }

	return unsortedList;
}
