// page/common/pages/resumeDetail/resumeDetail.js
import { getPersonalResumeApi, getJobhunterResumeApi } from '../../../../api/pages/center.js'
import { inviteInterviewApi } from '../../../../api/pages/interview.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  init () {
    if (getApp().globalData.identity === 'APPLICAN') {
      console.log('求职端')
      getPersonalResumeApi().then(res => {
        this.setData({
          info: res.data
        })
        console.log(this.data.info)
      })
    } else {
      console.log('招聘端')
      getJobhunterResumeApi({uid: 92})
    }
  },
  /* 开撩 */
  toCommunicate () {
    inviteInterviewApi({jobhunterUid: 91, positionId: 110101})
  }
  /* 获取简历 */
})