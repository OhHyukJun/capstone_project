import cv2
import numpy as np
from PIL import Image
import os
import glob

def Test(path='test/'):
    cam = cv2.VideoCapture(0)
    cam.set(3, 640) # set video width
    cam.set(4, 480) # set video height

    face_detector = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
    count = 0
    
    recognizer = cv2.face.LBPHFaceRecognizer_create()
    recognizer.read('dataset/trainer/trainer.yml')

    imagePaths = [f for f in glob.glob(path+'*.jpg')]
    faceSamples=[]
    ids = []

    
    while(True):

        ret, img = cam.read()
        #img = cv2.flip(img, -1) # flip video image vertically
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_detector.detectMultiScale(gray)

        for (x,y,w,h) in faces:

            cv2.rectangle(img, (x,y), (x+w,y+h), (255,0,0), 2)     
            count += 1

            # Save the captured image into the datasets folder
            cv2.imwrite(path+"User." + str(count) + ".jpg", gray[y:y+h,x:x+w])

            cv2.imshow('image', img)

        k = cv2.waitKey(100) & 0xff # Press 'ESC' for exiting video
        if k == 27:
            break
        elif count >=1: # Take 30 face sample and stop video
            break
        
    cam.release()
    cv2.waitKey(1)
    
    for imagePath in imagePaths:

        PIL_img = Image.open(imagePath).convert("L")
        img_numpy = np.array(PIL_img,'uint8')

        id, confidence = recognizer.predict(img_numpy)
        id1 = str(id)

        if (confidence < 70):
            #print(imagePath)
            #print(confidence)
            #print(id)
            return id1
        else:
            #print("unknown")
            return id1