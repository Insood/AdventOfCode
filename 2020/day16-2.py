import itertools
import numpy as np
import pdb

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
  definition, my_ticket_str, nearby = raw.split("\n\n")

my_ticket = [int(x) for x in my_ticket_str.split("\n")[1].split(",")]
nearby = nearby.split("\n")[1:]

validators = [Validator(raw) for raw in definition.split("\n")]

valid_tickets = []

for line in nearby:
  ticket = [int(x) for x in line.split(",")]
  valid_ticket = True
  for value in ticket:
    if not any([v.validate(value) for v in validators]):
      valid_ticket = False
  if valid_ticket:
    valid_tickets.append(ticket)

values = np.array(valid_tickets)

validator_matches = []
for ix, validator in enumerate(validators):
  valid_for_columns = []
  for column_ix in range(0, len(validators)):
    matches_all = all([validator.validate(v) for v in values[:,column_ix]])
    if matches_all:
      valid_for_columns.append(column_ix)
  validator_matches.append([validator, valid_for_columns])

validator_matches.sort(key=lambda values: len(values[1]))

assigned_columns = []
assigned_validators = {}

for validator, possible_columns in validator_matches:
  available_columns = [col for col in filter(lambda c: c not in assigned_columns, possible_columns)]
  print(f"{possible_columns} -> {available_columns}")

  if len(available_columns) != 1:
    raise RuntimeError("couldn't sort")
  column_for_validator = available_columns[0]
  assigned_columns.append(column_for_validator)
  print(f"{validator} - {column_for_validator}")
  assigned_validators[validator] = column_for_validator

result = 1
for validator, col_ix in assigned_validators.items():
  if not "departure" in validator.name:
    continue
  
  print(validator)
  print(my_ticket[col_ix])
  result = result*my_ticket[col_ix]

print(result)