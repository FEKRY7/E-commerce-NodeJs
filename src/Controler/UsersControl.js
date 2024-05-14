const Users = require('../../Database/models/Users.js')
const http = require('../folderS,F,E/S,F,E.JS')
const Responsers = require('../utilites/httperespons.js')
const Createtoken = require('./../Maddewares/CreatToken.js')
const crypto = require('crypto')
const sendVerificationEmail = require('../utilites/verifmail.js')
const Token = require('../../Database/models/Token.js')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');



const getalluser = async(req,res)=>{
try{
    const getProduct = await Users.find({},{'__v':false})
    if(!getProduct){
        Responsers.Firest(res,[],400,http.FAIL)    
    }else{
        Responsers.Schand(res,getProduct,200,http.SUCCESS)    
    }
}catch(error){
    console.log(error);
    return Responsers.Thered(res, ['Internal Server Error'], 500, http.ERROR);    
}
}

const Register = async (req, res) => {
    try {

        const userData = req.body;
        const existingUser = await Users.findOne({ email: userData.email });

        if (existingUser) {
             return Responsers.Firest(res, ["Email already exists"], 400, http.FAIL);
        }

        const newUser = await Users.create(userData);

        const token = await Token.create({
            userId: newUser._id,
            token: crypto.randomBytes(15).toString('hex')
        });

        const verificationLink = `${process.env.API}/api/user/confirm/${token.token}`;
        await sendVerificationEmail(userData.email, verificationLink);

        return Responsers.Schand(res, ['Email sent, please check your mail'], 200, http.SUCCESS);
    } catch (error) {
        console.error(error);
        return Responsers.Thered(res, ['Internal Server Error'], 500, http.ERROR);
    }
};

const Confirm = async (req, res) => {
    try {
        const token = await Token.findOne({ token: req.params.token });
        if (!token) {
          return  Responsers.Firest(res, ["Invalid or expired token"], 400, http.FAIL);
        }

        await Users.updateOne({ _id: token.userId }, { $set: { confirmEmail: true } });
        await Token.findByIdAndDelete(token._id);

        return Responsers.Schand(res, ["Email is verified"], 200, http.SUCCESS);
    } catch (error) {
        console.error(error);
        return Responsers.Thered(res, ['Internal Server Error'], 500, http.ERROR);
    }
};

const Login = async (req, res) => {
    try {
        const getone = req.body;
        const user = await Users.findOne({ email: getone.email });

        if (!user) {
            return Responsers.Firest(res, ["Email does not exist"], 400, http.FAIL);
        } 
        
        if (!user.confirmEmail) {
            return  Responsers.Firest(res, ["Please confirm your email to login"], 400, http.FAIL);
        }
 
        if (user.authenticate(req.body.password)) {
            const token = await Createtoken(user._id, user.username, user.email, user.role);
            await Users.updateMany({ _id: user._id }, { $set: { isActive: true, isBlocked: false } });

            return Responsers.Schand(res, ['Password is correct',{token }], 200, http.SUCCESS)
        } else {
            return  Responsers.Firest(res, ["Wrong password"], 400, http.FAIL);
        }
    } catch (error) {
        console.error(error);
        return Responsers.Thered(res, ['Internal Server Error'], 500, http.ERROR);
    }
};

const Logout = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await Users.findOne({ _id: userId });
        
        if (!user) {
            return  Responsers.Firest(res, ["User not found"], 400, http.FAIL);
        }
        
        await Users.updateMany({ _id: user._id }, { $set: { isActive: false } });
        
        return Responsers.Schand(res, ['Successfully logged out'], 200, http.SUCCESS)
    } catch (error) {
        console.error(error);
        return Responsers.Thered(res, ['Internal Server Error'], 500, http.ERROR);
    }
};

const ChangePassword = async (req, res) => {
    try {
        const userId = req.params.id;
        const newPassword = req.body.password;

        const user = await Users.findOne({ _id: userId });

        if (!user || !newPassword) {
            return  Responsers.Firest(res, ["User not found or new password not provided"], 400, http.FAIL);
        }

        const saltRounds = 10; // Adjust the salt rounds as needed
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        await Users.updateOne({ _id: user._id }, { $set: { password: hashedPassword } });

        return Responsers.Schand(res, ['Password changed successfully'], 200, http.SUCCESS)
    } catch (error) {
        console.error(error);
        return Responsers.Thered(res, ['Internal Server Error'], 500, http.ERROR);
    }
};

const Softdelete = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await Users.findOne({ _id: userId });

        if (!user) {
            return  Responsers.Firest(res, ["User not found"], 400, http.FAIL);
        }

        await Users.updateMany({ _id: user._id }, { $set: { isActive: false, isBlocked: true } });

        return Responsers.Schand(res, ['User account soft deleted successfully'], 200, http.SUCCESS)
    } catch (error) {
        console.error(error);
        return Responsers.Thered(res, ['Internal Server Error'], 500, http.ERROR);
    }
};

const Unsubscribe = async (req, res) => {
    try {
        // Retrieve the token from request parameters
        const token = req.params.token;

        if (!token) {
            return Responsers.Firest(res, ["Token is required"], 400, http.FAIL);
        }

        // Verify the token using the secret key from environment variables
        const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Find the user by the email in the decoded token
        const user = await Users.findOne({ email: decoded.email });

        if (!user) {
            return Responsers.Firest(res, ["User not found"], 400, http.FAIL);
        }

        // Check if the email has already been verified
        if (user.confirmEmail) {
            return  Responsers.Firest(res, ["Email already verified"], 400, http.FAIL);
        }

        // Delete the user if not already verified
        await Users.findOneAndDelete({ email: decoded.email });

        // Send a success response
        return Responsers.Schand(res, ['You are now unsubscribed'], 200, http.SUCCESS)
    } catch (error) {
        // Handle errors
        console.error(error);
        return Responsers.Thered(res, ['Internal Server Error'], 500, http.ERROR);
    }
};

const Forgotpassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await Users.findOne({ email });

        if (!user) {
            return  Responsers.Firest(res, ["Email not found"], 400, http.FAIL);
        }

        const OTP = Math.floor(Math.random() * 100000);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Password Reset',
            html: `
                <p>Click the following link to reset your password:</p>
                <p><a href="http://localhost:3000/api/user/resetpassword/${OTP}">Reset Password</a></p>
            `
        };

        await transporter.sendMail(mailOptions);

        // Store OTP in the user document
        await Users.updateOne({ email }, { $set: { OTP } });

        return Responsers.Schand(res, ['Email has been sent with instructions to reset your password'], 200, http.SUCCESS)
    } catch (error) {
        console.error(error);
        return Responsers.Thered(res, ['Internal Server Error'], 500, http.ERROR);
    }
};

const Resetpassword = async (req, res) => {
    try {
        const token = req.params.token;
        const password = req.body.password;

        // Find user by OTP token
        const user = await Users.findOne({ OTP: token });

        if (!user) {
            return  Responsers.Firest(res, ["Invalid or expired token"], 400, http.FAIL);
        }


        // Update password and reset OTP
        await Users.updateMany(
            {  OTP: token },
            { $set: { password: password, OTP: Date.now() } }
        );

        return Responsers.Schand(res, ['Password has been reset successfully'], 200, http.SUCCESS)
    } catch (error) {
        console.error(error);
        return Responsers.Thered(res, ['Internal Server Error'], 500, http.ERROR);
    }
};

module.exports={
    getalluser,
    Register,
    Confirm,
    Login,
    Logout,
    ChangePassword,
    Softdelete,
    Unsubscribe,
    Forgotpassword,
    Resetpassword
}
