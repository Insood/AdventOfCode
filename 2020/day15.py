class Game:
  def __init__(self, initial_values):
    self.initial_values = initial_values.copy()
    self.log = []
    self.turn_counter = 0
    self.speak_counter = {}

  def say_initial_values(self):
    for n in self.initial_values:
      self.turn_counter += 1
      self.speak(n)
      #print(f"Turn {self.turn_counter} Saying {n}")

  def speak(self,n):
    self.log.append(n)
    if n in self.speak_counter:
      self.speak_counter[n].append(self.turn_counter)
    else:
      self.speak_counter[n] = [self.turn_counter]

  def play(self):
    self.say_initial_values()

    while self.turn_counter < 30000000:
      self.turn_counter += 1
      last_spoken_number = self.log[-1]

      if len(self.speak_counter[last_spoken_number]) == 1:
        #print(f"Turn {self.turn_counter} Saying 0 (First Time for #{last_spoken_number}) Total numbers=({len(self.speak_counter)})")
        self.speak(0)
      else:
        ix = self.speak_counter[last_spoken_number][-2]
        n = self.turn_counter - 1 - ix
        #print(f"Turn {self.turn_counter} Saying {n} Last={last_spoken_number} Last Time={ix}")
        self.speak(n)
    print(f"Last number spoken is: {self.log[-1]}")

g = Game([3,1,2])
g.play()