// page/applicant/pages/center/resumeEditor/aimsEdit/aimsEdit.js
import { editCareerApi, addCareerApi, deleteCareerApi } from '../../../../../../api/pages/center.js'
let target = null
let title = null
let nowWorkId = null // 当前编辑的意向数据id
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowInputNum: 0,
    showCase: false, // 是否展示例子
    jobCategories: '请选择职业类别',
    company: '',
    positionName: '',
    starTime: '',
    endTime: '',
    skill: '选择技能标签', // 技能标签
    skillsId: [],
    isAdd: false,
    duty: ''
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
    nowWorkId = parseInt(options.id)
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
  /* 展示或关闭例子 */
  showPopups () {
    this.setData({
      showCase: !this.data.showCase
    })
  },
  /* 实时监听输入 */
  WriteContent (e) {
    this.setData({
      duty: e.detail.value,
      nowInputNum: e.detail.cursor
    })
  },
  // 存储拿回来的数据
  set () {
    switch (target) {
      case '3':
        this.setData({jobCategories: wx.getStorageSync('result')})
        break;
      case '4':
        let skillList = wx.getStorageSync('result')
        let skill = null
        let skillsId = []
        skillList.map(item => {
          
          if (skill) {
            skill = `${skill},${item.name}`
            skillsId.push(item.name)
          } else {
            skill = `${item.name}`
            skillsId.push(item.name)
          }
        })
        this.setData({skill, skillsId})
        break;
    }
  },
  // 修改编辑页标题
  setTitle (target) {
    switch (target) {
      case '3':
        title = this.data.jobCategories
        break;
      case '4':
        title = this.data.skill
        break;
    }
  },
  /* 去选择页面(3、职位类别，4:技能标签) */
  choose (e) {
    target = e.currentTarget.dataset.type
    this.setTitle(target)
    if (target === '4') {
      wx.navigateTo({
        url: `/page/applicant/pages/center/resumeEditor/skills/skills`
      })
      return
    }
    wx.navigateTo({
      url: `/page/applicant/pages/center/resumeEditor/systematics/systematics?title=${title}&target=${target}`
    })
  },
  // 输入公司名字
  inpCompany (e) {
    this.data.company = e.detail.value
  },
  // 输入职位
  inpPosition (e) {
    console.log(e.detail.value)
    this.data.positionName = e.detail.value
  },
  getresult (e) {
    console.log(e)
    if (e.currentTarget.dataset.time === 'start') {
      this.data.starTime = e.detail.propsResult
    } else {
      this.data.endTime = e.detail.propsResult
    }
  },
  // 保存编辑
  save () {
    const param = {
      id: nowWorkId,
      company: this.data.company,
      position: this.data.positionName,
      positionType: this.data.jobCategories.labelId+'',
      startTime: this.data.starTime,
      endTime: this.data.endTime,
      labels: this.data.skillsId,
      duty: this.data.duty
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
    editCareerApi(param).then(res => {
      app.globalData.resumeInfo.careers.map((item,index) => {
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
      company: this.data.company,
      position: this.data.positionName,
      positionType: this.data.jobCategories.labelId+'',
      startTime: this.data.starTime,
      endTime: this.data.endTime,
      labels: this.data.skillsId,
      duty: this.data.duty
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
    addCareerApi(param).then(res => {
      app.globalData.resumeInfo.careers.push(res.data)
      wx.navigateBack({delta: 1}) 
    })
  },
  // 删除
  del () {
    deleteCareerApi({id: nowWorkId}).then(res => {
      app.globalData.resumeInfo.careers.map((item, index) => {
        if (item.id === nowWorkId) {
          app.globalData.resumeInfo.careers.splice(index,1)
          wx.navigateBack({delta: 1})
        }
      })
    })
  }
})