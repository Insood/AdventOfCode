import numpy as np
import sys
import pdb

raw_pattern = ["00000000000000000010","10000110000110000111","01001001001001001000"]
pattern = np.array([[int(c) for c in s] for s in raw_pattern])

def search_image(img):
  img_rows, img_cols = img.shape
  pattern_rows, pattern_cols = pattern.shape

  matches = []
  for row in range(0, img_rows - pattern_rows):
    for col in range(0, img_cols - pattern_cols):
      img_crop = img[row:row+pattern_rows, col:col+pattern_cols]
      if (np.logical_and(img_crop,pattern) == pattern).all():
        matches.append((row,col))

  return matches

def replace_monsters(img, matches):
  img_rows, img_cols = img.shape
  pattern_rows, pattern_cols = pattern.shape

  for row, col in matches:
    img[row:row+pattern_rows, col:col+pattern_cols] += pattern
  
  return img

def calculate_turbulence(replaced_img):
  return np.count_nonzero(replaced_img == 1)

if __name__ == "__main__":
  if len(sys.argv) !=2 :
    print(f"Usage: {sys.argv[0]} <img data as numpy array>")
    sys.exit()
  filename = sys.argv[1]

  img = np.loadtxt(filename)

  for flip, img_data in [("original", img), ("flipped",np.flipud(img))]:
    for rotations in range(0,4):
      img_candidate = np.rot90(img_data,rotations)

      matches = search_image(img_candidate)
      replaced_img = replace_monsters(img_candidate, matches)
      turbulence = calculate_turbulence(replaced_img)

      print(f"Img: {flip}, rotations: {rotations}, matches: {len(matches)}, turbulence: {turbulence}")
