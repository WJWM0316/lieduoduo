import { getRecruiterAllmanifestoApi } from '../../../../../../api/pages/recruiter.js'

const app = getApp()

Page({
	data: {
    mobile: '',
  	realName: '',
  	eMail: '',
  	job: ''
  },
  onLoad() {
    getApp().globalData.identity = 'RECRUITER'
    getRecruiterAllmanifestoApi()
  },
  bindInput(e) {
  	let field = e.currentTarget.dataset.field
    this.setData({
      [field]: e.detail.value
    })
  },
	submit(e) {
    const form = e.detail.value
    console.log(form)
  }
})
