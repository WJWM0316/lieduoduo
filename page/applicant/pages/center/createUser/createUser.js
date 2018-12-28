// page/applicant/pages/center/firstStep/fitstStep.js
import { postfirstStepApi } from '../../../../../api/pages/center'
Page({
  data: {
    workTime: '',
    avatarUrl: '',
    avatarId: ''
  },
  getresult (val) {
    console.log(val, '777777777777777')
    this.workTime = val.detail.propsResult
  },
  formSubmit (e) {
    e.detail.value.avatar = 12
    e.detail.value.startWorkYear = this.workTime
    postfirstStepApi(e.detail.value).then(res => {
      console.log(res, '99999999999')
      wx.navigateTo({ // 完善简历第二步
        url: '/page/applicant/pages/center/workExperience/workExperience'
      })
    }).catch (err => {
      console.log(err, '88888888888888888')
    })
  },
  onShow() {
    let avatarId = wx.getStorageSync('avatarId')
    let avatarUrl = wx.getStorageSync('avatarUrl')
    this.setData({avatarUrl, avatarId})
  }
})