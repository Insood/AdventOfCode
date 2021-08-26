require 'active_model'
require 'byebug'

class P
  include ActiveModel::Validations
  attr_accessor :byr, :iyr, :eyr, :hgt, :hcl, :ecl, :pid, :cid

  validates :byr, presence: true, numericality: { greater_than_or_equal_to: 1920, less_than_or_equal_to: 2002}
  validates :iyr, presence: true, numericality: { greater_than_or_equal_to: 2010, less_than_or_equal_to: 2020}
  validates :eyr, presence: true, numericality: { greater_than_or_equal_to: 2020, less_than_or_equal_to: 2030}
  validate :height
  validates :hcl, presence: true, format: {with: /\A#[a-z0-9]{6}\z/, message: "must be hex"}
  validates :ecl, presence: true, inclusion: {in: %w(amb blu brn gry grn hzl oth)}
  validates :pid, presence: true, format: {with: /\A[0-9]{9}\z/, message: "must be 9 digits"}

  def height
    unless hgt then
      errors.add(:hgt, "is missing")
      return
    end

    matches = hgt.match(/^(\d+)(cm|in)$/)
    unless matches &&  matches.length == 3 then
      errors.add(:hgt, "invalid format")
      return
    end
    measurement = matches[1].to_i
    unless ["cm","in"].include?(matches[2]) then
      errors.add(:hgt, "must be in cm or in")
      return
    end
    if matches[2] == "cm" then
      errors.add(:hgt, "cm must be between 150 and 193") unless measurement >= 150 && measurement <= 193
    else
      errors.add(:hgt, "in must be between 59 and 76") unless measurement >= 59 && measurement <= 76
    end
  end
end

f = open("day4.txt")
raw = f.read()

ps = []

raw.split("\n\n").each do |raw_spec|
  p = P.new()
  raw_spec = raw_spec.gsub("\n"," ")
  raw_fields = raw_spec.split(" ")
  raw_fields.each do |raw_field|
    k, v = raw_field.split(":")
    p.send("#{k}=", v)
  end
  ps << p
end

counter = 0
ps.each do |p|
  if p.valid? then
    counter += 1
  else
    print p.errors.messages
  end
end

print counter