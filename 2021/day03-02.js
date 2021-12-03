const fs = require('fs')

const input_file = process.argv.slice(2,3)[0];

let values = fs.readFileSync(input_file, 'utf8')
               .trim()
               .split('\n')
               .map(line => line.split('').map(c => parseInt(c)));

const bits_per_line = values[0].length;

function calculate_counts(values){
  const counts = Array(bits_per_line).fill(0);
  values.forEach(value => {
    value.forEach( (bit, ix) => {
      if(bit > 0){ counts[ix]+= 1 }
    })
  });
  return counts;
}

// deep copy array
var oxygen = JSON.parse(JSON.stringify(values));
var co2 = JSON.parse(JSON.stringify(values));

console.log(oxygen);

for(var bit_ix = 0; bit_ix < bits_per_line; bit_ix++){
  if( oxygen.length > 1)
  {
    let oxygen_counts = calculate_counts(oxygen);
    oxygen_keep_value = (oxygen_counts[bit_ix] >= oxygen.length/2) ? 1 : 0
    oxygen = oxygen.filter(value => value[bit_ix] == oxygen_keep_value)
  }

  if( co2.length > 1 )
  {
    let co2_counts = calculate_counts(co2);
    co2_keep_value = (co2.length - co2_counts[bit_ix] <= co2.length/2) ? 0 : 1
    co2 = co2.filter(value => value[bit_ix] == co2_keep_value)
  }
}

console.log(oxygen);
console.log(co2); 

const a = parseInt(oxygen[0].join(''),2);
const b = parseInt(co2[0].join(''),2)
console.log(a*b);
