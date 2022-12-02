# A - Rock, B - Paper, C - Scissors
# X - Rock, Y - Paper, Z - Scissors
# C > B > A > C

move_map = %{ "X" => "A", "Y" => "B", "Z" => "C"}

defmodule PRS do
  def outcome(action1, action2) when action1 == action2, do: 3
  def outcome(action1, action2) when action1 == "A" and action2 == "C", do: 0
  def outcome(action1, action2) when action2 == "A" and action1 == "C", do: 6
  def outcome(action1, action2) when action2 > action1, do: 6
  def outcome(action1, action2) when action2 < action1, do: 0

  def score(action1, action2) do
    :binary.first(action2) - 64 + outcome(action1, action2)
  end
end

System.argv()                                       # Get command line arguments
|> File.read                                        # Pass them into File.read
|> elem(1)                                          # Get the file contents
|> String.split("\n")                               # Read the lines
|> Enum.map(fn line -> String.split(line, " ") end) # Split each line by a space
|> Enum.map(fn round -> [List.first(round), move_map[List.last((round))]] end)
|> Enum.map(fn round -> PRS.score(List.first(round), List.last(round)) end)
|> Enum.sum()
|> IO.inspect()
