package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

// type CacheMap map[int]*map[int]int
type TupleKey struct {
	value int
	depth int
}
type CacheMap map[TupleKey]int

func ReadFile() []int {
	raw, _ := os.ReadFile(os.Args[1])
	values := strings.Split(string(raw), " ")

	input := []int{}

	for _, s := range values {
		v, _ := strconv.Atoi(s)
		input = append(input, v)
	}
	return input
}

func EvenNumberOfDigits(i int) bool {
	s := strconv.Itoa(i)
	return len(s)%2 == 0
}

func SplitNumber(i int) (int, int) {
	s := strconv.Itoa(i)
	s1, _ := strconv.Atoi(s[:len(s)/2])
	s2, _ := strconv.Atoi(s[len(s)/2:])
	return s1, s2
}

func Evolve(v int) (int, int) {
	if v == 0 {
		return 1, -1
	} else if EvenNumberOfDigits(v) {
		s1, s2 := SplitNumber(v)
		return s1, s2
	} else {
		return v * 2024, -1
	}
}

func RecursiveCalculate(cache *CacheMap, input int, depth int, target_depth int) int {
	if depth == target_depth {
		return 1
	}

	sum := 0

	v1, v2 := Evolve(input)

	cached_v1, ok := (*cache)[TupleKey{v1, target_depth - depth}]
	if ok {
		sum += cached_v1
	} else {
		calculated_v1 := RecursiveCalculate(cache, v1, depth+1, target_depth)
		(*cache)[TupleKey{v1, target_depth - depth}] = calculated_v1
		sum += calculated_v1
	}

	if v2 == -1 {
		return sum
	}

	cached_v2, ok := (*cache)[TupleKey{v2, target_depth - depth}]
	if ok {
		sum += cached_v2
	} else {
		calculated_v2 := RecursiveCalculate(cache, v2, depth+1, target_depth)
		(*cache)[TupleKey{v2, target_depth - depth}] = calculated_v2
		sum += calculated_v2
	}

	return sum
}

func Calculate(input []int, depth int) {
	cache := make(CacheMap)

	sum := 0
	for _, v := range input {
		sum += RecursiveCalculate(&cache, v, 0, depth)
	}
	fmt.Println(sum)
}

func main() {
	input := ReadFile()
	Calculate(input, 25)
	Calculate(input, 75)
}
