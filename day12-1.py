class Ship:
  def __init__(self):
    self.x = 0
    self.y = 0
    
    self.dir_x = 1
    self.dir_y = 0

  def move(self, command):
    cmd = command[0]
    dist = int(command[1:])

    if cmd == "N":
      self.y += dist
    elif cmd == "S":
      self.y -= dist
    elif cmd == "W":
      self.x -= dist
    elif cmd =="E":
      self.x += dist
    elif cmd == "F":
      self.x += self.dir_x * dist
      self.y += self.dir_y * dist
    elif cmd == "L":
      rotations = dist/90
      while rotations > 0:
        self.rotate_left()
        rotations -= 1
    elif cmd == "R":
      rotations = dist/90
      while rotations > 0:
        self.rotate_right()
        rotations -= 1

  def rotate_left(self):
    rotations = { (1,0) : (0,1),
                  (0,1) : (-1,0),
                  (-1,0): (0,-1),
                  (0,-1): (1, 0) }

    self.dir_x, self.dir_y = rotations[(self.dir_x, self.dir_y)]

  def rotate_right(self):
    rotations = { (1,0) : (0,-1),
                  (0,-1) : (-1,0),
                  (-1,0): (0,1),
                  (0,1): (1, 0) }

    self.dir_x, self.dir_y = rotations[(self.dir_x, self.dir_y)]

  def __repr__(self):
    return f"({self.x},{self.y}) Orientation: ({self.dir_x},{self.dir_y})"

with open("day12.txt") as f:
  commands = f.readlines()

ship = Ship()

for command in commands:
  ship.move(command)
  print(command, ship)