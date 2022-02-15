const fs = require('fs');
const _ = require('lodash');

const input_file = process.argv.slice(2, 3)[0];

let [starting_polymer, raw_insertion_rules] = fs.readFileSync(input_file, 'utf8')
  .trim()
  .split('\n\n')

let insertion_rules = new Map(raw_insertion_rules.split('\n')
  .map(line => line.split(' -> ')))

function step(polymer) {
  let i = 0;
  while (true) {
    if (i == polymer.length - 1) { break; }
    let pair = polymer.substring(i, i + 2);

    if (insertion_rules.has(pair)) {
      polymer = polymer.slice(0, i + 1) + insertion_rules.get(pair) + polymer.slice(i + 1);
      i += 2;
    } else {
      i += 1
    }
  }
  return polymer;
}

function count_elements(polymer) {
  let count = {};

  for (let i = 0; i < polymer.length; i++) {
    let c = polymer[i];
    if (!(c in count)) { count[c] = 0; }

    count[c] += 1
  }

  let sorted_count = Object.entries(count).sort((a, b) => a[1] - b[1]);

  let min = sorted_count[0][1];
  let max = sorted_count[sorted_count.length - 1][1];
  return max - min;
}

let polymer = starting_polymer;
for (let i = 0; i < 10; i++) {
  polymer = step(polymer);
  console.log(count_elements(polymer));
}