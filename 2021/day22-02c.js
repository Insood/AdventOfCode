const fs = require('fs');
const _ = require('lodash');

const minx = 0;
const maxx = 1;
const miny = 2;
const maxy = 3;
const minz = 4;
const maxz = 5;

function calculate_segments(min_set, max_set) {
  let mins_with_flag = Array.from(min_set).map(mn => [mn,0])
  let maxs_with_flag = Array.from(max_set).map(mx => [mx,1])

  let sorted_values = mins_with_flag.concat(maxs_with_flag)
    .sort( (a,b) => a[0] - b[0] || a[1] - b[1]);

  let segments = [];
  for(let i = 0; i < sorted_values.length - 1; i++){
    let a = sorted_values[i];
    let b = sorted_values[i+1];

    // If we have a min next to a max (ie: 9Max-10Min) then there's no space in between
    if(a[1] == 1 && b[1] == 0 && (a[0] + 1 == b[0])) { continue; }

    // if A is a min value (flag=0), start on that value otherwise use the next coordinate
    let start = a[1] == 0 ? a[0] : a[0] + 1;

    // if B is a min value (flag=0), end before B, otherwise end on B
    let end = b[1] == 0 ? b[0] - 1 : b[0]

    segments.push([start, end]);
  }

  return segments;
}

console.assert(
  _.isEqual(
    calculate_segments(new Set([-20]),new Set([0,-18])),
    [[-20,-18],[-17,0]]
  ),
  'A'
)

console.assert(
  _.isEqual(
    calculate_segments(new Set([-20,-19]),new Set([0,-18,2])),
    [[-20,-20],[-19,-18],[-17,0],[1,2]]
  ),
  'B'
)

console.assert(
  _.isEqual(
    calculate_segments(new Set([-20]),new Set([-18,-17,-16])),
    [[-20,-18],[-17,-17],[-16,-16]]
  ),
  'C'
)

console.assert(
  _.isEqual(
    calculate_segments(new Set([-20]),new Set([-19,-16,-15])),
    [[-20,-19],[-18,-16],[-15,-15]]
  ),
  'D'
)

console.assert(
  _.isEqual(
    calculate_segments(new Set([0,3]),new Set([3,1,4])),
    [[0,1],[2,2],[3,3],[4,4]]
  ),
  'E'
)

function preprocess_instructions(instructions){
  let min_xs = new Set();
  let max_xs = new Set();
  let min_ys = new Set();
  let max_ys = new Set();
  let min_zs = new Set();
  let max_zs = new Set();

  instructions.forEach(instructions => {
    let cube = instructions.slice(1);
    min_xs.add(cube[minx])
    max_xs.add(cube[maxx])
    min_ys.add(cube[miny])
    max_ys.add(cube[maxy])
    min_zs.add(cube[minz])
    max_zs.add(cube[maxz])
  });

  let xs = calculate_segments(min_xs, max_xs);
  let ys = calculate_segments(min_ys, max_ys);
  let zs = calculate_segments(min_zs, max_zs);
  return [xs, ys, zs];
}

function cube_inside_cube(inner_cube, outer_cube){
  return inner_cube[0] >= outer_cube[0] &&
         inner_cube[1] <= outer_cube[1] &&
         inner_cube[2] >= outer_cube[2] &&
         inner_cube[3] <= outer_cube[3] &&
         inner_cube[4] >= outer_cube[4] &&
         inner_cube[5] <= outer_cube[5];
}

console.assert(cube_inside_cube([10,10,10,10,10,10],[9,10,9,10,9,10]))
console.assert(!cube_inside_cube([11,11,11,11,11,11],[9,10,9,10,9,10]))

function cube_volume(cube){
  return (cube[1] + 1 - cube[0])*(cube[3] + 1 - cube[2])*(cube[5] + 1 - cube[4]);
}

console.assert(cube_volume([10,10,10,10,10,10]) == 1)
console.assert(cube_volume([10,12,10,12,10,12]) == 27)

function calculate_activated_volume(instructions, xs, ys, zs){
  let volume = 0;

  for(let i = 0; i < xs.length; i++){
    console.log(i + ' of ' + xs.length)
    for(let j = 0; j < ys.length; j++){
      for(let k = 0; k < zs.length; k++){
        let inner_cube = [xs[i][0],xs[i][1],ys[j][0],ys[j][1],zs[k][0],zs[k][1]]
        let last_mode = 0;

        for(let m = 0; m < instructions.length; m++){
          let mode = instructions[m][0];
          if(mode == last_mode) { continue; }

          if(inner_cube[0] >= instructions[m][1] &&
             inner_cube[1] <= instructions[m][2] &&
             inner_cube[2] >= instructions[m][3] &&
             inner_cube[3] <= instructions[m][4] &&
             inner_cube[4] >= instructions[m][5] &&
             inner_cube[5] <= instructions[m][6]){
               last_mode = mode;
            }
        }

        if(last_mode){
          volume += cube_volume(inner_cube);
        }
      }
    }
  }
  return volume;
}

console.assert(
  calculate_activated_volume([[1,9,11,9,11,9,11]],[[9,11]],[[9,11]],[[9,11]]) == 27
)

console.assert(
  calculate_activated_volume(
    [
      [1,10,12,10,12,10,12],
      [1,11,13,11,13,11,13],
      [0,9,11,9,11,9,11],
      [1,10,10,10,10,10,10]
    ],
    [[9,9],[10,10],[11,11],[12,12],[13,13]],
    [[9,9],[10,10],[11,11],[12,12],[13,13]],
    [[9,9],[10,10],[11,11],[12,12],[13,13]]) == 39
)

console.assert(
  calculate_activated_volume(
    [
      [1,10,12,10,12,10,12],
      [1,11,13,11,13,11,13],
      [0,9,11,9,11,9,11],
    ],
    [[9,9],[10,10],[11,11],[12,12],[13,13]],
    [[9,9],[10,10],[11,11],[12,12],[13,13]],
    [[9,9],[10,10],[11,11],[12,12],[13,13]]) == 38
)

const input_file = process.argv.slice(2, 3)[0];
let instructions = fs.readFileSync(input_file, 'utf8')
                     .trim()
                     .split(/\r?\n/)
                     .map(line => {
                       return line
                        .replace(/(\.\.)/g, " ")
                        .replace("on", "1")
                        .replace("off", "0")
                        .replace("x=", "")
                        .replace(",y="," ")
                        .replace(",z="," ")
                        .split(" ")
                        .map(v => parseInt(v))
                     })

let [xs, ys, zs] = preprocess_instructions(instructions);

console.log(calculate_activated_volume(instructions, xs, ys, zs));