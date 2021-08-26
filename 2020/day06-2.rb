class Group
  attr_reader :raw_string
  def initialize(raw_string)
    @raw_string = raw_string
  end

  def group_size
    raw_string.split("\n").length
  end

  def common_answers_count
    answers = raw_string.gsub("\n","").gsub(" ","")

    unique_answers = Hash.new(0)
    answers.split("").each { |c| unique_answers[c] += 1}

    answer_counter = 0
    unique_answers.each do |k,counter|
      answer_counter += 1 if counter == self.group_size
    end
    return answer_counter
  end
end

raw = open("day6.txt").read()
raw_groups = raw.split("\n\n")

groups = raw_groups.collect { |raw_string| Group.new(raw_string)}

counter = 0

groups.each do |group|
  puts group.common_answers_count, group.raw_string
  counter += group.common_answers_count
end

print counter
