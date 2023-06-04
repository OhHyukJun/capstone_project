const { User } = require("../model/User");

let auth = (req, res, next) => {
  let token = req.cookies.x_auth;

  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });

    req.token = token;
    req.user = user;
    next();
  });
};
/*
    인증 처리들을 할 auth.js 파일을 생성한다.
    유저가 없거나 에러인 경우에는 isAuth에 false를 할당한 뒤 에러를 띄워주고, 
    유저가 있다면 req.token에 token을 넣고 req.user에 user 정보를 넣어준다. 
    이렇게 하는 이유는 토큰과 유저를 req에 넣어주어서 req.user를 하면 user 정보를 
    req.token을 하면 token 정보를 가져올 수 있도록 하기 위해서다. 
    next()를 호출하는 이유는 미들웨어이기 때문에 그 다음으로 넘겨주기 위해서 호출한다.
 */
module.exports = { auth };

