class Floor:
  def __init__(self, layout):
    self.layout = layout
    self.width = len(self.layout[0])
    self.height = len(self.layout)

  def occupied_at(self,x,y):
    if (x < 0) or (x>=self.width) or (y<0) or (y>=self.height):
      return False
    
    if self.at(x,y) == "#":
      #print(self.at(x,y))
      return True
    else:
      return False

  def count_adjacent(self, x,y):
    adjacent = 0
    for x_offset in [-1,0,1]:
      for y_offset in [-1,0,1]:
        if x_offset == 0 and y_offset == 0:
          continue
        if self.occupied_at(x+x_offset, y+y_offset):
          adjacent += 1

    return adjacent

  def at(self, x,y):
    return self.layout[y][x]

  def step(self):
    new_layout = []
    for y in range(0, self.height):
      row = ""
      for x in range(0,self.width):  
        if self.at(x,y) == ".":
          row += "."
          continue
        
        if not self.occupied_at(x,y) and self.count_adjacent(x,y) == 0:
          row += "#"
        elif self.occupied_at(x,y) and self.count_adjacent(x,y) >= 4:
          row += "L"
        else:
          row += self.at(x,y)
      new_layout.append(row)
    self.layout = new_layout

  def count_occupied(self):
    counter = 0
    for x in range(0,self.width):
      for y in range(0,self.height):
        if self.occupied_at(x,y):
          counter += 1
    return counter

  def __repr__(self):
    return "\n".join(self.layout)

with open("day11.txt") as f:
  layout = f.readlines()
  layout = [ row.replace("\n","") for row in layout ]

f = Floor(layout)
print(f)

for x in range(0,500):
  print("--------\n\n--------")
  f.step()
  #print(f)
  print(f.count_occupied())