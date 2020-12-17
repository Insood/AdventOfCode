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
  min_value = int(min_value)
  max_value = int(max_value)

  letter_count = 0

  for c in password:
    if c == letter:
      letter_count += 1

  match_found = False
  if letter_count >= min_value and letter_count <= max_value:
    valid_password_counter += 1
    match_found = True
  
  print([min_value, max_value, letter, password, match_found])

  password_counter += 1

print(valid_password_counter, password_counter)