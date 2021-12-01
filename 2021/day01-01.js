const fs = require('fs')

var lines = [];

fs.readFile('day01.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  }

  let last = null;
  increasing_counter = 0;

  data.split("\n").forEach( (value) => {
    value = parseInt(value)
    if(last != null && value > last) { increasing_counter++; }
    last = value;
  })
  console.log(increasing_counter);
})

