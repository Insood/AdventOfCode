import itertools

class Validator:
  def __init__(self, raw_string):
    self.name, validations = raw_string.split(": ")
    range1, range2 = validations.split(" or ")
    self.min1, self.max1 = [int(x) for x in range1.split("-")]
    self.min2, self.max2 = [int(x) for x in range2.split("-")]

  def validate(self, value):
    return ((self.min1 <= value) and (value <= self.max1)) or ((self.min2 <= value) and (value <= self.max2))

  def __repr__(self):
    return f"Validator<{self.name}: {self.min1}-{self.max1} or {self.min2}-{self.max2}>"

with open("day16.txt") as f:
  raw = f.read()
  definition, my_ticket, nearby = raw.split("\n\n")

my_ticket = my_ticket.split("\n")[1].split(",")
nearby = nearby.split("\n")[1:]

validators = [Validator(raw) for raw in definition.split("\n")]

invalid_values = []
valid_tickets = []
for line in nearby:
  values = [int(x) for x in line.split(",")]
  valid_ticket = True
  for value in values:
    if not any([v.validate(value) for v in validators]):
      invalid_values.append(value)
      valid_ticket = False
  if valid_ticket:
    valid_tickets.append(values)

print(valid_tickets)

my_ticket_with_fields = {}

counter = 0
for validator_permutation in itertools.permutations(validators):
  counter += 0
  if counter % 10000:
    print(".",end="")
    
  all_valid = True
  for ticket in valid_tickets:
    if not all([validator.validate(value) for validator, value in zip(validator_permutation, ticket)]):
      all_valid = False
      break

  if all_valid:
    for validator, my_ticket_value in zip(validator_permutation, my_ticket):
      my_ticket_with_fields[validator.name] = my_ticket_value
    break

print(my_ticket_with_fields)

answer = 1
for k,v in my_ticket_with_fields.items():
  if "departure" in k:
    answer *= v

print(answer)