var gameover = true;
var score = 0;
var gamewindow = document.getElementById("game");

var texts = ["BHP", "WF", "WDI", "PP", "LDI", "JP", "JA", "FIZ", "AMZEA", "MN", "JPO", "GK", "EZI", "BD", "SWI", "SO", "RPIT", "RPiSM", "PIO", "AK", "AiSD", "SW", "SE", "SKITD", "PBDS", "MD", "JPDSI", "SB", "SSO", "PSK", "PPSI", "AWA", "PWAG", "PAM", "MS"];
gamewindow.classList.add('screen-menu');
if(localStorage.getItem("studenciak_bestscore") !== null) {
	var bestScore = document.createElement("div");
	bestScore.id = "bestscore";
	bestScore.className = "score";
	bestScore.textContent = "Najlepszy wynik: "+localStorage.getItem("studenciak_bestscore");
	gamewindow.appendChild(bestScore);
}
var canvas = document.createElement("canvas");
canvas.width = 800;
canvas.height = 600;
document.getElementById("game").appendChild(canvas);
var context = canvas.getContext("2d");
document.getElementById('startgame').addEventListener('click', function() {
	gamewindow.classList.remove('screen-menu');
    const elements = document.getElementsByClassName('score');
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
	var currentscore = document.createElement("div");
	currentscore.id = "currentscore";
	currentscore.className = "score";
	currentscore.textContent = "Twój wynik: "+score;
	gamewindow.appendChild(currentscore);
	for(var i = 0; i < squares.length; i++) {
		squares.splice(i, 1);
		i--;
	}
	score = 0;
	gamewindow.classList.add('screen-game1');
	playerX = (canvas.width-55) / 2;
	playerY = canvas.height - 105;
	gameover=false;
});

// Pozycja gracza
var playerX = (canvas.width-55) / 2;
var playerY = canvas.height - 105;
var playerSpeed_base = 5; //początkowa prędkość gracza

// Załaduj grafiki gracza
var playerImageIdle = new Image();
playerImageIdle.src = "res/img/player.png";

var playerImageLeft = new Image();
playerImageLeft.src = "res/img/player_left.png";

var playerImageRight = new Image();
playerImageRight.src = "res/img/player_right.png";

var playerImage = playerImageIdle; // Domyślnie ustawiamy grafikę idle

// Tablica przechowująca spadające kwadraty
var squares = [];

// Funkcja generująca losową liczbę w podanym przedziale
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function update() {
	if(!gameover) {
	  context.clearRect(0, 0, canvas.width, canvas.height);
	  // Rysowanie gracza
	  context.drawImage(playerImage, playerX, playerY);
	  // Przechodzenie przez tablicę kwadratów
	  for (var i = 0; i < squares.length; i++) {
		var square = squares[i];
		square.y += square.speed;
		// Jeśli kwadrat przekroczy podaną wartość Y, usuń go z tablicy
		if (square.y > canvas.height) {
		  squares.splice(i, 1);
		  i--;
		  continue;
		}
		// Sprawdzenie kolizji z graczem
		if (
		  playerX < square.x + 40 &&
		  playerX + 55 > square.x &&
		  playerY < square.y + 50 &&
		  playerY + 100 > square.y //&& 10==2

		) {
		  //opcja game-over
		  gamewindow.classList.remove('screen-game1');
			const elements = document.getElementsByClassName('score');
			while(elements.length > 0){
			elements[0].parentNode.removeChild(elements[0]);
			}
			gamewindow.classList.add('screen-menu');
			for(var i = 0; i < squares.length; i++) {
				squares.splice(i, 1);
				i--;
			}
			context.clearRect(0,0,800,600);
			var audio = new Audio('res/audio/crash.mp3');
			if(audio.paused) {audio.play();}
			
			// Dodawanie elementów do div o id="game"
			var gameDiv = document.getElementById("game");
			
			var gameoverText = document.createElement("div");
			gameoverText.id = "gameovertext";
			gameoverText.className = "score";
			if(score < 80)
				gameoverText.textContent = "SESJA NIEZDANA (OCENA 2)";
			else if(score >= 80 && score < 120)
				gameoverText.textContent = "SESJA ZALICZONA NA 3";
			else if(score >= 120 && score < 130)
				gameoverText.textContent = "SESJA ZALICZONA NA 3.5";
			else if(score >= 130 && score < 150)
				gameoverText.textContent = "SESJA ZALICZONA NA 4";
			else if(score >= 150 && score < 170)
				gameoverText.textContent = "SESJA ZALICZONA NA 4.5";
			else if(score >= 180 && score < 200)
				gameoverText.textContent = "SESJA ZALICZONA NA 5";
			else if(score > 200)
				gameoverText.textContent = "NIEŹLE WASZA MAGNIFICENCJO";
			gameDiv.appendChild(gameoverText);
			
			var yourScore = document.createElement("div");
			yourScore.id = "yourscore";
			yourScore.className = "score";
			yourScore.textContent = "Twój wynik: "+score;
			gameDiv.appendChild(yourScore);
			
			if(localStorage.getItem("studenciak_bestscore") !== null) {
				if(localStorage.getItem("studenciak_bestscore") < score)
					localStorage.setItem("studenciak_bestscore", score);
			} else localStorage.setItem("studenciak_bestscore", score);
			
			var bestScore = document.createElement("div");
			bestScore.id = "bestscore";
			bestScore.className = "score";
			bestScore.textContent = "Najlepszy wynik: "+localStorage.getItem("studenciak_bestscore");
			gameDiv.appendChild(bestScore);
			gameover=true;
		  continue;
		}
		drawSquare(square.x, square.y, square.text);
	  }
	}
  requestAnimationFrame(update);
}


// Funkcja dodająca nowy kwadrat do tablicy z losowym opóźnieniem
function addSquareWithDelay() {
  var delay = getRandomNumber(800-(score*4),800-(score*3));
  if(delay < 350) getRandomNumber(350,380);
  setTimeout(function() {
		addSquare();
		addSquareWithDelay(); // Wywołanie rekurencyjne
		score++;
		var currentscore = document.getElementById('currentscore');
		if(currentscore)
			currentscore.innerHTML = 'Twój wynik: '+score;
  }, delay);

}
// Funkcja dodająca nowy kwadrat do tablicy

var speed=0;
function addSquare() {
  var x = getRandomNumber(0, canvas.width - 50);
  var y = 0;
  speed = getRandomNumber(1, 6);
  var text = texts[Math.floor(Math.random() * texts.length)]; // Losowy tekst z tablicy
  squares.push({ x: x, y: y, speed: speed, text: text });
}
// Funkcja rysująca kwadrat
function drawSquare(x, y, text) {
  context.fillStyle = "red";
  context.fillRect(x, y, 50, 50);
  context.fillStyle = "white";
  context.font = "12px Arial";
  context.fillText(text, x + 4, y + 30);
}
function animate() {
  addSquareWithDelay();
  update();
}
var audio = new Audio('res/audio/step.mp3');
// Obsługa poruszania się gracza
document.addEventListener("keydown", function(event) {
if(score > 250) playerSpeed=17,5;
else playerSpeed = playerSpeed_base+(0.05*score);

  if(event.key === "ArrowLeft" || event.key === 'a' || event.key === 'A') {
	if((playerX - playerSpeed) >= 0)
		playerX -= playerSpeed;
	playerImage = playerImageLeft; // Ustawiamy grafikę poruszania się w lewo
	
	if(audio.paused) {audio.play();}
  } else if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
    if((playerX + playerSpeed) <= (canvas.width-80))
		playerX += playerSpeed;
    playerImage = playerImageRight; // Ustawiamy grafikę poruszania się w prawo
	if(audio.paused) {audio.play();}
  }
  else {
	  playerImage = playerImageIdle;
  }
});

// Obsługa zatrzymywania się gracza
document.addEventListener("keyup", function(event) {
  if(event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "a" || event.key === "A" || event.key === "d" || event.key === "D") {
    playerImage = playerImageIdle; // Ustawiamy grafikę idle
  }
});

// Uruchom animację
animate();