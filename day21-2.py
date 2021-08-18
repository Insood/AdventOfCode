import pdb
import sys

def loadfile(filename):
  ingredients_allergens = []
  ingredients_set = set()
  allergens_set = set()

  with open(filename, "r") as f:
    lines = f.readlines()

  for line in lines:
    ingredients, allergens = line.strip().replace(")","").split(" (contains ")
    ingredients = ingredients.split(" ")
    for ingredient in ingredients:
      ingredients_set.add(ingredient)

    allergens = allergens.split(", ")
    for allergen in allergens:
      allergens_set.add(allergen)

    ingredients_allergens.append([ingredients, allergens])
  return ingredients_allergens, ingredients_set, allergens_set

def calculate_candidate_allergens(ingredients_allergens, ingredient, allergen):
  for food_ingredients, food_allergens in ingredients_allergens:
    if not allergen in food_allergens:
      continue

    if (allergen in food_allergens) and not (ingredient in food_ingredients):
      return False

  return True

def exclude_ingredients(ingredients_allergens, ingredients_set, allergens_set):
  candidate_allergens = set()
  non_allergen_ingredients = []

  # For each ingredient -- see if it can be an allergen
  for ingredient in ingredients_set:
    matches = 0
    for allergen in allergens_set:
      candidate = calculate_candidate_allergens(ingredients_allergens, ingredient, allergen)

      if candidate:
        candidate_allergens.add((ingredient, allergen))
        matches += 1
    if matches == 0:
      non_allergen_ingredients.append(ingredient)

  return candidate_allergens, non_allergen_ingredients

def group_ingredients_by_allergen(ingredients_allergens, candidate_allergens):
  possible_allergens_for_ingredient = {}
  for ingredient, allergen in candidate_allergens:
    if ingredient not in possible_allergens_for_ingredient:
      possible_allergens_for_ingredient[ingredient] = []
    possible_allergens_for_ingredient[ingredient].append(allergen)
  return possible_allergens_for_ingredient

def remove_allergen_from_list(allergen, possible_allergens_for_ingredient):
  for ingredient, allergens in possible_allergens_for_ingredient.items():
    if allergen in allergens:
      allergens.remove(allergen)

def match_ingredient_to_allergen(possible_allergens_for_ingredient):
  ingredient_to_allergen = {}

  while len(possible_allergens_for_ingredient) != len(ingredient_to_allergen):
    for ingredient in possible_allergens_for_ingredient.keys():
      if len(possible_allergens_for_ingredient[ingredient]) == 1:
        allergen = possible_allergens_for_ingredient[ingredient][0]
        ingredient_to_allergen[ingredient] = allergen
        remove_allergen_from_list(allergen, possible_allergens_for_ingredient)
  return ingredient_to_allergen

def sort_ingredients_by_allergen(ingredient_to_allergen):
  sortable_list = [(k,v) for k,v in ingredients_to_allergen.items()]
  sortable_list.sort(key=lambda item: item[1])
  ingredient_by_alphabetical_allergen = [ingredient for ingredient, allergen in sortable_list]
  return ','.join(ingredient_by_alphabetical_allergen)

if __name__ == "__main__":
  if len(sys.argv) !=2 :
    print(f"Usage: {sys.argv[0]} <file>")
    sys.exit()
  filename = sys.argv[1]

  ingredients_allergens, ingredients, allergens = loadfile(filename)
  candidate_allergens, non_allergen_ingredients = exclude_ingredients(ingredients_allergens, ingredients, allergens)
  possible_allergens_for_ingredient = group_ingredients_by_allergen(ingredients_allergens, candidate_allergens)
  ingredients_to_allergen = match_ingredient_to_allergen(possible_allergens_for_ingredient)
  print(f"Part 2 answer: {sort_ingredients_by_allergen(ingredients_to_allergen)}")