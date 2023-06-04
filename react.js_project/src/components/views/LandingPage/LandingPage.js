import React, {useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import '../../../App.css';

/*
    axios는 node.js와 브라우저를 위한 Promise 기반 HTTP 클라이언트입니다
    1. axios 설치 => npm install axios --save
    2. 
*/



function LandingPage() {
    const navigate = useNavigate();

    const onLogout = () =>{
        axios.get('api/users/logout').then((response) => {
            if (response.data.success){
                navigate("/login");
            }
            else{
                alert("fail");
            }
        });
    };

    const onRegister = () => {
        navigate("/register");
      };

    const onLogin = () => {
        navigate("/login");
    }

    return (
        <React.Fragment>
        <Navbar bg="light" expand="lg" style={{ marginBottom: '2rem' }}>
          <Navbar.Brand href="/" className="p-1">Capstone</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto" style={{margin: '1rem'}}>
              <Nav.Link onClick={onRegister}>회원가입 페이지</Nav.Link>
              <Nav.Link onClick={onLogin}>로그인 페이지</Nav.Link>
              <Nav.Link onClick={onLogout}>로그아웃</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Container className="p-5">
        <Row className='main-bg'>
        </Row>
        </Container>
        </React.Fragment>
    )
}

export default LandingPage;