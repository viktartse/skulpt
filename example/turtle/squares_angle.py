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
    s(50 + 1 * 10)
    s(65.5 + i * 10)

penup()
goto(0, -190)
pendown()
for i in range(10):
    goto(0, -200)
    setheading(0)
    s(50 + i * 10)
    s(65.5 + i * 10)

penup()
goto(-10, 0)
setheading(0)
pendown()
left(90)
for i in range(10):
    s(50 + 1 * 10)
    s(65.5 + i * 10)

penup()
goto(-10, -10)
setheading(0)
pendown()
left(180)
for i in range(10):
    s(50 + 1 * 10)
    s(65.5 + i * 10)

penup();
goto(100, 0)
setheading(0)

pendown()
color('red')
width(2)
speed(0)
left(55)
forward(160)
color('green')
left(130)
forward(160)