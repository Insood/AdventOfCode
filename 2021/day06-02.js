const fs = require('fs');

const input_file = process.argv.slice(2,3)[0];

let inputs = fs.readFileSync(input_file, 'utf8')
               .trim()
               .split(',')
               .map( values => parseInt(values))

var fishes = {}
for(var i = 0; i < 9; i++){ fishes[i] = 0}

inputs.forEach(input => { fishes[input] +=1 } )

for(var dayix = 0; dayix < 256; dayix++){
  let new_fish = 0

  for(var i = 0; i < 9; i++){
    if(i == 0){
      new_fish = fishes[0]
      fishes[0] = 0
    } else {
      fishes[i-1] = fishes[i]
      fishes[i] = 0
    }
  }

  fishes[6] += new_fish
  fishes[8] += new_fish
}

let total_fish = Object.values(fishes).reduce( (prev,cur) => prev + cur)
console.log(total_fish)
