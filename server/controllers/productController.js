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
