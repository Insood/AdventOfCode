# Fuel itself requires fuel just like a module - take its mass, divide
# by three, round down, and subtract 2. However, that fuel also requires
# fuel, and that fuel requires fuel, and so on. Any mass that would require
# negative fuel should instead be treated as if it requires zero fuel; the
# remaining mass, if any, is instead handled by wishing really hard, which
# has no mass and is outside the scope of this calculation.

defmodule FuelCalculator do
  def fuel_required(mass) do
    fuel = trunc(mass/3)-2
    if fuel > 0 do
      fuel + fuel_required(fuel)
    else
      0
    end
  end
end

fuel_sum = File.read("day1.txt") 
           |> elem(1)
           |> String.split("\r\n")
           |> Enum.map(fn s -> String.to_integer(s) end)
           |> Enum.map(fn mass -> FuelCalculator.fuel_required(mass) end)
           |> Enum.sum()

IO.puts(fuel_sum)