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

/*
	 nolint: golint
		M S   M M   S M   S S
		 A     A     A     A
		M S   S S   S M   M M
*/
func countOccurences(m Matrix, row int, col int) int {
	a := get(m, row, col)
	ul := get(m, row-1, col-1)
	ur := get(m, row-1, col+1)
	ll := get(m, row+1, col-1)
	lr := get(m, row+1, col+1)

	occurences := 0

	if a != "A" {
		return occurences
	}

	if ul == "M" && ur == "S" && ll == "M" && lr == "S" {
		occurences += 1
	}

	if ul == "M" && ur == "M" && ll == "S" && lr == "S" {
		occurences += 1
	}

	if ul == "S" && ur == "M" && ll == "S" && lr == "M" {
		occurences += 1
	}

	if ul == "S" && ur == "S" && ll == "M" && lr == "M" {
		occurences += 1
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
