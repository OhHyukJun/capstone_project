const express = require('express');
const app = express();
const port = 4000;
const { User } = require('./model/User');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const config = require('./config/key');
const mongoose = require('mongoose');
const { auth } = require("./middleware/auth");

const connect = async () => {
  try {
    await mongoose.connect("mongodb+srv://ohj3961:8756@cluster0.1ytxiv9.mongodb.net/myFirstDatabase", {
      useNewUrlParser: true,
    });
    console.log('MongoDB Connected...');

    mongoose.connection.on('error', (err) => {
      console.log('MongoDB connect ERROR', err)
    });

    mongoose.connection.addListener('disconnected', () => {
      console.log('몽고 디비 연결이 끊어졌습니다. 연결을 재시도 합니다.');
    });
  } catch (err) {
    console.log(err);
  }
}

connect();



app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: "Welcome to the registration page" });
});


const axios = require('axios');

app.post('/api/users/register', async (req, res) => {
  try {
    const { name, departmentNum, password } = req.body;

    if (!name || !departmentNum || !password) {
      return res.status(400).json({ success: false, message: "Please provide all the required fields" });
    }

    // Create a new user
    const user = new User({ name, departmentNum, password });
    await user.save();

    // ip 바뀔 때마다 변경해야함
    const raspberryUrl = 'http://192.168.239.239:5000'; // 라즈베리 파이의 IP 주소와 포트로 변경해야 합니다.
    const payload = { name, password };

    axios.post(raspberryUrl, payload)
      .then((response) => {
        console.log('Password send:', response.data);
        // 라즈베리 파이로부터의 응답 처리 코드를 여기에 추가할 수 있습니다.
      })
      .catch((error) => {
        console.error('Error', error);
        // 라즈베리 파이로부터의 에러 응답 처리 코드를 여기에 추가할 수 있습니다.
      });

    return res.status(200).json({ success: true, message: "Registration successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "An error occurred during registration" });
  }
});


app.post('/api/users/login', async (req, res) => {
  try {
    const receivedData = req.body;

    // Process the received data as needed
    console.log(receivedData);
    console.log(receivedData.name);
    console.log(receivedData.password);
    // Find the user based on the received name
    const user = await User.findOne({ name: receivedData.name });
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "No user found with the provided name.",
      });
    }
    console.log(true);
    const isMatch = await user.comparePassword(receivedData.password);
    
    const raspberryUrl = 'http://192.168.239.239:5000'; // Replace with your Raspberry Pi's IP address and port
    const payload = { loginSuccess: false };

    axios.post(raspberryUrl, payload)
      .then((response) => {
        console.log('Success value sent to Raspberry Pi:', response.data);
      })
      .catch((error) => {
        console.error('Error sending success value to Raspberry Pi:', error);
      });
    if (!isMatch) {
      return res.json({ loginSuccess: false, message: "Incorrect password." });
    }
    console.log(true);
    const token = await user.generateToken();
    console.log('Generated token:', token);

    res.setHeader('Content-Type', 'application/json');

    res.cookie("x_auth", token).status(200).json({
      loginSuccess: true,
      userName: receivedData.name,
      token: token
    });

    /* Send true value to Raspberry Pi
    const raspberryUrl = 'http://192.168.166.239:4000'; // Replace with your Raspberry Pi's IP address and port
    const payload = { loginSuccess: true };

    axios.post(raspberryUrl, payload)
      .then((response) => {
        console.log('Success value sent to Raspberry Pi:', response.data);
      })
      .catch((error) => {
        console.error('Error sending success value to Raspberry Pi:', error);
      });*/
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


/*
app.post('/api/users/login', async (req, res) => {
  try {
   
    const { name, password } = req.body;
    console.log(name);
    // 요청된 이름(name)을 DB에서 찾는다.
    const user = await User.findOne({ name });
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이름에 해당하는 유저가 없습니다.",
      });
    }

    // 비밀번호 비교
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });

    // 로그인 성공 시 토큰 생성
    const token = await user.generateToken();

    // 토큰을 쿠키에 저장하고 응답 반환
    res.cookie("x_auth", token).status(200).json({
      loginSuccess: true,
      userName: user.name,
      token: token
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("서버 에러");
  }
});
*/


app.get("/api/users/logout", auth, async (req, res) => {
  try {
    await User.findOneAndUpdate({ _id: req.user._id }, { token: "" });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
});


app.post("/api/users/raspberry-data", (req, res) => {
  const data = req.body;
  
  // Process the received data as needed
  console.log(data);

  // Send a response back to the client
  res.status(200).json({ success: true });
});

app.get("/api/users/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    department: req.user.department,
    name: req.user.name,
    role: req.user.role,
    image: req.user.image,
  });
});

app.listen(port, () => {
  console.log(`${port}`)
});

const server = app.listen(port, '192.168.239.205', () => {
  const { address, port } = server.address();
  console.log(`Express server running at http://${address}:${port}`);
});