import copy
with open("day10.txt") as f:
  adapters = [int(i) for i in f.readlines()]
  adapters.append(0)
  adapters.sort()

print(adapters)
adapters.reverse()
print(adapters)

combinations = {}

for adapter in adapters:
  if len(combinations) == 0:
    combinations[adapter] = 1
    continue

  combos_for_adapter = 0
  for offset in [1,2,3]:
    if adapter + offset in adapters:
      combos_for_adapter += combinations[adapter + offset]
      print(f"{adapter}\t{offset} \t{combinations[adapter+offset]}")
  combinations[adapter] = combos_for_adapter
  print(f"{adapter}\t{combos_for_adapter}")

print(combinations)