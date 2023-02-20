defmodule ProcessingState do
  defstruct depth: 0, path: [], directory_sizes: %{}
end

defmodule FileProcessor do
  def process_file(file) do
    String.split(file, "$")
    |> Enum.reject(&(&1 == ""))
    |> Enum.map(&(String.trim(&1)))
    |> Enum.reduce(%ProcessingState{}, fn(io, state) -> process_io(io, state) end)
    |> return_to_root()
  end

  def calculate_file_sizes(output) do
    Enum.map(
      output,
      fn line ->
        case String.split(line, " ") do
          ["dir", _] -> 0
          [size, _] -> String.to_integer(size)
        end
      end
    ) |> Enum.sum()
  end

  def enter_directory(directory, processing_state) do
    %{ processing_state | path: processing_state.path ++ [directory], depth: processing_state.depth + 1}
  end

  def exit_directory(processing_state) do
    departing_dir = Enum.join(processing_state.path, "/")
    departing_dir_size = Map.get(processing_state.directory_sizes, departing_dir)
    parent_path = Enum.drop(processing_state.path, -1)
    parent_dir = Enum.join(parent_path, "/")
    updated_processing_state = %{ processing_state | path: parent_path, depth: processing_state.depth - 1 }
    increment_dir_size(parent_dir, departing_dir_size, updated_processing_state)
  end

  def return_to_root(processing_state) do
    if processing_state.depth > 0 do
      exit_directory(processing_state) |> return_to_root()
    else
      processing_state
    end
  end

  def increment_dir_size(dir_name, size, processing_state) do
    updated_directory_sizes = if Map.has_key?(processing_state.directory_sizes, dir_name) do
      {_, v} = Map.get_and_update(processing_state.directory_sizes, dir_name, fn current_size -> {current_size, current_size + size} end)
      v
    else
      Map.put(processing_state.directory_sizes, dir_name, size)
    end

    %{processing_state | directory_sizes: updated_directory_sizes }
  end

  def increment_cur_dir_size(size, processing_state) do
    dir_name = Enum.join(processing_state.path, "/")
    increment_dir_size(dir_name, size, processing_state)
  end

  def process_io(io, processing_state) do
    {input, output} = String.split(io, "\n") |> Enum.split(1)

    input_parts = List.first(input) |> String.split(" ")

    updated_processing_state = case input_parts do
      ["ls"] ->
        increment_cur_dir_size(calculate_file_sizes(output), processing_state)
      ["cd", ".."] ->
        # IO.inspect("Go up")
        exit_directory(processing_state)
      ["cd", directory] ->
        # IO.inspect("Going into #{directory}")
        enter_directory(directory, processing_state)
    end

    updated_processing_state
  end
end

state = System.argv()
|> File.read()
|> Kernel.elem(1)
|> FileProcessor.process_file()
|> IO.inspect()

Map.filter(state.directory_sizes, fn {_, v} -> v <= 100000 end)
  |> Enum.map(fn {_, v} -> v end)
  |> Enum.sum()
  |> IO.inspect()

Map.get(state.directory_sizes, "/") |> IO.inspect()
