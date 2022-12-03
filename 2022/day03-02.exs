defmodule Group do
  def common(lines) do
    first = Enum.at(lines, 0) |> String.to_charlist() |> MapSet.new
    second = Enum.at(lines, 1) |> String.to_charlist() |> MapSet.new
    third = Enum.at(lines, 2) |> String.to_charlist() |> MapSet.new

    MapSet.intersection(first, second)
    |> MapSet.intersection(third)
    |> MapSet.to_list()
    |> List.to_string()
  end

  def score(str) do
    if String.upcase(str) == str do
      :binary.first(str) - 38
    else
      :binary.first(str) - 96
    end
  end
end

System.argv()
|> File.read
|> elem(1)
|> String.split("\n")
|> Enum.chunk_every(3)
|> Enum.map(fn group -> Group.common(group) end)
|> Enum.map(fn common -> Group.score(common) end)
|> Enum.sum()
|> IO.inspect()
