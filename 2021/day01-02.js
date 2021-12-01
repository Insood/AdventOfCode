const fs = require('fs')

var lines = [];

fs.readFile('day01.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  }

  let last = null;
  increasing_counter = 0;

  let values = data.split("\n").map(value => parseInt(value))
  
  for(var i = 0; i < values.length - 2; i++){
    let running_average = values.slice(i,i+3).reduce( (prev, current) => prev + current);
    if(last && running_average > last){ increasing_counter++ }
    last = running_average;
  }
  console.log(increasing_counter);
})
