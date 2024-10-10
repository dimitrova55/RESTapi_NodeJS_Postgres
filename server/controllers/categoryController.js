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
 * Create an instance
*/

export const createCategory = async (req, res) => {
    // Check for existence of 'name'
    if(!req.body.name) {
        // (422) -> Unprocessable Entity. 
        return res.status(422).json({error: 'Name is required!'});
    }

    try {
        // Check If the category name already exists in the table.
        const checkName = await db.query(`SELECT count(*) FROM category 
                                          WHERE name = $1`, [req.body.name]);        

        if(checkName.rows[0].count > 0){
            // (409) -> Conflict 
            return res.status(409).json({error: `Category ${req.body.name} alredy exists!`});
        }

        // Otherwise, insert the new category name into the table.
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