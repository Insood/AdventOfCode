defmodule Rucksack do
  def split_in_half(line) do
    String.split_at(line, Kernel.trunc(String.length(line)/2))
  end

  def common(first, second) do
    first_list = String.to_charlist(first)
    second_list = String.to_charlist(second)
    List.myers_difference(first_list, second_list)[:eq]
    |> List.to_string()
  end

  def score(str) do
    if String.upcase(str) == str do
      :binary.first(str) - 38
    else
      :binary.first(str) - 96
    end
  end

  def priority(line) do
    {first, second} = split_in_half(line)
    common(first, second)
    |> score()
  end
end

System.argv()                                       # Get command line arguments
|> File.read                                        # Pass them into File.read
|> elem(1)                                          # Get the file contents
|> String.split("\n")                               # Read the lines
|> Enum.map(fn line -> Rucksack.priority(line) end)
|> Enum.sum()
|> IO.inspect()
