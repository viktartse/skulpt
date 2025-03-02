from p5 import *

def setup():
    createCanvas(720, 400)

    global capture
    capture = createCapture(VIDEO)

    capture.size(360, 200)

    capture.hide()

def draw():
    background(51)
    image(capture, 0, 0, 360, 400)
    filter(INVERT)

run()