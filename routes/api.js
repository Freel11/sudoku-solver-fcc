'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {

    });
    
  app.route('/api/solve')
    .post((req, res) => {
      if (!req.body.hasOwnProperty('puzzle')) {
        res.json({error: 'Required field missing'})
        return
      }
      const puzzle = req.body.puzzle
      const validation = solver.validate(puzzle)

      if (Object.keys(validation)[0] == 'error') {
        res.json(solver.validate(puzzle))
        return
      }

      const string = puzzle.replaceAll('.','0')
      const grid = []
      string.split('').forEach((value, index) => {
        if ((index + 1) % 9 == 0) {
          grid.push(string.split('').slice((index + 1) - 9, index + 1))
        }
      })

      let solution = solver.solve(grid)
      if (!solution) {
        res.json({error: 'Puzzle cannot be solved'})
        return
      }
      solution = solution.grid
      const joined = solution.flat(1)
      res.json({solution: joined.join('')})
    });
};
