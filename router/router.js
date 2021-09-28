//导入express模块
const express = require("express")
//创建router模块
const router = express.Router()
//导入user.js文件
const userRouter = require("./userRouter")

//登录
router.post("/login", userRouter.login)
//注册
router.post("/reg", userRouter.reg )


module.exports = router