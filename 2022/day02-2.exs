# A - Rock, B - Paper, C - Scissors
# C > B > A > C
# X - Lose, Y - Draw, Z - Win

defmodule PRS do
  def outcome(action1, action2) when action1 == action2, do: 3
  def outcome(action1, action2) when action1 == "A" and action2 == "C", do: 0
  def outcome(action1, action2) when action2 == "A" and action1 == "C", do: 6
  def outcome(action1, action2) when action2 > action1, do: 6
  def outcome(action1, action2) when action2 < action1, do: 0
  def score(action1, desired_outcome) do
    desired_actions = %{
      "AX" => "C",
      "AY" => "A",
      "AZ" => "B",
      "BX" => "A",
      "BY" => "B",
      "BZ" => "C",
      "CX" => "B",
      "CY" => "C",
      "CZ" => "A"
    }

    action2 = desired_actions["#{action1}#{desired_outcome}"]
    :binary.first(action2) - 64 + outcome(action1, action2)
  end
end

System.argv()                                       # Get command line arguments
|> File.read                                        # Pass them into File.read
|> elem(1)                                          # Get the file contents
|> String.split("\n")                               # Read the lines
|> Enum.map(fn line -> String.split(line, " ") end) # Split each line by a space
|> Enum.map(fn round -> PRS.score(List.first(round), List.last(round)) end)
|> Enum.sum()
|> IO.inspect()
