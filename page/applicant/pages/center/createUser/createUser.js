// page/applicant/pages/center/firstStep/fitstStep.js
import { postfirstStepApi } from '../../../../../api/pages/center'
let isStudent = false
Page({
  data: {
    name: '',
    workTime: '',
    avatarUrl: '',
    avatarId: '',
    position: '',
    gender: '1',
    workTimeDesr: ''
  },
  getresult (val) {
    if (val.detail.propsDesc === '在校生') {
      isStudent = true
    }
    this.workTime = val.detail.propsResult
  },
  formSubmit (e) {
    e.detail.value.avatar =  this.data.avatarId
    e.detail.value.startWorkYear = this.data.workTime
    e.detail.value.name = this.data.userName
    e.detail.value.gender = this.data.gender
    e.detail.value.position = this.data.position
    postfirstStepApi(e.detail.value).then(res => {
      let createUser = {
        gender: this.data.gender,
        workTime: this.data.workTime,
      }
      wx.setStorageSync('createUser', createUser)
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
  onLoad() {
    let avatar = wx.getStorageSync('avatar')
    let createUser = wx.getStorageSync('createUser')
    if (avatar && createUser) {
      this.setData({avatarUrl: avatar.url, avatarId: avatar.id, gender: createUser.gender, workTime: createUser.workTime})
    } else if (avatar) {
      this.setData({avatarUrl: avatar.url, avatarId: avatar.id})
    }
  }
})