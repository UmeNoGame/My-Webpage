let score = 0;
const scoreElem = document.getElementById("score");


const gameArea = {
  left: 0,
  top: 0,
  bottom: 100,
  right: 100,
  elem: document.querySelector("#snake-area")
}

const apple = {
  elem: document.querySelector(".apple"),
  appear: false,
  left: 90,
  top: 90,
}

const lastMessage = {
  elem: document.querySelector("#looser"),
  rotate: 0
}

const mouth = {
  elem: document.querySelector("#mouth")
}

const body = {
  elem: document.querySelector("body")
}

const snakeContainer = document.getElementById("all-snake");

const snake = {
  direction: "left",
  segmentNumber: 4,
  segmentSize: 5,
  segments: []
}

for(let i = 0; i < snake.segmentNumber; i++) {
  snake.segments.push({
    top: 50,
    left: 50 + (i * snake.segmentSize),
    elem: document.querySelector(`.snake-segment:nth-child(${i + 1})`)
  })
}


function updateRotateMouth() {
    const size = snake.segmentSize;

    switch(snake.direction) {
      case "right":
        mouth.rotate = 180
        break;
      case "up":
        mouth.rotate = 90
         break;
      case "left":
        mouth.rotate = 0
        break;
      case "down": 
        mouth.rotate = -90
        break;
    }
  }
function renderRotateHead() {
    snake.segments[0].elem.style.transform = `rotate(${mouth.rotate}deg)` 
  }

function updateSnake() {
  changeDirection()
  moveBody()
  moveHead()
  updateRotateMouth()
}

//manage keyboard events 
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    changeDirection("down");
  }
   if (e.key === "ArrowUp") {
    changeDirection("up");
  }
   if (e.key === "ArrowLeft") {
    changeDirection("left");
  }
   if (e.key === "ArrowRight") {
    changeDirection("right");
  }
});

function changeDirection(direction) {
  if(direction === "down") {
    snake.direction = "down"
  }
  else if(direction === "up") {
    snake.direction = "up"
  }
  else if(direction === "left") {
    snake.direction = "left"
  }
  else if(direction === "right") {
    snake.direction = "right"
  }
}

function moveHead() {
  const head = snake.segments[0]
  if(snake.direction == "left") { head.left -= snake.segmentSize }
  if(snake.direction == "right") { head.left += snake.segmentSize }
  if(snake.direction == "down") { head.top += snake.segmentSize }
  if(snake.direction == "up") { head.top -= snake.segmentSize }
  }

function moveBody() {
  snake.segments.forEach(seg => {
  if (!seg.elem) {
    const el = document.createElement("div");
    el.classList.add("snake-segment");
    snakeContainer.appendChild(el);
    seg.elem = el;
  }});
   for (let i = snake.segments.length - 1; i > 0; i--) {
    const thisSegment = snake.segments[i]
    const aheadSegment = snake.segments[i-1]
    thisSegment.left = aheadSegment.left
    thisSegment.top = aheadSegment.top
  }
}

function renderSnake() {
  for (segment of snake.segments) {
    segment.elem.style.left = `${segment.left}%`
    segment.elem.style.top = `${segment.top}%`
  }
}

function renderLooser() {
  //color style changing 
   body.elem.style.backgroundColor = "black";  
    for (let i = snake.segments.length - 1; i >= 0; i--) {
    snake.segments[i].elem.style.opacity = "0.2";
    }

  //head of the snake disappear
    snake.segments[0].elem.style.display = "none"
  
  //message appears
    lastMessage.elem.style.display = "block"
}

function controlGameEdges(gameArea, head) {
  if (head.leftRect < gameArea.left || 
      head.rightRect > gameArea.right || 
      head.topRect < gameArea.top || 
      head.bottomRect > gameArea.bottom) 
      { return true }
  else 
      { return false }
}


function controlSelfEating() {
  const head = snake.segments[0];
  let touch = ""
  for(let i = 1; i < snake.segmentNumber; i++) {
      const segment = snake.segments[i]
      if (head.left === segment.left && head.top === segment.top)
        { return true }
      else 
          { touch = "no" }
    }
  return false
}


function bruuuuhLooser() {
  const gameAreaRect = gameArea.elem.getBoundingClientRect();
  const headRect = {
        leftRect: snake.segments[0].elem.getBoundingClientRect().left,
        rightRect: snake.segments[0].elem.getBoundingClientRect().right,
        topRect: snake.segments[0].elem.getBoundingClientRect().top,
        bottomRect: snake.segments[0].elem.getBoundingClientRect().bottom,
      }
  
  if (controlGameEdges(gameAreaRect, headRect)|| controlSelfEating()) 
    {
    return true;
    }
  else 
    {
      return 
    }
}


function appleAppear() {
     findNewApplePosition();
    // Tant que la position est la même qu'un élément du snake, on en cherche une nouvelle
    while (samePosition()) {
      findNewApplePosition();
    }

    renderApple();
    apple.appear = true;
}

function samePosition() {
  for (let i = snake.segments.length - 1; i > 0; i--)  {
    if (snake.segments[i].top == apple.top && snake.segments[i].left == apple.left) 
    {
      return true
    }
  }
  return false
}

function findNewApplePosition() {
  apple.top = getRandomInt(0, 18) * 5;
  apple.left = getRandomInt(0, 18) * 5;
}


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function renderApple() {
  apple.elem.style.left = `${apple.left}%`;
  apple.elem.style.top = `${apple.top}%`;
  apple.elem.style.display = "block";
}


function eatApple() {

    apple.appear = false
    apple.elem.style.display = "none";
    addNewSegment()
    return
}

function addNewSegment() {
  const last = snake.segments[snake.segments.length - 1];

  const newSegment = {
    top: last.top,
    left: last.left,
    elem: null // no DOM element yet
  };

  snake.segments.push(newSegment);
}

let numLoops = 0;
let eat = false;

function gameLoop() { 
  if (numLoops % 10 == 0) {
    updateSnake();
    renderSnake();
    renderRotateHead();
    if (!eat && snake.segments[0].left === apple.left && snake.segments[0].top === apple.top) 
   {
    eatApple()
    eat = true;
   }
       if (bruuuuhLooser()) 
      { 
        renderLooser()
        return 
      }
    }
  //je veux qu'une pomme apparaisse aléatoirement sur le jeu mais pas sur un endroit du seprent 
   
   if (!apple.appear && numLoops % 120 == 0)
   {
      appleAppear()
     eat = false;
  }
  //et que si la tête entre en contact avec la pomme, alors il grandit.
  numLoops += 1;
  requestAnimationFrame(gameLoop)
}

requestAnimationFrame(gameLoop)
const btnPlay = document.getElementById("snake-btn");

btnPlay.addEventListener("click", () => {
  window.location.reload();
});


