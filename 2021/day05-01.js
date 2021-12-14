const fs = require('fs');

const input_file = process.argv.slice(2,3)[0];

let inputs = fs.readFileSync(input_file, 'utf8')
               .trim()
               .split('\n')
               .map( line => {
                 return line.split('->').map(coords => {
                   return coords.split(',').map(coord => {
                     return parseInt(coord)
                   })
                  })
                })

function values_between(a,b){
  let values = []
  // WTF sorting is done alphanumerically..?!
  let [min,max] = [a,b].sort( (c,d) => c -d )
  while(min<=max){
    values.push(min);
    min += 1
  }
  return values
}

let matrix = {}

function points(p1, p2){
  let points = [];

  if(p1[0] == p2[0]){ // Same X, so vertical line
    values_between(p1[1],p2[1]).forEach( y => points.push([p1[0], y]) )
  }
  else if(p1[1] == p2[1]){
    values_between(p1[0],p2[0]).forEach( x => points.push([x, p1[1]]) )
  }

  return points;
}

function draw_line(matrix, line_coords){
  let p1 = line_coords[0]
  let p2 = line_coords[1]

  start = Object.keys(matrix).length

  points(p1, p2).forEach( point => {
    if(point in matrix){
      matrix[point] += 1
    } else {
      matrix[point] = 1
    }
  })
}

inputs.forEach(coords => draw_line(matrix, coords))
intersections = Object.values(matrix)
                      .map(value => value > 1 ? 1 : 0)
                      .reduce( (prev, current) => prev + current )

console.log(intersections)