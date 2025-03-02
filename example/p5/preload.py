from p5 import *

def onload(event):
    print("loaded", event.height, event.isModified())

def preload():
    global bottomImg
    bottomImg = loadImage('https://p5js.org/assets/parrot-color.png', onload)
    global topImg
    topImg = loadImage('https://p5js.org/assets/parrot-bw.png', onload)

def setup():
    createCanvas(720, 400)
    image(topImg, 0, 0)

def mouseDragged():
    copy(bottomImg, mouseX, mouseY, 20, 20, mouseX, mouseY, 20, 20)
    
run()