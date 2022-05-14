const { timeStamp } = require('console');
const fs = require('fs');
const { reduce } = require('lodash');

class Digit {
  constructor(value, depth){
    this.value = value;
    this.depth = depth;
  }
}

function parse(line){
  let values = [];
  let depth = 0;

  for(let i =0; i < line.length; i++){
    c = line[i];
    if(c == '['){
      depth += 1;
    } else if ( c == ']'){
      depth -=1 ;
    } else if (c == ','){
      continue;
    } else {
      values.push(new Digit(parseInt(c), depth));
    }
  }
  return values;
}

function snail_add(a,b){
  a.forEach(digit => digit.depth += 1);
  b.forEach(digit => digit.depth += 1);
  let c = a.concat(b);
  snail_reduce(c)
  return c;
}

function snail_explode(number){
  for(let i = 0; i < number.length; i++){
    let digit = number[i];

    if(digit.depth == 5){
      // Handle left side
      if(i != 0) {
        number[i-1].value += digit.value;
      }

      // Handle right side
      if ( i < number.length - 2){
        number[i+2].value += number[i+1].value
      }

      number.splice(i+1,1);
      digit.value = 0;
      digit.depth -=1;
      return true;
    }
  }
  return false;
}

function snail_split(number){
  for( let i =0; i < number.length; i++){
    if(number[i].value >= 10){
      let left = Math.floor(number[i].value / 2);
      let right = Math.ceil(number[i].value / 2);

      number.splice(i,1, new Digit(left,  number[i].depth+1), new Digit(right, number[i].depth+1));
      return true;
    }
  }
  return false;
}

function snail_reduce(number){
  while(true){
    let exploded = snail_explode(number);
    if(exploded){ continue }

    let split = snail_split(number);
    if(!split){ break }
  }
}

function snail_magnitude(number){
  for(let depth = 5; depth > 0; depth--){
    for(let i = 0; i < number.length; i++){
      if( number[i].depth == depth){
        let left = 3 * number[i].value
        let right = 2 * number[i+1].value
        number.splice(i, 2, new Digit(left + right, depth - 1))
      }
    }
  }

  return number[0].value;
}

const input_file = process.argv.slice(2, 3)[0];

let numbers = fs.readFileSync(input_file, 'utf8')
                .trim()
                .split('\n')
                .map(line => parse(line))


let highest_magnitude = 0;

for(let i =0; i < numbers.length; i++){
  for(let j = 0; j < numbers.length; j++){
    if(i == j) { continue; }
    let a = JSON.parse(JSON.stringify(numbers[i]))
    let b = JSON.parse(JSON.stringify(numbers[j]))

    let n = snail_add(a,b)
    let m = snail_magnitude(n);
    if(m > highest_magnitude) { highest_magnitude = m};
  }
}

console.log(highest_magnitude)