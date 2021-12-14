require 'byebug'

values = File.open(ARGV[0])
            .readlines
            .collect do |line|
              line.match(/(\d+),(\d+) -> (\d+),(\d+)/)
                  .to_a()[1..]
                  .collect { |v| v.to_i }
            end

matrix = Hash.new(0)

values.each do |x1, y1, x2, y2|
  next unless x1 == x2 || y1 == y2

  x1,x2 = [x1,x2].sort
  y1,y2 = [y1,y2].sort

  start = matrix.length

  if x1 == x2 # Vertical line
    (y1..y2).each { |y| matrix[ [x1, y] ] += 1 }
  elsif y1 == y2 # Horizontal
    (x1..x2).each { |x| matrix[ [x, y1] ] += 1 }
  end

  puts "#{ [x1,y1,x2,y2] } : #{matrix.length - start}"
end

intersections = matrix.values.select { |v| v > 1 }.count
puts(intersections)