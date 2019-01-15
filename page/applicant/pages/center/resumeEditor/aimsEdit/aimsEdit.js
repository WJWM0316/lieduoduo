import { editExpectApi, addExpectApi, removeExpectApi } from '../../../../../../api/pages/center.js'
import {COMMON, APPLICANT} from '../../../../../../config.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    index: 0,
    options: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let info = this.data.info
    if (options.id) {
      wx.removeStorageSync('createPosition')
      wx.removeStorageSync('result')
      app.globalData.resumeInfo.expects.map((item, index) => {
        if (item.id === parseInt(options.id)) {
          this.setData({info: item, options, index})
          return
        }
      })
    }
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
    let result = wx.getStorageSync('result')
    let info = this.data.info
    let position = wx.getStorageSync('createPosition')
    if (result) {
      info.fields = result
    }
    if (position) {
      info.position = position.typeName
      info.positionId = position.type
    }
    this.setData({info})
  },
  onHide () {
  },
  /* 去选择页面(0、选择城市，1、选择职位，2、选择领域) */
  choose (e) {
    let target = e.currentTarget.dataset.type
    if (target === '2') {
      wx.navigateTo({
        url: `${APPLICANT}center/resumeEditor/skills/skills?target=${target}`
      })
    } else if (target === '1') {
      wx.navigateTo({
        url: `${COMMON}category/category`
      })
    }
  },
  
  getresult (e) {
    let info = this.data.info
    if (e.currentTarget.dataset.type === "salaryRangeC") {
      info.salaryCeil = parseInt(e.detail.propsResult[1])
      info.salaryFloor = parseInt(e.detail.propsResult[0])
    } else {
      info.cityNum = e.detail.propsResult[1]
      info.city = e.detail.propsDesc[1]
      this.setData({info})
    }
  },
  // 保存修改
  save () {
    let info = this.data.info
    let fields = []
    info.fields.map((item) => {
      if (item.fieldId) {
        fields.push(item.fieldId)
      } else {
        fields.push(item.labelId)
      }
    })
    const param = {
      id: this.data.options.id,
      cityNum: info.cityNum,
      positionId: info.positionId,
      salaryCeil: info.salaryCeil,
      salaryFloor: info.salaryFloor,
      fieldIds: fields.join(',')
    }
    editExpectApi(param).then(res => {
      app.globalData.resumeInfo.expects[this.data.info] = info
      wx.removeStorageSync('createPosition')
      wx.removeStorageSync('result')
      app.wxToast({
        title: '保存成功',
        icon: 'success',
        callback() {
          wx.navigateBack({delta: 1}) 
        }
      })
    })
  },
  // 新增
  add () {
    let info = this.data.info
    let fields = []
    info.fields.map((item) => {
      if (item.fieldId) {
        fields.push(item.fieldId)
      } else {
        fields.push(item.labelId)
      }
    })
    const param = {
      cityNum: info.cityNum,
      positionId: info.positionId,
      salaryCeil: info.salaryCeil,
      salaryFloor: info.salaryFloor,
      fieldIds: fields.join(',')
    }
    addExpectApi(param).then(res => {
      app.globalData.resumeInfo.expects.push(res.data)
      wx.removeStorageSync('createPosition')
      wx.removeStorageSync('result')
      app.wxToast({
        title: '发布成功',
        icon: 'success',
        callback() {
          wx.navigateBack({delta: 1}) 
        }
      })
    })
  },
  // 删除
  del () {
    let that = this
    app.wxConfirm({
      title: '删除求职意向',
      content: '求职意向删除后将无法恢复，是否确定删除？',
      confirmBack() {
        removeExpectApi({id: that.data.options.id}).then(res => {
          app.wxToast({
            title: '删除成功',
            icon: 'success',
            callback() {
              app.globalData.resumeInfo.expects.map((item, index) => {
                if (item.id === parseInt(that.data.options.id)) {
                  app.globalData.resumeInfo.expects.splice(index,1)
                  wx.navigateBack({delta: 1})
                  return
                }
              })
            }
          })
          
        })
      }
    })
    
  }
})