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

  def flat_quantity(self, bag_color, depth=0):
    bag = self.bags[bag_color]
    if len(bag.colors) == 0:
      return 0

    total_qty = 0
    for color, qty in bag.colors.items():
      print(f"{' '*depth}- {color}({qty})")
      total_qty += qty
      inner_qty = self.flat_quantity(color, depth + 1) * qty
      print(inner_qty)
      total_qty += inner_qty
      print(total_qty)

    return total_qty

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

print(bm.flat_quantity("shiny gold"))

