def readfile(filename):
  with open(filename, "r") as f:
    lines = f.readlines()
  return [int(line) for line in lines]

def find2020(values):
  for i in values:
    for j in values:
      for k in values:
        if (i !=j and j !=k) and (i+j+k == 2020):
          return i*j*k

values = readfile("day1.txt")
print(find2020(values))
