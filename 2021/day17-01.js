const fs = require('fs');
const { max } = require('lodash');
const _ = require('lodash');

const input_file = process.argv.slice(2, 3)[0];

let target = fs.readFileSync(input_file, 'utf8')
               .trim()
               .replace(/[a-z =:]*/g,'')
               .replace(/\../g,',')
               .split(',')
               .map(s => parseInt(s))

// target is [-x,+x,-y,+y]
function within_target(target, position) {
  return position[0] >= target[0] && position[0] <= target[1] && position[1] >= target[2] && position[1] <= target[3];
}

// Below target, no hope for recovery
function missed_target(target, position) {
  return position[1] < target[2];
}

function update(position, velocity) {
  let new_position = [position[0] + velocity[0], position[1] + velocity[1]];
  let new_velocity = [
                      velocity[0] - 1 > 0 ? velocity[0] -1 : 0,
                      velocity[1] - 1 
                     ];
  return [new_position, new_velocity];
}

function fire(target, velocity) {
  let current_position = [0,0];
  let current_velocity = velocity;
  let max_height = 0;
  let hit = false;

  while(true){
    let [new_position, new_velocity] = update(current_position, current_velocity);
    current_velocity = new_velocity;
    current_position = new_position;
    if(current_position[1] > max_height) { max_height = current_position[1]}

    if(missed_target(target, new_position)){ break; }
    if(within_target(target, new_position)){
      hit = true;
      break;
    }
  }
  return [hit, max_height];
}

function guess_velocity(target){
  let best_max_height = 0;
  let best_velocity = null;

  for(let vx = 0; vx < 200; vx += 1){
    for(let vy = 0; vy < 200; vy += 1){
      let [hit, height] = fire(target, [vx, vy]);
      if(hit && height > best_max_height) {
        best_max_height = height;
        best_velocity = [vx, vy];
      }
    }
  }
  return [best_velocity, best_max_height]
}

console.log(guess_velocity(target));