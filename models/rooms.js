const Room = require('../lib/mongo').Room

module.exports = {
  // 用于房间管理：
  // 通过房间号获取房间信息
  getRoomByNumber: function getRoomByNumber (number) {
    return Room.findOne({ number: number }).exec()
  },

  // 获取所有房间信息
  getAllRoomInfo: function getAllRoomInfo () {
    return Room.find().exec()
  },

  // 添加一个房间
  create: function create (room) {
    return Room.create(room).exec()
  },

  // 通过number删除一个房间
  delRoomById: function delRoomById (number) {
    return Room.deleteOne({ number: number }).exec()
  },

  // 修改房间信息
  updateRoom: function updateRoom (room) {
    return Room.updateOne({'number':room.number},{$set:{'type':room.type, value:room.value}}).exec()
  },

  // 获得单人房房间的总数
  getSingleRoomNumber: function getSingleRoomNumber () {
    return singleNum = Room.count({type: '单人房'}).exec()
  },

  // 获得双人房房间的总数
  getDoubleRoomNumber: function getDoubleRoomNumber () {
    return singleNum = Room.count({type: '双人房'}).exec()
  },

  // 获得大房房间的总数
  getBigRoomNumber: function getBigRoomNumber () {
    return singleNum = Room.count({type: '大房'}).exec()
  },
  
  // 用于登记入住管理：

  // 根据房间类型随机获得一个空房的信息, 类型：{number:xx, type:xx, value:xx, status:0}
  getRoomIdByType: function getRoomIdByType (type) {
    Room.find({type:type, status:0}).then(function(rooms) {
      var randNum = Math.floor(Math.random()*rooms.length)
      return rooms[randNum];
    })
  },

  // 根据房间号码登记入住/退房(退房时customerId传入"0")
  setStatusByRoomNumer: function setStatusByRoomNumer (number,customerId) {
    return updateOne({'number':number},{$set:{'status':customerId}}).exec()
  },
}
