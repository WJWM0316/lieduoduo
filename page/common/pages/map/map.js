var QQMapWX = require('../../lib/qqmap-wx-jssdk.min.js')
var qqmapsdk
Page({
  data: {
    markers: [],
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color:"#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    controls: [{
      id: 1,
      iconPath: '../../resources/location.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }]
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  onLoad: function () {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'P63BZ-4RM35-BIJIV-QOL7E-XNCZZ-WIF4L'
    })
    wx.chooseLocation({
      success: res => {
        this.reverseGeocoder(res)
      },
      fail(e) {
        console.log(e)
      }
    })
    wx.getLocation({
     type: 'gcj02', //返回可以用于wx.openLocation的经纬度
     success (res) {
       const latitude = res.latitude
       const longitude = res.longitude
       wx.openLocation({
         latitude: 23.131881713867195,
         longitude: 113.32707977294919,
         scale: 18
       })
     }
    })
  },
  onShow: function () {
    // 调用接口
    // qqmapsdk.search({
    //   keyword: '广州华师地铁口',
    //   success: function (res) {
    //     console.log(res)
    //   },
    //   fail: function (res) {
    //     console.log(res)
    //   },
    //   complete: function (res) {
    //     console.log(res)
    //   }
    // })
  },
  // 转化地址信息
  reverseGeocoder(res) {
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: res.latitude,
        longitude: res.longitude
      },
      success: res => {
        wx.navigateTo({url: `${RECRUITER}position/post/post`})
        wx.setStorageSync('mapInfos', res.result)
      }
    })
  }
})