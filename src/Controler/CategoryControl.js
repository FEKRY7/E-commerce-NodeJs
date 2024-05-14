const Category = require('../../Database/models/Category.js');
const slugify = require('slugify');
const http = require('../folderS,F,E/S,F,E.JS'); // Fixed typo in the require path
const Responsers = require("../utilites/httperespons.js");// Fixed typo and added object destructuring for imported functions
const authenticate = require('../Maddewares/UsersMaddlwares.js')
const shortid = require('shortid')



const getCategory = async (req, res) => {
    try {
        const categories = await Category.find({}, { '__v': false });
        if(categories){
         const CategoryList = authenticate.createCategories(categories)
         return Responsers.Schand(res, [CategoryList], 200, http.SUCCESS);
        }else{
            Responsers.Firest(res, [], 400, http.FAIL);
        }
    } catch (error) {
        console.log(error);
        Responsers.Thered(res, ['Internal Server Error'], 500, http.ERROR); // Changed Responsers to Thered
    }
};

const addCategory = async (req, res) => {
    const sora = req.files.categoryImage
    const categoryObj = {
        name: req.body.name,
        slug: `${slugify(req.body.name)}-${shortid.generate()}`,
        categoryImage:sora[0].filename,
        createdBy:req.user._id,
    };
    
    if (req.body.productId) {
        categoryObj.productId = req.body.productId;
    }

    try {
        const cat = await Category.create(categoryObj);
        return Responsers.Schand(res, [{category:cat}], 200, http.SUCCESS);
    } catch (error) {
        // Handle error appropriately, e.g., send error response
      return Responsers.Thered(res, ['Internal Server Error'], 500, http.ERROR);
    }
};


const upDateCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        
        if (!category) {
            return Responsers.Firest(res, ["Category is not found"], 400, http.FAIL);
        }

        if (req.user._id.toString() !== category.createdBy.toString()) {
            return Responsers.Firest(res, ["You are not the admin who created this category"], 400, http.FAIL);
        }

        const sora = req.files.categoryImage;

        category.categoryImage = sora[0].filename;

        category.name = req.body.name ? req.body.name : category.name;
        category.slug = req.body.name ? slugify(req.body.name) : category.slug;

        await category.save();

        return Responsers.Schand(res, ["Category updated"], 200, http.SUCCESS);
    } catch (error) {
        console.log(error);
      return Responsers.Thered(res, ['Internal Server Error'], 500, http.ERROR);
    }
}

const DeleteCategory = async (req, res) => {
    try {
        const search = req.params.id; // corrected variable name
        const getProduct = await Category.findByIdAndDelete(search);
        if (!getProduct) {
            Responsers.Firest(res, [], 400, http.FAIL); // Assuming Firest handles failure
        } else {
            Responsers.Schand(res, 'Delete Category', 200, http.SUCCESS); // Assuming Schand handles success
        }
    } catch (error) {
        console.log(error);
        Responsers.Thered(res, [], 500, http.ERROR); // Assuming Responsers.Thered handles errors
    }
}


module.exports = {
    addCategory,
    getCategory,
    upDateCategory,
    DeleteCategory
};
