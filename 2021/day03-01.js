const fs = require('fs')

const input_file = process.argv.slice(2,3)[0];

let values = fs.readFileSync(input_file, 'utf8')
               .trim()
               .split('\n')
               .map(line => line.split('').map(c => parseInt(c)));

const readings = values.length;
const bits_per_line = values[0].length;
const counts = Array(bits_per_line).fill(0);

values.forEach(value => {
  value.forEach( (bit, ix) => {
    if(bit > 0){ counts[ix]+= 1 }
  })
});

const gamma = Array(bits_per_line).fill(0)
const epsilon = Array(bits_per_line).fill(0)

counts.forEach( (count, ix) => {
  if(count > readings-count) {
    gamma[ix] = 1;
  } else {
    epsilon[ix] = 1;
  }
});

console.log(gamma);
console.log(epsilon);

const g = parseInt(gamma.join(''),2);
const e = parseInt(epsilon.join(''),2)
console.log(e*g);
