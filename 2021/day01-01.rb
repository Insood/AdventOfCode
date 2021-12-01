last = nil
increasing_counter = 0

File.readlines('day01-01.txt').each do |line|
  value = line.to_i
  if last && value > last
    increasing_counter += 1
  end
  last = value
end

puts increasing_counter