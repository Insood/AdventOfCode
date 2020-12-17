class CPU:
  def __init__(self, instructions):
    self.accumulator = 0
    self.instructions = instructions
    self.pc = 0
    self.running = False
    self.log = {}

  def process_instruction(self, instruction):
    if self.pc in self.log:
      self.log[self.pc] += 1
    else:
      self.log[self.pc] = 1
    
    if self.log[self.pc] > 1:
      self.running = False
      return

    inst, arg = instruction.replace("\n", "").split(" ")
    print(f"{self.pc} {self.accumulator} {inst} {arg}")

    if inst == "nop":
      self.pc += 1
    elif inst == "acc":
      self.accumulator += int(arg)
      self.pc += 1
    elif inst == "jmp":
      self.pc += int(arg)

  def run(self):
    self.running = True
    while self.running:
      self.process_instruction(self.instructions[self.pc])

with open("day8.txt") as f:
  lines = f.readlines()

c = CPU(lines)
c.run()