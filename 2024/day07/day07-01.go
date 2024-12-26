package main

import (
	"fmt"
	"math"
	"os"
	"strconv"
	"strings"
)

type Equation struct {
	output int64
	inputs []int64
}

func testEquation(eq Equation) bool {
	operator_count := len(eq.inputs) - 1
	max_iteration := int64(math.Pow(2, float64(operator_count)) - 1)
	for i := int64(0); i <= max_iteration; i++ {
		output := eq.inputs[0]
		equation := strconv.FormatInt(output, 10)

		for bit := 0; bit < operator_count; bit++ {
			v := eq.inputs[bit+1]

			if (i>>bit)&1 == 0 {
				output += v
				equation += " + " + strconv.FormatInt(v, 10)
			} else {
				output *= v
				equation += " * " + strconv.FormatInt(v, 10)
			}
		}
		if output == eq.output {
			return true
		}
	}
	return false
}

func readInput() []Equation {
	equations := []Equation{}
	raw, _ := os.ReadFile(os.Args[1])
	lines := strings.Split(string(raw), "\n")
	for _, line := range lines {
		parts := strings.Split(line, ": ")
		output, _ := strconv.ParseInt(parts[0], 10, 64)
		inputs_str := strings.Split(parts[1], " ")
		inputs := []int64{}
		for _, input_str := range inputs_str {
			input, _ := strconv.ParseInt(input_str, 10, 64)
			inputs = append(inputs, input)
		}
		equations = append(equations, Equation{output, inputs})
	}
	return equations
}

func main() {
	eqs := readInput()

	output := int64(0)
	for _, eq := range eqs {
		if testEquation(eq) {
			output += eq.output
		}
	}

	fmt.Println(output)
}
