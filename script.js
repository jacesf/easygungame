document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const player = document.getElementById('player');
    const scoreBoard = document.getElementById('score-board');
    const startScreen = document.getElementById('start-screen');
    const startButton = document.getElementById('start-button');

    let score = 0;
    let bullets = [];
    let enemies = [];
    let gameInterval;
    let enemySpawnInterval;
    let gameRunning = false;

    // 게임 시작 함수
    function startGame() {
        score = 0;
        scoreBoard.textContent = `점수: ${score}`;
        bullets = [];
        enemies = [];
        gameContainer.innerHTML = ''; // 기존 요소 제거
        gameContainer.appendChild(player); // 플레이어 다시 추가
        gameContainer.appendChild(scoreBoard); // 점수판 다시 추가

        startScreen.style.display = 'none';
        gameContainer.style.display = 'block';
        gameRunning = true;

        // 게임 루프 시작
        gameInterval = setInterval(gameLoop, 1000 / 60); // 60 FPS
        enemySpawnInterval = setInterval(spawnEnemy, 1000); // 1초마다 적 생성
    }

    // 게임 종료 함수
    function endGame() {
        clearInterval(gameInterval);
        clearInterval(enemySpawnInterval);
        gameRunning = false;
        alert(`게임 종료! 당신의 점수는 ${score}점입니다.`);
        startScreen.style.display = 'flex';
        gameContainer.style.display = 'none';
    }

    // 플레이어 이동 (마우스 따라다니기)
    gameContainer.addEventListener('mousemove', (e) => {
        if (gameRunning) {
            // 마우스 X 좌표를 따라 플레이어 중앙 정렬
            player.style.left = `${e.clientX - gameContainer.getBoundingClientRect().left - player.offsetWidth / 2}px`;

            // 플레이어가 게임 컨테이너를 벗어나지 않도록 제한
            const playerLeft = parseFloat(player.style.left);
            if (playerLeft < 0) {
                player.style.left = '0px';
            }
            if (playerLeft + player.offsetWidth > gameContainer.offsetWidth) {
                player.style.left = `${gameContainer.offsetWidth - player.offsetWidth}px`;
            }
        }
    });

    // 총알 발사
    gameContainer.addEventListener('click', () => {
        if (gameRunning) {
            const bullet = document.createElement('div');
            bullet.classList.add('bullet');
            // 플레이어 중앙에서 총알 발사
            bullet.style.left = `${player.offsetLeft + player.offsetWidth / 2 - bullet.offsetWidth / 2}px`;
            bullet.style.top = `${player.offsetTop}px`;
            gameContainer.appendChild(bullet);
            bullets.push(bullet);
        }
    });

    // 적 생성
    function spawnEnemy() {
        if (!gameRunning) return;

        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.style.left = `${Math.random() * (gameContainer.offsetWidth - 40)}px`; // 게임 컨테이너 너비 내에서 랜덤 위치
        gameContainer.appendChild(enemy);
        enemies.push(enemy);
    }

    // 게임 루프
    function gameLoop() {
        // 총알 이동
        bullets.forEach((bullet, index) => {
            let bulletTop = parseFloat(bullet.style.top) || 0;
            bulletTop -= 10; // 위로 이동 속도
            bullet.style.top = `${bulletTop}px`;

            // 화면 밖으로 나가면 제거
            if (bulletTop < 0) {
                bullet.remove();
                bullets.splice(index, 1);
            }
        });

        // 적 이동 및 충돌 감지
        enemies.forEach((enemy, enemyIndex) => {
            let enemyTop = parseFloat(enemy.style.top) || 0;
            enemyTop += 2; // 아래로 이동 속도
            enemy.style.top = `${enemyTop}px`;

            // 적이 화면 아래로 내려가면 게임 종료
            if (enemyTop + enemy.offsetHeight > gameContainer.offsetHeight) {
                endGame();
            }

            // 총알과 적 충돌 감지
            bullets.forEach((bullet, bulletIndex) => {
                if (isColliding(bullet, enemy)) {
                    bullet.remove();
                    bullets.splice(bulletIndex, 1);
                    enemy.remove();
                    enemies.splice(enemyIndex, 1);
                    score += 10; // 점수 증가
                    scoreBoard.textContent = `점수: ${score}`;
                }
            });
        });
    }

    // 충돌 감지 함수
    function isColliding(a, b) {
        const aRect = a.getBoundingClientRect();
        const bRect = b.getBoundingClientRect();

        return !(
            aRect.top + aRect.height < bRect.top ||
            aRect.top > bRect.top + bRect.height ||
            aRect.left + aRect.width < bRect.left ||
            aRect.left > bRect.left + bRect.width
        );
    }

    // 게임 시작 버튼 클릭 이벤트
    startButton.addEventListener('click', startGame);
});