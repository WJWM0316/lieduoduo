// page/recruiter/pages/company/postImages/postImages.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: []
  },
  upload(e) {
    const item = e.detail[0]
    const imgList = this.data.imgList
    imgList.push(item)
    this.setData({imgList})
    console.log(imgList)
  }
})