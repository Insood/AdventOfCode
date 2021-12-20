const fs = require('fs');

const input_file = process.argv.slice(2,3)[0];

let inputs = fs.readFileSync(input_file, 'utf8')
               .trim()
               .split('\n')
               .map( line => line.split('').map(c => parseInt(c)))

let width = inputs[0].length
let height = inputs.length

function nearby_points(x,y){
  let points = []
  if(x-1>=0){ points.push([x-1,y]) }
  if(x+1<width){ points.push([x+1,y]) }
  if(y-1>=0){ points.push([x,y-1]) }
  if(y+1<height){ points.push([x,y+1]) }

  return points;
}

function check_if_low_point(inputs, x,y){
  let nearby_values = []
  var this_height = inputs[y][x]

  nearby_points(x,y).forEach(point => nearby_values.push(inputs[point[1]][point[0]]))

  let lower_points = nearby_values.filter(val => this_height >= val)
  if(lower_points.length > 0){
    return null
  } else {
    return this_height;
  }
}

var total = 0
var low_points = [];

for(let y = 0; y < height; y++){
  for(let x = 0; x < width; x++){
    var score = check_if_low_point(inputs, x,y);
    if(score != null){
      total += score + 1
      low_points.push([x,y])
    }
  }
}

function calculate_basin_size(points, low_point){
  var points_to_check = [ low_point ]
  var points_in_basin = [ ]

  while(points_to_check.length > 0){
    var new_points = [];
    points_to_check.forEach(point_to_check => {
      nearby_points(...point_to_check).forEach( nearby_point => {
        let height = points[nearby_point[1]][nearby_point[0]]
        
        if(height != 9 &&
           !points_in_basin.find(pt => pt[0] == nearby_point[0] && pt[1] == nearby_point[1]) &&
           !new_points.find(pt => pt[0] == nearby_point[0] && pt[1] == nearby_point[1])
           ){
          new_points.push(nearby_point);
        }
      })
      points_in_basin.push(point_to_check)
    })
    points_to_check = []
    new_points.forEach(new_point => points_to_check.push(new_point) )
  }
  return points_in_basin.length
}

let basin_sizes = low_points.map(low_point => calculate_basin_size(inputs, low_point)).sort((a,b) => b-a)
let answer = basin_sizes.slice(0,3).reduce((prev, cur) => prev * cur)
console.log(answer)