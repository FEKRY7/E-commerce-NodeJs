const express = require('express')
const router = express.Router()
const UserControl = require('./../Controler/UsersControl.js')
const authenticate = require('./../Maddewares/UsersMaddlwares.js')

router.route('/')
.get(UserControl.getalluser)

router.route('/register')
.post(authenticate.UserMaddlwares(),authenticate.isRequestValidatod,UserControl.Register)

router.route('/confirm/:token')
.get(UserControl.Confirm)

router.route('/login')
.post(authenticate.UserMaddlwaresLogin(),authenticate.isRequestValidatod,UserControl.Login)

router.route('/logout/:id')
.post(UserControl.Logout)

router.route('/changePassword/:id')
.post(UserControl.ChangePassword)

router.route('/softdelete/:id')
.post(UserControl.Softdelete)

router.route('/unsubscribe/:token')
.post(UserControl.Unsubscribe)
 
router.route('/forgotpassword')
.post(UserControl.Forgotpassword)

router.route('/resetpassword/:token')
.post(UserControl.Resetpassword)

module.exports = router