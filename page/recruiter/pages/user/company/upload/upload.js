Page({
  data: {
    uploadUrl: ''
  },
  onLoad() {
    getApp().globalData.identity = 'RECRUITER'
  },
  upload(e) {
    console.log(e)
  }
})