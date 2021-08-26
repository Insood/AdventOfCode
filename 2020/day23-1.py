# The small crab challenges you to a game! The crab is going to mix up some cups, and you have to predict where they'll end up.
# The cups will be arranged in a circle and labeled clockwise (your puzzle input). For example, if your 
# labeling were 32415, there would be five cups in the circle; going clockwise around the circle from the first cup, 
# the cups would be labeled 3, 2, 4, 1, 5, and then back to 3 again.
# Before the crab starts, it will designate the first cup in your list as the current cup. The crab is then going to do 100 moves.
# Each move, the crab does the following actions:
# The crab picks up the three cups that are immediately clockwise of the current cup. They are removed
# from the circle; cup spacing is adjusted as necessary to maintain the circle.
# The crab selects a destination cup: the cup with a label equal to the current cup's label minus one.
# If this would select one of the cups that was just picked up, the crab will keep subtracting one until
# it finds a cup that wasn't just picked up. If at any point in this process the value goes below
# the lowest value on any cup's label, it wraps around to the highest value on any cup's label instead.
# The crab places the cups it just picked up so that they are immediately clockwise of the destination cup. They keep the same order as when they were picked up.
# The crab selects a new current cup: the cup which is immediately clockwise of the current cup.
# For example, suppose your cup labeling were 389125467. If the crab were to do merely 10 moves, the following changes would occur:

class Node:
  def __init__(self, value):
    self.value = value
    self.cw = None
    self.ccw = None

  def __str__(self):
    return f"Value: {self.value}, CCW: {self.ccw.value}, CW: {self.cw.value}"

def build_ring(values):
  nodes = []
  for c in values:
    n = Node(int(c))
    if len(nodes) > 0:
      nodes[-1].cw = n
      n.ccw = nodes[-1]
    nodes.append(n)

  n.cw = nodes[0]
  nodes[0].ccw = nodes[-1]
  return nodes

class Game:
  def __init__(self, first):
    self.current = first
    self.values = self.node_values()

  def node_values(self):
    node = self.current
    values = []
    while True:
      values.append(node.value)
      node = node.cw
      if node == self.current:
        break
    return values

  def __str__(self):
    node = self.current
    ix = 0

    output = []
    while True:
      if ix == 0:
        output.append(f"({node.value})")
      else:
        output.append(f"{node.value}")

      node = node.cw
      ix += 1

      if node == self.current:
        break
    
    return " ".join(output)

  def print_details(self):
    node = self.current
    while True:
      print(node)
      node = node.cw
      if node == self.current:
        break

  def unhook_three(self):
    nodes = []
    node = self.current.cw

    for i in range(0,3):
      nodes.append(node)
      node = node.cw

    self.current.cw = node
    node.ccw = self.current
    return nodes

  def node_with_value(self, target_value):
    node = self.current
    while True:
      if node.value == target_value:
        return node
      node = node.cw
      if node == self.current:
        return nil

  def find_destination(self, destination_value, unhooked_nodes):
    unreachable_destinations = [n.value for n in unhooked_nodes]
    while True:
      if destination_value < min(self.values):
        destination_value = max(self.values)

      if destination_value not in unreachable_destinations:
        return self.node_with_value(destination_value)

      destination_value -= 1

  def play_round(self):
    nodes = self.unhook_three()
    destination_node = self.find_destination(self.current.value - 1, nodes)
    next_node = destination_node.cw

    destination_node.cw = nodes[0]
    nodes[0].ccw = destination_node

    next_node.ccw = nodes[-1].ccw
    nodes[-1].cw = next_node

    self.current = self.current.cw

nodes = build_ring("784235916")
g = Game(nodes[0])

for i in range(0,100):
  g.play_round()

g.values