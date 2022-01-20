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
var point_values = { '(': 1, '[':2, '{':3, '<':4}

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
      return 0;
    }
  }
  
  var completion_score = 0;
  while(stack.length > 0){
    completion_score *= 5;
    completion_score += point_values[stack.pop()];
  }
  return completion_score;
}

let scores = inputs.map(line => parse(line))
                   .filter(i => i > 0)
                   .sort((a,b) => b-a)

console.log(scores[parseInt(scores.length/2)])
