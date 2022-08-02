'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {

      const check = solver.check(req.body)

      // if (Object.keys(check)[0] == 'error') {
      //   res.json(check)
      //   return
      // }

      res.json(check)
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
        res.json(validation)
        return
      }

      let solution = solver.solve(solver.makeGrid(puzzle))
      if (!solution) {
        res.json({error: 'Puzzle cannot be solved'})
        return
      }
      solution = solution.grid
      const joined = solution.flat(1)
      res.json({solution: joined.join('')})
    });
};
