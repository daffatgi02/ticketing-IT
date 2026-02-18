const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabase() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        port: 3306
    });

    try {
        await connection.query('CREATE DATABASE IF NOT EXISTS ticketing_it;');
        console.log('Database "ticketing_it" created or already exists.');
    } catch (error) {
        console.error('Error creating database:', error);
    } finally {
        await connection.end();
    }
}

createDatabase();
