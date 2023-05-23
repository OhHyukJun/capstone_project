import axios from "axios"; //axios를 통해 request를 진행합니다. 서버에서 받은 data를 request 변수에 저장
import { LOGIN_USER, REGISTER_USER } from "./types"; 

export function registerUser(dataToSubmit) {
  const request = axios.post('/api/users/register', dataToSubmit).then((response) => response.data);

  return {
    type: REGISTER_USER,
    payload: request,
  };
}

export function loginUser(dataToSubmit) {
  const request = axios.post('api/users/login', dataToSubmit).then((response) => response.data);

  return {
    type: LOGIN_USER,
    payload: request, 
    /*
      return을 시켜 reducer로 보냅니다.
      action은 type과 response를 넣어주어야합니다.
      type 이름은 LOGIN_USER(type 파일에서 빼서 관리합니다)
      response(request)를 payload라는 변수명에 저장합니다.
    */
  };
}