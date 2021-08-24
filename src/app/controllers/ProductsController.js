var sql = require("mssql");
var config = require("../config/config");

class ProductsController {

    async index(req, res) {
        var query1 = `select * from Products Where Status = 'On'`;
        var query2 = `select * from ProductVariants`;
        var query3 = `select * from QuantityBySize`;
        var products, colors, sizes, temp = [];
        try {
            let pool = await sql.connect(config)
            let result1 = await pool.request()
                .query(query1)
            let result2 = await pool.request()
                .query(query2)
            let result3 = await pool.request()
                .query(query3)
            products = result1.recordsets[0];
            colors = result2.recordsets[0];
            sizes = result3.recordsets[0];
        } catch (err) {

        }
        products.map(product => {
            var newcolors = [];
            var newsizes = [];
            colors.map(color => {
                if (color.ProductId.trim() === product.ProductId.trim()) {
                    newcolors.push({
                        Color: color.Color,
                        URLPicture: color.URLPicture,
                    })
                }
            })
            sizes.map(size => {
                if (size.ProductId.trim() === product.ProductId.trim()) {
                    newsizes.push(size.Size);
                }
            })
            sizes.sort();
            const newProduct =
            {
                ...product,
                colors: newcolors,
                sizes: newsizes
            };
            temp.push(newProduct);
        })
        res.json(temp);
    }

    // [GET] /products/:id
    async getById(req, res) {
        var query = `select * from Products where ProductId = '${req.params.id}' and Status = 'On'`;
        var query2 = `select * from ProductVariants where ProductId = '${req.params.id}'`;
        var query3 = `select * from QuantityBySize where ProductId = '${req.params.id}'`;
        var products, colors, sizes = [];
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            let result2 = await pool.request()
                .query(query2)
            let result3 = await pool.request()
                .query(query3)
            products = result.recordsets[0];
            colors = result2.recordsets[0];
            sizes = result3.recordsets[0];
        } catch (err) {

        }
        if (products.length === 0) {
            res.json({ successful: false, message: 'Mã Sản Phẩm không tồn tại!' })
        }
        var product = products[0];
        var newColors = [];
        var newSizes = [];
        colors.map(color => {
            if (color.ProductId.trim() === product.ProductId.trim()) {
                newColors.push({
                    Color: color.Color,
                    URLPicture: color.URLPicture,
                })
            }
        })
        sizes.map(size => {
            if (size.ProductId.trim() === product.ProductId.trim()) {
                newSizes.push(size.Size);
            }
        })
        var newProduct = {...product,
                            colors: newColors,
                            sizes: newSizes};
        res.json(newProduct);
    }
}

module.exports = new ProductsController();
