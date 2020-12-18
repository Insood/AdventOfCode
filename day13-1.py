import math

with open("day13.txt") as f:
  lines = f.readlines()

leave_at = int(lines[0])
raw_busses = lines[1]

busses = []

for bus in raw_busses.split(","):
  if bus == "x":
    continue

  busses.append(int(bus))

earliest_bus = 0
best_departure_time = 99999999

for bus_id in busses:
  next_depart_at = math.ceil(leave_at / bus_id) * bus_id

  print(f"{bus_id} - {next_depart_at}")

  if next_depart_at < best_departure_time:
    earliest_bus = bus_id
    best_departure_time = next_depart_at

wait_time = best_departure_time - leave_at

print(earliest_bus, best_departure_time, wait_time, earliest_bus * wait_time)