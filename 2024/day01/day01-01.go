package main

import (
	"bufio"
	"fmt"
	"log"
	"math"
	"os"
	"sort"
	"strconv"
	"strings"
)

func main() {
	fileName := os.Args[1]
	file, err := os.Open(fileName)
	if err != nil {
		log.Fatal(err)
	}

	scanner := bufio.NewScanner(file)

	leftList := []int{}
	rightList := []int{}

	for scanner.Scan() {
		line := scanner.Text()
		values := strings.Split(line, "   ")

		leftValue, _ := strconv.Atoi(values[0])
		rightValue, _ := strconv.Atoi(values[1])

		leftList = append(leftList, leftValue)
		rightList = append(rightList, rightValue)
	}

	sort.Ints(leftList)
	sort.Ints(rightList)

	sum := 0.0

	for i := 0; i < len(leftList); i++ {
		sum += math.Abs(float64(leftList[i] - rightList[i]))
	}
	fmt.Println(int(sum))
}
