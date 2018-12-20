import { applyCompanyApi } from '../../../../../../api/pages/certification.js'
import {realNameReg, emailReg, positionReg} from '../../../../../../utils/fieldRegular.js'

const app = getApp()

Page({
  data: {
    real_name: '',
    user_email: '',
    user_position: '',
    company_id: 1,
    canClick: false,
    financeStage: ['所有状态', '所有状态1', '所有状态2', '所有状态3']
  },
  onLoad() {
    getApp().globalData.identity = 'RECRUITER'
  },
  bindInput(e) {
    console.log(e.detail.value)
  },
  selectCompany() {
    this.setData({canClick: true})
  },
  submit() {}
})