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
    async getProductById(req, res) {
        var query = ` select Top(1) ProductId from Products where CategoryId = '${req.params.id}' Order By ProductId DESC`;
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            res.json(result.recordsets[0][0].ProductId);
        } catch (err) {
    
        }
    }


    // Admin 
    async getQuantityByMonthAndYear(req, res) {
        var query = `EXEC getCategoryByMonthAndYear @month = '${req.params.month}', @year = '${req.params.year}'`;
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            res.json(result.recordsets[0]);
        } catch (err) {

        }
    }

    async getQuantityByYear(req, res) {
        var query = `EXEC getCategoryByYear @year = '${req.params.year}'`;
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
