from turtle import *

speed(0)
width(1)

def s(n):
    color('red')
    forward(n)
    left(90)
    color('blue')
    forward(n)
    left(90)
    color('green')
    forward(n)
    left(90)
    color('orange')
    forward(n)
    left(90)

for i in range(10):
    s(50 + i * 10)
    s(65.5 + i * 10)

penup()
goto(0, -200)
pendown()
for i in range(10):
    goto(0, -200)
    setheading(0)
    s(50 + i * 10)
    s(65.5 + i * 10)
