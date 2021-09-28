//导入数据库模块
const mySql = require("../mysql.js")
//导入bcryptjs
const bcryptjs = require("bcryptjs")
//导入jsonwebtoken包， 用这个包来生成 Token 字符串
const jwt = require("jsonwebtoken")
//导入密钥
const configKey = require("../token/config")


//登录模块
exports.login = (req, res) => {
    //检查登录的用户名和密码是否为空
    if (req.query.uname === "" || req.query.password === "") {
        return res.send({status: 400, msg: "用户名或密码不能为空！"})
    }
    //检查登录的用户名是否存在
    const inquireNameSql = "SELECT * FROM users WHERE uname = ?"
    mySql.query(inquireNameSql, req.query.uname, (err, results) => {
        if (err) {
            return res.send({status: 400, msg: err.message})
        }
        if (results.length !== 1) {
            return res.send({status: 200, msg: "登录失败！"})
        }
        //检查登录用户的密码是否正确
        const comparePassword = bcryptjs.compareSync(req.query.password, results[0].password)
        if (!comparePassword) {
            return res.send({status: 200, msg: "登录失败！"})
        }
        // 剔除，user 中只保留了用户的 id, username, nickname, email 这四个属性的值
        const user = {...results[0], password: '', user_pic: ''}
        // 生成 Token 字符串
        const userToken = jwt.sign(user, configKey.jwtSecretKey, {expiresIn: "10h"})

        res.send({
            status: 200,
            msg: "登录成功！",
            token:"Bearer "+userToken
        })
    })


}
//注册模块
exports.reg = (req, res) => {
    //检查注册的用户名和密码是否为空
    if (req.query.uname === "" || req.query.password === "") {
        return res.send({status: 400, msg: "用户名或密码不能为空！"})
    }
    //查询注册的用户名在数据库中是否有重名
    const sameNameSql = "SELECT * FROM users WHERE uname = ?"
    mySql.query(sameNameSql, req.query.uname, (err, results) => {
        if (err) {
            return res.send({status: 400, msg: err.message})
        }
        if (results.length > 0) {
            return res.send({status: 400, msg: '用户名被占用，请更换其他用户名！'})
        }
        //为密码加密
        req.query.password = bcryptjs.hashSync(req.query.password, 10)
        //加入时间戳
        req.query.addtime = new Date()
        //插入数据
        const insertSql = "INSERT INTO users SET ?"
        mySql.query(insertSql, req.query, (err, results) => {
            if (results.affectedRows !== 1) {
                return res.send({status: 400, msg: '注册用户失败'})
            }
            res.send({status: 200, msg: '注册成功！'})
        })
    })
}