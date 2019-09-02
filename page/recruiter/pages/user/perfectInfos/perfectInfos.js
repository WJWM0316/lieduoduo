
const app = getApp()
import {COMMON, RECRUITER} from '../../../../../config.js'
import {getRecruiteBaseApi} from '../../../../../api/pages/recruiter.js'
let timer = null

Page({
  /**
   * 页面的初始数据
   */
  data: {
    nav: app.globalData.navHeight,
    positionTypeIds: '',
    positionType: '',
    labelType: '',
    labelIds: '',
    signature: '',
    userInfo: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow () {
    let getSignature = wx.getStorageSync('saveSignature'),
        createPosition = wx.getStorageSync('createPosition'),
        setData = {}
    let personalizedLabels = app.globalData.recruiterDetails.personalizedLabels
    if (personalizedLabels && personalizedLabels.length) {
      let labelIds = [],
          labelType= []
      personalizedLabels.forEach(item => {
        labelIds.push(item.id)
        labelType.push(item.labelName)
      })
      setData = {labelType: labelType.join(','), labelIds: labelIds.join(',')}
    }
    let signature = app.globalData.recruiterDetails.signature
    if (signature) setData.signature = signature
    if (getSignature) {
      setData.signature = getSignature
      wx.removeStorageSync('saveSignature')
    }
    if (createPosition) {
      setData.positionTypeIds = createPosition.type
      setData.positionType = createPosition.typeName
      wx.removeStorageSync('createPosition')
    }
    this.setData(setData)
  },
  routeJump (e) {
    let route = e.currentTarget.dataset.type,
        url   = ''
    switch (route) {
      case 'positionType':
        url = `${COMMON}category/category`
        break
      case 'labelType':
        url = `${COMMON}tabsPage/tabsPage`
        break
      case 'signature':
        url = `${RECRUITER}user/signature/signature`
        break
    }
    wx.navigateTo({url})
  },

  getValue (e) {
    let value = e.detail.value
  },
  formSubmit(e) {
    app.postFormId(e.detail.formId)
  },
  saveInfo () {
    let personalizedLabels = app.globalData.recruiterDetails.personalizedLabels,
        params = {}
    params = {
      positionTypeId: this.data.positionTypeIds,
      signature: this.data.signature
    }
    let that = this
    getRecruiteBaseApi(params).then(res => {
      app.wxToast({
        title: '保存成功',
        icon: 'success',
        callback () {
          app.globalData.signature = that.data.signature
          wx.navigateBack({delta: 1})
        }
      })
    })
  }
})