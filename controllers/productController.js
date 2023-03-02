const { getProductById } = require("../models/product");
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

    async createProduct(req, res) {
        try {
            const productId = await Product.create(req.body);
            res.status(201).json({id:productId});
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error"});
        }
    },

    async getProductById(req, res) {
        try {
            const productId = req.params.id;
            const product = await Product.getProductById(productId);
            if (!product) {
                return res.status(404).json({ message: "Product not found"});
            }
            res.status(200).json(product);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    },

    async updateProduct(req, res) {
        try {
            const productId = req.params.id;
            const product = await Product.getProductById(productId);
            if (!product) {
                return res.status(404).json({message: "Product not found"});
            }
            await Product.update(productId, req.body);
            res.status(204).end();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    },

    async deleteProduct(req, res) {
        try {
            const productId = req.params.id;
            const product = await Product.getProductById(productId);
            if (!product) {
                return res.status(404).json({message: "Server error"});
            }
            await Product.delete(productId);
            res.status(204).end();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }
};

module.exports = ProductController;