from p5 import *

def setup():
    createCanvas(400, 400)

def draw():
    if mouseIsPressed:
        fill(0)
    else:
        fill(255)

    circle(mouseX, mouseY, 100)

run()