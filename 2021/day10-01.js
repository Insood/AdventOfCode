const { match } = require('assert');
const fs = require('fs');
const { syncBuiltinESMExports } = require('module');
const { openStdin } = require('process');

const input_file = process.argv.slice(2,3)[0];

let inputs = fs.readFileSync(input_file, 'utf8')
               .trim()
               .split('\n')


var openers = ['(', '{', '<', '[']
var closers = [')', '}', '>', ']']
var matchers = { '(': ')', '{':'}', '<':'>', '[':']'}
var point_values = { ')': 3, ']':57, '}':1197, '>':25137}

var current_line = [];
var stack = [];

function parse(line){
  tokens = line.split('');
  stack = [];

  while(tokens.length > 0){
    let token = tokens.shift();
    if(openers.includes(token)){
      stack.push(token);
    } else if (token == matchers[stack[stack.length-1]]){
      stack.pop()
    } else {
      return point_values[token];
    }
  }
  return 0;
}

let score = inputs.map(line => parse(line))
                  .reduce( (prev, cur) => prev + cur);

console.log(score);
