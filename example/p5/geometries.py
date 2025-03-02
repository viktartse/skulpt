from p5 import *

def preload():
    global astronaut
    astronaut = loadModel('https://p5js.org/assets/astronaut.obj')

def setup():
    createCanvas(710, 400, WEBGL)
    angleMode(DEGREES)
    normalMaterial()

def draw():
    background(250)

    push()
    translate(-250, -100, 0)
    rotateWithFrameCount()
    plane(70)
    pop()

    push()
    translate(-75, -100, 0)
    rotateWithFrameCount()
    box(70, 70, 70)
    pop()

    push()
    translate(100, -100, 0)
    rotateWithFrameCount()
    cylinder(70, 70)
    pop()

    push()
    translate(275, -100, 0)
    rotateWithFrameCount()
    cone(50, 70)
    pop()

    push()
    translate(-250, 100, 0)
    rotateWithFrameCount()
    torus(50, 20)
    pop()

    push()
    translate(-75, 100, 0)
    rotateWithFrameCount()

    stroke(0)
    sphere(50)
    pop()

    push()
    translate(100, 100, 0)
    rotateWithFrameCount()
    ellipsoid(20, 40, 40)
    pop()

    push()
    translate(275, 100, 0)
    rotateWithFrameCount()

    rotateZ(180)
    model(astronaut)
    pop()

def rotateWithFrameCount():
    rotateZ(frameCount)
    rotateX(frameCount)
    rotateY(frameCount)

run()