import React, {useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

/*
    axios는 node.js와 브라우저를 위한 Promise 기반 HTTP 클라이언트입니다
    1. axios 설치 => npm install axios --save
    2. 
*/



function LandingPage() {
    const navigate = useNavigate();

    const onRegister = () => {
        navigate("/register");
      };

    const onLogin = () => {
        navigate("/login");
    }

    useEffect(() => {
        axios.get('api/hello')
        .then(response => console.log(response.data))
    }, [])

    return (
        <Container
             style={{ border: '0.1rem solid black',marginTop:'15vh', 
                        borderRadius:'10%',width:'50%', height: '70vh', 
                            display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

            <Button style={{ margin: '2rem'}} variant="outline-dark" onClick={onRegister}>
                회원가입 페이지
            </Button>

            <Button style={{ margin: '2rem'}} variant="outline-dark" onClick={onLogin}>
                로그인 페이지
            </Button>
            
        </Container>
      
    )
}

export default LandingPage;