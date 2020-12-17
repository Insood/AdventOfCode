with open("day10.txt") as f:
  adapters = [int(i) for i in f.readlines()]
  adapters.sort()

print(adapters)

jortage = 0
j1_counter = 0
j3_counter = 0
while True:
  diff1 = jortage + 1
  diff3 = jortage + 3

  if diff1 in adapters:
    jortage = diff1
    adapters.remove(diff1)
    j1_counter += 1
  elif diff3 in adapters:
    jortage = diff3
    adapters.remove(diff3)
    j3_counter += 1
  else:
    break

j3_counter += 1

print(jortage, j1_counter, j3_counter)