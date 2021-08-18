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

def count_non_allergen_ingredients(non_allergen_ingredients, ingredients_allergens):
  usage = 0
  for ingredient in non_allergen_ingredients:
    for ingredients, allergens in ingredients_allergens:
      if ingredient in ingredients:
        usage += 1
  return usage

if __name__ == "__main__":
  if len(sys.argv) !=2 :
    print(f"Usage: {sys.argv[0]} <file>")
    sys.exit()
  filename = sys.argv[1]

  ingredients_allergens, ingredients, allergens = loadfile(filename)
  candidate_allergens, non_allergen_ingredients = exclude_ingredients(ingredients_allergens, ingredients, allergens)
  non_allergen_ingredient_usage = count_non_allergen_ingredients(non_allergen_ingredients, ingredients_allergens)
  print(f"Part 1: {non_allergen_ingredient_usage}")