// page/applicant/pages/center/firstStep/fitstStep.js
import { postfirstStepApi } from '../../../../../api/pages/center'
import {userNameReg, positionReg} from '../../../../../utils/fieldRegular.js'
let app = getApp()
Page({
  data: {
    cdnImagePath: app.globalData.cdnImagePath,
    name: '',
    navHeight: app.globalData.navHeight,
    workTime: '',
    avatar: {},
    position: '',
    gender: '1',
    workTimeDesr: '',
    startWorkYear: ''
  },
  getresult (val) {
    this.setData({workTimeDesr: val.detail.propsDesc, startWorkYear: val.detail.propsResult})
  },
  getValue(e) {
    switch(e.currentTarget.dataset.type) {
      case 'name':
        this.setData({name: e.detail.value})
        break
      case 'position':
        this.setData({position: e.detail.value})
        break
    }
  },
  submit () {
    let info = this.data
    let title = ''
    if (!info.avatar.id) {
      title = '请上传头像'
    } else  if (!info.name) {
      title = '请输入姓名'
    } else if (info.name && (info.name.length < 2 || info.name.length > 20)) {
      title = '姓名需为2-20个汉字或英文'
    } else if (!info.workTimeDesr) {
      title = '请选择开始工作时间'
    }else  if (!info.position && this.data.workTimeDesr !== '在校生') {
      title = '请输入职位'
    } else if (info.position && !positionReg.test(info.position)) {
      title = '职位名称需为2-20个字'
    }
    if (title) {
      app.wxToast({'title': title})
      return
    }
    let data = {
      avatar:  info.avatar.id,
      startWorkYear: info.startWorkYear,
      name: info.name,
      gender: info.gender,
      position: info.position
    }
    postfirstStepApi(data).then(res => {
      let createUser = {
        name: info.name,
        gender: info.gender,
        startWorkYear: info.startWorkYear,
        workTimeDesr: info.workTimeDesr,
        position: info.position
      }
      wx.setStorageSync('createUserFirst', createUser)
      if (info.workTimeDesr === '在校生') {
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
    let avatar = wx.getStorageSync('avatar')
    let createUser = wx.getStorageSync('createUserFirst')
    if (avatar && createUser) {
      this.setData({avatar, name: createUser.name, position: createUser.position, gender: createUser.gender, workTimeDesr: createUser.workTimeDesr, startWorkYear: createUser.startWorkYear})
    } else if (avatar) {
      this.setData({avatar})
    }
  }
})