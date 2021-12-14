const fs = require('fs');

const input_file = process.argv.slice(2,3)[0];

let inputs = fs.readFileSync(input_file, 'utf8')
               .trim()
               .split('\n')
               .map( line => line.split('|').map(values => values.trim().split(' ')))

function find_and_pop(arr, f){
  let ix = arr.findIndex(f)
  let value = arr[ix];
  arr.splice(ix, 1)
  return value;
}

function match_segments(a,b, segments){
  let count = 0;
  for(let c of a){
    if(b.includes(c)){ count+= 1}
  }
  return count == segments;
}

function decipher_signals(signals) {
  let digits = {};

  digits[1] = find_and_pop(signals, signal => signal.length == 2)
  digits[4] = find_and_pop(signals, signal => signal.length == 4)
  digits[7] = find_and_pop(signals, signal => signal.length == 3)
  digits[8] = find_and_pop(signals, signal => signal.length == 7)
  digits[3] = find_and_pop(signals, signal => signal.length == 5 && match_segments(signal, digits[7],3))
  digits[9] = find_and_pop(signals, signal => signal.length == 6 && match_segments(signal, digits[3],5))
  digits[0] = find_and_pop(signals, signal => signal.length == 6 && match_segments(signal, digits[1],2))
  digits[6] = find_and_pop(signals, signal => signal.length == 6)
  digits[5] = find_and_pop(signals, signal => signal.length == 5 && match_segments(signal, digits[6],5))
  digits[2] = signals[0]

  let key = {};
  for(let k in Object.keys(digits)){
    let value = digits[k].split('').sort().join('')
    key[value] = k;
  }

  return key;
}

function decipher_outputs(outputs, key) {
  let deciphered_output = parseInt(outputs.map( output => key[output] ).join(''))
  return deciphered_output;
}

var sum = 0;
inputs.forEach( line => {
  let signals = line[0]
  let outputs = line[1].map( output => output.split('').sort().join('') ) // # sort segments

  let key = decipher_signals(signals)
  let output= decipher_outputs(outputs, key)
  sum += output;
});

console.log(sum)