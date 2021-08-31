# An Intcode program is a list of integers separated by commas (like 1,0,0,3,99).
# To run one, start by looking at the first integer (called position 0).
# Here, you will find an opcode - either 1, 2, or 99. The opcode indicates what to do;
# For example, 99 means that the program is finished and should immediately halt.
# Encountering an unknown opcode means something went wrong.
# Opcode 1 adds together numbers read from two positions and stores the result in a
# third position. The three integers immediately after the opcode tell you these three
# positions - the first two indicate the positions from which you should read the input
# values, and the third indicates the position at which the output should be stored.
# For example, if your Intcode computer encounters 1,10,20,30, it should read the
# values at positions 10 and 20, add those values, and then overwrite the value at position 30 with their sum.
# Opcode 2 works exactly like opcode 1, except it multiplies the two inputs
# instead of adding them. Again, the three integers after the opcode indicate where
# the inputs and outputs are, not their values.
# Once you're done processing an opcode, move to the next one by stepping forward 4 positions.

defmodule IntCodeCPU do
  def sum(program, position) do
    result = program[program[position+1]] + program[program[position+2]]
    dest = program[position+3]

    program = Map.replace(program, dest, result)
    execute(program, position+4)
  end

  def prod(program, position) do
    result = program[program[position+1]] * program[program[position+2]]
    dest = program[position+3]
    program = Map.replace(program, dest, result)
    execute(program, position+4)
  end

  def halt(program, _) do
    IO.puts("*H*A*L*T*")
    program[0]
  end

  def execute(program, position) do
    case program[position] do
      1 -> sum(program, position)
      2 -> prod(program, position)
      99 -> halt(program, position)
    end
  end
end

program = File.read("day2.txt")
          |> elem(1)
          |> String.split(",")
          |> Enum.map(fn s -> String.to_integer(s) end)
          |> Enum.with_index()
          |> Enum.map(fn {k,v} -> {v,k} end )
          |> Map.new()

# Before running the program, replace position 1 with the value 12 and
# replace position 2 with the value 2.
# What value is left at position 0 after the program halts?
program = Map.replace(program, 1, 12)
program = Map.replace(program, 2, 2)
result = IntCodeCPU.execute(program,0)
IO.puts("Value at position 0: #{result}")