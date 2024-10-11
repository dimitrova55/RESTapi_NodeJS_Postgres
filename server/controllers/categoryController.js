import db from "../db.js";

/**
 * 'GET'
 * Everything from the table Category
 */

export const getAllCategories = async(req, res) => {
    try {
        const result = await db.query(`SELECT * FROM category`);

        return res.status(200).json(result.rows);   // 200 - OK
    } catch (error) {
        return res.status(500).json({error: error.message});    // 500 - server error
    }
}

// export const getAllCategories = async(req, res) => {
//     db.query(`SELECT * FROM category`).then((result) => {
//         return res.status(200).json(result.rows);   // 200 - OK
//     }).catch((error) => {
//         return res.status(500).json({error: error.message});    // 500 - server error
//     });
// }


/**
 * 'POST'
 * Creates an instance
*/

export const createCategory = async (req, res) => {
    
    if(!req.body.name) {
        // (422) -> Unprocessable Entity. 
        return res.status(422).json({error: 'Name is required!'});
    }

    try {
        // Check If the category name already exists in the table.
        const flag = await existName(req.body.name);
        if(flag)
            return res.status(409).json({error: `Category ${req.body.name} alredy exists!`});

        // Otherwise, create the new category into the table.
        const result = await db.query({
            text: `INSERT INTO category (name)
                   VALUES ($1) RETURNING *`,
            values: [req.body.name]
        });

        return res.status(201).json(result.rows[0]);    // (201) -> Created.

    } catch (error) {
        return res.status(500).json({error: error.message});
    }    
}


/**
 * 'PUT'
 * Updates an instance
*/

export const updateCategory = async (req, res) => {

    try {
        if(!req.body.name) {
            return res.status(422).json({error: "Name is required!"});
        }
        /** Check if there is already a category of this name. */
        const flag = await existName(req.body.name);
        if(flag)
            return res.status(409).json({error: `Category ${req.body.name} alredy exists!`});
        
        /** Update otherwise. */
        const updateResult = await db.query({
            text : `
            UPDATE category
            SET name = $1, updated_date = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *`,
            values : [req.body.name, req.params.id]
        });

        /** If the category, we try to update, does not exist. */
        if(updateResult.rowCount == 0)
            return res.status(404).json({error: "Category not found!"});

        // Category name updated 
        res.status(200).json(updateResult.rows[0]);

    } catch (error) {
        return res.status(500).json({error: error.message});
    }


}


/**
 * 'DELETE'
 * Deletes an instance
*/

export const deleteCategory = async (req, res) => {
    try {
        /** Check if the category is being used by a product. */
        const countResult = await db.query({
            text: `SELECT COUNT(*) FROM product WHERE category_id = $1`,
            values: [req.params.id]
        });
        if(countResult.rows[0].count > 0)
            return res.status(409).json({
                error: `The category cannot be deleted because there are products of this category.`
            });
        
        /** Delete the category if there are no products of it. */
        const result = await db.query({
            text: `DELETE FROM category WHERE name = $1`,
            values: [req.params.id]
        });
        if(result.rowCount = 0)
            res.status(204).json({message: `Category deleted!`});

    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}



async function existName(name) {
    const checkName = await db.query(`SELECT count(*) FROM category 
                                          WHERE name = $1`, [name]);        

    if(checkName.rows[0].count > 0)
        return true;
    return false;
}