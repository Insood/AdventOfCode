import numpy as np
import copy
import pdb
import sys

TOP = 0
RIGHT = 1
BOTTOM = 2
LEFT = 3

def arr_to_integer(arr):
  return int("".join([str(c) for c in arr]),2)

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
    for tile in [self.data, np.flipud(self.data)]:
      for rotations in range(0,4):
        rotated = np.rot90(tile,rotations)
        self.permutations.append(self.edges(rotated))

  def edges(self, data):
    t = arr_to_integer(data[0])
    r = arr_to_integer(data[:,-1])
    b = arr_to_integer(data[-1])
    l = arr_to_integer(data[:,0])
    return [t,r,b,l]

  def shape(self):
    return self.data.shape

  def borderlessimage(self, permutation):
    permutation_ix = self.permutations.index(permutation)
    if permutation_ix < 4:
      data = np.rot90(self.data, permutation_ix)
    else:
      data = np.rot90(np.flipud(self.data), permutation_ix-4)

    borderless = data[1:-1,1:-1]
    return borderless

    #list2d = borderless.tolist()

    #output = ["".join([str(i) for i in row]).replace("0",".").replace("1","#") for row in list2d]
    #return output

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
    return tile_id_matrix, permutation_matrix

  for t in candidate_tiles:
    for p in t.permutations:
      fits = tile_fits(permutation_matrix, tile_id_matrix.shape, ix, p)
      if fits:
        new_candidate_tiles = copy.copy(candidate_tiles)

        row, col = np.unravel_index(ix,tile_id_matrix.shape)
        tile_id_matrix[row][col] = t.id
        permutation_matrix[row][col] = p
        new_candidate_tiles.remove(t)

        filled_tile_matrix, filled_permutation_matrix = fill_matrix(tile_id_matrix, permutation_matrix, ix+1, new_candidate_tiles)
        if filled_tile_matrix is not None:
          return filled_tile_matrix, filled_permutation_matrix
  return None, None

def load_tiles(filename):
  tiles = {}
  with open(filename) as f:
    raw_tiles = f.read().split("\n\n")

  for raw_tile in raw_tiles:
    tile = Tile(raw_tile)
    tiles[tile.id] = tile
  return tiles

def solve(tiles):
  tile_matrix_dim = int(np.sqrt(len(tiles)))

  empty_tile_id_matrix = np.zeros((tile_matrix_dim,tile_matrix_dim))
  empty_permutation_matrix = [[None for i in range(0,tile_matrix_dim)] for j in range(0,tile_matrix_dim)]
  tile_matrix = [tile for tile in tiles.values()]

  tile_id_matrix, permutation_matrix = fill_matrix(empty_tile_id_matrix, empty_permutation_matrix, 0, tile_matrix)
  sum = tile_id_matrix[0][0]*tile_id_matrix[-1][0]*tile_id_matrix[0][-1]*tile_id_matrix[-1][-1]

  return sum, tile_id_matrix, permutation_matrix

def build_image(tiles, tile_id_matrix, permutation_matrix):
  rows_of_tiles = int(np.sqrt(len(tiles)))
  pixels_per_tile = tiles[tile_id_matrix[0][0]].shape()[0] - 2 # All this work to get "8"
  image_shape = [rows_of_tiles*pixels_per_tile]*2

  image = np.zeros(image_shape)

  for row_index, tile_row in enumerate(tile_id_matrix):
    for col_index, tile_id in enumerate(tile_row):
      tile = tiles[tile_id]
      permutation = permutation_matrix[row_index][col_index]
      image_fragment = tile.borderlessimage(permutation)

      image[row_index*pixels_per_tile:(row_index+1)*pixels_per_tile,
            col_index*pixels_per_tile:(col_index+1)*pixels_per_tile] = image_fragment

  return image

if __name__ == "__main__":
  if len(sys.argv) !=2 :
    print(f"Usage: {sys.argv[0]} <tile data file>")
    sys.exit()

  filename = sys.argv[1]
  tiles = load_tiles(filename)
  sum, tile_id_matrix, permutation_matrix = solve(tiles)
  print(f"Part 1 solution: {sum}")
  img = build_image(tiles, tile_id_matrix, permutation_matrix)
  print(img)
  outfilename = f"{filename}.out"
  np.save(outfilename, img)