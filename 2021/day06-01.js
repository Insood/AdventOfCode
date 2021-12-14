const fs = require('fs');

const input_file = process.argv.slice(2,3)[0];

let fishes = fs.readFileSync(input_file, 'utf8')
               .trim()
               .split(',')
               .map( values => parseInt(values))

for(var dayix = 0; dayix < 80; dayix++){
  let fish_counter = fishes.length

  for(var fishix = 0; fishix < fish_counter; fishix++){
    if(fishes[fishix] == 0){
      fishes[fishix] = 6;
      fishes.push(8)
    } else {
      fishes[fishix] -= 1
    }
  }
  //console.log(fishes)
}

console.log(fishes.length)