class SudokuSolver {

  validate(puzzleString) {
    if (puzzleString.length != 81) {
      return ({error: 'Expected puzzle to be 81 characters long'})
    }
    const regex = /[^0-9.]/
    if (regex.test(puzzleString)) {
      return ({error: 'Invalid characters in puzzle'})
    }
    return {}
  }

  checkRowPlacement(puzzleString, row, column, value) {

  }

  checkColPlacement(puzzleString, row, column, value) {

  }

  checkRegionPlacement(puzzleString, row, column, value) {

  }

  solve(grid) {

    let newGrid = grid.concat()

    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        if (newGrid[y][x] == '0') {
          for (let n = 1; n < 10; n++) {
            if (this.possible(newGrid, y, x, n)) {
              newGrid[y][x] = n
              if (this.solve(newGrid).varified) {
                return {varified: true, grid: newGrid}
              } else {
                newGrid[y][x] = 0
              }
            }
          }
          return false
        }
      }
    }
    return {varified: true, grid: newGrid}
  }



  possible(array, y, x, n) {

    for (let i = 0; i < 9; i++) {
      if (array[y][i] == n) {
        return false
      }
    }

    for (let i = 0; i < 9; i++) {
      if (array[i][x] == n) {
        return false
      }
    }

    const x0 = (Math.floor(x/3)) * 3
    const y0 = (Math.floor(y/3)) * 3

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (array[y0 + i][x0 + j] == n) {
          return false
        }
      }
    }

    return true
  }


}

module.exports = SudokuSolver;

