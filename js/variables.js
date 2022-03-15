export const colors = [
	null,
	"red",
	"blue",
	"violet",
	"green",
	"orange",
	"pink",
	"purple",
];

export const player = {
	pos: { x: 0, y: 0 },
	matrix: null,
	score: 0,
};

function createMatrix(w, h) {
	const matrix = [];
	while (h--) {
		matrix.push(new Array(w).fill(0));
	}
	return matrix;
}

export const arena = createMatrix(12, 20);
