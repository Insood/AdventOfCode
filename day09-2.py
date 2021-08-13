import copy

class XMAS:
  def __init__(self, filename, premable_length):
    self.premable_length = premable_length
    self.load_data(filename)

  def load_data(self, filename):
    with open(filename) as f:
      numbers = [int(x) for x in f.readlines()]
    self.previous_values = numbers[0:self.premable_length]
    self.all_previous_values = copy.deepcopy(self.previous_values)
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
        return value
      self.previous_values.pop(0)
      self.previous_values.append(value)
      self.all_previous_values.append(value)

  def find_summands(self, value):
    i = 0
    while i < len(self.all_previous_values):
      n = 1
      while n < len(self.all_previous_values) - i:
        contiguous_values = self.all_previous_values[i:i+n]
        s = sum(contiguous_values)
        if s > value:
          break
        elif s == value:
          print(f"Found values! {contiguous_values}")
          return contiguous_values
        n +=1
      i += 1

x = XMAS("day9.txt",25)
err = x.find_error()
print(err)
contiguous_values = x.find_summands(err)
num = min(contiguous_values) + max(contiguous_values)
print(num)