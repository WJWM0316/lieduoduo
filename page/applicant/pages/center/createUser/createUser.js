// page/applicant/pages/center/firstStep/fitstStep.js
import { postfirstStepApi } from '../../../../../api/pages/center'
let isStudent = false
Page({
  data: {
    workTime: '',
    avatarUrl: '',
    avatarId: '',
    gender: '1'
  },
  getresult (val) {
    if (val.detail.propsDesc === '在校生') {
      isStudent = true
    }
    this.workTime = val.detail.propsResult
  },
  formSubmit (e) {
    e.detail.value.avatar =  wx.getStorageSync('avatar').id
    e.detail.value.startWorkYear = this.workTime
    e.detail.value.gender = this.data.gender
    postfirstStepApi(e.detail.value).then(res => {
      if (isStudent) {
        wx.navigateTo({ // 是学生，直接跳转完善简历第三步
          url: '/page/applicant/pages/center/educaExperience/educaExperience'
        })
      } else {
        wx.navigateTo({ // 完善简历第二步
          url: '/page/applicant/pages/center/workExperience/workExperience'
        })
      }
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