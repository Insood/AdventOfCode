import re
import sys
import numpy as np

offsets = {"nw": (-1,1), "ne": (0,1), "e": (1,0), "se": (1,-1), "sw": (0,-1), "w": (-1,0)}

def readfile(filename):
  with open(filename, "r") as f:
    lines = f.readlines()

  regex = re.compile("(nw|sw|w|se|ne|e)")
  instructions = []
  for line in lines:
    instructions.append(re.findall(regex, line))
  return instructions

class Grid:
  def __init__(self, shape):
    self.tiles = np.zeros(shape)
    self.center_x = int(shape[0]/2)
    self.center_y = int(shape[1]/2)

  def activate(self,instruction):
    cx, cy = self.center_x, self.center_y
    for step in instruction:
      dx, dy = offsets[step]
      cx += dx
      cy += dy

    self.tiles[cx,cy] = not self.tiles[cx,cy]

  def neighbors(self,x,y):
    black = 0
    for dx,dy in offsets.values():
      black += self.tiles[x+dx,y+dy]
    return black

  #Any black tile with zero or more than 2 black tiles immediately adjacent to it is flipped to white.
  #Any white tile with exactly 2 black tiles immediately adjacent to it is flipped to black.
  def flip(self):
    next_tiles = np.copy(self.tiles)
    for x in range(1,self.tiles.shape[0]-1):
      for y in range(1,self.tiles.shape[1]-1):
        b_neighbors = self.neighbors(x,y)
        if (next_tiles[x,y] == 0) and b_neighbors == 2:
          next_tiles[x,y] = 1
        elif (next_tiles[x,y] == 1) and (b_neighbors==0 or b_neighbors > 2):
          next_tiles[x,y] = 0
    self.tiles = next_tiles

  def count(self):
    return np.count_nonzero(self.tiles)

if __name__ == "__main__":
  if len(sys.argv) !=2 :
    print(f"Usage: {sys.argv[0]} <file>")
    sys.exit()
  filename = sys.argv[1]

  grid = Grid((500,500))
  instructions = readfile(filename)
  for instruction in instructions:
    grid.activate(instruction)

  for i in range(1,101):
    grid.flip()
    print(grid.count())