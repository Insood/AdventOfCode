import re

class PC:
  def __init__(self):
    self.mask = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    self.memory = {}

  def set_mask(self,new_mask):
    self.mask = new_mask
    print(f"Setting mask to {new_mask}")

  def set_memory(self, address, value):
    masked_value = self.mask_value(value)
    self.memory[address] = masked_value
    print(f"Setting {address} to {value}. New value {masked_value}")

  def mask_value(self,value):
    m = self.mask.replace("X","0")
    print(value)
    v = int(m,2) | value

    m = self.mask.replace("X","1")
    v = int(m,2) & v
    return v

  def value_sum(self):
    return sum(self.memory.values())
    
pc = PC()

with open("day14.txt") as f:
  lines = f.readlines()

for line in lines:
  line = line.strip()
  if line.split(" = ")[0] == "mask":
    mask = line.split(" = ")[1]
    pc.set_mask(mask)
  else:
    matches = re.match(r"mem\[(\d+)\] = (\d*)",line)
    pc.set_memory(int(matches[1]),int(matches[2]))

print(pc.value_sum())