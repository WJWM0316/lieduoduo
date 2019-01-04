// page/common/pages/resumeDetail/resumeDetail.js
import { getPersonalResumeApi, getJobhunterResumeApi } from '../../../../api/pages/center.js'
import { inviteInterviewApi } from '../../../../api/pages/interview.js'
let id = 92
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
    id = options.uid
    console.log(options.uid)
    this.init()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  init () {
    if (wx.getStorageSync('choseType') === 'APPLICANT') {
      console.log('求职端')
      getPersonalResumeApi().then(res => {
        this.setData({
          info: res.data
        })
        console.log(this.data.info)
      })
    } else {
      console.log('招聘端')
      getJobhunterResumeApi({uid: id}).then(res => {
        this.setData({
          info: res.data
        })
        console.log(this.data.info)
      })
    }
  },
  /* 开撩 */
  toCommunicate () {
    inviteInterviewApi({jobhunterUid: id, positionId: 110101})
  }
  /* 获取简历 */
})