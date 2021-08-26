# Fuel required to launch a given module is based on its mass. Specifically, 
# to find the fuel required for a module, take its mass, divide by three,
# round down, and subtract 2.

fuel_sum = File.read("day1.txt") 
           |> elem(1) 
           |> String.split("\r\n")
           |> Enum.map(fn s -> String.to_integer(s) end)
           |> Enum.map(fn i -> trunc(i/3) -2 end)
           |> Enum.sum()

IO.puts(fuel_sum)