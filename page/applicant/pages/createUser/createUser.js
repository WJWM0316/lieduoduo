import wxAnimation from '../../../../utils/animation.js'
import {getSelectorQuery} from '../../../../utils/util.js'
import {getStepApi, getCreatFirstStepApi, postCreatFirstStepApi, getCreatSecondStepApi, postCreatSecondStepApi} from '../../../../api/pages/center.js'
import {COMMON, APPLICANT} from '../../../../config.js'
const app = getApp()
let timer = null,
    duration = 800 // 过场动画时间
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: app.globalData.navHeight,
    isBangs: app.globalData.isBangs,
    cdnImagePath: app.globalData.cdnImagePath,
    animationData: {},
    step: -1, // 创建步数
    active: null,
    avatar: {},
    gender: 1,
    name: '',
    birthDesr: '',
    birth: 0,
    startWorkYearDesc: '',
    startWork: 0,
    workCurrent: 0,
    workErr: 0,
    workDate: [
      {
        company: '',
        positionTypeId: 0,
        positionType: '',
        position: '',
        startTime: 0,
        startTimeDesc: '',
        endTime: 0,
        endTimeDesc: '',
        duty: ''
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.loginInit) {
      this.getStep()
    } else {
      app.loginInit = () => {
        this.getStep()
      }
    }
  },
  progress (step) {
    this.setData({step}, () => {
      this.setData({active: step})
      if (step !== 0 && step%2 !== 0) return
      timer = setTimeout(() => {
        step++
        if (step > 7) {
          clearTimeout(timer)   
        } else {
          this.progress(step)
        }
      }, duration)
    })
  },
  toggle (e) {
    let workCurrent = this.data.workCurrent
    let getData = e.currentTarget.dataset
    switch (getData.type) {
      case 'next':
        workCurrent++
        if (workCurrent > this.data.workDate.length - 1) workCurrent = 0
        break
      case 'prev':
        workCurrent--
        if (workCurrent < 0) workCurrent = this.data.workDate.length - 1
        break
      case 'change':
        workCurrent = e.detail.current
        break
      case 'index':
        workCurrent = getData.index
    }
    this.setData({workCurrent})
  },
  addItem (e) {
    let getData = e.currentTarget.dataset
    let type = ''
    let listKey = ''
    let list = []
    let current = 0
    switch (getData.type) {
      case 'work':
        listKey = 'workDate'
        type = 'workCurrent'
        current = this.data.workCurrent
        list = this.data.workDate
        break
    }
    if (this.data.workDate.length >= 3) {
      app.wxToast({title: '最多只能添加三份档案'})
      return
    }
    list.push({})
    this.setData({[listKey]: list, [type]: list.length - 1})
  },
  remove (e) {
    let getData = e.currentTarget.dataset,
        type = '',
        listKey = '',
        list = [],
        current = 0,
        errType = '',
        err = 0,
        that = this
    switch (getData.type) {
      case 'work':
        listKey = 'workDate'
        type = 'workCurrent'
        errType = 'workErr'
        current = this.data.workCurrent
        list = this.data.workDate
        break
    }
    app.wxConfirm({
      title: '提示',
      content: `删除后无法恢复，确认是否要删除0${current + 1}档案？`,
      confirmBack() {
        if (that.data[errType] === current + 1) {
          err = 0
        } else {
          err = that.data[errType]
        }
        if (current !== 0 && current <= list.length - 1) {
          list.splice(current, 1)
          current --
          that.setData({[type]: current, [listKey]: list, [errType]: err})
        } else {
          list.splice(current, 1)
          that.setData({[listKey]: list, [errType]: err})
        }
      }
    })
  },
  continue () {
    this.submitFun().then(res => {
      let step = this.data.step
      step++
      this.progress(step)
    })
  },
  submitFun () {
    switch (this.data.step) {
      case 1:
        return this.postFirstFun()
        break
      case 3:
        let workDate = this.data.workDate
        let workErr = this.data.workErr
        let workCurrent = this.data.workCurrent
        for (let i = 0; i <= workDate.length - 1; i++) {
          if (!workDate[i].company || !workDate[i].positionTypeId || !workDate[i].position || !workDate[i].startTime || (!workDate[i].endTime && workDate[i].endTime !== 0) || !workDate[i].duty) {
            workErr = i + 1
            this.setData({workErr, workCurrent: i})
            break
          } else {
            if (workErr) this.setData({workErr: 0})
          }
        }
        if (workErr) {
          return new Promise((resolve, reject) => {reject(`第${workErr}个工作经历档案信息不完整, 无法提交`)})
        }
        return this.postSecondFun()
    }
  },
  postFirstFun (type) {
    let data = this.data
    let params = {
      avatar: data.avatar.id,
      gender: data.gender,
      name: data.name,
      birth: data.birth,
      startWorkYear: data.startWorkYear
    }
    return postCreatFirstStepApi(params)
  },
  postSecondFun (type) {
    let data = this.data
    let params = this.data.workDate
    return postCreatSecondStepApi({careers: params})
  },
  getStepData (step) {
    switch (step) {
      case 1:
        return getCreatFirstStepApi().then(res => {
          let avatar = res.data.avatar
          let birth = res.data.birth
          let birthDesc = res.data.birthDesc
          let gender = res.data.gender
          let name = res.data.name
          let startWorkYearDesc = res.data.startWorkYearDesc
          let startWorkYear = res.data.startWorkYear
          this.setData({name, gender, birth, birthDesc, startWorkYear, startWorkYearDesc})
        })
        break
      case 2:
        return getCreatSecondStepApi().then(res => {
        })
    }
  },
  getStep () {
    getStepApi().then(res => {
      let step = res.data.step
      if (step === 1) step = -1
      if (step > 0) this.setData({step: step + 2}, () => {
        this.progress(this.data.step)
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let step = this.data.step
    this.progress(step)
  },
  getresult (e) {
    let getData = e.currentTarget.dataset
    let detail = e.detail
    switch (getData.type) {
      case 'workTime':
        this.setData({startWorkYearDesc: e.detail.propsDesc, startWorkYear: e.detail.propsResult})
        break
      case 'birth':
        this.setData({birthDesr: e.detail.propsDesc, birth: e.detail.propsResult})
        break
      case 'startTime':
        var index = this.data.workCurrent,
            workDate = this.data.workDate
        workDate[index].startTime = e.detail.propsResult
        workDate[index].startTimeDesc = e.detail.propsDesc
        this.setData({workDate})
        break
      case 'endTime':
        var index = this.data.workCurrent,
            workDate = this.data.workDate
        workDate[index].endTime = e.detail.propsResult
        workDate[index].endTimeDesc = e.detail.propsDesc
        this.setData({workDate})
        break
    }
    
  },
  chooseGender (e) {
    let getData = e.currentTarget.dataset
    this.setData({gender: getData.gender})
  },
  getValue (e) {
    clearTimeout(timer)
    let getData = e.currentTarget.dataset
    let value = e.detail.value
    let key = ''
    switch (getData.type) {
      case 'name':
        key = 'name'
        break
      case 'companyName':
        key = 'workDate'
        var workDate = this.data.workDate
        workDate[this.data.workCurrent].company = value
        value = workDate
        break
      case 'positionName':
        key = 'position'
        var workDate = this.data.workDate
        workDate[this.data.workCurrent].position = value
        value = workDate
    }
    timer = setTimeout(() => {
      this.setData({[key]: value})
      clearTimeout(timer)
    }, 300)
  },
  jump (e) {
    let type = e.currentTarget.dataset.type
    let url = ''
    switch (type) {
      case 'companyName':
        url = `${APPLICANT}searchCompany/searchCompany`
        wx.setStorageSync('createdCompany', e.currentTarget.dataset.value)
        break
      case 'positionType':
        url = `${COMMON}category/category`
        break
      case 'workContent':
        url = `${APPLICANT}center/workContent/workContent`
        wx.setStorageSync('workContent', e.currentTarget.dataset.value)
        break
    }
    wx.navigateTo({url})
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let avatar = wx.getStorageSync('avatar')
    let positionType = wx.getStorageSync('createPosition')
    let companyName = wx.getStorageSync('companyName')
    let workContent = wx.getStorageSync('workContent')
    if (avatar) {
      this.setData({avatar}, () => {
        wx.removeStorageSync('avatar')
      })
    }
    if (companyName) {
      let workDate = this.data.workDate
      let index = this.data.workCurrent
      workDate[index].company = companyName
      this.setData({workDate}, () => {
        wx.removeStorageSync('companyName')
      })
    }
    if (positionType) {
      let workDate = this.data.workDate
      let index = this.data.workCurrent
      workDate[index].positionTypeId = positionType.type
      workDate[index].positionType = positionType.typeName
      this.setData({workDate}, () => {
        wx.removeStorageSync('createPosition')
      })
    }
    if (workContent) {
      let workDate = this.data.workDate
      let index = this.data.workCurrent
      workDate[index].duty = workContent
      this.setData({workDate}, () => {
        wx.removeStorageSync('workContent')
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})