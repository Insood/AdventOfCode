const fs = require('fs');
const math = require('mathjs');

const SPACE = '.'.charCodeAt(0);
const RIGHT = '>'.charCodeAt(0);
const DOWN = 'v'.charCodeAt(0);

function load(input_file){
  let array_2d = fs.readFileSync(input_file, 'utf8')
    .trim()
    .split(/\r?\n/)
    .map(row =>
      row.split('').map(char => char.charCodeAt(0))
    )
  
  return math.matrix(array_2d);
}

function show(matrix){
  let [rows, cols] = matrix.size();
  for(let i = 0; i < rows; i++){
    let str = "";
    for(let j =0; j < cols; j++){
      str += String.fromCharCode(matrix.get([i,j]));
    }
    console.log(str);
  }
}

function moveable(matrix, piece_to_move){
  let moveable_matrix = math.matrix();
  moveable_matrix.resize(matrix.size(), false);

  let [rows, cols] = matrix.size();
  for(let i = 0; i < rows; i++){
    for(let j =0; j < cols; j++){
      let piece = matrix.get([i,j]);
      if(piece != piece_to_move) { continue; }

      if(piece == RIGHT) {
        let next_j = (j == cols - 1) ? 0 : j + 1;
        if(matrix.get([i,next_j]) == SPACE){
          moveable_matrix.set([i,j], true);
        }
      } else if(piece == DOWN) {
        let next_i = ( i== rows -1 ) ? 0 : i + 1;
        if(matrix.get([next_i, j]) == SPACE){
          moveable_matrix.set([i,j], true);
        }
      }
    }
  }

  return moveable_matrix;
}

function move(matrix, moveable_matrix, piece_to_move){
  let [rows, cols] = matrix.size();
  for(let i = 0; i < rows; i++){
    for(let j =0; j < cols; j++){
      let should_move = moveable_matrix.get([i,j]);
      if(!should_move) { continue; }

      let piece = matrix.get([i,j]);
      if(piece != piece_to_move){ continue; }

      if(piece == RIGHT){
        let next_j = (j == cols - 1) ? 0 : j + 1;
        matrix.set([i,j],SPACE);
        matrix.set([i,next_j], RIGHT);
      } else if(piece == DOWN){
        let next_i = ( i== rows -1 ) ? 0 : i + 1;
        matrix.set([i,j],SPACE);
        matrix.set([next_i,j], DOWN);
      }
    }
  }
}

function step(matrix) {
  let mv = moveable(matrix, RIGHT);
  move(matrix, mv, RIGHT);
  mv = moveable(matrix, DOWN)
  move(matrix, mv, DOWN);
  return matrix;
}


const input_file = process.argv.slice(2, 3)[0];
let matrix = load(input_file);

let step_counter = 1;

while(true) {
  let original = math.matrix(matrix);
  step(matrix);

  if(!math.deepEqual(original, matrix)){
    step_counter += 1;
  } else {
    console.log('Stable after %d', step_counter);
    break;
  }
}