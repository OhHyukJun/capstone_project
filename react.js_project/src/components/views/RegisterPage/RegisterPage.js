import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../_actions/user_action";
import { useNavigate } from "react-router-dom";

function RegisterPage(props){
    const dispatch = useDispatch();
    const navigate = useNavigate();
   
    const [Name, setName] = useState("");
    const [Password, setPassword] = useState("");
    const [Department, setDepartment] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");
    const onNameHandler = (event) => {
        setName(event.target.value);
    };

    const onDepartmentHandler = (event) => {
        setDepartment(event.target.value);
    };

    const onPasswordHandler = (event) => {
        setPassword(event.target.value);
    };

    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.target.value);
    };
    
    const onSubmitHandler = async (event) => {
        event.preventDefault();
        
        if (Password !== ConfirmPassword) {
          return alert("Passwords do not match");
        }
        
        const body = {
          name: Name,
          department: Department,
          password: Password,
        };
      
        try {
          const response = await dispatch(registerUser(body));
          
          if (response.payload.success) {
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
        <label>Name</label>
        <input type="text" value={Name} onChange={onNameHandler} />

        <label>DepartmentNum</label>
        <input type="number" value={Department} onChange={onDepartmentHandler} />

        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />

        <label>Confirm Password</label>
        <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />

        <br />
        <button onSubmit={onSubmitHandler}>회원가입</button>
      </form>
    </div>
  );
}

export default RegisterPage;