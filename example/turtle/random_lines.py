from turtle import *
import random
setup(2500, 2500)
width(1)
color('red', 'yellow')
speed(0)
begin_fill()

for i in range(200):
    x = random.randint(-660, 660)
    y = random.randint(-520, 520)
    goto(x, y)

end_fill()
done()