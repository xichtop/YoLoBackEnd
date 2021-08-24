var sql = require("mssql");
var config = require("../config/config");

class ShippingController {
    // [GET] /new
    async index(req, res) {
        var query = `select * from ShippingMethods`;
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            res.json(result.recordsets[0]);
        } catch (err) {
    
        }
    }
}

module.exports = new ShippingController();