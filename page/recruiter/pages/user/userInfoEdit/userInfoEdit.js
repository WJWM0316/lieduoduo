import {saveRecruiterInfoApi} from '../../../../../api/pages/recruiter.js'
import {removeFileApi} from '../../../../../api/pages/common.js'
import {COMMON} from "../../../../../config.js"
import {realNameReg,positionReg,emailReg,wechatReg,mobileReg} from '../../../../../utils/fieldRegular.js'
let userInfo = null
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    gender: 0,
    position: '',
    email: '',
    wechat: '',
    signature: '',
    positionTypeId: 0,
    positionType: '',
    picList: [],
    choseNum: 6
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setStorageSync('choseType', 'RECRUITER')
    let userInfo = app.globalData.recruiterDetails
    this.setData({
      userName: userInfo.name,
      gender: userInfo.gender,
      position: userInfo.position,
      email: userInfo.email,
      wechat: userInfo.wechat,
      signature: userInfo.signature,
      picList: userInfo.avatars,
      positionTypeId: userInfo.positionTypeId,
      positionType: userInfo.positionType
    })
  },
  jumpLabel() {
    wx.navigateTo({
      url: `/page/common/pages/tabsPage/tabsPage`
    })
  },
  radioChange(e) {
    this.setData({gender: parseInt(e.detail.value)})
  },
  getResult(e) {
    let picList = this.data.picList
    picList = picList.concat(e.detail)
    let choseNum = this.data.choseNum
    choseNum = 6 - picList.length
    this.setData({picList, choseNum})
  },
  routeJump (e) {
    switch (e.target.dataset.type) {
      case 'positionType':
        wx.navigateTo({url: `${COMMON}category/category`})
        break
    }
  },
  getInputValue(e) {
    let type = ''
    switch (e.target.dataset.type) {
      case 'name':
        type = 'userName'
        break
      case 'position':
        type = 'position'
        break
      case 'email':
        type = 'email'
        break
      case 'wechat':
        type = 'wechat'
        break
    }
    this.setData({[type]: e.detail.value})
  },
  singInput(e) {
    if (e.detail.value === ' ') {
      this.setData({signature: ''})
    } else {
      this.setData({signature: e.detail.value})
    }
  },
  removeFile(e) {
    let picList = this.data.picList
    picList.splice(e.currentTarget.dataset.index, 1)
    this.setData({picList})
  },
  saveInfo() {
    let info = this.data
    let idList = []
    let title = ''
    info.picList.map((item, index) => {
      idList.push(item.id)
    })
    if (!realNameReg.test(info.userName)) {
      title = '姓名需为2-20个中文字符'
    }
    if (!info.positionTypeId) {
      title = '请选择担任职务类别'
    }
    if (!positionReg.test(info.position)) {
      title = '担任职务需为2-20个字'
    }
    if (!emailReg.test(info.email)) {
      title = '邮箱格式不正确'
    }
    if (info.wechat && !wechatReg.test(info.wechat)) {
      title = '微信号格式不正确'
    }
    if (info.signature) {
      if (info.signature.length < 6) {
        title = '个人签名不得少于6个字'
      } else if (info.signature.length > 30) {
        title = '个人签名最多输入30个字'
      }
    } else {
      title = '个人签名需为6~30个字'
    }
    if (title) {
      app.wxToast({
        title
      })
      return
    }
    let data = {
      attachIds: idList.join(','),
      gender: info.gender,
      name: info.userName,
      position: info.position,
      email: info.email,
      wechat: info.wechat,
      signature: info.signature,
      positionTypeId: info.positionTypeId,
      ...app.getSource()
    }
    saveRecruiterInfoApi(data).then(res => {
      app.wxToast({
        title: '保存成功',
        icon: 'success',
        callback() {
          app.globalData.recruiterDetails.avatar = info.picList[0]
          app.globalData.recruiterDetails.avatars = info.picList
          app.globalData.recruiterDetails.gender = info.gender
          app.globalData.recruiterDetails.name = info.userName
          app.globalData.recruiterDetails.position = info.position
          app.globalData.recruiterDetails.email = info.email
          app.globalData.recruiterDetails.wechat = info.wechat
          app.globalData.recruiterDetails.signature = info.signature
          app.globalData.recruiterDetails.positionTypeId = info.positionTypeId
          app.globalData.recruiterDetails.positionType = info.positionType
          wx.navigateBack({ delta: 1 })
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let createPosition = wx.getStorageSync('createPosition'),
        setData = {}
    if (createPosition) {
      setData.positionTypeId = createPosition.type
      setData.positionType = createPosition.typeName
      this.setData(setData)
      wx.removeStorageSync('createPosition')
    }
    
    let avatar = wx.getStorageSync('avatar')
    if (avatar) {
      let picList = this.data.picList
      picList.push(avatar)
      wx.removeStorageSync('avatar')
      this.setData({picList})
    }
  }
})