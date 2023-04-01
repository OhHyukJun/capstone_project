const express = require('express');
// express 모듈을 express라는 이름으로 사용할 수 있도록 선언
const app = express();
// express 함수를 이용해 새로운 express 앱을 만듬
const port = 3000;
// 3000번 포트 사용
const bodyParser = require('body-parser');
const { User } = require('./model/User');
// 앞서 다운받았던 bodyParser와 작성했던 User 모델을 불러옴

app.use(bodyParser.urlencoded({extend: true}));
app.use(bodyParser.json());
/* 
    바디파서가 클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있도록 해주는 것
*/

const config = require('./config/key');
const mongoose = require('mongoose');

const connect = async () => {
    try {
        await mongoose.connect('mongodb+srv://cluster0.1ytxiv9.mongodb.net/myFirstDatabase',{
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

app.get('/',(req,res) => {
    res.send('success')
})// 해당 루트 디렉토리에 오게되면 success를 출력

app.post('/register',async (req,res)=>{
    //회원가입에 필요한 정보들을 가져오면 그것들을 db에 넣어줌
    try {
        const user = new User(req.body);
        const userStatus = await user.save()
    
        if (!userStatus){
          const err = new Error("실패");
          res.status(400).json({success: fail, err} )
        }
        res.status(200).json({success: true});
        console.log(userStatus);
    
      } catch (err) {
        res.status(500).send(err);
        console.log(err);
      }
});

app.listen(port,()=>{
    console.log(`${port}`)
});