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

  can_visit(history) {
    if (this.name == 'start') { return false }
    if (!this.is_small_cave()) { return true; }

    let visited = []
    history.slice(1).forEach(node_name => {
      if (node_name.toLowerCase() == node_name) {
        visited[node_name] = (visited[node_name] || 0) + 1
      }
    })

    let this_visit_count = visited[this.name] || 0;

    // We can visit a small cave twice under these circumstances:
    //   * No other small cave has been visited twice
    //   * We haven't visited this cave twice

    delete visited[this.name]
    let other_small_cave_multiple_visits = Object.values(visited).some(visit_counter => visit_counter > 1)
    return (!other_small_cave_multiple_visits && this_visit_count < 2) || (other_small_cave_multiple_visits && this_visit_count == 0)
  }

  terminal() {
    return this.name == 'end'
  }

  is_small_cave() {
    return !this.terminal() && this.name.toLowerCase() == this.name;
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
    if (!next_node.can_visit(local_history)) { return }

    traverse(next_node, local_history, depth + 1);
  });

}

let start_node = nodes["start"];
traverse(start_node, []);
console.log(routes.length);