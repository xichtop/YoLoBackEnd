var sql = require("mssql");
var config = require("../config/config");

class CategoryController {
    // [GET] /new
    async index(req, res) {
        var query = `select * from Categories`;
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            res.json(result.recordsets[0]);
        } catch (err) {
    
        }
    }

    // [GET] /new/:slug
    async getById(req, res) {
        var query = `select * from Categories where CategoryId = '${req.params.id}'`;
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            res.json(result.recordsets[0]);
        } catch (err) {
    
        }
    }
}

module.exports = new CategoryController();
