const colors = require('colors');
const fs = require('fs');
const _ = require('lodash');

const input_file = process.argv.slice(2, 3)[0];

let grid = fs.readFileSync(input_file, 'utf8')
  .trim()
  .split('\n')
  .map(line => line.split('').map(c => parseInt(c)))


function prettyprint(grid) {
  let output = grid.map(row => row.join(" ")).join('\n')
  console.log("----")
  console.log(output)
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

  let minimum_cost = 1000;

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

let costs = build_cost_grid(grid);
let outer_edges = [
  [0, 1],
  [1, 0]
]

while (step(grid, costs, outer_edges)) {}

let end_x = costs[0].length - 1;
let end_y = costs.length - 1;

console.log(value_at(costs, end_x, end_y))