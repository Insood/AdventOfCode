package main

import (
	"fmt"
	"os"
	"strings"
)

type Field struct {
	Data     [][]string
	Rows     int
	Cols     int
	PieceRow int
	PieceCol int
}

type TravelCounter struct {
	Data [][]int
	Rows int
	Cols int
}

func (m Field) display() {
	for _, row := range m.Data {
		fmt.Println(row)
	}
}

func (t TravelCounter) display() {
	for _, row := range t.Data {
		fmt.Println(row)
	}
}

func (m Field) get(row int, col int) string {
	if row < 0 || row >= m.Rows || col < 0 || col >= m.Cols {
		return ""
	}

	return string(m.Data[row][col])
}

func (m TravelCounter) get(row int, col int) string {
	if row < 0 || row >= m.Rows || col < 0 || col >= m.Cols {
		return ""
	}

	return string(m.Data[row][col])
}

func (m Field) set(row int, col int, value string) {
	m.Data[row][col] = value
}

func (m Field) copy() Field {
	c := m // Will copy everything but the Data field
	data_copy := make([][]string, len(m.Data))
	for i, row := range m.Data {
		data_copy[i] = make([]string, len(row))
		copy(data_copy[i], row)
	}
	c.Data = data_copy
	return c
}

func (m TravelCounter) increment(row int, col int) {
	m.Data[row][col] += 1
}

func buildField() Field {
	raw, _ := os.ReadFile(os.Args[1])
	contents := string(raw)
	rows := strings.Split(contents, "\n")

	piece_row := 0
	piece_col := 0

	for row_ix, row := range rows {
		col := strings.Index(row, "^")
		if col > 0 {
			piece_row = row_ix
			piece_col = col
			break
		}
	}

	elements := [][]string{}

	for _, row := range rows {
		elements = append(elements, strings.Split(row, ""))
	}

	return Field{elements, len(rows), len(rows[0]), piece_row, piece_col}
}

func step(f Field, tc TravelCounter) (Field, TravelCounter) {
	offsets := map[string][2]int{
		"^": {-1, 0},
		"v": {1, 0},
		"<": {0, -1},
		">": {0, 1},
	}

	orientation := f.get(f.PieceRow, f.PieceCol)
	offset := offsets[orientation]
	next := f.get(f.PieceRow+offset[0], f.PieceCol+offset[1])
	if next == "" {
		// About to leave the matrix
		tc.increment(f.PieceRow, f.PieceCol)
		f.PieceRow = -1
		f.PieceCol = -1
	} else if next == "." {
		tc.increment(f.PieceRow, f.PieceCol)
		f.set(f.PieceRow, f.PieceCol, ".")
		f.set(f.PieceRow+offset[0], f.PieceCol+offset[1], orientation)
		f.PieceRow += offset[0]
		f.PieceCol += offset[1]
	} else if next == "#" {
		// Turn right
		turns := map[string]string{
			"^": ">",
			">": "v",
			"v": "<",
			"<": "^",
		}
		f.set(f.PieceRow, f.PieceCol, turns[orientation])
	} else {
		fmt.Println("Unexpected character", next)
	}
	return f, tc
}

func detectLoop(tc TravelCounter) bool {
	m := make(map[int]int)

	for _, row := range tc.Data {
		for _, col := range row {
			m[col] += 1
		}
	}

	for k := range m {
		if k > 10 && m[10] == 0 {
			return true
		}
	}
	return false
}

func buildTravelCounter(rows int, cols int) TravelCounter {
	travel_counter_data := make([][]int, rows)
	for i := range travel_counter_data {
		travel_counter_data[i] = make([]int, cols)
	}

	travel_counter := TravelCounter{travel_counter_data, 0, 0}
	return travel_counter
}

func testForLoop(f Field, row int, col int) bool {
	field_copy := f.copy()
	field_copy.set(row, col, "#")
	travel_counter := buildTravelCounter(f.Rows, f.Cols)

	step_counter := 0
	for true {
		step_counter += 1
		field_copy, travel_counter = step(field_copy, travel_counter)
		if field_copy.PieceRow == -1 {
			return false
		}
		if step_counter%5000 == 0 && detectLoop(travel_counter) {
			break
		}
	}
	return true
}

func main() {
	original_field := buildField()

	loopable_counter := 0

	for row := 0; row < original_field.Rows; row++ {
		for col := 0; col < original_field.Cols; col++ {
			if original_field.get(row, col) != "." {
				continue
			}

			if testForLoop(original_field, row, col) {
				loopable_counter += 1
			}
		}
	}

	fmt.Println(loopable_counter)
}
