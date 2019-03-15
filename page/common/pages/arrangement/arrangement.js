import {interviewDetailApi, setInterviewDetailApi, sureInterviewApi} from "../../../../api/pages/interview.js"
import {COMMON,APPLICANT,RECRUITER} from "../../../../config.js"
import {mobileReg} from "../../../../utils/fieldRegular.js"
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    identity: "", // 身份标识
    options: {},
    cdnImagePath: app.globalData.cdnImagePath,
    appointmentId: '',
    hasReFresh: false,
    revised: false, // 重新编辑面试安排信息
    info: {}
  },
  getResult(e) {
    let date = e.detail.propsResult
    let curDate = new Date().getTime() / 1000
    if (curDate > date) {
      getApp().wxToast({
        title: '面试时间必须晚于当前时间'
      })
      return
    }
    let info = this.data.info
    let hasFilter = false
    if (!info.arrangementInfo) {
      info.arrangementInfo = {
        appointmentList: []
      }
    } else {
      if (!info.arrangementInfo.appointmentList) {
        info.arrangementInfo.appointmentList = []
      }
    }
    info.arrangementInfo.appointmentList.map((item, index) => {
      if (item.appointmentTime === date) {
        getApp().wxToast({
          title: '面试时间重复'
        })
        hasFilter = true
        return
      }
    })
    if (hasFilter) return
    info.arrangementInfo.appointmentList.push({appointmentTime:date})
    this.setData({info})
  },
  changeVal(e) {
    let info = this.data.info
    if (e.currentTarget.dataset.type === 'name') {
      info.recruiterInfo.realname = e.detail.value
    } else {
      info.recruiterInfo.mobile = e.detail.value
    }
    this.setData({info})
  },
  openMap() {
    wx.openLocation({
      latitude: Number(this.data.info.lat),
      longitude: Number(this.data.info.lng),
      scale: 14,
      name: this.data.info.address,
      fail: res => {
        app.wxToast({title: '获取位置失败'})
      }
    })
  },
  callPhone() {
    let info = this.data.info
    wx.showActionSheet({
      itemList: ['拨打', '复制'],
      success(res) {
        if (res.tapIndex === 0) {
          wx.makePhoneCall({
            phoneNumber: info.arrangementInfo.mobile || info.recruiterRealMobile
          })
        } else {
          wx.setClipboardData({
            data: info.arrangementInfo.mobile || info.recruiterRealMobile,
            success(res) {
              wx.getClipboardData({
                success(res) {
                  app.wxToast({
                    title: '复制成功',
                    icon: 'success'
                  })
                }
              })
            }
          })
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  jump(e) {
    let url = ''
    let info = this.data.info
    switch(e.currentTarget.dataset.type) {
      case 'jobList':
        url = `${RECRUITER}position/jobList/jobList?recruiterUid=${info.recruiterInfo.uid}`
        break
      case 'addressList':
        url = `${RECRUITER}position/addressList/addressList?type=position&selected=1`
        break
      case 'position':
        url = `${COMMON}positionDetail/positionDetail?positionId=${info.positionId}`
        break
    }
    wx.navigateTo({url})
  },
  radioChange(e) {
    let appointmentId = e.detail.value
    this.setData({appointmentId})
  },
  removeDate(e) {
    let index = e.currentTarget.dataset.index
    let info = this.data.info
    info.arrangementInfo.appointmentList.splice(index, 1)
    this.setData({info})
  },
  send() {
    let info = this.data.info
    let dateList = []
    if(!info.arrangementInfo.appointmentList || (info.arrangementInfo.appointmentList && info.arrangementInfo.appointmentList.length === 0)) {
      app.wxToast({title: '请编辑面试时间'})
      return
    }
    if (info.arrangementInfo) {
      info.arrangementInfo.appointmentList.map((item, index) => {
        dateList.push(item.appointmentTime)
      })
    }

    let data = {
      interviewId: this.data.options.id,
      realname: info.recruiterInfo.realname,
      mobile: info.recruiterInfo.mobile,
      positionId: info.positionId,
      addressId: info.addressId,
      interviewTime: dateList.join(',')
    }
    let title = ''
    if (!info.recruiterInfo.realname) {
      title = '请填写面试联系人'
    } else if (!info.recruiterInfo.mobile) {
      title = '请填写面试联系电话'
    } else if (info.recruiterInfo.mobile && !mobileReg.test(info.recruiterInfo.mobile)) {
      title = '联系电话格式错误'
    } else if (!data.interviewTime) {
      title = '请至少添加一个约面时间'
    }
    if (title) {
      app.wxToast({title})
      return
    }
    setInterviewDetailApi(data).then(res => {
      wx.removeStorageSync('interviewData')
      wx.removeStorageSync('createPosition')
      app.wxToast({
        title: '发送成功',
        icon: 'success'
      })
      this.pageInit()
    })
  },
  revise() {
    let info = this.data.info
    info.status = 21
    this.setData({info, revised: true})
  },
  sureDate() {
    let data = {
      interviewId: this.data.options.id,
      appointmentId: this.data.appointmentId
    }
    if(!this.data.appointmentId) {
      app.wxToast({title: '请选择一个面试时间'})
      return;
    }
    sureInterviewApi(data).then(res => {
      app.wxToast({
        title: '确定成功',
        icon: 'success'
      })
      this.pageInit()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    identity = app.identification(options)
    this.setData({options, identity})
  },
  pageInit() {
    return interviewDetailApi({interviewId: this.data.options.id}).then(res => {
      let addressData = wx.getStorageSync('createPosition')
      let positionData = wx.getStorageSync('interviewData')
      if ((res.data.status === 12 || res.data.status === 21 || res.data.status === 32) && wx.getStorageSync('choseType') === 'RECRUITER') {
        if (addressData) {
          res.data.addressId = addressData.address_id
          res.data.address = addressData.address
        }
        if (positionData) {
          res.data.positionName = positionData.positionName
          res.data.positionId = positionData.positionId
        }
      }
      this.setData({info: res.data})
    })
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
    let positionData = wx.getStorageSync('interviewData')
    let addressData = wx.getStorageSync('createPosition')
    let info = this.data.info
    if (positionData) {
      info.positionName = positionData.positionName
      info.positionId = positionData.positionId
    }
    if (addressData) {
      info.address = addressData.address
      info.addressId = addressData.address_id
    }
    this.setData({info})
    if (!this.data.revised) {
      this.pageInit()
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
    wx.removeStorageSync('createPosition')
    wx.removeStorageSync('interviewData')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh(hasLoading = true) {
    this.setData({hasReFresh: true, revised:false})
    this.pageInit().then(res => {
      this.setData({hasReFresh: false})
      wx.stopPullDownRefresh()
    }).catch(e => {
      wx.stopPullDownRefresh()
    })
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