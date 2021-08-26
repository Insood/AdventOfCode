with open("day2.txt") as f:
  lines = f.readlines()
  
valid_password_counter = 0
password_counter = 0
for line in lines:
  definition, password = line.split(":")
  definition = definition.strip()
  password = password.strip()
  
  valid_range, letter = definition.split(" ")
  min_value, max_value = valid_range.split("-")
  letter1_index = int(min_value)
  letter2_index = int(max_value)

  c1 = password[letter1_index - 1]
  c2 = password[letter2_index - 1]

  matches = 0
  if c1 == letter:
    matches += 1
  if c2 == letter:
    matches += 1

  if matches == 1:
    valid_password_counter += 1
  
  print([min_value, max_value, letter, password, matches])

  password_counter += 1

print(valid_password_counter, password_counter)