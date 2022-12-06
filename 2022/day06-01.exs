defmodule Processor do
  def unique_characters(substr) do
    substr
    |> String.to_charlist()
    |> Enum.frequencies()
    |> Map.keys()
    |> length()
    |> then(fn len -> len == 4 end)
  end

  def find_marker(line) do
    Enum.map(0..String.length(line) - 4, fn start -> String.slice(line, start, 4) end)
    |> Enum.find_index(fn str -> unique_characters(str) end)
    |> then(fn ix -> ix + 4 end)
  end
end

System.argv()
|> List.first()
|> Processor.find_marker()
|> IO.inspect()
