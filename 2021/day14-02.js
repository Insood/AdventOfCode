const fs = require('fs');
const _ = require('lodash');
const { start } = require('repl');

const input_file = process.argv.slice(2, 3)[0];

let [starting_polymer, raw_insertion_rules] = fs.readFileSync(input_file, 'utf8')
  .trim()
  .split('\n\n')

let insertion_rules = new Map(raw_insertion_rules.split('\n')
  .map(line => line.split(' -> ')))

function build_pairs(polymer) {
  let pairs = {};

  for (let i = 0; i < polymer.length - 1; i++) {
    let pair = polymer.substring(i, i + 2);
    if (!(pair in pairs)) {
      pairs[pair] = 0;
    }

    pairs[pair] += 1
  }
  return pairs;
}

function step(pairs) {
  let new_pairs = {};
  let pairs_to_delete = [];

  Object.keys(pairs).forEach(pair => {
    if (insertion_rules.has(pair)) {
      let element = insertion_rules.get(pair);
      let count = pairs[pair];

      let [left, right] = pair.split('');

      let leftpair = left + element;
      let rightpair = element + right;

      if (!(leftpair in new_pairs)) { new_pairs[leftpair] = 0 }
      if (!(rightpair in new_pairs)) { new_pairs[rightpair] = 0 }

      new_pairs[leftpair] += count;
      new_pairs[rightpair] += count;

      pairs_to_delete.push(pair);
    }
  });

  pairs_to_delete.forEach(pair => delete pairs[pair])

  for (pair in new_pairs) {
    pairs[pair] = new_pairs[pair];
  }
  return pairs;
}

function score(pairs, starting_polymer) {
  let elements = {}
  for (pair in pairs) {
    let count = pairs[pair];

    if (!(pair[0] in elements)) { elements[pair[0]] = 0 }
    elements[pair[0]] += count;
  }

  // We are only counting the appearance of the first element in each pair.
  // IE: ABC -> AB BC. Counts: A= 1, B=1. Need to adjust it by adding the last element
  elements[starting_polymer[starting_polymer.length - 1]] += 1

  let sorted_count = Object.entries(elements).sort((a, b) => a[1] - b[1]);

  let min = sorted_count[0][1];
  let max = sorted_count[sorted_count.length - 1][1];
  return max - min;
}

let pairs = build_pairs(starting_polymer);

for (let i = 0; i < 10; i++) {
  pairs = step(pairs);
  console.log(score(pairs, starting_polymer))
}