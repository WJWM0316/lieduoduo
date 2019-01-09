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
    info: null,
    isOwner: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    id = options
    const { vkey } = options
    console.log(options)
    this.init(options)
    app.pageInit = () => {
      console.log(9999)
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  init (options) {
    if (app.globalData.resumeInfo.uid) {
      if (app.globalData.resumeInfo.uid === options.uid || !options.uid ) {
        this.setData({info: app.globalData.resumeInfo, isOwner: true})
      } else {
        getPersonalResumeApi(options).then(res => {
          this.setData({info: res.data})
        })
      }
    } else {
      app.pageInit = () => {
        if (app.globalData.resumeInfo.uid === parseInt(options.uid)) {
          this.setData({info: app.globalData.resumeInfo, isOwner: true})
        } else {
          getPersonalResumeApi(options).then(res => {
            this.setData({info: res.data})
          })
        }
      }
      getPersonalResumeApi(options).then(res => {
        this.setData({info: res.data})
      })
    }
    
//  if (wx.getStorageSync('choseType') === 'APPLICANT') {
//    console.log('求职端')
//    if (resumeInfo) {
//      this.setData({
//        info: resumeInfo
//      })
//    } else {
//      getPersonalResumeApi(options).then(res => {
//        this.setData({
//          info: res.data
//        })
//      })
//    }
//  } else {
//    console.log('招聘端')
//    getPersonalResumeApi(options).then(res => {
//      this.setData({
//        info: res.data
//      })
//      console.log(this.data.info)
//    })
//  }
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
      case 'intent':
        url = `/page/applicant/pages/center/resumeEditor/aimsEdit/aimsEdit?id=${this.data.info.expects[0].id}`
        break;
      case 'work':
        url = `/page/applicant/pages/center/resumeEditor/workEdit/workEdit`
        break;
      case 'project':
        url = `/page/applicant/pages/center/resumeEditor/itemEdit/itemEdit`
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