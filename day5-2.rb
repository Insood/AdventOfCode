require 'set'
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
lowest_id = 900
f.read().split("\n").each do |line|
  row, seat = string_to_row_and_seat(line)
  id = row * 8 + seat
  highest_id = id if id > highest_id
  lowest_id = id if id < lowest_id
  passes << [row, seat, id]
end

#print passes
print "#{lowest_id} -> #{highest_id}"
available_seats = Set.new(11..835)
boarding_passes = Set.new(passes.collect { |row, seat, id| id })
print (available_seats - boarding_passes).to_a

