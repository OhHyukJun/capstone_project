import face_recognition

image = face_recognition.load_image_file("dataset/User.1.1.jpg")
face_locations = face_recognition.face_locations(image)

print(face_locations)