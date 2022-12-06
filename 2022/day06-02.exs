defmodule Processor do
  def unique_characters(substr) do
    substr
    |> String.to_charlist()
    |> Enum.frequencies()
    |> Map.keys()
    |> length()
    |> then(fn len -> len == 14 end)
  end

  def find_marker(line) do
    Enum.map(0..String.length(line) - 14, fn start -> String.slice(line, start, 14) end)
    |> Enum.find_index(fn str -> unique_characters(str) end)
    |> then(fn ix -> ix + 14 end)
  end
end

System.argv()
|> List.first()
|> Processor.find_marker()
|> IO.inspect()
