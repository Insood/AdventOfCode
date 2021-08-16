import numpy as np
import copy
import pdb

TOP = 0
RIGHT = 1
BOTTOM = 2
LEFT = 3

def arr_to_integer(arr):
  return int("".join([str(c) for c in arr]),2)

def flatten(t):
    return [item for sublist in t for item in sublist]

def visualize_permutations(permutations):
  permutations = flatten(permutations)
  for perm in permutations:
    if perm:
      print([str(bin(i)).replace('0b','').rjust(10,'0').replace('0','.').replace('1','#') for i in perm])

class Tile:
  def __init__(self, raw_tile):
    header, tile_string = raw_tile.split(":\n")
    self.process_header(header)
    self.process_tile_data(tile_string)
    self.calculate_permutations()
    
  def process_header(self, header):
    _, id_string = header.split(" ")
    self.id = int(id_string)

  def process_tile_data(self, tile_string):
    tile_lines = []
    for line in tile_string.replace("#","1").replace(".","0").split("\n"):
      tile_lines.append([int(c) for c in line])

    self.data = np.array(tile_lines)

  def calculate_permutations(self):
    self.permutations = []
    for tile in [self.data, np.fliplr(self.data), np.flipud(self.data)]:
      for rotations in range(0,4):
        rotated = np.rot90(tile,rotations)
        self.permutations.append(self.edges(rotated))

  def edges(self, data):
    t = arr_to_integer(data[0])
    r = arr_to_integer(data[:,-1])
    b = arr_to_integer(data[-1])
    l = arr_to_integer(data[:,0])
    return [t,r,b,l]

def tile_fits(matrix, shape, ix, tile):
  row, col = np.unravel_index(ix, shape)
  fits = True
  if (row-1 >= 0) and (matrix[row-1][col][BOTTOM] != tile[TOP]):
    fits = False

  if (col-1 >= 0) and (matrix[row][col-1][RIGHT] != tile[LEFT]):
    fits = False

  return fits

def fill_matrix(tile_id_matrix, permutation_matrix, ix, candidate_tiles):
  if len(candidate_tiles) == 0:
    print("Solution found!")
    print(tile_id_matrix)
    print(permutation_matrix)
    return True

  for t in candidate_tiles:
    for p in t.permutations:
      fits = tile_fits(permutation_matrix, tile_id_matrix.shape, ix, p)
      if fits:
        new_tile_id_matrix = copy.deepcopy(tile_id_matrix)
        new_permutation_matrix = copy.deepcopy(permutation_matrix)
        new_candidate_tiles = copy.copy(candidate_tiles)

        row, col = np.unravel_index(ix,tile_id_matrix.shape)
        new_tile_id_matrix[row][col] = t.id
        new_permutation_matrix[row][col] = p
        new_candidate_tiles.remove(t)

        if fill_matrix(new_tile_id_matrix, new_permutation_matrix, ix+1, new_candidate_tiles):
          return True

tiles = []
with open("day20.txt") as f:
  raw_tiles = f.read().split("\n\n")
  for raw_tile in raw_tiles:
    tiles.append(Tile(raw_tile))

permutation_matrix = []

dim = int(np.sqrt(len(tiles)))
tile_id_matrix = np.zeros((dim,dim))
for rows in range(0,dim):
  permutation_matrix.append([None]*dim)

fill_matrix(tile_id_matrix, permutation_matrix, 0, tiles)