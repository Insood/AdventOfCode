PK = 20201227

def find_loop_size(public_key, subject=7):
    value = 1
    for loop_size in range(1,1000000000):
        value *= subject
        value = value % PK
        if value == public_key:
            return loop_size

def transform(n,subject):
    value = 1
    for _ in range(0,n):
        value *= subject
        value = value % PK
    return value

def calculate_encryption_key(public_key1, public_key2):
  l1 = find_loop_size(public_key1)
  l2 = find_loop_size(public_key2)
  print(f"Loops {l1} {l2}")
  print(transform(l1,public_key2))
  print(transform(l2,public_key1))

#calculate_encryption_key(5764801,17807724)
calculate_encryption_key(8421034,15993936)