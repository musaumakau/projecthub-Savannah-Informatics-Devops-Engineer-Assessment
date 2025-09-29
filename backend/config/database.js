const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST || 'postgres',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'projecthub',
    user: process.env.DB_USER || 'projecthub_user',
    password: process.env.DB_PASSWORD || 'projecthub_password',
});

module.exports = pool;