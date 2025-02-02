# capstone_project

## 프로젝트 소개

이 프로젝트는 얼굴인식 도어락 기능을 구현하고자 한 프로젝트입니다.

react.js와 node.js를 사용하여 express 서버에서 WiFi 통신을 통해 데이터를 라즈베리파이로 보내면 라즈베리파이에서 얼굴인식 알고리즘을 통해 학습을 진행하고 학습이 된 유저와 되지 않은 유저를 판단하여 다시 서버로 데이터를 전송하는 방식으로 프로젝트를 진행하였습니다.

## 백 코드
- index.js
  - 몽고DB 연결
  - 기능들의 경로를 설정하여 메인, 회원등록, 로그인 등의 기능을 구현
  - 라즈베리 파이와 와이파이 통신하는 코드 추
- User.js
  - 사용할 데이터의 값을 스키마로 선언
  - 암호화를 위한 hash 함수를 사용
  - jwt 토큰 사용 위에서 toHexString로 토큰을 생성
  - 로그인 시 비밀번호 비교
  - 생성된 토큰을 비교하여 있으면 login 성

## 프론트 코드
- views 폴더
  - 회원가입, 메인 페이지 등을 구현
- App.js
  - 라우터를 사용하여 경로 설정
- setupProxy.js
  - 프록시 주소를 설정하여 react와 node를 npm run dev로 동시 실행   

## 통신 파이 코드
- socket, request등을 사용하여 서버와 통신하여 로그인, 회원등록 등을 처리
- 얼굴인식 파일을 실행하여 유저 얼굴을 학습하여 등록처라
