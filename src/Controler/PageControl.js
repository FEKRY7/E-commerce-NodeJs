const Page = require('../../Database/models/Page.js');
const http = require('../folderS,F,E/S,F,E.JS')
const Responsers = require('../utilites/httperespons.js')

const CreatePage = async (req, res) => {
    try {
        // Extracting banners and products from req.files
        const banners = req.files.banners.map(file => ({ img: file.filename }));
        const products = req.files.products.map(file => ({ img: file.filename }));

        // Constructing banners and products with img and navigateTo properties
        const bannerObjects = banners.map(banner => ({
            img: `${process.env.API}/public/${banner.img}`,
            navigateTo: `/bannersCliked?categoryId=${req.body.category}&type=${req.body.type}`
        }));
        const productObjects = products.map(product => ({
            img: `${process.env.API}/public/${product.img}`,
            navigateTo: `/productCliked?categoryId=${req.body.category}&type=${req.body.type}`
        }));

        // Setting createdBy field to the current user's ID
        req.body.createdBy = req.user._id;

        // Finding if a page with the same category already exists
        const existingPage = await Page.findOne({ category: req.body.category });

        if (existingPage) {
            // If the page already exists, update it
            const updatedPage = await Page.findByIdAndUpdate(existingPage._id, {
                title:req.body.title,
                description:req.body.description,
                banners: bannerObjects,
                products: productObjects,
                createdBy: req.body.createdBy
            });
            Responsers.Schand(res, ["Page updated successfully",{page: updatedPage}], 200, http.SUCCESS);
        } else {
            // If the page does not exist, create a new one
            const newPage = new Page({
                title:req.body.title,
                description:req.body.description,
                category: req.body.category,
                banners: bannerObjects,
                products: productObjects,
                createdBy: req.body.createdBy
            });
            await newPage.save();
            Responsers.Schand(res, ["Page created successfully",{page: newPage}], 200, http.SUCCESS);
        }
    } catch (error) {
        // Handling errors
        console.error(error);
        Responsers.Thered(res, ["Error creating/updating page",{error: error.message}], 500, http.ERROR);
    }
};

const getPage = async (req, res) => {
    try {
        const { category, type } = req.params;
        let FindPage;

        if (type === 'page') {
            FindPage = await Page.findOne({ category: category });
        }
        Responsers.Schand(res, [FindPage], 200, http.SUCCESS);
    } catch (error) {
        console.error(error);
        Responsers.Thered(res, ["Error retrieving page", {error: error.message}], 500, http.ERROR);
    }
};

const upDatePage = async (req, res) => {
    try {
        const page = await Page.findById(req.params.id);
        
        if (!page) {
            Responsers.Firest(res, ["Page is not found"], 400, http.FAIL);
        }

        if (req.user._id.toString() !== page.createdBy.toString()) {
            return Responsers.Firest(res, ["You are not the admin who created this page"], 400, http.FAIL);       
        }

        const banners = req.files.banners.map(file => ({ img: file.filename }));
        const products = req.files.products.map(file => ({ img: file.filename }));

        page.banners = banners.map(item => item.img);
        page.products = products.map(item => item.img);

        page.title = req.body.title || page.title;
        page.description = req.body.description || page.description;

        await page.save();
        Responsers.Schand(res, ["Page updated"], 200, http.SUCCESS);
    } catch (error) {
        console.error(error);
        Responsers.Thered(res, [error], 500, http.ERROR);
    }
}


const DeletePage = async (req, res) => {
    try {
        const search = req.params.id; // corrected variable name
        const getProduct = await Page.findByIdAndDelete(search);
        if (!getProduct) {
            Responsers.Firest(res, [], 400, http.FAIL); // Assuming Firest handles failure
        } else {
            Responsers.Schand(res, 'Delete brand', 200, http.SUCCESS); // Assuming Schand handles success
        }
    } catch (error) {
        console.log(error);
        Responsers.Thered(res, [], 500, http.ERROR); // Assuming Responsers.Thered handles errors
    }
}


module.exports = {
    CreatePage,
    getPage,
    upDatePage,
    DeletePage
};


