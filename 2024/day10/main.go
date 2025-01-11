package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

type Matrix struct {
	Data [][]int
	Rows int
	Cols int
}

func (m Matrix) get(row int, col int) int {
	if row < 0 || row >= m.Rows || col < 0 || col >= m.Cols {
		return -1
	}

	return m.Data[row][col]
}

func (m Matrix) display() {
	for _, row := range m.Data {
		fmt.Println(row)
	}
}

func readFile() Matrix {
	raw, _ := os.ReadFile(os.Args[1])
	lines := strings.Split(string(raw), "\n")
	data := [][]int{}

	m := Matrix{Data: data, Rows: len(lines), Cols: len(lines[0])}

	for row_ix, line := range lines {
		cells := strings.Split(line, "")

		m.Data = append(m.Data, make([]int, len(cells)))

		for col_ix, cell := range cells {
			v, err := strconv.Atoi(cell)
			if err == nil {
				m.Data[row_ix][col_ix] = v
			} else {
				m.Data[row_ix][col_ix] = -1
			}
		}

	}
	return m
}

func main() {
	m := readFile()
	calculate1(&m)
	calculate2(&m)
}
