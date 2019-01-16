// page/applicant/pages/center/resumeEditor/aimsEdit/aimsEdit.js
import { editProjectApi, addProjectApi, deleteProjectApi } from '../../../../../../api/pages/center.js'
let target = null
let title = null
let nowItemId = null // 当前编辑的意向数据id
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: '', // 当前编辑的项目旧数据
    itemName: '', //项目名称
    role: '', // 担任角色
    signory: '请选择领域',
    startTime: '',
    endTime: '',
    description: '', // 项目描述
    itemLink: '',
    isAdd: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    nowItemId = parseInt(options.id)
    if (options.id === '0') {
      this.setData({
        isAdd: true
      })
    }
    this.init()
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
    if (e.currentTarget.dataset.time === 'start') {
      this.data.startTime = e.detail.propsResult
    } else {
      this.data.endTime = e.detail.propsResult
    }
  },
  WriteContent (e) {
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
      if (!param[item] && item !== 'link' && item !== 'endTime') {
        let itemName = ''
        switch (item) {
          case 'name':
            itemName = '项目名字不能为空'
            break;
          case 'role':
            itemName = '担任角色不能为空'
            break;
          case 'startTime':
            itemName = '开始时间不能为空'
            break;
          case 'description':
            itemName = '项目描述不能为空'
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
        return
      }
    }
    editProjectApi(param).then(res => {
      wx.showToast({
        title: '编辑成功',
        icon: 'none',
        duration: 1000
      })
      app.globalData.resumeInfo.projects.map((item, index) => {
        if (item.id === param.id) {
          app.globalData.resumeInfo.projects[index] = res.data
          app.wxToast({
            title: '保存成功',
            icon: 'success',
            callback() {
              wx.navigateBack({delta: 1}) 
            }
          })
          return
        }
      })
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
      if (!param[item] && item !== 'link' && item !== 'endTime') {
        let itemName = ''
        switch (item) {
          case 'name':
            itemName = '项目名字不能为空'
            break;
          case 'role':
            itemName = '担任角色不能为空'
            break;
          case 'startTime':
            itemName = '开始时间不能为空'
            break;
          case 'description':
            itemName = '项目描述不能为空'
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
        return
      }
    }
    addProjectApi(param).then(res => {
      app.globalData.resumeInfo.projects.push(res.data)
      app.wxToast({
        title: '保存成功',
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
        deleteProjectApi({id: nowItemId}).then(res => {
          app.wxToast({
            title: '删除成功',
            icon: 'success',
            callback() {
              app.globalData.resumeInfo.projects.map((item, index) => {
                if (item.id === nowItemId) {
                  app.globalData.resumeInfo.projects.splice(index,1)
                  wx.navigateBack({delta: 1})
                }
              })
            }
          })
        })
      }
    })
  },
  init () {
    if (!nowItemId) return;
    app.globalData.resumeInfo.projects.map((item, index) => {
      if (item.id === nowItemId) {
        this.setData({
          itemName: item.name,
          role: item.role,
          description: item.description,
          itemLink: item.link,
          startTime: item.startTime,
          endTime: item.endTime,
          info: item
        })
        console.log(item)
        return
      }
    })
  }
})