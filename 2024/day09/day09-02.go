package main

import (
	"fmt"
)

func all_empty(arr []int) bool {
	for _, v := range arr {
		if v != -1 {
			return false
		}
	}
	return true
}

func find_gap(disk_map *[]int, size int, before_ix int) int {
	for i := 0; i < before_ix; i++ {
		if (*disk_map)[i] != -1 {
			continue
		}

		slice := (*disk_map)[i : i+size]
		if all_empty(slice) {
			return i
		}
	}
	return -1
}

func compress2(disk_map *[]int, file_lengths [][3]int) {
	for file := len(file_lengths) - 1; file >= 0; file-- {
		file_ix := file_lengths[file][0]
		file_length := file_lengths[file][1]
		file_position := file_lengths[file][2]

		gap := find_gap(disk_map, file_length, file_position)
		if gap == -1 {
			continue
		}

		// Gap is big enough to insert the file
		for j := 0; j < file_length; j++ {
			(*disk_map)[gap+j] = file_ix      // insert the file
			(*disk_map)[file_position+j] = -1 // Delete the file from the old position
		}
		// prettyPrint(disk_map)
	}
}

func checkSum2(disk_map *[]int) int {
	sum := 0
	for ix, v := range *disk_map {
		if v != -1 {
			sum += ix * v
		}
	}
	return sum
}

func parttwo(disk_map *[]int, file_lengths [][3]int) {
	compress2(disk_map, file_lengths)
	fmt.Println(checkSum2(disk_map))
}
