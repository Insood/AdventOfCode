const colors = require('colors');
const fs = require('fs');

const input_file = process.argv.slice(2, 3)[0];

let grid = fs.readFileSync(input_file, 'utf8')
  .trim()
  .split('\n')
  .map(line => line.split('').map(c => parseInt(c)))

function incrementone(grid) {
  return grid.map(row => row.map(c => c + 1));
}

var flash_counter = 0;

function flash(grid, row, col) {
  grid[row][col] = 0;
  flash_counter = flash_counter + 1;

  for (var dx = -1; dx <= 1; dx += 1) {
    for (var dy = -1; dy <= 1; dy += 1) {

      // Boundary checking
      if (
        (dx == 0 && dy == 0) || (row + dy) < 0 || (col + dx) < 0 ||
        (row + dy) >= grid.length || (col + dx) >= grid[0].length
      ) {
        continue;
      }

      // Adjacent cell has already flashed this step
      if (grid[row + dy][col + dx] == 0) {
        continue;
      } else {
        grid[row + dy][col + dx] += 1;
      }
    }
  }
}

function activate_flashes(grid) {
  for (var row = 0; row < grid.length; row++) {
    for (var col = 0; col < grid[0].length; col++) {
      if (grid[row][col] <= 9) {
        continue;
      }
      flash(grid, row, col);
      return true;
    }
  }
  return false;
}

function step(grid) {
  grid = incrementone(grid);

  while (true) {
    if (!activate_flashes(grid)) {
      break;
    }
  }

  return grid;
}

// function prettyprint(grid) {
//   let output = grid.map(row => row.join("")).join('\n').replace(/0/g, '0'.brightWhite)
//   console.log("----")
//   console.log(output)
// }

for (var steps = 0; steps < 100; steps++) {
  //prettyprint(grid);
  grid = step(grid);
}

console.log(flash_counter);