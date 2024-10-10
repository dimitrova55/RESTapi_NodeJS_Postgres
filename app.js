import express from "express";
import db from "./server/db.js";

import productRouter from './server/routes/productRoute.js';
import categoryRouter from './server/routes/categoryRoute.js';


const app = express();
const port = 3000;


// Database Connection
db.connect()
    .then(() => console.log('Connected to the database!'))
    .catch(err => console.error('Connection error', err.stack));

// Middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Routes
app.use('/category', categoryRouter);
app.use('/product', productRouter);


// 'GET' method -> homepage
app.get('/', (req, res) => {
    res.send('Homepage.');
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}.`); 
});