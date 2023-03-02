const db = require('../config/db');

const createTable = async () => {
  try {
    const connection = await db.getConnection();
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id INT(11) NOT NULL AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        telephone VARCHAR(13) NOT NULL,
        role VARCHAR(200) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      )
    `;
    const orderTableQuery = `
    CREATE TABLE IF NOT EXISTS orders (
      id INT(11) NOT NULL AUTO_INCREMENT,
      user_id INT(11) NOT NULL,
      total_quantity INT(11) NOT NULL,
      total_price DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `;
  const orderDetailsTableQuery = `
    CREATE TABLE IF NOT EXISTS order_details (
      id INT(11) NOT NULL AUTO_INCREMENT,
      order_id INT(11) NOT NULL,
      product_id INT(11) NOT NULL,
      quantity INT(11) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `;
    await connection.execute(query);
    console.log('Table created successfully!');
    await connection.execute(orderTableQuery);
    console.log('Orders table created successfully!');
    await connection.execute(orderDetailsTableQuery);
    console.log('Order details table created successfully!');
    await connection.release();
  } catch (error) {
    console.log(`Error creating table: ${error.message}`);
  }
};

module.exports = createTable;


