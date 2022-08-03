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

  check(object) {

    if (!object.puzzle || !object.value || !object.coordinate) {
      return {error: 'Required field(s) missing'}
    }

    const { puzzle, value } = object
    const coordinates = object.coordinate.split('')

    if (coordinates.length != 2) {
      return { error: "Invalid coordinate"}
    }

    const yCoordinate = coordinates[0]
    const xCoordinate = coordinates[1]

    if (Object.keys(this.validate(puzzle))[0] == 'error') {
      return this.validate(puzzle)
    }

    const validYCoordinates = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
    const validValue = []
    for (let i = 1; i < 10; i++) {
      validValue.push(i)
    }

    if (!this.verify(yCoordinate, validYCoordinates)) {
      return { error: 'Invalid coordinate' }
    }
    if (!this.verify(xCoordinate, validValue)) {
      return { error: 'Invalid coordinate' }
    }
    if (!this.verify(value, validValue)) {
      return { error: 'Invalid value'}
    }

    let yValue
    for (let i = 0; i < validYCoordinates.length; i++) {
      if (yCoordinate == validYCoordinates[i]) {
        yValue = i
      }
    }

    const newGrid = this.makeGrid(puzzle)
    return this.possible(newGrid, yValue, xCoordinate - 1, value)
  }

  verify(value, array) {
    for (let i = 0; i < array.length; i++) {
      if (value == array[i]) {
        return true
      } 
    }
    return false
  }

  solve(grid) {

    let newGrid = grid

    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        if (newGrid[y][x] == '0') {
          for (let n = 1; n < 10; n++) {
            if (this.possible(newGrid, y, x, n).valid) {
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

    const conflict = []
    let sameValue

    if (array[y][x] == n) {
      sameValue = true
    }

    for (let i = 0; i < 9; i++) {
      if (array[y][i] == n) {
        conflict.push('row') 
      }
    }

    for (let i = 0; i < 9; i++) {
      if (array[i][x] == n) {
        conflict.push('column')
      }
    }

    const x0 = (Math.floor(x/3)) * 3
    const y0 = (Math.floor(y/3)) * 3

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (array[y0 + i][x0 + j] == n) {
          conflict.push('region')
        }
      }
    }

    if (sameValue) {
      return { valid: true }
    } else if (conflict.length > 0) {
      return { valid: false, conflict: conflict }
    } else {
      return { valid: true }
    }

  }

  makeGrid(puzzle) {
    const string = puzzle.replaceAll('.','0')
    const grid = []
    string.split('').forEach((value, index) => {
      if ((index + 1) % 9 == 0) {
        grid.push(string.split('').slice((index + 1) - 9, index + 1))
      }
    })
    return grid.concat()
  }


}

module.exports = SudokuSolver;

