var sql = require("mssql");
var config = require("../config/config");

class QuantitybysizeController {
    // [GET] /products
    async index(req, res) {
        var query = `select * from QuantityBySize`;
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            res.json(result.recordsets[0]);
        } catch (err) {
    
        }
    }

    // [GET] /products/:ProductId
    async getById(req, res) {
        var query = `select * from QuantityBySize where ProductId = '${req.params.ProductId}'`;
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            res.json(result.recordsets[0]);
        } catch (err) {
    
        }
    }
}

module.exports = new QuantitybysizeController();