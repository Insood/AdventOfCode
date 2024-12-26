package main

import (
	"fmt"
	"os"
	"strings"
)

type Matrix struct {
	Data [][]string
	Rows int
	Cols int
}

type Point struct {
	X int
	Y int
}

func (m Matrix) display() {
	fmt.Println("----------")
	for _, row := range m.Data {
		fmt.Println(strings.Join(row, ""))
	}
}

func findPoints(m Matrix) map[string][]Point {
	points := map[string][]Point{}

	for y, row := range m.Data {
		for x, cell := range row {
			if cell == "." {
				continue
			}
			p := Point{X: x, Y: y}
			points[cell] = append(points[cell], p)
		}
	}
	return points
}

func readFile() Matrix {
	raw, _ := os.ReadFile(os.Args[1])
	contents := string(raw)
	lines := strings.Split(contents, "\n")
	data := [][]string{}

	for _, line := range lines {
		data = append(data, strings.Split(line, ""))
	}

	return Matrix{Data: data, Rows: len(data), Cols: len(data[0])}
}

func buildAntinodes(antennas Matrix) Matrix {
	antinodes := [][]string{}

	for _, row := range antennas.Data {
		antinode_row := make([]string, len(row))

		for c := 0; c < len(row); c++ {
			antinode_row[c] = "."
		}
		antinodes = append(antinodes, antinode_row)
	}

	return Matrix{Data: antinodes, Rows: len(antinodes), Cols: len(antinodes[0])}
}

func calculateAntinodes(a Point, b Point) []Point {
	dx1 := a.X - b.X
	dx2 := b.X - a.X
	dy1 := a.Y - b.Y
	dy2 := b.Y - a.Y

	points := []Point{a, b}

	for i := 1; i <= 50; i++ {
		c := Point{X: a.X + i*dx1, Y: a.Y + i*dy1}
		d := Point{X: b.X + i*dx2, Y: b.Y + i*dy2}
		points = append(points, c, d)
	}

	return points
}

func countAntinodes(antinodes Matrix) int {
	count := 0
	for _, row := range antinodes.Data {
		for _, cell := range row {
			if cell == "#" {
				count++
			}
		}
	}
	return count
}

func findAntinodes(antennas Matrix) {
	points_map := findPoints(antennas)
	antinodes := buildAntinodes(antennas)

	for _, points := range points_map {
		for i, a := range points {
			for j, b := range points {
				if i == j {
					continue
				}
				points := calculateAntinodes(a, b)
				for _, p := range points {
					if p.X >= 0 && p.Y >= 0 && p.X < antinodes.Cols && p.Y < antinodes.Rows {
						antinodes.Data[p.Y][p.X] = "#"
					}
				}
			}
		}
	}
	antinodes.display()
	fmt.Println(countAntinodes(antinodes))
}

func main() {
	antennas := readFile()
	antennas.display()
	findAntinodes(antennas)
}
