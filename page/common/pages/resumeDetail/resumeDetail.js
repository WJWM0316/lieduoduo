// page/common/pages/resumeDetail/resumeDetail.js
import { getPersonalResumeApi } from '../../../../api/pages/center.js'
import { inviteInterviewApi } from '../../../../api/pages/interview.js'
let id = 92
const app = getApp()
let resumeInfo = null
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
    id = options
    const { vkey } = options
    console.log(options)
    if (vkey) {
      this.init(vkey)
    } else {
      app.pageInit = () => {
        resumeInfo = app.globalData.resumeInfo
        this.init(options)
      }
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    resumeInfo = app.globalData.resumeInfo
    this.init(id)
  },
  init (options) {
    if (wx.getStorageSync('choseType') === 'APPLICANT') {
      console.log('求职端')
      if (resumeInfo) {
        this.setData({
          info: resumeInfo
        })
      } else {
        getPersonalResumeApi(options).then(res => {
          this.setData({
            info: res.data
          })
          console.log(this.data.info, "个人信息")
        })
      }
    } else {
      console.log('招聘端')
      getPersonalResumeApi(options).then(res => {
        this.setData({
          info: res.data
        })
        console.log(this.data.info)
      })
    }
  },
  /* 编辑 */
  edit (e) {
    console.log(e.currentTarget.dataset.editname, '555')
    let editName = e.currentTarget.dataset.editname
    let url = null
    switch (editName) {
      case 'info':
        url = '/page/applicant/pages/center/userInfoEdit/userInfoEdit'
        break;
    }
    wx.navigateTo({
      url: url
    })
  },
  /* 开撩 */
  toCommunicate () {
    inviteInterviewApi({jobhunterUid: id.uid, positionId: 110101})
  }
  /* 获取简历 */
})