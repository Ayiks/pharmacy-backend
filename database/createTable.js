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
    await connection.execute(query);
    console.log('Table created successfully!');
    await connection.release();
  } catch (error) {
    console.log(`Error creating table: ${error.message}`);
  }
};

module.exports = createTable;
