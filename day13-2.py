import math
import numpy as np
from scipy.linalg import qr
from decimal import *

# The solution to this problem is to use the Chinese Remainder Theorem
# http://homepages.math.uic.edu/~leon/mcs425-s08/handouts/chinese_remainder.pdf

# From: https://stackoverflow.com/questions/4798654/modular-multiplicative-inverse-function-in-python
def egcd(a, b):
    if a == 0:
        return (b, 0, 1)
    else:
        g, y, x = egcd(b % a, a)
        return (g, x - (b // a) * y, y)

def modinv(a, m):
    g, x, y = egcd(a, m)
    if g != 1:
        raise Exception('modular inverse does not exist')
    else:
        return x % m

with open("day13.txt") as f:
  lines = f.readlines()

leave_at = int(lines[0])
raw_busses = lines[1]

Ms = []
As = [] 

for ix, bus_str in enumerate(raw_busses.split(",")):
  if bus_str == "x":
    continue

  bus_id = int(bus_str)
  Ms.append(bus_id)
  As.append(ix)

print(Ms, As)

m = 1
for m_v in Ms:
  m *= m_v

Zs = [ m/m_v for m_v in Ms]
Ys = [ modinv(z_v,m_v) for z_v, m_v in zip(Zs, Ms)]
Ws = [ Decimal(y_v * z_v) for y_v, z_v in zip(Ys,Zs)]
x = sum([a_v * w_v for a_v, w_v in zip(As,Ws)])

print("M:", m)
print("Zs:", Zs)
print("Ys:", Ys)
print("Ws:", Ws)

print(x)
print(x%m)
print(m-x%m)