// page/applicant/pages/center/resumeEditor/aimsEdit/aimsEdit.js
import { editExpectApi } from '../../../../../../api/pages/center.js'
let target = null
let title = null
let nowEcpetId = null // 当前编辑的意向数据id
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: '请选择城市',
    position: '请选择职位',
    signory: '请选择领域',
    salaryCeil: '',
    salaryFloor: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    nowEcpetId = options.id
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
    this.set()
  },
  onHide () {
    wx.removeStorageSync('result')
  },
  // 存储数据
  set () {
    switch (target) {
      case '0':
        this.setData({city: wx.getStorageSync('result')})
        break;
      case '1':
        this.setData({position: wx.getStorageSync('result')})
        break;
      case '2':
        this.setData({signory: wx.getStorageSync('result')})
        break;
    }
  },
  setTitle (target) {
    switch (target) {
      case '0':
        title = this.data.city
        break;
      case '1':
        title = this.data.position
        break;
      case '2':
        title = this.data.signory
        break;
    }
  },
  /* 去选择页面(0、选择城市，1、选择职位，2、选择领域) */
  choose (e) {
    target = e.currentTarget.dataset.type
    this.setTitle(target)
    wx.navigateTo({
      url: `/page/applicant/pages/center/resumeEditor/systematics/systematics?title=${title}&target=${target}`
    })
  },
  
  getresult (e) {
    console.log(e)
    this.setData({
      salaryCeil: parseInt(e.detail.propsResult[1]),
      salaryFloor: parseInt(e.detail.propsResult[0])
    })
  },
  save () {
    const param = {
      id: nowEcpetId,
      cityNum: this.data.city.areaId,
      positionId: this.data.position.labelId,
      salaryCeil: this.data.salaryCeil,
      salaryFloor: this.data.salaryFloor,
      fieldIds: this.data.signory.labelId+''
    }
    for (let item in param) {
      if (!param[item]) {
        wx.showToast({
          title: '必填项不能为空，请重新输入',
          icon: 'none',
          duration: 1000
        })
        return
      }
    }
    editExpectApi(param).then(res => {
      wx.showToast({
        title: '编辑成功',
        icon: 'none',
        duration: 1000
      })
      wx.navigateBack({delta: 1}) 
    })
  }
})