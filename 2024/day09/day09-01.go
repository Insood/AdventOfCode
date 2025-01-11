package main

import (
	"fmt"
)

func compress1(disk_map *[]int) {
	for i := len(*disk_map) - 1; i >= 0; i-- {
		insertion_ix := -1

		for j := 0; j < i; j++ {
			if (*disk_map)[j] == -1 {
				insertion_ix = j
				break
			}
		}

		// prettyPrint(disk_map)
		if insertion_ix == -1 {
			break
		}

		if (*disk_map)[i] != -1 {
			(*disk_map)[insertion_ix] = (*disk_map)[i]
			(*disk_map)[i] = -1
		}
	}
}

func checkSum1(disk_map *[]int) int {
	sum := 0
	for ix, v := range *disk_map {
		if v != -1 {
			sum += ix * v
		}
	}
	return sum
}

func partone(disk_map *[]int) {
	compress1(disk_map)
	fmt.Println(checkSum1(disk_map))
}
