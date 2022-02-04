const colors = require('colors');
const fs = require('fs');

const input_file = process.argv.slice(2, 3)[0];

let edges = fs.readFileSync(input_file, 'utf8')
  .trim()
  .split('\n')
  .map(line => line.split('-'))

class Node {
  constructor(name) {
    this.name = name;
    this.links = [];
  }

  can_visit() {
    return this.name != 'start'
  }

  terminal() {
    return this.name == 'end'
  }

  is_small_cave() {
    return this.name.toLowerCase() == this.name;
  }
}

var nodes = {}

function build(edge) {
  let start = edge[0]
  let end = edge[1]
  if (!(start in nodes)) { nodes[start] = new Node(start) }
  if (!(end in nodes)) { nodes[end] = new Node(end) }
  nodes[start].links.push(nodes[end])
  nodes[end].links.push(nodes[start])
}

edges.map(edge => build(edge))

var routes = [];

function traverse(current_node, history, depth = 0) {
  let local_history = JSON.parse(JSON.stringify(history))
  local_history.push(current_node.name);

  if (current_node.terminal()) {
    routes.push(local_history);
    return
  }

  current_node.links.forEach(next_node => {
    // Cannot return to start node
    if (!next_node.can_visit()) { return }

    // Cannot visit a small cave (lower case letter) twice
    if (next_node.is_small_cave() && local_history.includes(next_node.name)) { return }

    traverse(next_node, local_history, depth + 1);
  });

}

let start_node = nodes["start"];
traverse(start_node, []);
console.log(routes.length);