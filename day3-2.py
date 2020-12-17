import sys

class Hill:
  def __init__(self):
    self.lines = []

  def loadfile(self,filename):
    with open(filename) as f:
      self.lines = f.read().splitlines() 


  def contents(self, row_i, col_i):
    if row_i >= len(self.lines):
      return "" # For cases where we're going more than 1 row at time - if we go past the end of the hill return a blank

    row = self.lines[row_i]
    col_i_mod = col_i % len(row)
    return row[col_i_mod]

class Sledder:
  def __init__(self,hill):
    self.hill = hill

  def ride(self,row_slope, position_slope):
    row = 0
    position = 0

    trees = 0
    for _ in range(0, len(self.hill.lines)):
      if self.hill.contents(row, position) == "#":
        trees += 1

      row += row_slope
      position += position_slope

    return trees

if __name__ == "__main__":
  if len(sys.argv) != 2:
    print(f"Usage: {sys.argv[0]} <input file>")
  else:
    h = Hill()
    h.loadfile(sys.argv[1])
    s = Sledder(h)
    r1 = s.ride(1,1)
    r2 = s.ride(1,3)
    r3 = s.ride(1,5)
    r4 = s.ride(1,7)
    r5 = s.ride(2,1)
    print(r1*r2*r3*r4*r5)