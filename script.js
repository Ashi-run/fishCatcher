document.addEventListener("DOMContentLoaded", () => {
    const rod = document.getElementById("rod");
    const game = document.getElementById("game");
    const fishesContainer = document.getElementById("fishes");
    const scoreDisplay = document.getElementById("score");
    const gameOverScreen = document.getElementById("game-over");
    const gameResult = document.getElementById("game-result");
    const retryBtn = document.getElementById("retry-btn");
    const exitBtn = document.getElementById("exit-btn");

    let score = 0;
    let rodPosition = 50; // Centered
    let gameRunning = true;
    let gameSpeed = 2000; // Fish spawn interval
    let timer = 60; // Game timer
    let intervalId;
    
    const fishTypes = [
        { type: "normal", points: 10, speed: 5, image: "images/fish.png" },
        { type: "golden", points: 50, speed: 3, image: "images/golden-fish.png" },
        { type: "trash", points: -20, speed: 7, image: "images/trash.png" },
        { type: "electric", points: -50, speed: 6, image: "images/electric.png" }
    ];

    // Move Rod with Arrow Keys
    document.addEventListener("keydown", (event) => {
        if (!gameRunning) return;
        if (event.key === "ArrowLeft" && rodPosition > 5) {
            rodPosition -= 5;
        } else if (event.key === "ArrowRight" && rodPosition < 95) {
            rodPosition += 5;
        }
        rod.style.left = rodPosition + "%";
    });

    // Spawn Fish Randomly
    function spawnFish() {
        if (!gameRunning) return;
        const fishData = fishTypes[Math.floor(Math.random() * fishTypes.length)];
        const fish = document.createElement("div");
        fish.classList.add("fish");
        fish.style.backgroundImage = `url(${fishData.image})`;
        fish.style.left = Math.random() * 90 + "%";
        fish.dataset.type = fishData.type;
        fish.dataset.points = fishData.points;
        fish.dataset.speed = fishData.speed;

        fishesContainer.appendChild(fish);

        moveFish(fish);
    }

    // Move Fish Downward
    function moveFish(fish) {
        let position = 0;
        let speed = parseInt(fish.dataset.speed);
        const moveInterval = setInterval(() => {
            if (!gameRunning) return;
            position += speed;
            fish.style.top = position + "px";

            // Check Collision with Rod
            const rodRect = rod.getBoundingClientRect();
            const fishRect = fish.getBoundingClientRect();
            if (
                fishRect.bottom >= rodRect.top &&
                fishRect.left >= rodRect.left &&
                fishRect.right <= rodRect.right
            ) {
                clearInterval(moveInterval);
                fishCaught(fish);
            }

            // Remove fish if it goes out of bounds
            if (position > window.innerHeight) {
                clearInterval(moveInterval);
                fish.remove();
            }
        }, 50);
    }

    // Fish Caught Logic
    function fishCaught(fish) {
        const points = parseInt(fish.dataset.points);
        score += points;
        scoreDisplay.innerText = `Score: ${score}`;

        if (fish.dataset.type === "electric") {
            gameOver();
        }

        fish.remove();
    }

    // Game Timer
    function startTimer() {
        intervalId = setInterval(() => {
            if (!gameRunning) return;
            timer--;
            if (timer === 0) {
                gameOver();
            }
        }, 1000);
    }

    // Game Over
    function gameOver() {
        gameRunning = false;
        gameOverScreen.style.display = "flex";
        gameResult.innerText = `Game Over! Final Score: ${score}`;
        saveScore(score);
    }

    // Retry Game
    retryBtn.addEventListener("click", () => {
        location.reload();
    });

    // Exit Game
    exitBtn.addEventListener("click", () => {
        alert("Thanks for playing!");
        window.close();
    });
#game {
    background-image: url('images/background.jpg');
}

.fish {
    background-image: url('images/fish1.jpg');
}

#electric-plant {
    background-image: url('images/electric.jpg');
}

    // Save High Score to Local Storage
    function saveScore(score) {
        let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
        highScores.push(score);
        highScores.sort((a, b) => b - a);
        localStorage.setItem("highScores", JSON.stringify(highScores.slice(0, 5)));
    }

    // Start Game
    startTimer();
    setInterval(spawnFish, gameSpeed);
});
