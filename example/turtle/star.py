from turtle import *
width(1)
speed(0)
ht()

color('black')

fillcolor('red')
begin_fill()
circle(40)
end_fill()


penup()
goto(0, 40)
pendown()

for i in range(8):
    forward(50)
    right(90)
    forward(50)
    left(45) 
