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

  def flip(self,instruction):
    cx, cy = self.center_x, self.center_y
    for step in instruction:
      dx, dy = offsets[step]
      cx += dx
      cy += dy

    self.tiles[cx,cy] = not self.tiles[cx,cy]

if __name__ == "__main__":
  if len(sys.argv) !=2 :
    print(f"Usage: {sys.argv[0]} <file>")
    sys.exit()
  filename = sys.argv[1]

  grid = Grid((50,50))
  instructions = readfile(filename)
  for instruction in instructions:
    grid.flip(instruction)

  print(np.count_nonzero(grid.tiles))