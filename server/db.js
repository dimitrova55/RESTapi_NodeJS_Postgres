import pg from "pg";
import dotenv from 'dotenv'

dotenv.config();

// Database Initialization
const db = new pg.Client({
    user: process.env.USER_ID,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PW,
    port: process.env.PORT,
    ssl: {
        rejectUnauthorized: false
    }
});

export default db;