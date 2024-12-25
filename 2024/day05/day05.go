package main

import (
	"fmt"
	"os"
	"slices"
	"strconv"
	"strings"
)

type Rule struct {
	before int
	after  int
}

func readRules(rule_string string) []Rule {
	rules := []Rule{}

	rule_strings := strings.Split(rule_string, "\n")
	for _, line := range rule_strings {
		parts := strings.Split(line, "|")
		before, _ := strconv.Atoi(parts[0])
		after, _ := strconv.Atoi(parts[1])
		rules = append(rules, Rule{before: before, after: after})
	}
	return rules
}

func readUpdates(update_string string) [][]int {
	updates := [][]int{}
	update_strings := strings.Split(update_string, "\n")
	for _, line := range update_strings {
		parts := strings.Split(line, ",")
		update := []int{}
		for _, part := range parts {
			num, _ := strconv.Atoi(part)
			update = append(update, num)
		}
		updates = append(updates, update)
	}

	return updates
}

func findInvalidRule(rules []Rule, update []int) int {
	for rule_ix, rule := range rules {
		if !slices.Contains(update, rule.before) || !slices.Contains(update, rule.after) {
			continue
		}
		before_ix := slices.Index(update, rule.before)
		after_ix := slices.Index(update, rule.after)

		if before_ix > after_ix {
			return rule_ix
		}
	}
	return -1
}

func middleValue(update []int) int {
	return update[len(update)/2]
}

func reorder(rules []Rule, update []int) []int {
	applicable_rules := []Rule{}
	for _, rule := range rules {
		if slices.Contains(update, rule.before) && slices.Contains(update, rule.after) {
			applicable_rules = append(applicable_rules, rule)
		}
	}

	for true {
		if findInvalidRule(applicable_rules, update) == -1 {
			break
		}

		for _, rule := range applicable_rules {
			before_ix := slices.Index(update, rule.before)
			after_ix := slices.Index(update, rule.after)

			if after_ix < before_ix {
				new_slice := []int{}
				new_slice = append(new_slice, update[:after_ix]...)
				new_slice = append(new_slice, rule.before)
				new_slice = append(new_slice, update[after_ix:before_ix]...)
				new_slice = append(new_slice, update[before_ix+1:]...)
				update = new_slice
			}
		}
	}
	return update
}

func main() {
	fileName := os.Args[1]
	raw, _ := os.ReadFile(fileName)
	contents := string(raw)
	parts := strings.Split(contents, "\n\n")
	rules := readRules(parts[0])
	updates := readUpdates(parts[1])

	initially_valid := 0
	corrected_values := 0

	for _, update := range updates {
		invalid_rule_ix := findInvalidRule(rules, update)
		if invalid_rule_ix == -1 {
			initially_valid += middleValue(update)
		} else {
			corrected_ordering := reorder(rules, update)
			corrected_values += middleValue(corrected_ordering)
		}
	}
	fmt.Println("part1", initially_valid)
	fmt.Println("part2", corrected_values)
}
