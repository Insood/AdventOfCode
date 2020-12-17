class XMAS:
  def __init__(self, filename, premable_length):
    self.premable_length = premable_length
    self.load_data(filename)

  def load_data(self, filename):
    with open(filename) as f:
      numbers = [int(x) for x in f.readlines()]
    self.previous_values = numbers[0:self.premable_length]
    self.test_values = numbers[self.premable_length:]
    
  def test_value(self, value):
    for s1 in self.previous_values:
      for s2 in self.previous_values:
        if s1 == s2:
          continue
        if s1 + s2 == value:
          return True
    return False

  def find_error(self):
    while len(self.test_values) > 0:
      value = self.test_values.pop(0)
      if not self.test_value(value):
        print(f"Found error: {value}")
        return
      self.previous_values.pop(0)
      self.previous_values.append(value)


x = XMAS("day9-1-sample.txt",5)
x.find_error()