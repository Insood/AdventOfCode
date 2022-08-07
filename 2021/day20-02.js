const fs = require('fs');
const math = require('mathjs');

const input_file = process.argv.slice(2, 3)[0];

let [raw_algorithm, raw_image] = fs.readFileSync(input_file, 'utf8')
  .trim()
  .split('\r\n\r\n')

function compact_algorithm(raw_algorithm){
  return raw_algorithm.split("\r\n").join('')
}

function load_image(raw_image, padding){
  let rows = raw_image.split("\r\n");
  let column_count = rows[0].length;

  let matrix = math.sparse();
  matrix.resize([column_count + 2*padding, rows.length + 2*padding], false);

  for(let x = 0; x < rows.length; x++){
    let row = rows[x];
    for(let y = 0; y < row.length; y++){
      let value = row[y] == '#' ? true : false
      matrix.set([x+padding,y+padding], value);
    }
  }
  return matrix;
}

function show(matrix){
  let [rows, cols] = matrix.size();
  for(let i = 0; i < rows; i++){
    let str = "";
    for(let j =0; j < cols; j++){
      str += matrix.get([i,j]) ? '#' : ' ';
    }
    console.log(str);
  }
}

function enhance(matrix, algorithm){
  let [cols, rows] = matrix.size();
  let matrix_copy = matrix.clone();
  let edge = matrix.get([0,0]) ? '1' : 0;

  for(let row = 0; row < rows; row++){
    for(let col = 0; col < cols; col++){
      let binary = "";

      for(let y = -1; y <= 1; y++){
        for(let x = -1; x <= 1; x++){
          if((x+row < 0) || (y+col < 0) || (x+row >= rows) || (y+col >= cols)){
            binary += edge;
          } else {
            binary += matrix.get([y+col,x+row]) ? '1' : '0'
          }
        }
      }

      let offset = parseInt(binary,2);
      let new_value = algorithm[offset] == '#' ? true : false;
      matrix_copy.set([col,row], new_value)
    }
  }
  return matrix_copy;
}

function count_pixels(image){
  let [rows, cols] = image.size();
  let counter = 0;

  for(let row = 0; row < rows; row++){
    for(let col = 0; col < cols; col++){
      counter += image.get([row,col]) ? 1 : 0;
    }
  }
  return counter;
}

let algorithm = compact_algorithm(raw_algorithm);

let image = load_image(raw_image, 51);
for(let i = 0; i < 50; i++){
  image = enhance(image, algorithm)
}

console.log(count_pixels(image))
