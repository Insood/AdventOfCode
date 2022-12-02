max = File.read("day01.txt")
        |> elem(1)
        |> String.split("\n\n")
        |> Enum.map(fn s ->
          String.split(s, "\n")
            |> Enum.map(fn s -> String.to_integer(s) end)
            |> Enum.sum()
        end)
        |> Enum.max

IO.puts(max)
