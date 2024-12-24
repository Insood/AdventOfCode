package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"regexp"
	"strconv"
)

func parse(line string) int {
	enable := true
	sum := 0
	r, _ := regexp.Compile("mul\\((\\d+),(\\d+)\\)|(do\\(\\))|(don't\\(\\))")
	submatches := r.FindAllStringSubmatch(line, -1)

	for _, submatch := range submatches {
		match := submatch[0]
		if match == "do()" {
			enable = true
		} else if match == "don't()" {
			enable = false
		} else {
			a, _ := strconv.Atoi(submatch[1])
			b, _ := strconv.Atoi(submatch[2])
			if enable {
				sum += a * b
			}
		}
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

	line := ""
	for scanner.Scan() {
		line += scanner.Text()
	}
	fmt.Println(parse(line))
}
