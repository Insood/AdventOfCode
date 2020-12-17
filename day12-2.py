import math

class Ship:
  def __init__(self, wx, wy):
    self.x = 0
    self.y = 0
    
    self.wx = wx
    self.wy = wy

  def move(self, command):
    cmd = command[0]
    arg = int(command[1:])

    if cmd == "N":
      self.wy += arg
    elif cmd == "S":
      self.wy -= arg
    elif cmd == "W":
      self.wx -= arg
    elif cmd =="E":
      self.wx += arg
    elif cmd == "F":
      self.x += self.wx * arg
      self.y += self.wy * arg
    elif cmd == "L":
      self.rotate(arg)
    elif cmd == "R":
      self.rotate(-arg)

  def rotate(self, angle):
    rad = math.radians(angle)
    self.wx, self.wy = [round(self.wx*math.cos(rad) - self.wy*math.sin(rad),0 ),
                        round(self.wx*math.sin(rad) + self.wy*math.cos(rad),0 )]

  def __repr__(self):
    return f"({self.x},{self.y}) Waypoint: ({self.wx},{self.wy})"

with open("day12.txt") as f:
  commands = f.readlines()

ship = Ship(10,1)
print (ship)

for command in commands:
  command = command.replace("\n","")
  ship.move(command)
  print(command, ship)

print(f"Manhattan dist: {math.fabs(ship.x) + math.fabs(ship.y)}")