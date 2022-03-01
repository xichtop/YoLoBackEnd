var sql = require("mssql");
var async = require('async');
var config = require("../config/config");

class ReviewsController {
    // [GET] /ProductVariants
    async index(req, res) {
        var query = `select * from Reviews`;
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
        var query = `select * from Reviews where ProductId = '${req.params.ProductId}'`;
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            res.json(result.recordsets[0]);

        } catch (err) {

        }
    }

    async addItem(req, res) {
        const { ProductId, Email, URLEmail, Vote, comment, URLComment, OrderId, Color, Size, Star } = req.body;
        const query = `Insert Into Reviews (ProductId, Email, URLEmail, Vote, Comment, URLComment, ReviewDate, Color, Size) 
                        Values ('${ProductId}', '${Email}', '${URLEmail}', ${Vote}, N'${comment}', '${URLComment}', getDate(), '${Color}', '${Size}')`;
        const query2 = `Update OrderDetails Set Review = 1 Where OrderId = ${OrderId} And ProductId = '${ProductId}' And Color = '${Color}' And Size = '${Size}'`;
        const query3 = `Update Products Set Vote = ${Star} Where ProductId = '${ProductId}'`;
        var listQuery = [];
        listQuery.push(query);
        listQuery.push(query2);
        listQuery.push(query3);
        const pool = new sql.ConnectionPool(config)
        pool.connect(err => {
            if (err) console.log(err)
            const transaction = new sql.Transaction(pool)
            const request = new sql.Request(transaction)
            transaction.begin(err => {
                if (err) return console.log(err)
                async.eachSeries(listQuery, function (query, callback) {
                    request.query(query, (err, result) => {
                        if (err) {
                            callback(err)
                        } else {
                            callback()
                        }
                    })
                }, function (err) {
                    if (err) {
                        transaction.rollback()
                        res.json({ successful: false, message: "Đã xảy ra lỗi!" });
                        console.log(err)
                    } else {
                        res.json({ successful: true, message: "Thành công!" });
                        transaction.commit()
                    }
                })
            })
        })
    }
}

module.exports = new ReviewsController();