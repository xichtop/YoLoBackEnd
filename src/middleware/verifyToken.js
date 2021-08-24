const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        console.log(authHeader);
        console.log('Khoog tìm thấy token');
        return res.status(400).json({ successful: false, message: 'Không tìm thấy token truy cập' })
    }
        

    try {
        const decoded = jwt.verify(token, "myyoloshop")
        req.userId = decoded.userId
        console.log('Token ok')
        next()
    } catch (error) {
        console.log('Lỗi')
        return res.status(403).json({ successful: false, message: 'Token không có hiệu lực' })
    }
}

module.exports = verifyToken