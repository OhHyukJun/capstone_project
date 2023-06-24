import cv2
import os
import numpy as np
from PIL import Image
import glob


def photos(password):

    cam = cv2.VideoCapture(0)
    cam.set(3, 640)
    cam.set(4, 480)

    face_detector = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

    face_id = password
    count = 0

    while(True):

        ret, img = cam.read()
        #img = cv2.flip(img, -1)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_detector.detectMultiScale(gray, 1.3, 5, minSize=(100,100))

        for (x,y,w,h) in faces:

            cv2.rectangle(img, (x,y), (x+w,y+h), (255,0,0), 2)
            count += 1

            cv2.imwrite("dataset/User." + str(face_id) + '.' + str(count) + ".jpg", gray[y:y+h,x:x+w])

            cv2.imshow('image', img)

        k = cv2.waitKey(100) & 0xff
        if k == 27:
           break
        elif count >=50:
           break
    
    print("Capture done!")
    cam.release()
    cv2.waitKey(1)
    cv2.destroyAllWindows()
    cv2.waitKey(1)

def train():
    recognizer = cv2.face.LBPHFaceRecognizer_create()
    detector = cv2.CascadeClassifier("haarcascade_frontalface_default.xml")

    imagePaths = [f for f in glob.glob('dataset/'+'*.jpg')]
    faceSamples=[]
    ids = []

    for imagePath in imagePaths:

        PIL_img = Image.open(imagePath).convert('L') # convert it to grayscale
        img_numpy = np.array(PIL_img,'uint8')

        id = int(os.path.split(imagePath)[-1].split(".")[1])
        faces = detector.detectMultiScale(img_numpy)

        for (x,y,w,h) in faces:
            faceSamples.append(img_numpy[y:y+h,x:x+w])
            ids.append(id)

    recognizer.train(faceSamples, np.array(ids))

    recognizer.write('dataset/trainer/trainer.yml')
    
    print("\n {0} faces trained. Exiting Program!".format(len(np.unique(ids))))



