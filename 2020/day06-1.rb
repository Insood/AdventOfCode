
raw = open("day6.txt").read()
raw_groups = raw.split("\n\n")
group_answers = raw_groups.collect { |raw_group| raw_group.gsub("\n","").gsub(" ","") }

counter = 0

group_answers.each do |group_answers|
  unique_answers = Hash.new(0)
  group_answers.split("").each { |c| unique_answers[c] += 1}
  counter += unique_answers.keys.length
end

print counter