import db from "../db.js";

/**
 * 'GET'
 * Everything from the table Product
 */

export const getAllProducts = async(req, res) => {
    try {
        const result = await db.query(`SELECT * FROM product`);

        return res.status(200).json(result.rows);   // 200 - OK
    } catch (error) {
        return res.status(500).json({error: error.message});    // 500 - server error
    }
}


/**
 * 'GET'
 * Get Product by ID
*/

export const getProductByID = async (req, res) => {
    try {
        const result = await db.query({
            text: `SELECT * FROM product WHERE id = $1`,
            values: [req.params.id]
        });

        if(result.rowCount <= 0)
            return res.status(404).json({error: "Product not found."});

        return res.status(200).json(result.rows[0]);
    } catch (error) {
        return res.status(500).json({error: error.message});    // 500 - server error
    }
}


/**
 * 'GET'
 * Get Products by Category ID
 */

export const getProductsByCategoryID = async (req, res) => {
    try {
        const flag = await existCategory(req.params.categoryId);
        
        if(!flag)
            return res.status(404).json({error: "Category not found."});

        const result = await db.query({
            text: `SELECT * FROM product WHERE category_id = $1`,
            values: [req.params.categoryId]
        });

        if(result.rowCount == 0)
            return res.status(404).json({error: "No products from this category."});
        
        return res.status(200).json(result.rows[0]);
        
    } catch (error) {
        return res.status(500).json({error: error.message});    // 500 - server error
    }
}

/**
 * 'POST'
 * Create an instance
 */

export const createProduct = async (req, res) => {
    try {
        // check if the category_id exists, if not insert new category in the table category
        if(!req.body.name) {
            return res.status(422).json({error : "Name is required."});
        }

        if(!req.body.price) {
            return res.status(422).json({error : "Price is required."});
        }

        if(!req.body.category_id) {
            return res.status(422).json({error : "Category id is required."});
        } else {
            const flag = await existCategory(req.body.category_id);
            if(!flag) {
                return res.status(422).json({error: `Category ${req.body.category_id} does not exist.`});
            }
        }

        const result = await db.query({
            text: `
            INSERT INTO product (name, description, price, currency, quantity, active, category_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            values: [
                req.body.name,
                req.body.description ? req.body.description : null,
                req.body.price,
                req.body.currency ? req.body.currency : 'USD',
                req.body.quantity ? req.body.quantity : 0,
                'active' in req.body ? req.body.active : true,
                req.body.category_id
            ]
        });

        return res.status(201).json(result.rows[0]);
        
    } catch (error) {
        return res.status(500).json({error: error.message});    // 500 - server error
    }
}


/**
 * 'PUT'
 * Update an instance
*/

export const updateProduct = async (req, res) => {
    try {
        /** Check if any field is empty. */
        if(!req.body.name || !req.body.description || !req.body.price || !req.body.currency 
            || !req.body.quantity || !req.body.active || !req.body.category_id){
                return res.status(422).json({error: "All fields are required!"});
            }
        /** Check if the category exists. */
        const flag = await existCategory(req.body.category_id);
        if(!flag) {
            return res.status(422).json({error: `Category ${req.body.category_id} does not exist.`});
        }

        const result = await db.query({
            text: `
            UPDATE product
            SET name = $1, description = $2, price = $3, currency = $4, 
                quantity = $5, active = $6, category_id = $7, updated_date = CURRENT_TIMESTAMP
            WHERE id = $8
            RETURNING *`,
            values: [
                req.body.name,
                req.body.description,
                req.body.price,
                req.body.currency,
                req.body.quantity,
                req.body.active,
                req.body.category_id,
                req.params.id
            ]
        });
        if(result.rowCount = 0) {
            return res.status(404).json({error: "Product not found."});
        }

        return res.status(200).json(result.rows[0]);
        
    } catch (error) {
        return res.status(500).json({error: error.message});    // 500 - server error
    }
}


/**
 * 'DELETE'
 * Update an instance
*/

export const deleteProduct = async (req, res) => {
    try {
        const deleteResult = await db.query({
            text: `DELETE FROM product WHERE id = $1`,
            values: [req.params.id]
        });

        if(deleteResult.rowCount <= 0)
            return res.status(409).json({error: "Product not found."});

        return res.status(204).send("Product deleted.")
    } catch (error) {
        return res.status(500).json({error: error.message});    // 500 - server error
    }
}


async function existCategory(category_id) {
    const existCategory = await db.query({
        text : `SELECT COUNT(*) FROM category WHERE id = $1`,
        values : [category_id] 
    }); 

    if(existCategory.rows[0].count == 0) 
        return false;
    return true;    
}