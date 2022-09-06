// 1.06
const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");

const ROW = 20;
const COL = COLUMN = 10;
const SQ = squareSize = 20;
// color of an empty square(boş karenin rengi)
const VACANT = "WHITE";

// draw a square (kareyi çizme)
function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * SQ, y * SQ, SQ, SQ);

    ctx.strokeStyle = "BLACK";
    ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

// create the board(zemini yapma)
let board = [];
for (r = 0; r < ROW; r++) {
    board[r] = [];
    for (c = 0; c < COL; c++) {
        board[r][c] = VACANT;
    }
}

// draw the board(zemini çizme)
function drawBoard() {
    for (r = 0; r < ROW; r++) {
        for (c = 0; c < COL; c++) {
            drawSquare(c, r, board[r][c]);
        }
    }
}

drawBoard();

// the pieces  and their colors(parçalar ve renkleri)
const PIECES = [
    [Z, "red"],
    [S, "green"],
    [T, "yellow"],
    [O, "blue"],
    [L, "purple"],
    [T, "cyan"],
    [J, "orange"]
];

// initate a piece(bir parçadan oyunnu başlatmak)
let p = new Piece(PIECES[0][0], PIECES[0][1]);

// the object piece(nesneler)
function Piece(tetromino, color) {
    this.tetromino = tetromino;
    this.color = color;

    // we start from the first pattern(ilk kalıp)
    this.tetrominoN = 0;
    this.activeTetromino = this.tetromino[this.tetrominoN];

    // we need to control the pieces(parçaları kontrol etme)
    this.x = 3;
    this.y = 0;
}

// draw a piece to the board(tahtaya parça çizme)
Piece.prototype.fill = function (color) {
    for (r = 0; r < this.activeTetromino.length; r++) {
        for (c = 0; c < this.activeTetromino.length; c++) {
            // we draw only occupied squares(sadece dolu kareleri çizme)
            if (this.activeTetromino[r][c]) {
                drawSquare(this.x + c, this.y + r, color)
            }
        }
    }
}

//fill function(doldurma )
Piece.prototype.draw = function () {
    this.fill(this.color);
}

// undraw a piece(parçayı çıkarmak)
Piece.prototype.unDraw = function () {
    this.fill(VACANT);
}


// move down the piece(parçayı aşağı taşıma)
Piece.prototype.moveDown = function () {
    if (!this.collision()) {
        this.unDraw();
        this.y++;
        this.draw();
    }else {
        // we lock the piece and generate a  new one (parçayı kilitler ve yeni bir tane oluştururuz)
    }
}

//move Right the piece(parçayı sağa kaydırma)
Piece.prototype.moveRight = function () {
    if(!this.collision()){
        this.unDraw();
        this.x++;
        this.draw();
    }
}

//move Left the piece(parçayı sola kaydırma)
Piece.prototype.moveleft = function () {
    if(!this.collision()){
        this.unDraw();
        this.x--;
        this.draw();
    }
}

//rotate the piece(parçayı yan döndürme)
Piece.prototype.rotate = function () {
    this.unDraw();
    //(0+1)%4=>1
    this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.draw();
}

//collision function(çarpmışma durumu)
Piece.prototype.collision = function (x, y, piece) {
    for (r = 0; r < piece.length; r++) {
        for (c = 0; c < piece.length; c++) {
            // if the square is empty,we skip it(kare boşsa atlama)
            if (!piece[r][c]) {
                continue;
            }
            // coordinates of the piece after movement(hareketten sonra parçanın koordınatları)
            let newX = this.x + c + x;
            let newY = this.y + r + y;

            // conditions(koşullar)
            if (newX < 0 || newX >= COL || newY >= ROW) {
                return true;
            }
            // skip newY <0 ; board [-1] will crush our game (bu pano oyunu bozucak)
            if (newY < 0) {
                continue;
            }
            // check if there is a locked piece alraady in place(yerinde kilitli bir parça olup olmadığını kontrol etme)
            if (board[newY][newX] != VACANT) {
                return true;
            }
        }
    }
    return false;
}

//control the piece(tuş kontrollerini js e tanıtma)
document.addEventListener("keydown", CONTROL);

function CONTROL(event) {
    if (event.keyCode == 37) {
        p.moveleft();
        dropStart = Date.now();
    } else if (event.keyCode == 38) {
        p.rotate();
        dropStart = Date.now();
    } else if (event.keyCode == 39) {
        p.moveRight();
        dropStart = Date.now();
    } else if (event.keyCode == 40) {
        p.moveDown();
    }
}


// drop the piece every Isec (her parçayı bırakma)
let dropStart = Date.now();
function drop() {
    let now = Date.now()
    let delta = now - dropStart;
    if (delta > 1000) {
        p.moveDown();
        dropStart = Date.now();
    }
    requestAnimationFrame(drop);
}

drop();