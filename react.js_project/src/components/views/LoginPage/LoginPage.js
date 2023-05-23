import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../_actions/user_action";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';

function LoginPage(props) {
  const dispatch = useDispatch(); 
  const navigate = useNavigate();

  const [Name, setName] = useState(""); //id state와 변경시킬 setId
  const [Password, setPassword] = useState("");

  const onNameHandler = (event) => {
    setName(event.target.value);
  };

  const onPasswordHandler = (event) => {
    setPassword(event.target.value);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    const body = {
      name: Name,
      password: Password,
    };
  
    try {
      const response = await dispatch(loginUser(body));
      
      if (response.payload.loginSuccess) {
        navigate("/");
      } else {
        alert("Fail");
      }
    } catch (error) {
      console.error(error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  return (
    <div
      style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100vh" }}
      onSubmit={onSubmitHandler}
    >
      <form style={{ display: "flex", flexDirection: "column" }}>
        <label>Id</label>
        <input type="text" value={Name} onChange={onNameHandler} />
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />
        <br />
        <Button variant="secondary">login</Button>
      </form>
    </div>
  );
}

export default LoginPage;