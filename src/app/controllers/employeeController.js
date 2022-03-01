var sql = require("mssql");
var config = require("../config/config");
const jwt = require('jsonwebtoken');
// var md5 = require('md5');

class EmployeeController {
    // [POST] /user/login
    async login(req, res) {
        const { email, password } = req.body;
        var query = `select * from Employees where EmployeeId = '${email}' and Password = '${password}'`;
        console.log(req.body);
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            const resultData = result.recordsets[0];
            console.log(resultData);
            if (resultData.length === 0) {
                res.json({ successful: false, message: 'Mã nhân viên hoặc Mật khẩu không đúng!' });
            }
            else {
                const employee = resultData[0];
                const accessToken = jwt.sign({ Email: email }, "myyoloshop")
                res.json({
                    successful: true,
                    message: 'Đăng nhập thành công!',
                    accessToken, employee
                })
            }
        } catch (err) {

        }
    }

}

module.exports = new EmployeeController();