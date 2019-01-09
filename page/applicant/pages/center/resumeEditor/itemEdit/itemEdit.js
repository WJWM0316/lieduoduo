// page/applicant/pages/center/resumeEditor/aimsEdit/aimsEdit.js
import { editProjectApi, addProjectApi } from '../../../../../../api/pages/center.js'
let target = null
let title = null
let nowItemId = null // 当前编辑的意向数据id
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemName: '', //项目名称
    role: '', // 担任角色
    signory: '请选择领域',
    startTime: '',
    endTime: '',
    description: '', // 项目描述
    itemLink: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    nowItemId = parseInt(options.id)
  },
  // 修改项目名称
  itemName (e) {
    this.data.itemName = e.detail.value
  },
  // 修改担任角色
  role (e) {
    this.data.role = e.detail.value
  },
  getresult (e) {
//  console.log(e.currentTarget.dataset.time)
    if (e.currentTarget.dataset.time === 'start') {
      this.data.startTime = e.detail.propsResult
    } else {
      this.data.endTime = e.detail.propsResult
    }
  },
  WriteContent (e) {
//  console.log(e.detail.value)
    this.data.description = e.detail.value
  },
  itemLink (e) {
    this.data.itemLink = e.detail.value
  },
  // 编辑保存
  save () {
    const param = {
      id: nowItemId,
      name: this.data.itemName,
      role: this.data.role,
      startTime: this.data.startTime,
      endTime: this.data.endTime,
      description: this.data.description,
      link: this.data.itemLink
    }
    for (let item in param) {
      if (!param[item] && item !== 'link') {
        console.log(item)
        wx.showToast({
          title: `必填项不能为空，请重新输入`,
          icon: 'none',
          duration: 1000
        })
        return
      }
    }
    editProjectApi(param).then(res => {
      wx.showToast({
        title: '编辑成功',
        icon: 'none',
        duration: 1000
      })
      app.globalData.resumeInfo.projects.map((item) => {
        if (item.id === param.id) {
          item = param
        }
      })
      wx.navigateBack({delta: 1}) 
    })
  },
  // 新增
  add () {
    const param = {
      name: this.data.itemName,
      role: this.data.role,
      startTime: this.data.startTime,
      endTime: this.data.endTime,
      description: this.data.description,
      link: this.data.itemLink
    }
    for (let item in param) {
      if (!param[item] && item !== 'link') {
        console.log(item)
        wx.showToast({
          title: `必填项不能为空，请重新输入`,
          icon: 'none',
          duration: 1000
        })
        return
      }
    }
    addProjectApi(param).then(res => {
      app.globalData.resumeInf.projects.push(res.data)
      wx.navigateBack({delta: 1}) 
    })
  }
})