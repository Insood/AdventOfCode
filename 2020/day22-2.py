import sys
import pdb
import copy

def readfile(filename):
  with open(filename, "r") as f:
    data = f.read()
  data = data.replace("Player 1:\n","")
  p1cards, p2cards = data.split("\n\nPlayer 2:\n")
  return [int(s) for s in p1cards.split("\n")], [int(s) for s in p2cards.split("\n")]

previous_games_results = {}

def play(p1cards, p2cards):
  game_state = (tuple(p1cards), tuple(p2cards))
  if game_state in previous_games_results:
    #print("Previous result detected")
    return previous_games_results[game_state], None, None

  p1cards, p2cards = copy.copy(p1cards), copy.copy(p2cards)
  previous_rounds = []

  while len(p1cards) > 0 and len(p2cards) > 0:
    # Before either player deals a card, if there was a previous round in this game
    # that had exactly the same cards in the same order in the same players' decks,
    # the game instantly ends in a win for player 1.
    if (p1cards, p2cards) in previous_rounds:
      return 1, None, None
    else:
      previous_rounds.append((copy.copy(p1cards), copy.copy(p2cards)))

    p1top = p1cards.pop(0)
    p2top = p2cards.pop(0)

    # If both players have at least as many cards remaining in their deck as the value
    # of the card they just drew, the winner of the round is determined by playing a
    # new game of Recursive Combat (see below).
    if len(p1cards) >= p1top and len(p2cards) >= p2top:
      subdeck1 = p1cards[:p1top]
      subdeck2 = p2cards[:p2top]
      winner, _, _ = play(subdeck1, subdeck2)
      previous_games_results[(tuple(subdeck1),tuple(subdeck2))] = winner
    else:
      if p1top > p2top:
        winner = 1
      else:
        winner = 2

    if winner == 1:
      p1cards += [p1top, p2top]
    else:
      p2cards += [p2top, p1top]
  return winner, p1cards, p2cards

def score(deck):
  deck.reverse()
  return sum([(ix+1)*card for ix, card in enumerate(deck)])

if __name__ == "__main__":
  if len(sys.argv) !=2 :
    debugprint(f"Usage: {sys.argv[0]} <file>")
    sys.exit()
  filename = sys.argv[1]

  p1cards, p2cards = readfile(filename)
  winner, p1cards, p2cards = play(p1cards,p2cards)
  print(f"Winner: Player {winner}")
  print(f"P1 score: {score(p1cards)}")
  print(f"P2 score: {score(p2cards)}")