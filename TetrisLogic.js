// ######################## 変数定義 ########################
// フィールドサイズ
const FIELD_COL = 20;
const FIELD_ROW = 40;

// ブロック一つのサイズ(ピクセル)
const BLOCK_SIZE = 10;

//スクリーンサイズ
const SCREEN_WIDTH = BLOCK_SIZE * FIELD_COL;
const SCREEN_HEIGHT = BLOCK_SIZE * FIELD_ROW;

//テトロミノのサイズ
const TETRO_SIZE = 4;

//テトロミノ本体
let tetro = [
    [0, 0, 0, 0],
    [1, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
];

//テトロミノの座標
let tetro_x = 0;
let tetro_y = 0;

//フィールド本体
let field = [];

// キャンバス要素を取得
const cvs = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// キャンバスサイズをフィールドサイズに設定
cvs.width = SCREEN_WIDTH;
cvs.height = SCREEN_HEIGHT;
cvs.style.border = "4px solid #555";

// ######################## メイン処理 ########################
// フィールド初期化
initField();

// フィールドを描画
drawAll();

// キー押下のタイミングでテトロミノを移動させて再描画
document.onkeydown = function (e) {
    console.log(e.key);
    switch (e.key) {
        case 'w':
        case 'ArrowUp':
            if (canMove(0, -1)) { tetro_y--; }
            break;
        case 'a':
        case 'ArrowLeft':
            if (canMove(-1, 0)) { tetro_x--; }
            break;
        case 's':
        case 'ArrowRight':
            if (canMove(0, 1)) { tetro_y++; }
            break;
        case 'd':
        case 'ArrowDown':
            if (canMove(1, 0)) { tetro_x++; }
            break;
        case ' ':
            break;
    }
    drawAll();
}

// ######################## 関数定義 ########################
//背景とテトロミノを描画する関数
function drawAll() {
    // 背景をクリアする
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    // 設置されているテトロミノを描画する
    for (let y = 0; y < FIELD_ROW; y++) {
        for (let x = 0; x < FIELD_COL; x++) {
            if (field[y][x]) {
                drawBlock(x, y);
            }
        }
    }
    // 操作中のテトロミノを描画する
    for (let y = 0; y < TETRO_SIZE; y++) {
        for (let x = 0; x < TETRO_SIZE; x++) {
            if (tetro[y][x]) {
                drawBlock(tetro_x + x, tetro_y + y);
            }
        }
    }
}

// フィールドを初期化する関数
function initField() {
    for (let y = 0; y < FIELD_ROW; y++) {
        field[y] = [];
        for (let x = 0; x < FIELD_COL; x++) {
            field[y][x] = 0;
        }
    }
    field[5][8] = 1;
    field[19][9] = 1;
    field[19][0] = 1;
}

// ブロック一つを描画する関数
function drawBlock(x, y) {
    let dx = x * BLOCK_SIZE;
    let dy = y * BLOCK_SIZE;
    ctx.fillStyle = "red";
    ctx.fillRect(dx, dy, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = "black";
    ctx.strokeRect(dx, dy, BLOCK_SIZE, BLOCK_SIZE);
}

// ブロックの衝突を判定する関数
function canMove(dx, dy) {
    for (let y = 0; y < TETRO_SIZE; y++) {
        for (let x = 0; x < TETRO_SIZE; x++) {
            if (tetro[y][x]) {
                let new_x = tetro_x + dx + x;
                let new_y = tetro_y + dy + y;
                if (new_y < 0 || new_x < 0 || new_y >= FIELD_ROW || new_x >= FIELD_COL || field[new_y][new_x]) {
                    return false;
                }
            }
        }
    }
    return true;
}