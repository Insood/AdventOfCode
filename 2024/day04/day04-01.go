package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
)

type Matrix struct {
	Data []string
	Rows int
	Cols int
}

func buildMatrix() Matrix {
	fileName := os.Args[1]
	file, err := os.Open(fileName)
	if err != nil {
		log.Fatal(err)
	}

	scanner := bufio.NewScanner(file)

	contents := []string{}

	for scanner.Scan() {
		line := scanner.Text()
		contents = append(contents, line)
	}

	return Matrix{contents, len(contents), len(contents[0])}
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

func countOccurences(m Matrix, row int, col int) int {
	occurences := 0

	checks := [][][]int{
		{{-1, 0}, {-2, 0}, {-3, 0}},
		{{-1, 1}, {-2, 2}, {-3, 3}},
		{{0, 1}, {0, 2}, {0, 3}},
		{{1, 1}, {2, 2}, {3, 3}},
		{{1, 0}, {2, 0}, {3, 0}},
		{{1, -1}, {2, -2}, {3, -3}},
		{{0, -1}, {0, -2}, {0, -3}},
		{{-1, -1}, {-2, -2}, {-3, -3}},
	}

	center := get(m, row, col)
	if center != "X" {
		return 0
	}

	for _, check := range checks {
		x1 := check[0][0]
		y1 := check[0][1]
		x2 := check[1][0]
		y2 := check[1][1]
		x3 := check[2][0]
		y3 := check[2][1]
		c1 := get(m, row+x1, col+y1)
		c2 := get(m, row+x2, col+y2)
		c3 := get(m, row+x3, col+y3)
		if c1 == "M" && c2 == "A" && c3 == "S" {
			occurences++
		}
	}
	return occurences
}

func main() {
	matrix := buildMatrix()
	display(matrix)

	occurences := 0
	for i := 0; i < matrix.Rows; i++ {
		for j := 0; j < matrix.Cols; j++ {
			occurences += countOccurences(matrix, i, j)
		}
	}
	fmt.Println(occurences)
}
