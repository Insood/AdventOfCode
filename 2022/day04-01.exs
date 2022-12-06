defmodule LineProcessor do
  def process(line) do
    String.split(line, ",")
    |> Enum.map(fn segments -> String.split(segments, "-") end)
    |> List.flatten()
    |> Enum.map(fn str -> String.to_integer(str) end)
  end

  def overlap(line) do
    [a,b,c,d] = process(line)

    if (c >= a && d <= b) || (a >= c && b <= d) do
      1
    else
      0
    end
  end
end

System.argv()
|> File.read
|> elem(1)
|> String.split("\n")
|> Enum.map(fn line -> LineProcessor.overlap(line) end)
|> Enum.sum()
|> IO.inspect()
