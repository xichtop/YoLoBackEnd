var sql = require("mssql");
var config = require("../config/config");

class ProductVariantsController {
    // [GET] /ProductVariants
    async index(req, res) {
        var query = `select * from ProductVariants`;
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            res.json(result.recordsets[0]);
        } catch (err) {
    
        }
    }

    // [GET] /productvariants/:Productid
    async getById(req, res) {
        var query = `select * from ProductVariants where ProductId = '${req.params.ProductId}'`;
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            res.json(result.recordsets[0]);
        } catch (err) {
    
        }
    }
}

module.exports = new ProductVariantsController();