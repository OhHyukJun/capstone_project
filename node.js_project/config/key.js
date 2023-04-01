if(process.env.Node_ENV === 'production'){
    module.exports = require('./prod');

}else {
    module.exports = require('./dev');
}
/* key.js 개발용인지 배포용인지 구분하는 파일 */