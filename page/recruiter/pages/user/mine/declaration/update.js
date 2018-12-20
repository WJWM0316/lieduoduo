const app = getApp()

Page({
	data: {
    mobile: '',
  	realName: '',
  	eMail: '',
  	job: ''
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
