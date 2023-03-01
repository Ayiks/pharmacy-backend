const db = require("../config/db");

const Product = {
  //function to get the list of all products in the database
  async getAllProduct() {
    const [rows] = await db.execute("SELECT * FROM products");
    return rows;
  },

  //function to get a single product from the database
  async getProductById(productId) {
    const [rows] = await db.execute("SELECT * FROM products WHERE id = ?", [
      productId,
    ]);
    return rows[0];
  },

  //function to create a product
  async create(product) {
    const { name, price, description, quantity, exp_date} = product;
    const sql = "INSERT INTO products (name, price, description, quantity, exp_date) VALUES (?, ?, ?, ?, ?)";
    const values = [name, price, description, quantity, exp_date];
    const [result] = await db.execute(sql, values.map(val => (val !== undefined ? val : "")));
    return result.insertId;
  },

  //function to update a product in the database
 /**
 * Updates a product with the given ID with the new values specified in the product object.
 * Only non-null values in the product object will be updated in the database.
 * @param {number} productId - The ID of the product to update.
 * @param {object} product - An object containing the new values for the product.
 */
async update(productId, product) {
    // Build the UPDATE query string
    let query = "UPDATE products SET";
    let params = [];
    let keys = Object.keys(product);
    keys.forEach((key, index) =>{
        // Only update non-null values and exclude the ID field from the query
        if (product[key] !== null && key !== 'id') {
            query += key + " = ?";
            params.push(product[key]);
            if (index < keys.length - 1) {
                query += ", ";
            }
        }
    });
    query += " WHERE id = ?";
    params.push(productId);

    // Execute the UPDATE query with the parameters
    await db.execute(query, params);
},

//delete a product
async delete(productId) {
    await db.execute("DELETE FROM products WHERE id = ?", [productId]);
}

};

module.exports = Product;
