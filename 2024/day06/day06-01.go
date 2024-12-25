package main

import (
	"fmt"
	"os"
	"strings"
)

type Matrix struct {
	Data     [][]string
	Rows     int
	Cols     int
	PieceRow int
	PieceCol int
}

func display(m Matrix) {
	for _, row := range m.Data {
		fmt.Println(row)
	}
}

func get(m Matrix, row int, col int) string {
	if row < 0 || row >= m.Rows || col < 0 || col >= m.Cols {
		return ""
	}

	return string(m.Data[row][col])
}

func count(m Matrix, value string) int {
	count := 0
	for _, row := range m.Data {
		for _, col := range row {
			if col == value {
				count++
			}
		}
	}
	return count
}

func set(m Matrix, row int, col int, value string) {
	m.Data[row][col] = value
}

func buildMatrix() Matrix {
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

	return Matrix{elements, len(rows), len(rows[0]), piece_row, piece_col}
}

func step(m Matrix) Matrix {
	offsets := map[string][2]int{
		"^": {-1, 0},
		"v": {1, 0},
		"<": {0, -1},
		">": {0, 1},
	}

	orientation := get(m, m.PieceRow, m.PieceCol)
	offset := offsets[orientation]
	next := get(m, m.PieceRow+offset[0], m.PieceCol+offset[1])
	if next == "" {
		// About to leave the matrix
		set(m, m.PieceRow, m.PieceCol, "X")
		m.PieceRow = -1
		m.PieceCol = -1
	} else if next == "." || next == "X" {
		set(m, m.PieceRow, m.PieceCol, "X")
		set(m, m.PieceRow+offset[0], m.PieceCol+offset[1], orientation)
		m.PieceRow += offset[0]
		m.PieceCol += offset[1]
	} else if next == "#" {
		// Turn right
		turns := map[string]string{
			"^": ">",
			">": "v",
			"v": "<",
			"<": "^",
		}
		set(m, m.PieceRow, m.PieceCol, turns[orientation])
	} else {
		fmt.Println("Unexpected character", next)
	}
	return m
}

func main() {
	matrix := buildMatrix()
	for true {
		matrix = step(matrix)
		if matrix.PieceRow == -1 {
			fmt.Println(count(matrix, "X"))
			break
		}
	}
}
