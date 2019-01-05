// page/applicant/pages/center/firstStep/fitstStep.js
import { postfirstStepApi } from '../../../../../api/pages/center'
Page({
  data: {
    workTime: '',
    avatarUrl: '',
    avatarId: '',
    gender: '1'
  },
  getresult (val) {
    this.workTime = val.detail.propsResult
  },
  formSubmit (e) {
    e.detail.value.avatar =  wx.getStorageSync('avatarId')
    e.detail.value.startWorkYear = this.workTime
    e.detail.value.gender = this.data.gender
    postfirstStepApi(e.detail.value).then(res => {
      wx.navigateTo({ // 完善简历第二步
        url: '/page/applicant/pages/center/workExperience/workExperience'
      })
    }).catch (err => {
      console.log(err, '88888888888888888')
    })
  },
  chooseGender (e) {
    this.setData({
      gender: e.target.dataset.gender
    })
  },
  onShow() {
    let avatarId = wx.getStorageSync('avatarId')
    let avatarUrl = wx.getStorageSync('avatarUrl')
    this.setData({avatarUrl, avatarId})
  }
})