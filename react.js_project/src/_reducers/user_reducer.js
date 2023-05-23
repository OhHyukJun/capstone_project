import { LOGIN_USER, REGISTER_USER } from "../_actions/types";

const userReducer = (state = {}, action) => {
  //userReducer라는 함수를 만들어서 state와 action을 받습니다.
  switch (action.type) {
    //여러 type을 관리하기 위해 switch 문을 사용합니다.
    case LOGIN_USER:
      return { ...state, loginSuccess: action.payload };
      //state를 spread한 것에 loginSuccess에 해당 action의 payload를 넣어줍니다.(서버에 값을 전달)
      case REGISTER_USER:
        return { ...state, register: action.payload };
    
    default:
      return state;
  }
};


export default userReducer;