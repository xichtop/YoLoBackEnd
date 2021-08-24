var sql = require("mssql");
var config = require("../config/config");
require('dotenv')
const jwt = require('jsonwebtoken');
var md5 = require('md5');
var { SendMail } = require('../mail/mailer');

class UserController {
    // [POST] /user/login
    async login(req, res) {
        const { email, password } = req.body;
        const newPass = md5(password);
        var query = `select * from Users where Email = '${email}' and Password = '${newPass}'`;
        console.log(req.body);
        var user = {};
        var resultData = [];
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)

            resultData = result.recordsets[0]

        } catch (err) {

        }
        if (resultData.length === 0) {
            res.json({ successful: false, message: 'Email hoặc Mật khẩu không đúng!' });
        }
        else {
            user = resultData[0];
            if(user.Status.trim() === 'Off') {
                res.json({ successful: false, message: 'Tài khoản của bạn đã bị khóa!' });
            }
            else {
                const accessToken = jwt.sign({ Email: email }, "myyoloshop")
            res.json({
                successful: true,
                message: 'Đăng nhập thành công!',
                accessToken, user
            })
            }
        }
    }

    // [POST] /user/register
    async register(req, res) {
        const { email, password, phone, fullname, address, urlpicture } = req.body;
        const newPass = md5(password);
        const query = `INSERT INTO Users(Email, Password, Phone, Fullname, Address, URLPicture)
                            VALUES('${email}', '${newPass}', '${phone}', N'${fullname}', N'${address}', '${urlpicture}')`
        var status = 0;
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            status = result;
        } catch (err) {

        }
        if (status != 0) {
            const subject = 'Đăng ký tài khoản thành công!';
            const body = "Chào mừng bạn đến với YoloShop!";
            SendMail(email, subject, body);
            res.json({ successful: true, message: 'Đăng ký tài khoản thành công!', status: status });
        }
        else {
            res.json({ successful: false, message: 'Đăng ký tài khoản thất bại!', status: status });
        }
    }

    // User update account
    async update(req, res) {
        const { email, phone, fullname, address, urlpicture } = req.body;
        const query = `UPDATE Users SET Phone = '${phone}', Fullname = N'${fullname}', Address = N'${address}', URLpicture = '${urlpicture}' WHERE Email = '${email}'`;
        var status = 0;
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            status = result;
        } catch (err) {

        }
        if (status != 0) {
            res.json({ successful: true, message: 'Chỉnh sửa tài khoản thành công!', status: status });
        }
        else {
            res.json({ successful: false, message: 'Chỉnh sửa tài khoản thất bại!', status: status });
        }
    }

    // [GET] /users/:id
    async getById(req, res) {
        var query = `select * from Users where Email = '${req.params.id}'`;
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            res.json(result.recordsets[0]);
        } catch (err) {

        }
    }

    //Admin get all account
    async getAll(req, res) {
        var query = `select * from Users`;
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            res.json(result.recordsets[0]);
        } catch (err) {

        }
    }

    //Admin update Status
    async updateStatus(req, res) {
        const { email, newStatus } = req.body;
        const query = `UPDATE Users SET Status = '${newStatus}' WHERE Email = '${email}'`;
        var status = 0;
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            status = result;
        } catch (err) {

        }
        if (status != 0) {
            res.json({ successful: true, message: 'Cập nhật tài khoản thành công!', status: status });
        }
        else {
            res.json({ successful: false, message: 'Cập nhật tài khoản thất bại!', status: status });
        }
    }
}

module.exports = new UserController();