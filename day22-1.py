import sys
import pdb

def readfile(filename):
  with open(filename, "r") as f:
    data = f.read()
  data = data.replace("Player 1:\n","")
  p1cards, p2cards = data.split("\n\nPlayer 2:\n")
  return [int(s) for s in p1cards.split("\n")], [int(s) for s in p2cards.split("\n")]

def play(p1cards, p2cards):
  while len(p1cards) > 0 and len(p2cards) > 0:
    p1top = p1cards.pop(0)
    p2top = p2cards.pop(0)
    if p1top > p2top:
      p1cards.append(p1top)
      p1cards.append(p2top)
      print("Player 1 wins!")
    else:
      p2cards.append(p2top)
      p2cards.append(p1top)
      print("Player 2 wins!")
    print(f"Player 1 deck: {p1cards}")
    print(f"Player 2 deck: {p2cards}")
  return p1cards, p2cards

def score(deck):
  deck.reverse()
  return sum([(ix+1)*card for ix, card in enumerate(deck)])

if __name__ == "__main__":
  if len(sys.argv) !=2 :
    print(f"Usage: {sys.argv[0]} <file>")
    sys.exit()
  filename = sys.argv[1]

  p1cards, p2cards = readfile(filename)
  print(p1cards)
  print(p2cards)
  p1cards, p2cards = play(p1cards,p2cards)
  print(f"P1 score: {score(p1cards)}")
  print(f"P2 score: {score(p2cards)}")