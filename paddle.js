const ball = {
    elem: document.querySelector("#ball"),
    ballY: 93,
    ballX: 50,
    velocityY: -0.5,
    velocityX: -0.5
}

const gameArea = {
    top: 2,
    bottom: 98,
    left: 2,
    right: 98,
    colorRed: 139, //dark red
    colorGreen: 0,
    colorBlue: 0,
    elem: document.querySelector("#paddle-area"),
}

//the units of the paddle
const paddle = {
    elem: document.querySelector("#paddle"),
}

let numberAlreadySmash = 0
const totalOfCells = 18
let paddleX = 0;

document.addEventListener("mousemove", (e) => {
    const gameAreaRect = gameArea.elem.getBoundingClientRect();
    const relativeX = e.clientX - gameAreaRect.left;

    if (relativeX > 0 && relativeX < gameAreaRect.width) {
        paddleX = relativeX - paddle.elem.offsetWidth / 2;

        paddleX = Math.max(0, Math.min(paddleX, gameAreaRect.width - paddle.elem.offsetWidth));
        paddle.elem.style.left = `${paddleX}px`;
    }
});



function quarterDirection(distance) {
    if (distance < 0) {
        return 1
    } else if (distance > 0) {
        return -1
    }
}

function verticalSpeed(distance, actualSpeed) {
    let speed = 0
    const minSpeed = 0.5;
    const maxSpeed = 2;

    // if center
    if (Math.abs(distance) < 0.02) {
        speed = Math.abs(actualSpeed) / 2;
    }
    // if between the center or the ends
    else if (Math.abs(distance) >= 0.02 && Math.abs(distance) <= 0.5) {
        speed = Math.abs(actualSpeed) * (1 + (Math.abs(distance) - 0.05) * (0.5 / (0.5 - 0.02)));
    } else if (Math.abs(distance) > 0.5 && Math.abs(distance) <= 0.8) {
        speed = Math.abs(actualSpeed) * (1 + (Math.abs(distance) - 0.5) * (0.5 / (0.8 - 0.5)));
    }
    // if at the edge
    else if (Math.abs(distance) > 0.8) {
        speed = Math.abs(actualSpeed) * 1.5
    }
    speed = Math.min(Math.max(speed, minSpeed), maxSpeed);

    return (actualSpeed < 0 ? -1 : 1) * speed
}


function horizontalSpeed(distance, actualSpeed) {
    let speed = 0

    // if center
    if (Math.abs(distance) < 0.02) {
        speed = 0;
    }
    // if at the edge
    else if (Math.abs(distance) > 0.9) {
        speed = 1
    }
    // if between the center or the ends
    else {
        speed = Math.abs(distance);
    }
    return (actualSpeed < 0 ? -1 : 1) * speed
}


function changeDirection(data, area) {
    const paddleCenterX = data.paddleLeft + data.paddleWidth / 2;
    const ballCenterX = (data.ballLeft + data.ballRight) / 2;
    const distance = ballCenterX - paddleCenterX;
    const halfPaddle = paddle.elem.offsetWidth / 2;
    const distanceEasier = distance / halfPaddle;


    //log(distanceEasier)
        // Managing rebounds against the paddle
    if (data.ballBottom >= data.paddleTop &&
        data.ballRight >= data.paddleLeft &&
        data.ballLeft <= data.paddleRight) {
        ball.velocityY = verticalSpeed(distanceEasier, ball.velocityY)
        ball.velocityY *= -1;

        if (Math.abs(distanceEasier) >= 0.75) {
            ball.velocityX = quarterDirection(distanceEasier)
        } else {
            ball.velocityX = horizontalSpeed(distanceEasier, ball.velocityX)
            ball.velocityX *= -1;
        }
    }

    // Managing rebounds against the top of the game area
    if (data.ballTop <= area.top) {
        ball.velocityY *= -1;
    }

    // Managing rebounds against the left and right sides of the game area
    if (data.ballLeft <= area.left || data.ballRight >= area.right) {
        ball.velocityX *= -1;
    }

    // Managing the rebound against the bottom of the game area
    if (data.ballBottom >= area.bottom) {
        gameArea.elem.style.backgroundColor = `rgb(${gameArea.colorRed},${gameArea.colorGreen},${gameArea.colorBlue})`;
        paddle.elem.style.opacity = 0.2;
        return "stop";
    }
  
    checkBlocksCollision(data)
}
const blocks = document.querySelectorAll(".cell");

function checkBlocksCollision(data) {
  const ballRect = ball.elem.getBoundingClientRect();

  for (const block of blocks) {
    const blockRect = block.getBoundingClientRect();

    const isColliding = !(
      ballRect.right < blockRect.left ||
      ballRect.left > blockRect.right ||
      ballRect.bottom < blockRect.top ||
      ballRect.top > blockRect.bottom
    );

    if (isColliding) {
      if (!block.alreadyHidden) {
        ball.velocityY *= -1; // Fait rebondir la balle

        block.style.visibility = 'hidden'; // Cache le bloc
        block.alreadyHidden = true; // Marque ce bloc comme traité
        numberAlreadySmash += 1
        return; // Sort de la fonction après avoir géré une collision
      }
    }
  }
}


function ballPosition() {
    ball.ballY += ball.velocityY;
    ball.ballX += ball.velocityX;
}

function renderBall() {
    ball.elem.style.top = ball.ballY + "%";
    ball.elem.style.left = ball.ballX + "%";
}




function gameLoop() {
    const ballRect = ball.elem.getBoundingClientRect();
    const paddleRect = paddle.elem.getBoundingClientRect();
    const gameAreaRect = gameArea.elem.getBoundingClientRect();

    const rectData = {
        // Collision with the paddle: we check if the ball touches the paddle
        // Vertical condition: the ball descends and touches the paddle
        ballBottom: ballRect.bottom,
        paddleTop: paddleRect.top,

        // Condition verticale : la balle monte et touche area
        ballTop: ballRect.top,
        // Horizontal condition: the ball is aligned horizontally with the paddle
        ballLeft: ballRect.left,
        ballRight: ballRect.right,
        paddleLeft: paddleRect.left,
        paddleRight: paddleRect.right,
        paddleWidth: paddleRect.width,
    }

    const status = changeDirection(rectData, gameAreaRect);
    if (status == "stop") 
      {
        return
      }
    ballPosition()
    renderBall()
    if (numberAlreadySmash === totalOfCells) {
        gameArea.elem.style.backgroundColor = "green";
        paddle.elem.style.opacity = 0.2;
        return
   }
    requestAnimationFrame(gameLoop);
}

// This should probably be the final line in your
// program and the one that sets off the gameLoop.
gameLoop()
const btnPlay = document.getElementById("paddle-btn");

btnPlay.addEventListener("click", () => {
  window.location.reload();
});


