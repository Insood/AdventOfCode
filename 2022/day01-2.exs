top_three = File.read("day01.txt")
            |> elem(1)
            |> String.split("\n\n")
            |> Enum.map(fn s ->
               String.split(s, "\n")
                 |> Enum.map(fn s -> String.to_integer(s) end)
                 |> Enum.sum()
             end
            )
           |> Enum.sort(fn a,b -> b < a end)
           |> Enum.slice(0,3)
           |> Enum.sum()

IO.inspect(top_three)
