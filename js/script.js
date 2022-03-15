import { colors, player, arena } from "./variables.js";
import { createPice } from "./createPice.js";
import { playerRotate, collide } from "./rotate.js";

const canvas = document.querySelector("#tetris");
const context = canvas.getContext("2d");

context.scale(20, 20);

// const matrix = [
// 	[0, 0, 0],
// 	[1, 1, 1],
// 	[0, 1, 0],
// ];

function arenaSweep() {
	let rowCount = 1;
	outer: for (let y = arena.length - 1; y > 0; y--) {
		for (let x = 0; x < arena[y].length; x++) {
			if (arena[y][x] === 0) {
				continue outer;
			}
		}

		const row = arena.splice(y, 1)[0].fill(0);
		arena.unshift(row);
		y++;

		player.score += rowCount * 10;
		rowCount *= 2;
	}
}

function draw() {
	context.fillStyle = "#000";
	context.fillRect(0, 0, canvas.width, canvas.height);
	drawMatrix(arena, { x: 0, y: 0 });
	drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset) {
	matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value != 0) {
				context.fillStyle = colors[value];
				context.fillRect(x + offset.x, y + offset.y, 1, 1);
			}
		});
	});
}

function merge(arena, player) {
	player.matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value !== 0) {
				arena[y + player.pos.y][x + player.pos.x] = value;
			}
		});
	});
}

function playerDrop() {
	player.pos.y++;
	if (collide(arena, player)) {
		player.pos.y--;
		merge(arena, player);
		playerReset();
		arenaSweep();
		updateScore();
	}
	dropCounter = 0;
}

function playerMove(dir) {
	player.pos.x += dir;
	if (collide(arena, player)) {
		player.pos.x -= dir;
	}
}

function clearArena() {
	arena.forEach((row) => row.fill(0));
	player.score = 0;
	updateScore();
}

function playerReset() {
	const pieces = "ILJOTSZ";
	player.matrix = createPice(pieces[(pieces.length * Math.random()) | 0]);
	player.pos.y = 0;
	player.pos.x =
		((arena[0].length / 2) | 0) - ((player.matrix[0].length / 2) | 0);
	if (collide(arena, player)) {
		clearArena();
	}
}

let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;

function update(time = 0) {
	const deltaTime = time - lastTime;

	lastTime = time;
	dropCounter += deltaTime;
	if (dropCounter > dropInterval) {
		playerDrop();
	}
	draw();
	requestAnimationFrame(update);
}

function updateScore() {
	document.querySelector(".score").innerText = player.score;
}

document.addEventListener("keydown", (event) => {
	if (event.keyCode === 37) {
		playerMove(-1);
	} else if (event.keyCode === 39) {
		playerMove(1);
	} else if (event.keyCode === 40) {
		playerDrop();
	} else if (event.keyCode === 81) {
		playerRotate(-1);
	} else if (event.keyCode === 87) {
		playerRotate(1);
	}
});

const start = document.querySelector(".start");

start.addEventListener("click", (event) => {
	clearArena();
});
playerReset();
updateScore();
update();
