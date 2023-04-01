const MARGIN = 5;
const BLOCK_SIZE = 20;
const TETRO_SIZE = 4;
const tetro = [
    [0, 0, 0, 0],
    [1, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
]

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

for (let y = 0; y < TETRO_SIZE; y++) {
    for (let x = 0; x < TETRO_SIZE; x++) {
        if (tetro[y][x] == 1) {
            let px = x * BLOCK_SIZE + MARGIN;
            let py = y * BLOCK_SIZE;
            ctx.fillStyle = "red";
            ctx.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
            ctx.strokeStyle = "black";
            ctx.lineWidth = 3;
            ctx.strokeRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
        }
    }
}

