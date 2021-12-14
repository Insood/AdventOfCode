const fs = require('fs');

const input_file = process.argv.slice(2,3)[0];

let inputs = fs.readFileSync(input_file, 'utf8')
               .trim()
               .split(',')
               .map( values => parseInt(values))
let min = Math.min(...inputs)
let max = Math.max(...inputs)

var best_fuel_cost = max*max*inputs.length;
var best_position = null;

function fuel_cost(pos, inputs){
  var fuel = 0;
  inputs.forEach(input => {
   let dist = Math.abs(pos-input)
   if(dist > 0 ){
    fuel += dist*0.5*(1+dist)
   }
  })
  return fuel;
}

for(var i = min; i < max; i++){
  var fuel = fuel_cost(i, inputs)
  if(fuel < best_fuel_cost)
  {
    best_fuel_cost = fuel;
    best_position = i;
  }
}

console.log(best_fuel_cost);
console.log(best_position);