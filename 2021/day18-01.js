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

function eq(a,b){
  if(a.length != b.length) { return false; }

  for(let i = 0; i < a.length; i++){
    if(a[i].value != b[i].value || a[i].depth != b[i].depth){
      return false;
    }
  }
  return true;
}

function math_test(){
  function explode_test(a,b){
    let number = parse(a);
    snail_explode(number);
    console.assert(eq(number, parse(b)))
  }

  function add_test(a,b,c){
    console.assert(eq(snail_add(parse(a), parse(b)), parse(c)));
  }

  function magnitude_test(a,b){
    console.assert(snail_magnitude(parse(a)) == b);
  }

  explode_test('[[[[[9,8],1],2],3],4]', '[[[[0,9],2],3],4]');
  explode_test('[7,[6,[5,[4,[3,2]]]]]', '[7,[6,[5,[7,0]]]]');
  explode_test('[[6,[5,[4,[3,2]]]],1]', '[[6,[5,[7,0]]],3]');
  explode_test('[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]', '[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]')
  explode_test('[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]', '[[3,[2,[8,0]]],[9,[5,[7,0]]]]')

  add_test(
    '[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]',
    '[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]',
    '[[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]'
  )

  magnitude_test('[[1,2],[[3,4],5]]', 143)
  magnitude_test('[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]', 3488)
}

math_test();

function solve(numbers){
  let sum = null;

  while(numbers.length > 0){
    if(sum) {
      let n = numbers.shift();
      sum = snail_add(sum,n);
    } else {
      sum = numbers.shift()
    }
  }
  console.log(snail_magnitude(sum))
}

const input_file = process.argv.slice(2, 3)[0];

let numbers = fs.readFileSync(input_file, 'utf8')
                .trim()
                .split('\n')
                .map(line => parse(line))

solve(numbers);