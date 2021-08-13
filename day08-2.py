import copy

class CPU:
  def __init__(self, instructions):
    self.accumulator = 0
    self.instructions = instructions
    self.pc = 0
    self.running = False
    self.log = {}
    self.instruction_counter = 0

  def process_instruction(self, instruction):
    inst, arg = instruction.replace("\n", "").split(" ")

    self.instruction_counter += 1
    if self.instruction_counter > 50000:
      print(f"{self.pc} {self.accumulator} {inst} {arg} (Early Termination)")
      self.running = False
      return
 
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
      if self.pc < len(self.instructions):
        self.process_instruction(self.instructions[self.pc])
      else:
        print(f"{self.pc} {self.accumulator} (Jumping past end of array)")
        return

with open("day8.txt") as f:
  original = f.readlines()

for i in range(0, len(original)):
  for old, new in [["jmp","nop"],["nop","jmp"]]:
    prog = copy.deepcopy(original)
    instr, arg = prog[i].split(" ")
    if instr == old:
      patched_instruction = f"{new} {arg}"
      prog[i] = patched_instruction
      c = CPU(prog)
      c.run()