const fs = require('fs');
const _ = require('lodash');

const input_file = process.argv.slice(2, 3)[0];

let [raw_points, raw_instructions] = fs.readFileSync(input_file, 'utf8')
  .trim()
  .split('\n\n')

let points = raw_points.split('\n')
  .map(line => line.split(',').map(coord => parseInt(coord)))

instructions = raw_instructions.split('\n')
  .map(line => {
    return line.split('fold along ')[1].split('=').map(instruction => {
      return parseInt(instruction) || instruction
    })
  })

function dimensions(points) {
  let max_x = 0;
  let max_y = 0;
  points.forEach(point => {
    if (point[0] > max_x) { max_x = point[0] }
    if (point[1] > max_y) { max_y = point[1] }
  });
  return [max_x, max_y];
}

function visualize(points) {
  let [x, y] = dimensions(points);

  for (let j = 0; j <= y; j++) {
    var line = "";
    for (let i = 0; i <= x; i++) {
      line += _.find(points, function(pt) { return pt[0] == i && pt[1] == j }) ? "#" : '.'
    }
    console.log(line);
  }
}

var new_points = [];

function fold(points, axis, coordinate) {

  points.forEach(point => {
    if (axis == 'x') {
      let new_x = coordinate - Math.abs(point[0] - coordinate);
      new_points.push([new_x, point[1]])
    } else {
      let new_y = coordinate - Math.abs(point[1] - coordinate);
      new_points.push([point[0], new_y]);
    }
  })

  new_points = _.uniqWith(new_points, _.isEqual);

  return new_points;
}

function fold_repeatedly(points, instructions) {
  instructions.forEach((instruction) => {
    let axis = instruction[0];
    let coordinate = instruction[1];
    points = fold(points, axis, coordinate);
  });
  visualize(points);
}

fold_repeatedly(points, instructions);