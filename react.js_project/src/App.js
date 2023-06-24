import React from "react";
import {BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/views/LandingPage/LandingPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import 'bootstrap/dist/css/bootstrap.min.css';

/* 
  라우팅에 관련한 것들을 처리합니다.
  라우팅이란 html로 치면 a 태그 같은 개념인데 로그인 페이지로 가고 싶다면 
  로그인 페이지로 보내주고, 랜딩 페이지로 가고 싶으면 랜딩 페이지로 보내주는 등의 
  역할을 하는 것을 라우팅입니다.
  
*/

function App() {
  return (
   <Router>
      <React.Fragment>
        <Routes>
          <Route exact path="/" element={<LandingPage/>}/>
          <Route exact path="/register" element={<RegisterPage/>}/> {/* 등록 페이지로 이동 */}
        </Routes>
      </React.Fragment>
   </Router>
  );
}

export default App;
