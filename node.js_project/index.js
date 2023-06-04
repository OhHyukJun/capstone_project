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

const { exec } = require("child_process");
const path = require("path");

const executePythonFile = (filename) => {
  const pythonFilePath = path.join(__dirname, "face_recognition_project", filename);

  const command = `python ${pythonFilePath}`;

  return new Promise((resolve, reject) => {
    exec(command, { cwd: path.join(__dirname, "face_recognition_project") }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python file: ${error}`);
        reject(error);
      } else {
        console.log(`Python file output: ${stdout}`);
        resolve(stdout);
      }
    });
  });
};

// 서버가 실행될 때 03_face_recognition.py 파일 실행
const pythonFilename = '01_face_dataset.py';
executePythonFile(pythonFilename)
  .then((output) => {
    console.log(`Python file (${pythonFilename}) execution output:`, output);
    // 실행 결과를 처리하는 로직을 추가할 수 있습니다.
  })
  .catch((error) => {
    console.error(`Error executing Python file (${pythonFilename}):`, error);
    // 에러 처리 로직을 추가할 수 있습니다.
  });

app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: "Welcome to the registration page" });
});

app.post('/api/users/register', async (req, res) => {
  try {
    const { name, departmentNum, password } = req.body;

    if (!name || !departmentNum || !password) {
      return res.status(400).json({ success: false, message: "Please provide all the required fields" });
    }

    // Create a new user
    const user = new User({ name, departmentNum, password });
    await user.save();

    return res.status(200).json({ success: true, message: "Registration successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "An error occurred during registration" });
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

app.get("/api/users/logout", auth, async (req, res) => {
  try {
    await User.findOneAndUpdate({ _id: req.user._id }, { token: "" });
    return res.status(200).send({ success: true });
  } catch (err) {
    return res.json({ success: false, error: err });
  }
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