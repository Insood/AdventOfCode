const fs = require('fs');

function read_input(register){
  const input = inputs.shift();
  registers[register] = parseInt(input);
}

function parse_value(str) {
  let v = parseInt(str);
  return isNaN(v) ? registers[str] : v;
}

function add(register, value){
  registers[register] += parse_value(value);
}

function multiply(register, value) {
  registers[register] *= parse_value(value);
}

function divide(register, value) {
  registers[register] = parseInt(registers[register] / parse_value(value));
}

function modulo(register, value) {
  registers[register] = registers[register] % parse_value(value);
}

function equal(register_a, value) {
  let v = parseInt(value);
  let compare_value = isNaN(v) ? registers[value] : v;

  registers[register_a] = registers[register_a] == compare_value ? 1 : 0;
}

function process_instruction(instruction) {
  const args = instruction.split(' ');
  // console.log(instruction);
  if(args[0] == 'inp') {
    read_input(args[1]);
  } else if(args[0] == 'add') {
    add(args[1], args[2]);
  } else if(args[0] == 'mul') {
    multiply(args[1], args[2]);
  } else if(args[0] == 'div'){
    divide(args[1], args[2]);
  } else if (args[0] == 'mod'){
    modulo(args[1], args[2]);
  } else if (args[0] == 'eql') {
    equal(args[1], args[2]);
  }
  // console.log(registers);
}

let registers = { w: 0, x: 0, y: 0, z: 0 }
let inputs = [];
// const [program_file, input] = process.argv.slice(2, 4)
// const inputs = input.split('');

const program_file = process.argv.slice(2, 3)[0];
const instructions = fs.readFileSync(program_file, 'utf8').trim().split('\n')

for(let i = 99999999999999; i >= 11111111111111; i -= 1) {
  // console.log(i);
  inputs = String(i).split('');

  // Cannot process any input that contains a 0
  if(inputs.some(digit => digit == '0')) { continue; }

  registers = { w: 0, x: 0, y: 0, z: 0 } // Reset registers

  instructions.forEach(process_instruction);

  if(registers['z'] == 0) {
    console.log(`${i} is valid!`);
    break;
  }
}
