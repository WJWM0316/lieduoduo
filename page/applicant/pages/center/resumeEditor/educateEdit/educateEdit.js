// page/applicant/pages/center/resumeEditor/aimsEdit/aimsEdit.js
import { editEducationApi, addEducationApi, deleteEducationApi } from '../../../../../../api/pages/center.js'
let target = null
let title = null
let nowEducateId = null // 当前编辑的意向数据id
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    schoolName: '', // 学校名称
    subject: '', // 专业名
    startTime: '',
    endTime: '',
    description: '', // 学校经历描述
    education: '', // 学历
    degreeDesc: '', // 学历描述
    isAdd: false
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
    nowEducateId = parseInt(options.id)
  },
  // 修改学校名字
  schoolName (e) {
    this.data.schoolName = e.detail.value
  },
  // 修改专业名称
  subject (e) {
    this.data.subject = e.detail.value
  },
  getresult (e) {
    console.log(e.detail, 999)
    if (e.currentTarget.dataset.time === 'start') {
      this.data.startTime = e.detail.propsResult
    } else if (e.currentTarget.dataset.time === 'end') {
      this.data.endTime = e.detail.propsResult
    } else {
      this.data.education = e.detail.propsResult
      this.data.degreeDesc = e.detail.propsDesc
    }
  },
  // 编辑学校经历
  WriteContent (e) {
//  console.log(e.detail.value)
    this.data.description = e.detail.value
  },
  // 编辑保存
  save () {
    const param = {
      id: nowEducateId,
      school: this.data.schoolName,
      degree: this.data.education,
      degreeDesc: this.data.degreeDesc,
      major: this.data.subject,
      startTime: this.data.startTime,
      endTime: this.data.endTime,
      experience: this.data.description
    }
    for (let item in param) {
      if (!param[item] && item !== 'endTime') {
        console.log(item)
        wx.showToast({
          title: `必填项不能为空，请重新输入`,
          icon: 'none',
          duration: 1000
        })
        return
      }
    }
    editEducationApi(param).then(res => {
      wx.showToast({
        title: '编辑成功',
        icon: 'none',
        duration: 1000
      })
      app.globalData.resumeInfo.educations.map((item, index) => {
        if (item.id === param.id) {
          app.globalData.resumeInfo.educations[index] = param
          wx.navigateBack({delta: 1})
        }
      })
    })
  },
  // 新增
  add () {
    const param = {
      school: this.data.schoolName,
      degree: this.data.education,
      major: this.data.subject,
      startTime: this.data.startTime,
      endTime: this.data.endTime,
      experience: this.data.description
    }
    for (let item in param) {
      if (!param[item] && item !== 'endTime') {
        console.log(item)
        wx.showToast({
          title: `必填项不能为空，请重新输入`,
          icon: 'none',
          duration: 1000
        })
        return
      }
    }
    addEducationApi(param).then(res => {
      app.globalData.resumeInfo.educations.push(res.data)
      wx.navigateBack({delta: 1})
    })
  },
  // 删除
  del () {
    deleteEducationApi({id: nowEducateId}).then(res => {
      app.globalData.resumeInfo.educations.map((item, index) => {
        if (item.id === nowEducateId) {
          app.globalData.resumeInfo.educations.splice(index,1)
          wx.navigateBack({delta: 1})
        }
      })
    })
  }
})