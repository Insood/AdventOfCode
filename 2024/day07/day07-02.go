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

func concat(a, b int64) int64 {
	out, _ := strconv.ParseInt(strconv.FormatInt(a, 10)+strconv.FormatInt(b, 10), 10, 64)
	return out
}

func testEquation(eq Equation) bool {
	operator_count := len(eq.inputs) - 1
	max_iteration := int64(math.Pow(3, float64(operator_count)) - 1)
	format := "%0" + strconv.Itoa(operator_count) + "s"

	for i := int64(0); i <= max_iteration; i++ {
		base3 := strconv.FormatInt(i, 3)
		base3 = fmt.Sprintf(format, base3)
		output := eq.inputs[0]

		for op_ix := 0; op_ix < operator_count; op_ix++ {
			v := eq.inputs[op_ix+1]
			op := string(base3[op_ix])

			if op == "0" {
				output += v
			} else if op == "1" {
				output *= v
			} else {
				output = concat(output, v)
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
