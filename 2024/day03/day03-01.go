package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"regexp"
	"strconv"
)

func parseLine(line string) int {
	sum := 0
	r, _ := regexp.Compile("mul\\((\\d+),(\\d+)\\)")
	submatches := r.FindAllStringSubmatch(line, -1)
	for _, submatch := range submatches {
		a, _ := strconv.Atoi(submatch[1])
		b, _ := strconv.Atoi(submatch[2])
		sum += a * b
	}
	return sum
}

func main() {
	fileName := os.Args[1]
	file, err := os.Open(fileName)
	if err != nil {
		log.Fatal(err)
	}

	scanner := bufio.NewScanner(file)

	sum := 0
	for scanner.Scan() {
		line := scanner.Text()
		sum += parseLine(line)
	}
	fmt.Println(sum)
}
