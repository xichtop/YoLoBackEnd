var sql = require("mssql");
var config = require("../config/config");

class DiscountController {

    async addItem(req, res) {
        const { DiscountId, PercentDiscount, Quantity } = req.body;
        console.log(DiscountId);
        const query = `INSERT INTO Discount(DiscountId, PercentDiscount, Quantity)
                            VALUES('${DiscountId}', ${PercentDiscount}, ${Quantity})`;
        var status = 0;
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            status = result;
        } catch (err) {

        }
        console.log(status);
        if (status != 0) {
            res.json({ successful: true, message: 'Thêm mã giảm giá thành công!', status: status });
        }
        else {
            res.json({ successful: false, message: 'Thêm mã giảm giá thất bại!', status: status });
        }
    }

    async update(req, res) {
        const { DiscountId, PercentDiscount, Quantity } = req.body;
        const query = `UPDATE Discount SET PercentDiscount = '${PercentDiscount}', Quantity = ${Quantity} WHERE DiscountId = '${DiscountId}'`;
        var status = 0;
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            status = result;
        } catch (err) {

        }
        if (status != 0) {
            res.json({ successful: true, message: 'Sửa mã giảm giá thành công!', status: status });
        }
        else {
            res.json({ successful: false, message: 'Sửa mã giảm giá thất bại!', status: status });
        }
    }

    // [GET] /new
    async index(req, res) {
        var query = `select * from Discount`;
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
        var query = `select * from Discount where DiscountId = '${req.params.id}'`;
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            res.json(result.recordsets[0]);
        } catch (err) {
    
        }
    }

}

module.exports = new DiscountController();