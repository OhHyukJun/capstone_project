import cv2
import numpy as np
from PIL import Image
import os
import glob

recognizer = cv2.face.LBPHFaceRecognizer_create()
recognizer.read('dataset/trainer/trainer.yml')

path = 'test/'

imagePaths = [f for f in glob.glob(path+'*.jpg')]
faceSamples=[]
ids = []

for imagePath in imagePaths:

    PIL_img = Image.open(imagePath).convert("L")
    img_numpy = np.array(PIL_img,'uint8')

    id, confidence = recognizer.predict(img_numpy)

    if (confidence < 100):
        print(imagePath)
        print(id)
        print(confidence)
    else:
        print("unknown")