// page/applicant/pages/center/resumeEditor/aimsEdit/aimsEdit.js
import { editExpectApi, addExpectApi } from '../../../../../../api/pages/center.js'
let target = null
let title = null
let nowEcpetId = null // 当前编辑的意向数据id
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: '请选择城市',
    position: '请选择职位',
//  signory: '请选择领域',
    salaryCeil: '',
    salaryFloor: '',
    isAdd: false,
    aimList: '请选择领域', // 用于展示的领域列表 
    aimIdList: '' // 作为接口参数的领域列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id === 'undefined') {
      this.setData({
        isAdd: true
      })
    }
    nowEcpetId = parseInt(options.id)
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
        let resultList = wx.getStorageSync('result')
        let aimList = null
        let aimIdList = ''
        resultList.map(item => {
          if (aimList) {
            aimList = `${aimList},${item.name}`
            aimIdList = `${aimIdList},${item.labelId}`
//          aimIdList.push(item.labelId)
          } else {
            aimList = `${item.name}`
            aimIdList = `${item.labelId}`
//          aimIdList.push(item.labelId)
          }
        })
        this.setData({aimList, aimIdList})
        console.log(wx.getStorageSync('result'))
//      this.setData({signory: wx.getStorageSync('result')})
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
        title = this.data.aimList
        break;
    }
  },
  /* 去选择页面(0、选择城市，1、选择职位，2、选择领域) */
  choose (e) {
    target = e.currentTarget.dataset.type
    this.setTitle(target)
    if (target === '2') {
      wx.navigateTo({
        url: `/page/applicant/pages/center/resumeEditor/skills/skills?target=${target}`
      })
      return
    }
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
  // 保存修改
  save () {
    const param = {
      id: nowEcpetId,
      cityNum: this.data.city.areaId,
      positionId: this.data.position.labelId,
      salaryCeil: this.data.salaryCeil,
      salaryFloor: this.data.salaryFloor,
      fieldIds: this.data.aimIdList
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
      app.globalData.resumeInfo.expects.map((item,index) => {
        if (item.id === res.data.id) {
          app.globalData.resumeInfo.careers[index] = res.data
        }
      })
      wx.navigateBack({delta: 1}) 
    })
  },
  // 新增
  add () {
    const param = {
      cityNum: this.data.city.areaId,
      positionId: this.data.position.labelId,
      salaryCeil: this.data.salaryCeil,
      salaryFloor: this.data.salaryFloor,
      fieldIds: this.data.aimIdList
    }
    for (let item in param) {
      if (!param[item] && item !== 'endTime') {
        wx.showToast({
          title: '带*为必填项，不能为空，请重新输入',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }
    addExpectApi(param).then(res => {
      app.globalData.resumeInfo.expects.push(res.data)
      wx.navigateBack({delta: 1}) 
    })
  },
  // 删除
  del () {
    editExpectApi({id: nowEcpetId}).then(res => {
      app.globalData.resumeInfo.expects.map((item, index) => {
        if (item.id === nowEcpetId) {
          app.globalData.resumeInfo.expects.splice(index,1)
          wx.navigateBack({delta: 1})
        }
      })
    })
  }
})