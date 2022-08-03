const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const puzzleStrings = {
	validInput: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
	invalidCharacters: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3po',
	wrongLength: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3',
	validInputSolution: '135762984946381257728459613694517832812936745357824196473298561581673429269145378',
	unsolvalble: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.6'
}

chai.use(chaiHttp);

suite('Functional Tests', () => {
	suite('/api/solve', () => {
		test('solve a puzzle with a valid puzzle string', done => {
			chai.request(server)
				.post('/api/solve')
				.send({
					puzzle: puzzleStrings.validInput
				})
				.end((err, res) => {
					assert.equal(res.status, 200)
					assert.equal(res.body.solution, puzzleStrings.validInputSolution)
					done()
				})
		})
		test('solve a puzzle with a missing puzzle string', done => {
			chai.request(server)
				.post('/api/solve')
				.send({
					puzzle: ''
				})
				.end((err, res) => {
					assert.equal(res.status, 200)
					assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
					done()
				})
		})
		test('solve a puzzle with invalid characters', done => {
			chai.request(server)
				.post('/api/solve')
				.send({
					puzzle: puzzleStrings.invalidCharacters
				})
				.end((err, res) => {
					assert.equal(res.status, 200)
					assert.equal(res.body.error, 'Invalid characters in puzzle')
					done()
				})
		})
		test('solve a puzzle with incorrect length', done => {
			chai.request(server)
				.post('/api/solve')
				.send({
					puzzle: puzzleStrings.wrongLength
				})
				.end((err, res) => {
					assert.equal(res.status, 200)
					assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
					done()
				})
		})
		test('solve a puzzle that cannot be solved', done => {
			chai.request(server)
				.post('/api/solve')
				.send({
					puzzle: puzzleStrings.unsolvalble
				})
				.end((err, res) => {
					assert.equal(res.status, 200)
					assert.equal(res.body.error, 'Puzzle cannot be solved')
					done()
				})
		})
	})

	suite('/api/check', () => {
		test('check a puzzle placement with all fields', done => {
			chai.request(server)
				.post('/api/check')
				.send({
					puzzle: puzzleStrings.validInput,
					coordinate: 'E4',
					value: '5'
				})
				.end((err, res) => {
					assert.equal(res.status, 200)
					assert.equal(res.body.valid, true)
					done()
				})
		})
		test('check a puzzle placement with single placement conflict', done => {
			chai.request(server)
				.post('/api/check')
				.send({
					puzzle: puzzleStrings.validInput,
					coordinate: 'E4',
					value: '8'
				})
				.end((err, res) => {
					assert.equal(res.status, 200)
					assert.equal(res.body.valid, false)
					assert.equal(res.body.conflict.length, 1)
					assert.equal(res.body.conflict[0], "row")
					done()
				})
		})
		test('check a puzzle placement with multiple placement conflicts', done => {
			chai.request(server)
				.post('/api/check')
				.send({
					puzzle: puzzleStrings.validInput,
					coordinate: 'E4',
					value: '2'
				})
				.end((err, res) => {
					assert.equal(res.status, 200)
					assert.equal(res.body.valid, false)
					assert.equal(res.body.conflict.length, 2)
					assert.equal(res.body.conflict[0], "row")
					assert.equal(res.body.conflict[1], "region")
					done()
				})
		})
		test('check a puzzle placement with all placement conflicts', done => {
			chai.request(server)
				.post('/api/check')
				.send({
					puzzle: puzzleStrings.validInput,
					coordinate: 'E4',
					value: '3'
				})
				.end((err, res) => {
					assert.equal(res.status, 200)
					assert.equal(res.body.valid, false)
					assert.equal(res.body.conflict.length, 3)
					assert.equal(res.body.conflict[0], "row")
					assert.equal(res.body.conflict[1], "column")
					assert.equal(res.body.conflict[2], "region")
					done()
				})
		})
		test('check a puzzle placement with missing required fields', done => {
			chai.request(server)
				.post('/api/check')
				.send({
					puzzle: puzzleStrings.validInput,
					coordinate: '',
					value: '3'
				})
				.end((err, res) => {
					assert.equal(res.status, 200)
					assert.equal(res.body.error, "Required field(s) missing")
					done()
				})
		})
		test('check a puzzle placement with invalid characters', done => {
			chai.request(server)
				.post('/api/check')
				.send({
					puzzle: puzzleStrings.validInput,
					coordinate: 'Z3',
					value: '3'
				})
				.end((err, res) => {
					assert.equal(res.status, 200)
					assert.equal(res.body.error, "Invalid coordinate")
					done()
				})
		})
		test('check a puzzle placement with invalid length', done => {
			chai.request(server)
				.post('/api/check')
				.send({
					puzzle: puzzleStrings.validInput,
					coordinate: 'Z34',
					value: '3'
				})
				.end((err, res) => {
					assert.equal(res.status, 200)
					assert.equal(res.body.error, "Invalid coordinate")
					done()
				})
		})
		test('check a puzzle placement with invalid placement coordinate', done => {
			chai.request(server)
				.post('/api/check')
				.send({
					puzzle: puzzleStrings.validInput,
					coordinate: 'Z3',
					value: '3'
				})
				.end((err, res) => {
					assert.equal(res.status, 200)
					assert.equal(res.body.error, "Invalid coordinate")
					done()
				})
		})
		test('check a puzzle placement with invalid placement value', done => {
			chai.request(server)
				.post('/api/check')
				.send({
					puzzle: puzzleStrings.validInput,
					coordinate: 'A3',
					value: '32'
				})
				.end((err, res) => {
					assert.equal(res.status, 200)
					assert.equal(res.body.error, "Invalid value")
					done()
				})
		})
	})

});

