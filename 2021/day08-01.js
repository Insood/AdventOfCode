const fs = require('fs');

const input_file = process.argv.slice(2,3)[0];

let inputs = fs.readFileSync(input_file, 'utf8')
               .trim()
               .split('\n')
               .map( line => line.split('|').map(values => values.trim().split(' ')))

var simple_outputs = 0;
var digits = [2, 4, 3, 7]; // 1 4 7 8 respectively

inputs.forEach( line => {
  let outputs = line[1]
  outputs.forEach(output => {
    if(digits.includes(output.length)){ simple_outputs +=1 }
  });
});

console.log(simple_outputs);