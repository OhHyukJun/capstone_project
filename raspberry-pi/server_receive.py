#여기서 데이터받고 makedataset 실행

import json
import socket
import MakeDataset as MD
import TestReturn as TR
# TCP 서버 설정
host = '0.0.0.0'  # 모든 IP 주소에서 연결 허용
port = 5000  # 사용할 포트 번호


def handle_client(client_socket):
    # 클라이언트로부터 데이터 수신
    received_data = client_socket.recv(1024).decode()
    print(received_data)
    
    # 수신한 데이터에서 JSON 데이터 추출
    json_start = received_data.find('{')  # JSON 데이터 시작 위치
    json_end = received_data.rfind('}')  # JSON 데이터 종료 위치
    json_data = received_data[json_start:json_end+1]
    
    # JSON 데이터 확인
    print('Received JSON data:', json_data)
   
    # JSON 데이터 파싱하여 처리
    try:
        data = json.loads(json_data)
        name = data.get('name')
        password = data.get('password')
        #print(password)
        MD.photos(password)
        MD.train()
        #print(password)
        #function start
   
    except json.JSONDecodeError:
        print("Invalid JSON format.")
   
    # 클라이언트에 응답 전송 (옵션)
    client_socket.send(b'Success')  # 클라이언트에게 성공 메시지 전송
   
    # 클라이언트 소켓 종료
    client_socket.close()



# TCP 서버 실행
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.bind((host, port))
server_socket.listen(1)  # 최대 1개의 동시 접속 허용

print('TCP server listening on {}:{}'.format(host, port))

while True:
    # 클라이언트 연결 대기
    client_socket, addr = server_socket.accept()
    print('Connected by', addr)

    # 클라이언트 요청 처리
    handle_client(client_socket)
