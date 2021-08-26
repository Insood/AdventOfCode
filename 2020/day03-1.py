import sys

class Hill:
  def __init__(self):
    self.lines = []

  def loadfile(self,filename):
    with open(filename) as f:
      self.lines = f.read().splitlines() 


  def contents(self, row_i, col_i):
    row = self.lines[row_i]
    print(row)
    col_i_mod = col_i % len(row)
    return row[col_i_mod]

class Sledder:
  def __init__(self,hill):
    self.hill = hill

  def ride(self):
    row = 0
    position = 0

    trees = 0
    for _ in range(0, len(self.hill.lines)):
      hill_contents = self.hill.contents(row, position)
      #print(row, hill_contents)
      if self.hill.contents(row, position) == "#":
        trees += 1

      row += 1
      position += 3

    return trees

if __name__ == "__main__":
  if len(sys.argv) != 2:
    print(f"Usage: {sys.argv[0]} <input file>")
  else:
    h = Hill()
    h.loadfile(sys.argv[1])
    s = Sledder(h)
    trees = s.ride()
    print(trees)