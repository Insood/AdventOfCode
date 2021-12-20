const fs = require('fs');

const input_file = process.argv.slice(2,3)[0];

let inputs = fs.readFileSync(input_file, 'utf8')
               .trim()
               .split('\n')
               .map( line => line.split('').map(c => parseInt(c)))

let width = inputs[0].length
let height = inputs.length

function check_if_low_point(inputs, x,y){
  let nearby_values = []
  var this_height = inputs[y][x]

  if(x-1>=0){ nearby_values.push(inputs[y][x-1]) }
  if(x+1<width){ nearby_values.push(inputs[y][x+1]) }
  if(y-1>=0){ nearby_values.push(inputs[y-1][x]) }
  if(y+1<height){ nearby_values.push(inputs[y+1][x]) }

  let lower_points = nearby_values.filter(val => this_height >= val)
  if(lower_points.length > 0){
    return null
  } else {
    return this_height;
  }
}

var total = 0

for(let y = 0; y < height; y++){
  for(let x = 0; x < width; x++){
    var score = check_if_low_point(inputs, x,y);
    if(score != null){
      total += score + 1
    }
  }
}

console.log(total)