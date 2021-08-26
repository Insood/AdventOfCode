import pdb
#Due to what you can only assume is a mistranslation (you're not exactly fluent in Crab), 
#you are quite surprised when the crab starts arranging many cups in a circle on your 
#raft - one million (1000000) in total.

#Your labeling is still correct for the first few cups; after that, the remaining cups
#are just numbered in an increasing fashion starting from the number after the 
#highest number in your list and proceeding one by one until one million is 
#reached. (For example, if your labeling were 54321, the cups would be numbered 
#5, 4, 3, 2, 1, and then start counting up from 6 until one million is reached.) 
#In this way, every number from one through one million is used exactly once.
#After discovering where you made the mistake in translating Crab Numbers, you realize
# the small crab isn't going to do merely 100 moves; the crab is going to do ten
# million (10000000) moves!

#The crab is going to hide your stars - one each - under the two cups that will end up
#immediately clockwise of cup 1. You can have them if you predict what the labels 
#on those cups will be when the crab is finished.
#In the above example (389125467), this would be 934001 and then 159792; multiplying
#these together produces 149245887792.
#Determine which two cups will end up immediately clockwise of cup 1.
#What do you get if you multiply their labels together?

class Node:
  def __init__(self, value):
    self.value = value
    self.cw = None
    self.ccw = None

  def __str__(self):
    return f"Value: {self.value}, CCW: {self.ccw.value}, CW: {self.cw.value}"

def build_ring(values, min, max):
  values = [int(c) for c in values] + [i for i in range(min,max)]

  nodes = {}
  prev_node = None
  first_node = None

  for v in values:
    n = Node(v)
    if prev_node:
      prev_node.cw = n
      n.ccw = prev_node
    else:
      first_node = n

    prev_node = n
    nodes[v] = n

  first_node.ccw = prev_node
  prev_node.cw = first_node
  return nodes

class Game:
  def __init__(self, nodes, start_node):
    self.nodes = nodes
    self.current = start_node
    self.min_value = min([nk for nk in self.nodes.keys()])
    self.max_value = max([nk for nk in self.nodes.keys()])

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

  def print_some(self):
    nodes = []
    node = self.current
    for _ in range(0,30):
      nodes.append(str(node.value))
      node = node.cw
    print(" ".join(nodes))

  def unhook_three(self):
    nodes = []
    node = self.current.cw

    for i in range(0,3):
      nodes.append(node)
      node = node.cw

    self.current.cw = node
    node.ccw = self.current
    return nodes

  def find_destination(self, destination_value, unhooked_nodes):
    unreachable_destinations = [n.value for n in unhooked_nodes]
    while True:
      if destination_value < self.min_value:
        destination_value = self.max_value

      if destination_value not in unreachable_destinations:
        return self.nodes[destination_value]

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

pattern = "784235916"
nodes = build_ring(pattern, 10, 1000001)
start_node = nodes[int(pattern[0])]

g = Game(nodes, start_node)
for i in range(0,10000000):
  if i % 100000 == 0:
    print(".", end="", flush=True)
  g.play_round()
  #g.print_some()

n2 = g.nodes[1].cw
n3 = n2.cw
n2v, n3v = n2.value, n3.value
print(f"{n2v} {n3v} = {n2v*n3v}")