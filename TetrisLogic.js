// ######################## 変数定義 ########################
// テトロミノが落下するスピード
const GAME_SPEED = 1000;

// フィールドサイズ
const FIELD_COL = 20;
const FIELD_ROW = 40;

// ブロック一つのサイズ(ピクセル)
const BLOCK_SIZE = 10;

// スクリーンサイズ
const SCREEN_WIDTH = BLOCK_SIZE * FIELD_COL;
const SCREEN_HEIGHT = BLOCK_SIZE * FIELD_ROW;

// テトロミノのサイズ
const TETRO_SIZE = 4;

// テトロミノの色
const TETRO_COLORS = [
    "#6CF",			//0水色
    "#F92",			//1オレンジ
    "#66F",			//2青
    "#C5C",			//3紫
    "#FD2",			//4黄色
    "#F44",			//5赤
    "#5B5"			//6緑
];

// テトロミノのタイプ別定義
const TETRO_TYPES = [
    // 0.I
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    // 1.L
    [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    // 2.J
    [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    // 3.T
    [
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0]
    ],
    // 4.O
    [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    // 5.Z
    [
        [0, 0, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    // 6.S
    [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [1, 1, 0, 0],
        [0, 0, 0, 0]
    ]
];

// テトロミノの形
let tetro_type = Math.floor(Math.random() * (TETRO_TYPES.length));

// テトロミノ本体
let tetro = TETRO_TYPES[tetro_type];

//初期位置
const START_X = FIELD_COL / 2 - TETRO_SIZE / 2;
const START_Y = 0;

// テトロミノの座標
let tetro_x = START_X;
let tetro_y = START_Y;

// フィールド本体
let field = [];

//ゲームオーバーフラグ
let over = false;

// ######################## メイン処理 ########################
// キャンバス要素を取得
const cvs = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// キャンバスサイズをフィールドサイズに設定
cvs.width = SCREEN_WIDTH;
cvs.height = SCREEN_HEIGHT;
cvs.style.border = "4px solid #555";

// テトロミノの落下ペースを設定
let intervalID = setInterval(dropTetro, GAME_SPEED);

// フィールド初期化
initField();

// フィールドを描画
drawAll();

// キー押下のタイミングでテトロミノを移動させて再描画
document.onkeydown = function (e) {
    if (over === true) {
        return;
    }
    console.log(e.key);
    switch (e.key) {
        case 'a':
        case 'ArrowLeft':
            if (doConflict(-1, 0)) { tetro_x--; }
            break;
        case 's':
        case 'ArrowDown':
            if (doConflict(0, 1)) { tetro_y++; }
            break;
        case 'd':
        case 'ArrowRight':
            if (doConflict(1, 0)) { tetro_x++; }
            break;
        case ' ':
            if (doConflict(0, 0, rotate())) { tetro = rotate(); }
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
            if (field[y][x] >= 0) {
                drawBlock(x, y, field[y][x]);
            }
        }
    }
    // 操作中のテトロミノを描画する
    for (let y = 0; y < TETRO_SIZE; y++) {
        for (let x = 0; x < TETRO_SIZE; x++) {
            if (tetro[y][x]) {
                drawBlock(tetro_x + x, tetro_y + y, tetro_type);
            }
        }
    }

    if (over === true) {
        let s = "GAME OVER";
        ctx.font = "40px 'ＭＳ ゴシック'";
        let w = ctx.measureText(s).width;
        let x = SCREEN_WIDTH / 2 - w / 2;
        let y = SCREEN_HEIGHT / 2 - 20;
        ctx.lineWidth = 4;
        ctx.strokeText(s, x, y);
        ctx.fillStyle = "white";
        ctx.fillText(s, x, y);
        clearInterval(intervalID);
    }
}

// フィールドを初期化する関数
function initField() {
    for (let y = 0; y < FIELD_ROW; y++) {
        field[y] = [];
        for (let x = 0; x < FIELD_COL; x++) {
            field[y][x] = -1;
        }
    }
    field[5][8] = 1;
    field[19][9] = 1;
    field[19][0] = 1;
}

// ブロック一つを描画する関数
function drawBlock(x, y, c) {
    let dx = x * BLOCK_SIZE;
    let dy = y * BLOCK_SIZE;
    ctx.fillStyle = TETRO_COLORS[c];
    ctx.fillRect(dx, dy, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = "black";
    ctx.strokeRect(dx, dy, BLOCK_SIZE, BLOCK_SIZE);
}

// テトロの衝突を判定する関数
function doConflict(dx, dy, current_tetro) {
    if (current_tetro === undefined) {
        current_tetro = tetro;
    }
    for (let y = 0; y < TETRO_SIZE; y++) {
        for (let x = 0; x < TETRO_SIZE; x++) {
            if (current_tetro[y][x]) {
                let new_x = tetro_x + dx + x;
                let new_y = tetro_y + dy + y;
                if (new_y < 0 || new_x < 0 || new_y >= FIELD_ROW || new_x >= FIELD_COL || field[new_y][new_x] >= 0) {
                    return false;
                }
            }
        }
    }
    return true;
}

// テトロを回転させる関数
function rotate() {
    let new_tetro = [];
    for (let y = 0; y < TETRO_SIZE; y++) {
        new_tetro[y] = [];
        for (let x = 0; x < TETRO_SIZE; x++) {
            new_tetro[y][x] = tetro[TETRO_SIZE - x - 1][y];
        }
    }
    return new_tetro;
}

// テトロを落下させる関数
function dropTetro() {
    if (doConflict(0, 1)) {
        tetro_y++;
    } else {
        fixTetro();
        checkLine();
        tetro_type = Math.floor(Math.random() * (TETRO_TYPES.length));
        tetro = TETRO_TYPES[tetro_type];
        tetro_x = START_X;
        tetro_y = START_Y;
        if (!doConflict(0, 0)) {
            over = true;
        }
    }
    drawAll();
}

// テトロを固定する関数
function fixTetro() {
    for (let y = 0; y < TETRO_SIZE; y++) {
        for (let x = 0; x < TETRO_SIZE; x++) {
            if (tetro[y][x]) {
                field[tetro_y + y][tetro_x + x] = tetro_type;
            }
        }
    }
}

//ラインが揃ったかチェックして消す関数
function checkLine() {
    let num_of_erasedline = 0;
    for (let y = 0; y < FIELD_ROW; y++) {
        let isFilledRow = true;
        for (let x = 0; x < FIELD_COL; x++) {
            if (field[y][x] < 0) {
                isFilledRow = false;
                break;
            }
        }
        if (isFilledRow === true) {
            num_of_erasedline++;
            for (let ny = y; ny > 0; ny--) {
                for (let nx = 0; nx < FIELD_COL; nx++) {
                    field[ny][nx] = field[ny - 1][nx];
                }
            }
        }
    }
    return num_of_erasedline;
}
