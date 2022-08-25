const fs = require('fs');

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

const minx = 0;
const maxx = 1;
const miny = 2;
const maxy = 3;
const minz = 4;
const maxz = 5;

let global_extents = {};

instructions.forEach(instructions => {
  let cube = instructions.slice(1);

  if(!global_extents[minx] || cube[minx] < global_extents[minx]){ global_extents[minx] = cube[minx] };
  if(!global_extents[maxx] || cube[maxx] > global_extents[maxx]){ global_extents[maxx] = cube[maxx] };

  if(!global_extents[miny] || cube[miny] < global_extents[miny]){ global_extents[miny] = cube[miny] };
  if(!global_extents[maxy] || cube[maxy] > global_extents[maxy]){ global_extents[maxy] = cube[maxy] };

  if(!global_extents[minz] || cube[minz] < global_extents[minz]){ global_extents[minz] = cube[minz] };
  if(!global_extents[maxz] || cube[maxz] > global_extents[maxz]){ global_extents[maxz] = cube[maxz] };
})

console.log(global_extents);
let on_counter =0;

for(let x = global_extents[minx]; x <= global_extents[maxx]; x++){
  console.log(x);
  let x_filtered_cubes = instructions.filter(instruction => (x >= instruction[1]) && (x <= instruction[2]));

  if(x_filtered_cubes.length == 0){ continue; }
  if(x_filtered_cubes.length == 1){
    let cube = x_filtered_cubes[0];
    on_counter += (cube[4] - cube[3]+1) * (cube[6] - cube[5] + 1);
    continue;
  }

  for(let y = global_extents[miny]; y <= global_extents[maxy]; y++){
    let xy_filtered_cubes = x_filtered_cubes.filter(instruction => (y >= instruction[3]) && (y <= instruction[4]));
    if(xy_filtered_cubes.length == 0){ continue; }
    if(xy_filtered_cubes.length == 1){
      let cube = xy_filtered_cubes[0];
      on_counter += (cube[6] - cube[5] + 1);
      continue;
    }

    for(let z = global_extents[minz]; z <= global_extents[maxz]; z++){
      let state = 0;

      for(let i = 0 ; i < xy_filtered_cubes.length; i++){
        xy_filtered_cubes.forEach(instruction => {
          if((z >= instruction[5]) && (z <= instruction[6])){
            state = instruction[0];
          }
        })
      }
      on_counter += state;
    }
  }
}

console.log(on_counter);