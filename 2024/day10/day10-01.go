package main

import (
	"fmt"
)

type PeakMap map[[2]int]bool

func addPeak(peaks *PeakMap, row int, col int) {
	(*peaks)[[2]int{row, col}] = true
}

func findRoutes1(m *Matrix, peaks *PeakMap, value int, row int, col int) int {
	// fmt.Println(fmt.Sprintf("%*d", value, value), row, col)
	score := 0

	if m.get(row-1, col) == value {
		if value == 9 {
			addPeak(peaks, row-1, col)
		} else {
			findRoutes1(m, peaks, value+1, row-1, col)
		}
	}

	if m.get(row+1, col) == value {
		if value == 9 {
			addPeak(peaks, row+1, col)
		} else {
			score += findRoutes1(m, peaks, value+1, row+1, col)
		}
	}

	if m.get(row, col-1) == value {
		if value == 9 {
			addPeak(peaks, row, col-1)
		} else {
			findRoutes1(m, peaks, value+1, row, col-1)
		}
	}

	if m.get(row, col+1) == value {
		if value == 9 {
			addPeak(peaks, row, col+1)
		} else {
			score += findRoutes1(m, peaks, value+1, row, col+1)
		}
	}

	return score
}

func calculate1(m *Matrix) {
	// m.display()
	score := 0

	for row := 0; row < m.Rows; row++ {
		for col := 0; col < m.Cols; col++ {
			if m.get(row, col) == 0 {
				peaks := make(PeakMap)
				findRoutes1(m, &peaks, 1, row, col)
				score += len(peaks)
			}
		}
	}
	fmt.Println(score)
}
