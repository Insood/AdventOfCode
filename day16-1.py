class Validator:
  def __init__(self, raw_string):
    self.name, validations = raw_string.split(": ")
    range1, range2 = validations.split(" or ")
    self.min1, self.max1 = [int(x) for x in range1.split("-")]
    self.min2, self.max2 = [int(x) for x in range2.split("-")]

  def validate(self, value):
    return ((self.min1 <= value) and (value <= self.max1)) or ((self.min2 <= value) and (value <= self.max2))

  def __repr__(self):
    return f"Validator<{self.name}: {self.min1}-{self.max1} or {self.min2}-{self.max2}>"


with open("day16.txt") as f:
  raw = f.read()
  definition, mine, nearby = raw.split("\n\n")
  mine = mine[1:]
  nearby = nearby.split("\n")[1:]

print(nearby)
validations = [Validator(raw) for raw in definition.split("\n")]

invalid_values = []

for line in nearby:
  values = line.split(",")
  for value in values:
    value = int(value)
    if not any([v.validate(value) for v in validations]):
      invalid_values.append(value)

print(invalid_values)
print(sum(invalid_values))
