package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
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
	rightMap := make(map[int]int)

	for scanner.Scan() {
		line := scanner.Text()
		values := strings.Split(line, "   ")

		leftValue, _ := strconv.Atoi(values[0])
		rightValue, _ := strconv.Atoi(values[1])

		leftList = append(leftList, leftValue)
		rightMap[rightValue] += 1

	}

	similarity := 0.0

	for i := 0; i < len(leftList); i++ {
		leftValue := leftList[i]
		similarity += float64(rightMap[leftValue] * leftValue)
	}
	fmt.Println(int(similarity))
}
