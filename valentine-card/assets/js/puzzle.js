class PuzzleGame {
    constructor(container, imageUrl) {
        this.container = container;
        this.imageUrl = imageUrl;
        this.size = 3;
        this.moves = 0;
        this.pieces = [];
        this.board = [];
        this.init();
    }

    init() {
        // สร้างพื้นที่เกม
        const gameArea = document.createElement('div');
        gameArea.className = 'puzzle-game-area';
        this.container.appendChild(gameArea);

        // สร้างพื้นที่วางชิ้นส่วน
        const piecesContainer = document.createElement('div');
        piecesContainer.className = 'puzzle-pieces-container';
        gameArea.appendChild(piecesContainer);

        // สร้างกระดาน
        const board = document.createElement('div');
        board.className = 'puzzle-board';
        gameArea.appendChild(board);

        // สร้าง cells บนกระดาน
        for (let i = 0; i < this.size * this.size; i++) {
            const cell = document.createElement('div');
            cell.className = 'puzzle-cell';
            cell.dataset.index = i;
            board.appendChild(cell);
            this.board[i] = null;

            this.setupDropZone(cell);
        }

        // สร้างชิ้นส่วนจิ๊กซอร์
        for (let i = 0; i < this.size * this.size; i++) {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.dataset.index = i;
            
            piece.style.backgroundImage = `url(${this.imageUrl})`;
            const x = (i % this.size) * 50;
            const y = Math.floor(i / this.size) * 50;
            piece.style.backgroundPosition = `-${x}% -${y}%`;
            piece.style.backgroundSize = `${this.size * 100}%`;

            this.setupDraggable(piece);
            this.pieces.push(piece);
            piecesContainer.appendChild(piece);
        }

        // สุ่มตำแหน่งชิ้นส่วน
        this.shufflePieces();

        // เพิ่ม moves counter
        const movesCounter = document.createElement('div');
        movesCounter.className = 'moves-counter';
        movesCounter.textContent = 'Moves: 0';
        gameArea.appendChild(movesCounter);
        this.movesDisplay = movesCounter;
    }

    setupDraggable(piece) {
        piece.draggable = true;
        
        piece.addEventListener('dragstart', (e) => {
            piece.classList.add('dragging');
            e.dataTransfer.setData('text/plain', piece.dataset.index);
        });

        piece.addEventListener('dragend', () => {
            piece.classList.remove('dragging');
        });
    }

    setupDropZone(cell) {
        cell.addEventListener('dragover', (e) => {
            e.preventDefault();
            cell.classList.add('valid-drop');
        });

        cell.addEventListener('dragleave', () => {
            cell.classList.remove('valid-drop');
        });

        cell.addEventListener('drop', (e) => {
            e.preventDefault();
            cell.classList.remove('valid-drop');
            
            const pieceIndex = e.dataTransfer.getData('text/plain');
            const piece = this.pieces[pieceIndex];
            const cellIndex = cell.dataset.index;

            // ตรวจสอบว่า cell ว่างอยู่
            if (!cell.hasChildNodes()) {
                cell.appendChild(piece);
                cell.classList.add('occupied');
                this.board[cellIndex] = parseInt(pieceIndex);
                this.moves++;
                this.movesDisplay.textContent = `Moves: ${this.moves}`;

                // ตรวจสอบชนะ
                if (this.checkWin()) {
                    this.showWinMessage();
                }
            }
        });
    }

    shufflePieces() {
        const piecesContainer = this.container.querySelector('.puzzle-pieces-container');
        for (let i = this.pieces.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            piecesContainer.appendChild(this.pieces[j]);
        }
    }

    checkWin() {
        for (let i = 0; i < this.board.length; i++) {
            if (this.board[i] !== i) {
                return false;
            }
        }
        return true;
    }

    showWinMessage() {
        const message = document.createElement('div');
        message.className = 'win-message';
        message.innerHTML = `
            <h2>ยินดีด้วย!</h2>
            <p>คุณเรียงจิ๊กซอร์สำเร็จใน ${this.moves} moves</p>
            <button class="restart-button">เล่นอีกครั้ง</button>
        `;
        this.container.appendChild(message);
        
        setTimeout(() => message.classList.add('active'), 100);
        
        message.querySelector('.restart-button').addEventListener('click', () => {
            message.remove();
            this.resetGame();
        });
    }

    resetGame() {
        const piecesContainer = this.container.querySelector('.puzzle-pieces-container');
        const cells = this.container.querySelectorAll('.puzzle-cell');
        
        // คืนชิ้นส่วนทั้งหมดกลับไปที่ container
        cells.forEach(cell => {
            if (cell.hasChildNodes()) {
                const piece = cell.firstChild;
                piecesContainer.appendChild(piece);
                cell.classList.remove('occupied');
            }
        });

        // รีเซ็ตตัวแปร
        this.board = new Array(9).fill(null);
        this.moves = 0;
        this.movesDisplay.textContent = 'Moves: 0';

        // สุ่มตำแหน่งใหม่
        this.shufflePieces();
    }
}

// ส่งออกคลาส
window.PuzzleGame = PuzzleGame;
