package main

import (
	"fmt"
)

func findRoutes2(m *Matrix, value int, row int, col int) int {
	score := 0

	if m.get(row-1, col) == value {
		if value == 9 {
			score += 1
		} else {
			score += findRoutes2(m, value+1, row-1, col)
		}
	}

	if m.get(row+1, col) == value {
		if value == 9 {
			score += 1
		} else {
			score += findRoutes2(m, value+1, row+1, col)
		}
	}

	if m.get(row, col-1) == value {
		if value == 9 {
			score += 1
		} else {
			score += findRoutes2(m, value+1, row, col-1)
		}
	}

	if m.get(row, col+1) == value {
		if value == 9 {
			score += 1
		} else {
			score += findRoutes2(m, value+1, row, col+1)
		}
	}

	return score
}

func calculate2(m *Matrix) {
	// m.display()
	score := 0

	for row := 0; row < m.Rows; row++ {
		for col := 0; col < m.Cols; col++ {
			if m.get(row, col) == 0 {
				score += findRoutes2(m, 1, row, col)
			}
		}
	}
	fmt.Println(score)
}
