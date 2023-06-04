import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../_actions/user_action";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import './style.scss';

function RegisterPage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [Name, setName] = useState("");
  const [DepartmentNum, setDepartmentNum] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  const onNameHandler = (event) => {
    setName(event.target.value);
  };

  const onDepartmentNumHandler = (event) => {
    setDepartmentNum(event.target.value);
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
      departmentNum: DepartmentNum,
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
    <div className="register-page">
      <form style={{ display: "flex", flexDirection: "column" }}>
        <label>Name</label>
        <input type="text" value={Name} onChange={onNameHandler} />

        <label>DepartmentNum</label>
        <input type="number" value={DepartmentNum} onChange={onDepartmentNumHandler} />

        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />

        <label>Confirm Password</label>
        <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />

        <br />
        <Button variant="secondary" onClick={onSubmitHandler}>
          Register
        </Button>
      </form>
    </div>
  );
}

export default RegisterPage;