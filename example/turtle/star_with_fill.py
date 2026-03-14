from turtle import *
import math

color('red', 'yellow')
speed(0)
width(1)
begin_fill()
while True:
    forward(200)
    left(170)
    x, y = pos()
    if math.sqrt(x*x + y*y) < 1:
        break
end_fill()
done()