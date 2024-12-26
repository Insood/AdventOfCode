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

func calculateAntinodes(a Point, b Point) (Point, Point) {
	c := Point{X: a.X + (a.X - b.X), Y: a.Y + (a.Y - b.Y)}
	d := Point{X: b.X + (b.X - a.X), Y: b.Y + (b.Y - a.Y)}

	return c, d
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
				c, d := calculateAntinodes(a, b)
				if c.X >= 0 && c.Y >= 0 && c.X < antinodes.Cols && c.Y < antinodes.Rows {
					antinodes.Data[c.Y][c.X] = "#"
				}

				if d.X >= 0 && d.Y >= 0 && d.X < antinodes.Cols && d.Y < antinodes.Rows {
					antinodes.Data[d.Y][d.X] = "#"
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
