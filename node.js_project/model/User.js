const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    
    name: {
        type: String,
        maxLength: 50,
    },

    privacyId : {
        type: Number,
        default: 0,
    },

    password: {
        type: String,
        minLength: 10,
        maxLength: 16,
    },
    
    role: {
        type: String,
    },
    
    image: {
        type: String,
        unique: 1, 
    }, 
    
    token: {type: String,},

    tokenExp: {type: Number,
    },
})

const bcrypt = require('bcrypt');
//bcrypt 모듈을 가져옴
const saltRounds = 10;
//saltRound는 공식 사이트와 같이 10으로 하겠습니다.

userSchema.pre('save', function (next) {
    const user = this;
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


const User = mongoose.model('User', userSchema)

module.exports = { User }