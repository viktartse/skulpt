from p5 import *

def setup():
    createCanvas(710, 400)
    background(0)
    strokeWeight(10)
    colorMode(HSB)

def mouseDragged():
    lineHue = mouseX - mouseY
    stroke(lineHue, 90, 90)
    line(pmouseX, pmouseY, mouseX, mouseY)

run()