const jwt = require('jsonwebtoken')
 
const Createtoken = (_id,username,email,role)=>{
    return  jwt.sign({
    _id,
    username,
     email,
     role

},process.env.JWT_SECRET_KEY)
}

module.exports = Createtoken 