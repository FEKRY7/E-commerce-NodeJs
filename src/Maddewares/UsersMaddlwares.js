const {body , check , validationResult} = require('express-validator')

const nameValidator = value =>{
const regex = /^[a-zA-Z]{4,9}[0-9]{0,3}$/
return regex.test(value)    
}

const emailValidator = value =>{
  const regex = /^[a-zA-Z]{3,9}[0-9]{0,4}@(hotmail|gmail).com$/
  return  regex.test(value)    
}

const UserMaddlwares = ()=>{
  return[
    check('username').notEmpty().withMessage('Cant be Empty in UserName')
    .custom(nameValidator).withMessage('Invalid UserName domain'),
    check('email').notEmpty().withMessage('Cant be Empty in Email')
    .custom(emailValidator).withMessage('Invalid Email domain'),
    body('password').notEmpty().withMessage('Cant be Empty in Password')
  ]  
}

const UserMaddlwaresLogin = ()=>{
  return[
    check('email').notEmpty().withMessage('Cant be Empty in Email')
    .custom(emailValidator).withMessage('Invalid Email domain'),
    body('password').notEmpty().withMessage('Cant be Empty in Password')
  ]  
}

const isRequestValidatod = (req,res,next) =>{
  const errors = validationResult(req)  // Perform validation and check for errors
  if(errors.array().length > 0 ){
    return res.status(404).json({error:errors.array()[0].msg})
  }
  next()
}


function createCategories(categories, productId = null) {
  const CategoryList = [];
  let category;
  if (productId == null) {
      category = categories.filter(cat => cat.productId == undefined); // Changed == to === for strict comparison
  } else {
      category = categories.filter(cat => cat.productId == productId); // Changed == to === for strict comparison
  }
  for (let cate of category) {
      CategoryList.push({
          _id: cate._id,
          name: cate.name,
          slug: cate.slug,
          productId:cate.productId,
          type: cate.type,
          children: createCategories(categories, cate._id)
      });
  }
  return CategoryList;
}

module.exports = {
    UserMaddlwares,
    isRequestValidatod,
    UserMaddlwaresLogin,
    createCategories
}