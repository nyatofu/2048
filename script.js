document.addEventListener('DOMContentLoaded', function() {
    // 游戏初始化变量
    const gameBoard = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    const bestScoreDisplay = document.getElementById('best-score');
    const newGameButton = document.getElementById('new-game-button');
    const gameOverElement = document.getElementById('game-over');
    const finalScoreDisplay = document.getElementById('final-score');
    const retryButton = document.getElementById('retry-button');

    let score = 0;
    let bestScore = localStorage.getItem('bestScore') || 0;
    let gameOver = false;
    let board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    // 创建游戏格子
    function createGameBoard() {
        gameBoard.innerHTML = '';
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const cell = document.createElement('div');
                cell.id = `cell-${row}-${col}`;
                cell.className = 'cell';
                gameBoard.appendChild(cell);
            }
        }
    }

    // 初始化游戏
    function initGame() {
        // 更新最高分显示
        bestScoreDisplay.textContent = bestScore;

        // 生成初始两个数字
        addRandomNumber();
        addRandomNumber();

        // 更新游戏板显示
        updateBoard();

        // 重置游戏状态
        score = 0;
        scoreDisplay.textContent = score;
        gameOver = false;
        gameOverElement.style.display = 'none';
    }

    // 添加随机数字（2 或 4）
    function addRandomNumber() {
        const emptyCells = [];
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (board[row][col] === 0) {
                    emptyCells.push({row, col});
                }
            }
        }

        if (emptyCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            const {row, col} = emptyCells[randomIndex];
            board[row][col] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    // 更新游戏板显示
    function updateBoard() {
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const cell = document.getElementById(`cell-${row}-${col}`);
                cell.innerHTML = '';
                if (board[row][col] !== 0) {
                    const cellNumber = document.createElement('div');
                    cellNumber.className = 'cell-number';
                    cellNumber.textContent = board[row][col];
                    cellNumber.dataset.value = board[row][col];
                    cell.appendChild(cellNumber);
                }
            }
        }
    }

    // 移动数字
    function moveNumbers(direction) {
        if (gameOver) return false;

        let moved = false;

        // 深拷贝当前游戏板用于比较是否发生改变
        const oldBoard = JSON.parse(JSON.stringify(board));

        // 按方向移动数字的逻辑
        switch (direction) {
            case 'up':
                for (let col = 0; col < 4; col++) {
                    for (let row = 1; row < 4; row++) {
                        if (board[row][col] !== 0) {
                            let targetRow = row;
                            while (targetRow > 0 && board[targetRow - 1][col] === 0) {
                                targetRow--;
                            }
                            if (targetRow !== row) {
                                board[targetRow][col] = board[row][col];
                                board[row][col] = 0;
                                moved = true;
                            } else if (board[targetRow - 1][col] === board[row][col]) {
                                board[targetRow - 1][col] *= 2;
                                board[row][col] = 0;
                                score += board[targetRow - 1][col];
                                moved = true;
                            }
                        }
                    }
                }
                break;

            case 'down':
                for (let col = 0; col < 4; col++) {
                    for (let row = 2; row >= 0; row--) {
                        if (board[row][col] !== 0) {
                            let targetRow = row;
                            while (targetRow < 3 && board[targetRow + 1][col] === 0) {
                                targetRow++;
                            }
                            if (targetRow !== row) {
                                board[targetRow][col] = board[row][col];
                                board[row][col] = 0;
                                moved = true;
                            } else if (board[targetRow + 1][col] === board[row][col]) {
                                board[targetRow + 1][col] *= 2;
                                board[row][col] = 0;
                                score += board[targetRow + 1][col];
                                moved = true;
                            }
                        }
                    }
                }
                break;

            case 'left':
                for (let row = 0; row < 4; row++) {
                    for (let col = 1; col < 4; col++) {
                        if (board[row][col] !== 0) {
                            let targetCol = col;
                            while (targetCol > 0 && board[row][targetCol - 1] === 0) {
                                targetCol--;
                            }
                            if (targetCol !== col) {
                                board[row][targetCol] = board[row][col];
                                board[row][col] = 0;
                                moved = true;
                            } else if (board[row][targetCol - 1] === board[row][col]) {
                                board[row][targetCol - 1] *= 2;
                                board[row][col] = 0;
                                score += board[row][targetCol - 1];
                                moved = true;
                            }
                        }
                    }
                }
                break;

            case 'right':
                for (let row = 0; row < 4; row++) {
                    for (let col = 2; col >= 0; col--) {
                        if (board[row][col] !== 0) {
                            let targetCol = col;
                            while (targetCol < 3 && board[row][targetCol + 1] === 0) {
                                targetCol++;
                            }
                            if (targetCol !== col) {
                                board[row][targetCol] = board[row][col];
                                board[row][col] = 0;
                                moved = true;
                            } else if (board[row][targetCol + 1] === board[row][col]) {
                                board[row][targetCol + 1] *= 2;
                                board[row][col] = 0;
                                score += board[row][targetCol + 1];
                                moved = true;
                            }
                        }
                    }
                }
                break;
        }

        // 如果数字发生了移动，则添加一个新的随机数字
        if (moved) {
            addRandomNumber();
            updateBoard();
            scoreDisplay.textContent = score;

            // 更新最高分
            if (score > bestScore) {
                bestScore = score;
                bestScoreDisplay.textContent = bestScore;
                localStorage.setItem('bestScore', bestScore);
            }

            // 检查游戏是否结束
            checkGameOver();
        }

        return moved;
    }

    // 检查游戏是否结束
    function checkGameOver() {
        // 检查是否有空格
        let hasEmptyCell = false;
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (board[row][col] === 0) {
                    hasEmptyCell = true;
                    break;
                }
            }
            if (hasEmptyCell) break;
        }

        if (hasEmptyCell) return;

        // 检查是否可以合并
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const current = board[row][col];
                // 检查右边是否可以合并
                if (col < 3 && current === board[row][col + 1]) {
                    return;
                }
                // 检查下边是否可以合并
                if (row < 3 && current === board[row + 1][col]) {
                    return;
                }
            }
        }

        // 如果没有空格且没有可以合并的数字，则游戏结束
        gameOver = true;
        gameOverElement.style.display = 'flex';
        finalScoreDisplay.textContent = score;
    }

    // 键盘事件监听
    document.addEventListener('keydown', function(event) {
        let direction;
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
            default:
                return;
        }

        event.preventDefault();
        moveNumbers(direction);
    });

    // 触摸事件监听（适配移动端）
    let startX, startY;
    gameBoard.addEventListener('touchstart', function(event) {
        const touch = event.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
    });

    gameBoard.addEventListener('touchmove', function(event) {
        event.preventDefault(); // 防止页面滚动
    });

    gameBoard.addEventListener('touchend', function(event) {
        if (gameOver) return;

        const touch = event.changedTouches[0];
        const endX = touch.clientX;
        const endY = touch.clientY;

        const dx = endX - startX;
        const dy = endY - startY;

        // 判断滑动方向
        if (Math.abs(dx) > Math.abs(dy)) { // 水平滑动
            if (dx > 0) {
                moveNumbers('right');
            } else {
                moveNumbers('left');
            }
        } else { // 垂直滑动
            if (dy > 0) {
                moveNumbers('down');
            } else {
                moveNumbers('up');
            }
        }
    });

    // 新游戏按钮点击事件，修改为刷新页面
    newGameButton.addEventListener('click', function() {
        location.reload(); // 刷新页面
    });

    // 再玩一次按钮点击事件
    retryButton.addEventListener('click', function() {
        location.reload(); // 刷新页面
    });

    // 初始化游戏板和游戏
    createGameBoard();
    initGame();
});