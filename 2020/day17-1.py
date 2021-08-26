import numpy as np
import pdb

class ConwayCube:
  def __init__(self, shape3):
    # Z, X, Y
    self.arr = np.zeros(shape3, dtype=bool)

  def center_z(self):
    z, x, y= self.arr.shape
    return int(z/2)

  def set_initial(self, slice):
    z = self.center_z()
    slice_x, slice_y = slice.shape
    _, matrix_x, matrix_y = self.arr.shape

    x = int(matrix_x/2 - slice_x/2)
    y = int(matrix_y/2 - slice_y/2)

    self.arr[self.center_z()][x:x+slice_x, y:y+slice_y] = slice

  def count_active(self):
    return np.count_nonzero(self.arr)

  def neighbors(self,z,x,y):
    count = 0
    for dz in [-1,0,1]:
      for dy in [-1,0,1]:
        for dx in [-1,0,1]:
          if dz == 0 and dy == 0 and dx == 0:
            continue

          if self.arr[z+dz][x+dx][y+dy]:
            count += 1
    return count

  def count_neighbors(self):
    neighbor_count = np.zeros(self.arr.shape)
    for z in range(1, self.arr.shape[0]-1):
      for x in range(1, self.arr.shape[1]-1):
        for y in range(1, self.arr.shape[2]-1):
          neighbor_count[z][x][y] = self.neighbors(z,x,y)
    return neighbor_count

  def update(self):
    neighbor_count = self.count_neighbors()
    self.arr = (self.arr & ((neighbor_count==2) | (neighbor_count==3))) | (np.logical_not(self.arr) & (neighbor_count==3))
    #pdb.set_trace()

def load_initial_state(filename):
  with open(filename, "r") as f:
    file_lines = f.readlines()
  
  state_array = []
  for line in file_lines:
    line = line.replace(".", "0").replace("#","1")
    state_array.append([bool(int(c)) for c in line.rstrip()])
  return np.array(state_array)

m = ConwayCube((50,50,50))
initial_state = load_initial_state("day17.txt")
m.set_initial(initial_state)

for x in range(0,6):
  m.update()
  print(m.count_active())
