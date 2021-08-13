import pdb
import re

rules = {}

def save_rules(raw_rules):
  for raw_rule in raw_rules.split("\n"):
    id_string, rule = raw_rule.split(": ")
    rule = rule.replace('"','')
    id = int(id_string)
    rules[id] = rule

def build_regex(id):
  rule = rules[id]
  pieces = []
  for chunk in rule.split(" "):
    if chunk == "|":
      pieces.append("|")
    elif chunk.isnumeric():
      pieces.append(f"({build_regex(int(chunk))})")
    else:
      pieces.append(chunk)
  return "".join(pieces)

def count_messages(raw_messages):
  pass

with open("day19.txt") as f:
  raw = f.read()

raw_rules, raw_messages = raw.split("\n\n") # Split on the line between the rules and messages
messages = raw_messages.split("\n")

save_rules(raw_rules)
regex = build_regex(id=0)
full_regex = f"^{regex}$"
prog = re.compile(full_regex)
valid_messages = 0
for msg in messages:
  if prog.match(msg):
    valid_messages += 1

print(valid_messages)
