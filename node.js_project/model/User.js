const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    
    Id: {
        
        type: String,  
    },

    name: {
        type: String,
        unique: 1,
    },

    department : {
        type: Number,
        default: 0,
    },
    
    facepassword:{
      type:String,
    },
    
    password: {
        type: String,
        //minLength: 10,
        //maxLength: 16,
    },
    
    role: {
        type: String,
    },
    
    image: {
        type: String,
    }, 
    
    token: {type: String,},

    tokenExp: {type: Number,
    },
})

const bcrypt = require('bcrypt');
//bcrypt 모듈을 가져옴
const saltRounds = 10;


userSchema.pre('save', function (next) {
    let user = this;
        //  비밀번호를 변경하는 경우에
    if (user.isModified('password')) {
        // pawword를 변경할 때만 password가 암호화 되도록 하기 위해 사용하는 조건문
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);
            //salt를 생성하기 위한 코드입니다. 만약 salt가 생성되지 못하고 에러가 발생한다면 에러를 리턴합니다.
            bcrypt.hash(user.password, salt, function (err, hash) {
                //salt가 생성되면 hash를 사용합니다. user.password는 암호화된 비밀번호가 아니라 입력한 비밀번호를 의미합니다.
                if (err) return next(err);
                user.password = hash;
                //해당 비밀번호를 salt만큼 암호화 해준 뒤 암호화가 된 hash를 user에 있는 password에 초기화합니다.
                next();
            });
        });
    } else {
        next();
    }
}); 

userSchema.methods.generateToken = async function () {
  const user = this;
  const token = jwt.sign(user._id.toHexString(), "secretToken");

  user.token = token;
  
  try {
    await user.save();
    return token;
  } catch (err) {
    throw err;
  }
};

userSchema.methods.comparePassword = async function(plainPassword) {
  try {
    const isMatch = await bcrypt.compare(plainPassword, this.password);
    return isMatch;
  } catch (err) {
    throw err;
  }
};


userSchema.statics.findByToken = async function (token, cb) {
  try {
    let user = this;

    // Decode the token.
    const decoded = jwt.verify(token, "secretToken");

    // Find the user using the user ID and token
    const foundUser = await user.findOne({ _id: decoded, token: token });

    return cb(null, foundUser);
  } catch (err) {
    return cb(err);
  }
};
/*
  verify를 이용해 토큰을 decode합니다. 유저 아이디를 이용해서 유저를 찾은 후
  클라이언트에서 가여온 token과 DB에 보관된 token이 일치하는지 확인합니다.
  에러가 뜬다면 callback으로 에러 내용을 넘겨주고 아니면 true를 반환
*/
const User = mongoose.model('User', userSchema)

module.exports = { User }