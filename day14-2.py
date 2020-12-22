import re
import itertools

class PC:
  def __init__(self):
    self.mask = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    self.memory = {}

  def set_mask(self,new_mask):
    self.mask = new_mask
    print(f"Setting mask to {new_mask}")

  def set_memory(self, address, value):
    for address in self.address_masks(address):
      self.memory[address] = value
      print(f"Setting {address} to {value}. New value {value}")

  def address_masks(self,address):
    binary_address_string = format(address,'b').rjust(len(self.mask),"0")
    masked_address = []
    floating_bits = []
    for ix, (m, a) in enumerate(zip(mask, binary_address_string)):
      if m == "X":
        masked_address.append('X')
        floating_bits.append(ix)
      elif m == "0":
        masked_address.append(a)
      elif m == "1":
        masked_address.append('1')

    addresses = []
    for seq in itertools.product([0,1],repeat=len(floating_bits)):
      address = masked_address.copy()
      for new_bit, bit_index in zip(seq, floating_bits):
        address[bit_index] = str(new_bit)
      address = "".join(address)
      addresses.append(address)

    return addresses

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