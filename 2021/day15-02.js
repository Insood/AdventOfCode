const colors = require('colors');
const fs = require('fs');
const _ = require('lodash');

const input_file = process.argv.slice(2, 3)[0];

let input_grid = fs.readFileSync(input_file, 'utf8')
  .trim()
  .split('\n')
  .map(line => line.split('').map(c => parseInt(c)))


function prettyprint(grid) {
  let output = grid.map(row => row.join(" ")).join('\n')
  console.log("----")
  console.log(output)
}

// Use the input_grid as a template to build a mega grid that is 5 times larger
function build_grid(input_grid) {
  let new_grid = []

  for (let i = 0; i < input_grid.length * 5; i++) {
    new_grid.push(Array(input_grid[0].length * 5));
  }

  // Each sub grid's values are incremented by this much. Any values over 9 roll over to 1
  const modifiers = [
    [0, 1, 2, 3, 4],
    [1, 2, 3, 4, 5],
    [2, 3, 4, 5, 6],
    [3, 4, 5, 6, 7],
    [4, 5, 6, 7, 8]
  ]

  for (let mega_grid_j = 0; mega_grid_j < 5; mega_grid_j++) {
    for (let mega_grid_i = 0; mega_grid_i < 5; mega_grid_i++) {
      let modifier = modifiers[mega_grid_j][mega_grid_i]
      let x_offset = mega_grid_i * input_grid[0].length;
      let y_offset = mega_grid_j * input_grid.length;

      for (let input_grid_y = 0; input_grid_y < input_grid.length; input_grid_y++) {
        for (let input_grid_x = 0; input_grid_x < input_grid[0].length; input_grid_x++) {
          let new_grid_y = y_offset + input_grid_y;
          let new_grid_x = x_offset + input_grid_x;

          let new_value = input_grid[input_grid_y][input_grid_x] + modifier
          new_value = new_value > 9 ? new_value - 9 : new_value

          new_grid[new_grid_y][new_grid_x] = new_value;
        }
      }
    }
  }
  return new_grid
}

function build_cost_grid(grid) {
  let cost_grid = []
  for (let row = 0; row < grid.length; row++) {
    cost_grid.push(Array(grid[row].length))
  }
  cost_grid[0][0] = 0;
  return cost_grid;
}

function coordinate_within_grid(grid, x, y) {
  return x >= 0 && y >= 0 && x < grid[0].length && y < grid.length;
}

function value_at(grid, x, y) {
  return grid[y][x];
}

function set_value_at(grid, x, y, value) {
  grid[y][x] = value;
}

const neighbor_delta = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1]
];

function cost_to_access(grid, cost_grid, x, y) {
  let access_cost = value_at(grid, x, y);

  let minimum_cost = 9999999;

  neighbor_delta.forEach(coord => {
    let nx = coord[0] + x;
    let ny = coord[1] + y;

    if (coordinate_within_grid(grid, nx, ny)) {
      let neighbor_value = value_at(cost_grid, nx, ny)
      if (!isNaN(neighbor_value) && neighbor_value + access_cost < minimum_cost) {
        minimum_cost = access_cost + neighbor_value;
      }
    }
  })
  return minimum_cost;
}

function expand_outer_edge(grid, outer_edges, consumed_edge) {
  _.remove(outer_edges, n => _.isEqual(n, consumed_edge))

  neighbor_delta.forEach(coord => {
    let nx = consumed_edge[0] + coord[0];
    let ny = consumed_edge[1] + coord[1];
    if (coordinate_within_grid(grid, nx, ny) && isNaN(value_at(grid, nx, ny))) {
      if (!(_.find(outer_edges, n => _.isEqual(n, [nx, ny])))) {
        outer_edges.push([nx, ny]);
      }
    }
  })
  return outer_edges;
}

function step(grid, costs, outer_edges) {
  let lowest_cost_to_access = 10000;
  let cheapest_cell_to_access = undefined;
  outer_edges.forEach(cell => {
    let cost = cost_to_access(grid, costs, ...cell)
    if (cost < lowest_cost_to_access) {
      lowest_cost_to_access = cost;
      cheapest_cell_to_access = cell;
    }
  });

  if (cheapest_cell_to_access) {
    set_value_at(costs, ...cheapest_cell_to_access, lowest_cost_to_access);
    outer_edges = expand_outer_edge(costs, outer_edges, cheapest_cell_to_access)
    return true;
  } else {
    return false;
  }
}

let grid = build_grid(input_grid)
let costs = build_cost_grid(grid);
let outer_edges = [
  [0, 1],
  [1, 0]
]

while (step(grid, costs, outer_edges)) {}

let end_x = costs[0].length - 1;
let end_y = costs.length - 1;

console.log(value_at(costs, end_x, end_y))