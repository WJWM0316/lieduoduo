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
    e.detail.value.gender = sex
    postfirstStepApi(e.detail.value).then(res => {
      console.log(res, '99999999999')
      wx.navigateTo({
        url: '/page/applicant/pages/center/secondStep/secondStep'
      })
    }).catch (err => {
      console.log(err, '88888888888888888')
    })
  }
})