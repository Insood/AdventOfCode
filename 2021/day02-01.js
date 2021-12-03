const fs = require('fs')

const input_file = process.argv.slice(2,3)[0];

lines = fs.readFileSync(input_file, 'utf8')
          .trim()
          .split('\n')

let depth = 0;
let horizontal = 0;

lines.forEach(line => {
  let values = line.split(' ');
  let cmd = values[0];
  let dist = parseInt(values[1])

  if(cmd == "forward"){ horizontal += dist }
  else if (cmd == "up") { depth -= dist }
  else if (cmd == "down") { depth += dist }
});

console.log(depth, horizontal, depth*horizontal);