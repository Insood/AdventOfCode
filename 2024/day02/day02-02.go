package main

import (
	"bufio"
	"fmt"
	"log"
	"math"
	"os"
	"strconv"
	"strings"
)

func safe(numbers []int) bool {
	var increasing bool = bool(numbers[1] > numbers[0])

	for i := 0; i < len(numbers)-1; i++ {
		this := numbers[i]
		next := numbers[i+1]

		// Values must change between iteration
		// Values must not change by more than 3
		// Values must always be incresing or decreasing
		if (this == next) || (math.Abs(float64(this-next)) > 3) || increasing && (next < this) || !increasing && (next > this) {
			return false
		}

	}
	return true
}

func main() {
	fileName := os.Args[1]
	file, err := os.Open(fileName)
	if err != nil {
		log.Fatal(err)
	}

	scanner := bufio.NewScanner(file)

	safe_reports := 0

	for scanner.Scan() {
		line := scanner.Text()
		values := strings.Split(line, " ")
		var numbers []int
		for i := 0; i < len(values); i++ {
			number, _ := strconv.Atoi(values[i])
			numbers = append(numbers, number)
		}

		if safe(numbers) {
			safe_reports += 1
		} else {
			for i := 0; i < len(numbers); i++ {
				new_array := append([]int{}, numbers[:i]...)
				new_array = append(new_array, numbers[i+1:]...)

				if safe(new_array) {
					safe_reports += 1
					break
				}
			}
		}
	}

	fmt.Println(safe_reports)
}
