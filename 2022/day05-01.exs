defmodule Processor do
  def shape(stacks) do
    {
      List.first(stacks) |> String.length() |> then(fn v -> (v+1)/4 end) |> Kernel.round(),
      Kernel.length(stacks)
    }
  end

  def process_stacks(stacks) do
    {cols, rows} = shape(stacks)

    Enum.map(1..cols,
      fn col ->
        Enum.map(1..rows,
          fn row ->
            line = Enum.at(stacks, row-1)
            ix = (col-1)*4 + 1
            String.slice(line, ix, 1)
          end
        ) |> Enum.reject(fn str -> str == " " end)
      end
    )
  end

  def process_header(header) do
    {_, stacks} = String.split(header,"\n") |> List.pop_at(-1)
    process_stacks(stacks)
  end

  def process_moves(moves) do
    String.split(moves, "\n")
    |> Enum.map(
      fn line ->
        String.replace(line, "move ", "")
        |> String.replace("from ", "")
        |> String.replace("to ", "")
        |> String.split(" ")
        |> Enum.map(fn str -> String.to_integer(str) end)
      end
    )
  end

  def move(stacks, origin, dest) do
    source = Enum.at(stacks, origin - 1)
    {container, source} = List.pop_at(source, 0)
    target = Enum.at(stacks, dest - 1)
    target = List.insert_at(target, 0, container)

    stacks
    |> List.replace_at(origin - 1, source)
    |> List.replace_at(dest - 1, target)
  end

  def moves(stacks, move_count, origin, dest) do
    Enum.reduce(1..move_count, stacks, fn _, acc -> move(acc, origin, dest) end )
  end

  def execute_moves(moves, stacks) do
    Enum.reduce(moves, stacks,
      fn move, acc ->
        [move_count, origin, dest] = move
        moves(acc, move_count, origin, dest)
      end
    )
  end

  def process(file) do
    [header, moves] = String.split(file, "\n\n")

    stacks = process_header(header)
    moves = process_moves(moves)

    execute_moves(moves, stacks)
    |> Enum.reduce("", fn stack, acc -> acc <> List.first(stack) end)
  end
end

System.argv()
|> File.read
|> elem(1)
|> Processor.process()
|> IO.inspect()
