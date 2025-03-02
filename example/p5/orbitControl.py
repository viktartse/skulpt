from p5 import *

def setup():
    createCanvas(710, 400, WEBGL)
    angleMode(DEGREES)
    strokeWeight(5)
    noFill()
    stroke(32, 8, 64)

def draw():
    background(250, 180, 200)

    orbitControl()

    for zAngle in range(0, 180, 30):
        for xAngle in range(0, 360, 30):
            push()

            rotateZ(zAngle)
            rotateX(xAngle)

            translate(0, 400, 0)
            box()
            pop()

run()