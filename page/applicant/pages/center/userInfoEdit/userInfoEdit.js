import {editBaseInfoApi} from '../../../../../api/pages/center.js'
import {userNameReg,mobileReg,wechatReg} from '../../../../../utils/fieldRegular.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    options: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({options})
  },
  jumpLabel() {
    wx.navigateTo({
      url: `/page/common/pages/tabsPage/tabsPage`
    })
  },
  jump() {
    wx.navigateTo({
      url: `/page/common/pages/changeMobile/changeMobile`
    })
  },
  radioChange(e) {
    let info = this.data.info
    info.gender = parseInt(e.detail.value)
    this.setData({info})
  },
  getResult(e) {
    let info = this.data.info
    switch (e.target.dataset.type) {
      case 'birthday':
        info.birth = e.detail.propsResult
        info.birthDesc = e.detail.propsDesc
        info.age = parseInt((new Date().getTime() - info.birth * 1000) / (365 * 24 * 3600 * 1000))
        break
      case 'workTime':
        info.startWorkYear = e.detail.propsResult
        info.startWorkYearDesc = e.detail.propsDesc
        if (info.startWorkYear) {
          let workAgeDesc = parseInt((new Date().getTime() - info.startWorkYear * 1000) / (365 * 24 * 3600 * 1000))
          if (workAgeDesc === 0) {
            info.workAgeDesc = '1年以内'
          } else if (workAgeDesc > 10) {
            info.workAgeDesc = '10年以上'
          } else {
            info.workAgeDesc = workAgeDesc + '年'
          }
        } else {
          info.workAgeDesc = '1年以内'
        }
        break
      case 'jobStatus':
        info.jobStatus = e.detail.propsResult
        info.jobStatusDesc = e.detail.propsDesc
        break
    }
    this.setData({info})
  },
  getInputValue(e) {
    let info = this.data.info
    switch (e.target.dataset.type) {
      case 'name':
        info.name = e.detail.value
        break
      case 'mobile':
        info.mobile = e.detail.value
        break
      case 'wechat':
        info.wechat = e.detail.value
        break
    }
    this.setData({info})
  },
  singInput(e) {
    let info = this.data.info
    if (e.detail.value === ' ') {
      info.signature = ''
      this.setData({info})
    } else {
      info.signature = e.detail.value
      this.setData({info})
    }
  },
  saveInfo() {
    let info = this.data.info
    let title = ''
    if (!info.name) {
      title = '请填写姓名'
    } else if (info.name && !userNameReg.test(info.name)) {
      title = '姓名需为2-20个汉字或英文'
    } else if (!info.birth) {
      title = '请选择出生年月'
    } else if (!info.startWorkYear && info.startWorkYear !== 0) {
      title = '请选择参加工作时间'
    } else if (!info.jobStatus) {
      title = '请选择求职状态'
    } else if (!info.mobile) {
      title = '请填写手机号'
    } else if (info.mobile && !mobileReg.test(info.mobile)) {
      title = '手机号格式不正确'
    } else if (info.mobile && !wechatReg.test(info.mobile)) {
      title = '微信号格式不正确'
    } else if (info.signature) {
      if (info.signature.length < 6) {
        title = '自我描述不得少于6个字'
      }
      if (info.signature.length > 150) {
        title = '自我描述最多输入150个字'
      }
    }
    if (title) {
      app.wxToast({title})
      return
    }
    let data = {
      avatar: info.avatar.id,
      name: info.name,
      gender: info.gender,
      birth: info.birth,
      startWorkYear: info.startWorkYear,
      jobStatus: info.jobStatus,
      mobile: info.mobile,
      wechat: info.wechat,
      signature: info.signature
    }
    let that = this
    editBaseInfoApi(data).then(res => {
      app.wxToast({
        title: '保存成功',
        icon: 'success',
        callback() {
          that.setData({info})
          app.getAllInfo().then(res => {
            if (that.data.options.from === 'guideCard') {
              wx.setStorageSync('appendUserInfoEdit', {firstIndex: that.data.options.firstIndex, secondIndex: that.data.options.secondIndex})
            }
            wx.navigateBack({
              delta: 1
            })
          })
          wx.removeStorageSync('avatar')
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let info = app.globalData.resumeInfo
    let avatar = wx.getStorageSync('avatar')
    if (avatar) {
      info.avatar = avatar
    }
    this.setData({info})
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  }
})