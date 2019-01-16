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
    info: '',
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
    if (options.id === '0') {
      this.setData({
        isAdd: true
      })
    }
    nowEducateId = parseInt(options.id)
    this.init()
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
      major: this.data.subject,
      startTime: this.data.startTime,
      endTime: this.data.endTime,
      experience: this.data.description
    }
    for (let item in param) {
      if (!param[item] && item !== 'endTime') {
        let itemName = ''
        switch (item) {
          case 'school':
            itemName = '学校名字不能为空'
            break;
          case 'degree':
            itemName = '学历不能为空'
            break;
          case 'startTime':
            itemName = '开始时间不能为空'
            break;
          case 'experience':
            itemName = '在校经历不能为空'
            break;
          case 'major':
            itemName = '专业不能为空'
            break;
          default:
            itemName = '结束时间不能为空'
            break;
        }
        wx.showToast({
          title: `${itemName}`,
          icon: 'none',
          duration: 1000
        })
        console.log(param)
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
          app.globalData.resumeInfo.educations[index] = res.data
          app.wxToast({
            title: '保存成功',
            icon: 'success',
            callback() {
              wx.navigateBack({delta: 1}) 
            }
          })
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
  },
  init () {
    if (!nowEducateId) return
    app.globalData.resumeInfo.educations.map((item, index) => {
      if (item.id === nowEducateId) {
        this.setData({
          schoolName: item.school,
          subject: item.major,
          description: item.experience,
          startTime: item.startTime,
          endTime: item.endTime,
          education: item.degree,
          info: item
        })
        return
      }
    })
  }
})