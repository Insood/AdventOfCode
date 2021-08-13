import numpy as np
import pdb

def arr_to_integer(arr):
  return int("".join([str(c) for c in arr]),2)

def arr_reversed_to_integer(arr):
  pass

class Tile:
  def __init__(self, raw_tile):
    header, tile_string = raw_tile.split(":\n")
    self.process_header(header)
    self.process_tile_data(tile_string)
    self.build_sides()
    
  def process_header(self, header):
    _, id_string = header.split(" ")
    self.id = int(id_string)

  def process_tile_data(self, tile_string):
    tile_lines = []
    for line in tile_string.replace("#","1").replace(".","0").split("\n"):
      tile_lines.append([int(c) for c in line])

    self.data = np.array(tile_lines)

  def build_sides(self):
    t = arr_to_integer(self.data[0])
    r = arr_to_integer(self.data[:,-1])
    l = arr_to_integer(self.data[:,0])
    b = arr_to_integer(self.data[-1])

    # Reversed
    tr
    rr
    l
    b



tiles = []
with open("day20-1-sample.txt") as f:
  raw_tiles = f.read().split("\n\n")
  for raw_tile in raw_tiles:
    tiles.append(Tile(raw_tile))

print(tiles)
pdb.set_trace()