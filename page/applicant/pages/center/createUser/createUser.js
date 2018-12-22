// page/applicant/pages/center/firstStep/fitstStep.js
import { postfirstStepApi } from '../../../../../api/pages/center'
Page({
  data: {
    workTime: ''
  },
  getresult (val) {
    this.workTime = val.detail.propsDesc
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
  }
})