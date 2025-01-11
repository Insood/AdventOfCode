package main

import (
	"os"
	"strconv"
)

func readFile() ([]int, [][3]int) {
	disk_map := []int{}
	file_lengths := [][3]int{}

	raw, _ := os.ReadFile(os.Args[1])

	id_counter := 0
	for ix, c := range string(raw) {
		v, _ := strconv.Atoi(string(c))

		if ix%2 == 0 {
			file_lengths = append(file_lengths, [3]int{id_counter, v, len(disk_map)})

			for i := 0; i < v; i++ {
				disk_map = append(disk_map, id_counter)
			}
			id_counter++
		} else {
			for i := 0; i < v; i++ {
				disk_map = append(disk_map, -1)
			}
		}
	}
	return disk_map, file_lengths
}

func prettyPrint(disk_map *[]int) {
	for i := 0; i < len(*disk_map); i++ {
		if (*disk_map)[i] == -1 {
			print(".")
		} else {
			print((*disk_map)[i])
		}
	}
	println()
}

func main() {
	disk_map1, _ := readFile()
	partone(&disk_map1)

	disk_map2, file_lengths := readFile()
	parttwo(&disk_map2, file_lengths)
}
