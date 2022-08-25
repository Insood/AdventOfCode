const fs = require('fs');

const min_x = -50;
const max_x = 50;
const min_y = -50;
const max_y = 50;
const min_z = -50;
const max_z = 50;
const x_space = (max_x - min_x + 1)
const y_space = (max_y - min_y + 1)
const z_space = (max_z - min_z + 1)

const size = x_space*y_space*z_space;

const space = Array(size);

const input_file = process.argv.slice(2, 3)[0];
let instructions = fs.readFileSync(input_file, 'utf8')
                     .trim()
                     .split(/\r?\n/)
                     .map(line => {
                       return line
                        .replace(/(\.\.)/g, " ")
                        .replace("on", "1")
                        .replace("off", "0")
                        .replace("x=", "")
                        .replace(",y="," ")
                        .replace(",z="," ")
                        .split(" ")
                        .map(v => parseInt(v))
                     })

function coord_to_index(x,y,z){
  return (x - min_x) + 
    (y - min_y) * y_space +
    (z - min_z) * y_space*x_space;
}

instructions.forEach(instructions => {
  let new_setting = instructions[0];
  if(instructions[1] < min_x ||
     instructions[2] > max_x ||
     instructions[3] < min_y ||
     instructions[4] > max_y ||
     instructions[5] < min_z ||
     instructions[6] > max_z){ return; }

  for(let x = instructions[1]; x <= instructions[2]; x++){
    for(let y = instructions[3]; y <= instructions[4]; y++){
      for(let z = instructions[5]; z <= instructions[6]; z++){
        space[coord_to_index(x,y,z)] = new_setting;
      }
    }
  }
})


console.log(space.reduce((prev, cur) => prev + cur))