const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin
const BookModel = require('../models/bookInfo')
const emptyRoomNumber = require('../models/emptyRoomNumber')

  
module.exports = {
  bookroomPage: function(req, res) {
    res.render("bookroom");
  },
  bookroomSubmit: function (req, res, next) {
    const id = req.fields.idcard
    const name = req.fields.name
    const score = req.fields.score
    const phone = req.fields.phone
    const roomtype = req.fields.roomtype
    const startdate = req.fields.startdate
    const enddate = req.fields.enddate


    // 校验参数
    try {
      if (!id.length || isNaN(id)) {
        throw new Error('请填写身份证:数字')
      }
      if (!roomtype.length || (roomtype!= "单人房"&&roomtype!= "双人房"&&roomtype!= "大房")) {
        throw new Error('房间类型填写有误，正确格式为：单人房/双人房/大房')
      }
      if (!score.length || isNaN(score)) {
        throw new Error('积分填写有误')
      }
    } catch (e) {
      req.flash('error', e.message)
      return res.redirect('back')
    }

      // 待写入数据库的房间信息
      let bookinfo = {
        id: id,
        name: name,
        phone: phone,
        type: roomtype,
        startdate: Number(startdate),
        enddate: Number(enddate)
      }

      for (var i = startdate; i < enddate; i++) {
         emptyRoomNumber.reduceNumberByTypeAndDays(i,roomtype)
            .then(function (days, type) {
              req.flash('success', '操作成功')
            })
            .catch(function (e) {
               req.flash('error', '操作失败')
            })
      }
     
      // 用户信息写入数据库
       BookModel.create(bookinfo)
        .then(function (result) {
          req.flash('success', '添加成功')
          res.redirect('/manage')
        })
        .catch(function (e) {
          // 预定失败
          req.flash('error', '预定失败')
          return res.redirect('/manage')
          next(e)
        }) 
  }
}
