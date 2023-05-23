
const express = require('express');
// express 모듈을 express라는 이름으로 사용할 수 있도록 선언
const app = express();
// express 함수를 이용해 새로운 express 앱을 만듬
const port = 4000;
// 4000번 포트 사용
//const bodyParser = require('body-parser');
const { User } = require('./model/User');
// 앞서 다운받았던 bodyParser와 작성했던 User 모델을 불러옴
const cookieParser = require('cookie-parser');
// 쿠키에 토큰을 저장하기 위해 사용하는 라이브러리

app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
/* 
    바디파서가 클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있도록 해주는 것
*/

const config = require('./config/key');
const mongoose = require('mongoose');
//const { auth } = require("./middelware/auth");

const connect = async () => {
    try {
        await mongoose.connect("mongodb+srv://ohj3961:8756@cluster0.1ytxiv9.mongodb.net/myFirstDatabase",{
            useNewUrlParser: true,
        });
        console.log('MongoDB Connected...');

        mongoose.connection.on('error',(err)=>{
            console.log('MongoDB connect ERROR',err)
        });

        mongoose.connection.addListener('disconnected', () => {
            console.log('몽고 디비 연결이 끊어졌습니다. 연결을 재시도 합니다.');
        });
    } catch (err) {
        console.log(err);
    }
}

connect();

module.exports = connect;

app.get('/api',(req,res) => {
    res.send('success')
   
})// 해당 루트 디렉토리에 오게되면 success를 출력

const { exec } = require("child_process");

app.post('/api/users/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    
    // Execute Test.py
    exec("python node.js_project/test.py", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Test.py: ${error}`);
        return res.status(500).json({ success: false, message: "Registration failed" });
      }
      
      console.log(`test.py output: ${stdout}`);
      console.error(`test.py errors: ${stderr}`);
      
      // Return a success response to the frontend
      return res.status(200).json({ success: true, message: "Registration successful" });
    });
    
  } catch (err) {
    // Return an error response to the frontend
    return res.status(500).json({ success: false, err });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    // 요청된 이메일을 DB에서 있는지 찾는다.
    const user = await User.findOne({ name: req.body.name });
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });

    const token = await user.generateToken();
    console.log('generatedUser:', token);
    res.cookie("x_auth", token).status(200).json({
      loginSuccess: true,
      userName: user._name,
      token: token
  });
  } catch (err) {
    console.error(err);
    res.status(500).send("서버 에러");
  }
});

/*
app.post('/api/users/login', async (req, res) => {
  const { id, password } = req.body;

  try {
    const user = await User.authenticate(id, password);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.cookie('token', user.token, { httpOnly: true });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
*/

//app.get("/api/users/auth", auth, (req,res) => {} );

app.listen(port,()=>{
    console.log(`${port}`)
});