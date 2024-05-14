const Product = require('../../Database/models/Product.js')
const Category = require('../../Database/models/Category.js')
const http = require('../folderS,F,E/S,F,E.JS')
const Responsers = require('../utilites/httperespons.js')
const slugify = require('slugify');


const getProduct = async (req, res) => {
    try {
        const { sort, page, keyword } = req.query;
        const getProductQuery = Product.find();
        
        // Applying sorting
        if (sort) {
            getProductQuery.sort(sort);
        }
        
        // Applying pagination and search
        const getProduct = await getProductQuery.paginate(page).search(keyword);

        if (getProduct.length === 0) {
            // Assuming Responsers is a custom response handler
            Responsers.Firest(res, [], 400, http.FAIL);
        } else {
            // Assuming Responsers is a custom response handler
            Responsers.Schand(res, getProduct, 200, http.SUCCESS);
        }
    } catch (error) {
        console.log(error);
        // Assuming Responsers is a custom response handler
        Responsers.Thered(res, [], 500, http.ERROR);
    }
};
 

const getProductById = async (req, res) => {
    try {
        const search = req.params.id;
        const foundCategory = await Category.findOne({ slug: search }).select('_id');
        
        if (!foundCategory) {
            Responsers.Firest(res, [], 400, http.FAIL); // Assuming Responsers.First is correct
        } else {
            // Assuming Product is the model representing your products
            const foundProducts = await Product.find({ category: foundCategory._id });
            Responsers.Schand(res,foundProducts,200,http.SUCCESS)  
        }
    } catch (error) {
        console.log(error);
        Responsers.Thered(res, [], 500, http.ERROR); // Assuming Responsers.There is correct
    }
}


const addProduct = async (req, res) => {
    try {
        const caerit = req.body;
        const amigin = req.files.gallery.map(file => {return {img:file.filename}});
 
        const getProduct = await Product.create({
            name: caerit.name,
            slug: slugify(caerit.name),
            price: caerit.price,
            quantity: caerit.quantity,
            description: caerit.description,
            gallery: amigin,
            category: caerit.category,
            createdBy: req.user._id
        });

        if (!getProduct) {
            return Responsers.Firest(res, [], 400, http.FAIL);
        }

        return Responsers.Schand(res, 'Done', 200, http.SUCCESS);

    } catch (error) {
        console.error('Error in three:', error);
        return Responsers.Thered(res, [], 500, http.ERROR);
    }
};


const upDateProduct = async (req, res) => {
    try {
        const search = req.params.id; // corrected variable name
        const newData = req.body; // corrected variable name
        const getProduct = await Product.findByIdAndUpdate(search, newData,{new:true , runValidators:true});
        if (!getProduct) {
            Responsers.Firest(res, [], 400, http.FAIL); // Assuming Responsers.Firest handles failure
        } else {
            Responsers.Schand(res, 'Done Update', 200, http.SUCCESS); // Assuming Responsers.Schand handles success
        }
    } catch (error) {
        console.log(error);
        Responsers.Thered(res, [], 500, http.ERROR); // Assuming Responsers.Thered handles errors
    }
}


const DeleteProduct = async (req, res) => {
    try {
        const search = req.params.id; // corrected variable name
        const getProduct = await Product.findByIdAndDelete(search);
        if (!getProduct) {
            Responsers.Firest(res, [], 400, http.FAIL); // Assuming Responsers.Firest handles failure
        } else {
            Responsers.Schand(res, 'Done Delete', 200, http.SUCCESS); // Assuming Responsers.Schand handles success
        }
    } catch (error) {
        console.log(error);
        Responsers.Thered(res, [], 500, http.ERROR); // Assuming Responsers.Thered handles errors
    }
}


module.exports={
getProduct,
getProductById,
addProduct,
upDateProduct,
DeleteProduct
}
