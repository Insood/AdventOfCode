def string_to_row_and_seat(str)
  row = str[0..6]
  row = row.gsub("F","0").gsub("B","1").to_i(2)
  seat = str[7..-1]
  seat = seat.gsub("L","0").gsub("R","1").to_i(2)

  return row, seat
end

passes = []

f = open("day5.txt")
highest_id = 0
f.read().split("\n").each do |line|
  row, seat = string_to_row_and_seat(line)
  id = row * 8 + seat
  highest_id = id if id > highest_id
  passes << [string_to_row_and_seat(line)]
end

print passes
print highest_id
