import re

class Bag:
  def __init__(self, color, colors):
    self.color = color
    
    # Hash of {bag_color: qty}
    self.colors = colors

class BagManager:
  def __init__(self):
    self.bags = {}

  def define_bag(self, name, colors):
    self.bags[name] = Bag(name, colors)

  def can_contain_top(self, target_color):
    self.valid_containers = {}
    self.target_color = target_color

    for bag_color in self.bags.keys():
      if bag_color != target_color:
        self.can_contain(0, bag_color)

    return self.valid_containers

  def can_contain(self, depth, bag_color):
    if bag_color == self.target_color:
      return True

    bag = self.bags[bag_color]

    can_contain_flag = False
    for color, qty in bag.colors.items():
      #print(f"{' '*depth}{bag_color}/{color}")

      if self.can_contain(depth+1, color):
        if bag_color in self.valid_containers:
          self.valid_containers[bag_color] += 1
        else:
          self.valid_containers[bag_color] = 1

        can_contain_flag = True
        #print(self.valid_containers)

    return can_contain_flag

with open("day7.txt") as f:
  lines = f.readlines()

bm = BagManager()

for line in lines:
  line = line.replace(".", "") # Get rid of useless period
  container, raw_contents = line.split(" contain ")
  contents = [c.strip() for c in raw_contents.split(",")]
  color = container.replace(" bags", "")

  colors = {}
  if contents[0] != 'no other bags':
    for content in contents:
      matches = re.match(r"(\d*)[ ](.*)", content)
      count = int(matches[1])
      sub_color = matches[2].replace(" bags","").replace(" bag","")
      colors[sub_color] = count
  
  bm.define_bag(color, colors)
  #print(color, colors)
  #print("#########")

#sprint("--------")

bm.can_contain_top("shiny gold")
print(len(bm.valid_containers))
