const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const puzzleStrings = {
	validInput: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
	invalidCharacters: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3po',
	wrongLength: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3',
	validInputSolution: '135762984946381257728459613694517832812936745357824196473298561581673429269145378',
	unsolvalble: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.6'
}
let solver = new Solver;
const grid = solver.makeGrid(puzzleStrings.validInput)

suite('Unit Tests', () => {
	suite('Solver.validate', () => {
		test('Logic handles a valid puzzle string of 81 chartacters', done => {
			assert.isObject(solver.validate(puzzleStrings.validInput), 'response is an object')
			assert.equal(Object.keys(solver.validate(puzzleStrings.validInput)).length, 0)
			done()
		})
		test('Logic handles a puzzle string with invalid characters', done => {
			assert.isObject(solver.validate(puzzleStrings.invalidCharacters), 'response is an object')
			assert.equal(solver.validate(puzzleStrings.invalidCharacters).error, 'Invalid characters in puzzle' )
			done()
		})
		test('Logic handles a puzzle that is not 81 characters in length', done => {
			assert.isObject(solver.validate(puzzleStrings.wrongLength), 'response is an object')
			assert.equal(solver.validate(puzzleStrings.wrongLength).error, 'Expected puzzle to be 81 characters long' )
			done()
		})
	})

	suite('Solver.possible', () => {
		test('Logic handles a valid row placement', done => {
			assert.isObject(solver.possible(grid, 0, 1, 3), 'response is an object')
			assert.equal(solver.possible(grid, 0, 1, 3).valid, true)
			done()
		})
		test('Logic handles an invalid row placement', done => {
			assert.isObject(solver.possible(grid, 0, 1, 4), 'response is an object')
			assert.equal(solver.possible(grid, 0, 1, 4).valid, false)
			assert.equal(solver.possible(grid, 0, 1, 4).conflict.length, 1)
			assert.equal(solver.possible(grid, 0, 1, 4).conflict[0], "row")
			done()
		})
		test('Logic handles a valid column placement', done => {
			assert.isObject(solver.possible(grid, 0, 1, 3), 'response is an object')
			assert.equal(solver.possible(grid, 0, 1, 3).valid, true)
			done()
		})
		test('Logic handles an invalid column placement', done => {
			assert.isObject(solver.possible(grid, 0, 1, 9), 'response is an object')
			assert.equal(solver.possible(grid, 0, 1, 9).valid, false)
			assert.equal(solver.possible(grid, 0, 1, 9).conflict.length, 1)
			assert.equal(solver.possible(grid, 0, 1, 9).conflict[0], "column")
			done()
		})
		test('Logic handles a valid region (3x3 grid) placement', done => {
			assert.isObject(solver.possible(grid, 0, 1, 3), 'response is an object')
			assert.equal(solver.possible(grid, 0, 1, 3).valid, true)
			done()
		})
		test('Logic handles an invalid region (3x3 grid) placement', done => {
			assert.isObject(solver.possible(grid, 1, 1, 5), 'response is an object')
			assert.equal(solver.possible(grid, 1, 1, 5).valid, false)
			assert.equal(solver.possible(grid, 1, 1, 5).conflict.length, 1)
			assert.equal(solver.possible(grid, 1, 1, 5).conflict[0], "region")
			done()
		})
	})

	suite('Solver.solve', () => {
		test('Valid puzzle strings pass the solver', done => {
			assert.isObject(solver.solve(grid), 'response is an object')
			assert.isArray(solver.solve(grid).grid, 'Response is an array')
			assert.equal(solver.solve(grid).varified, true)
			done()
		})
		test('invalid puzzle strings fail the solver', done => {
			assert.equal(solver.solve(solver.makeGrid(puzzleStrings.unsolvalble)), false)
			done()
		})
		test('solver returns the expected solution for an incolmplete puzzle', done => {
			assert.equal(solver.solve(grid).grid.flat(1).join(''), puzzleStrings.validInputSolution)
			done()
		})
	})
});
