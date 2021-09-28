//导入express模块
const express = require("express")
//导入cors模块,cors是解决跨域问题的模块
const cors = require("cors")
//导入router.js
const router = require("./router/router")
//注册路由
const app = express()
//调用cors
app.use(cors())
//解析 application/x-www-form-urlencoded （post）格式的表单数据的中间件
app.use(express.urlencoded({extended: false}))
//注册静态页面
app.use("/", express.static("wed"))
//注册router
app.use(router)
//监听端口
app.listen(80, () => {
    console.log("启动")
})