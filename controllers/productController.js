const Product = require("../models/product");

const ProductController = {
    async getAllProduct(req, res){
        try {
            const products = await Product.getAllProduct();
            res.status(200).json(products);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    },
}