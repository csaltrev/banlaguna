const { Pool } = require('pg');

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: true // Change for production
});

module.exports = {
	query: (text, params) => pool.query(text, params)
};