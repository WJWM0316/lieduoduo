import {
  getAttachResumeApi,
  scanQrcodeApi,
  scanLoginApi
} from '../../../../../api/pages/common.js'

let app = getApp()

Page({
  data: {
    navH: app.globalData.navHeight,
    cdnPath: app.globalData.cdnImagePath,
    attachResume: {
      vkey: ''
    }
  },
  onLoad() {
    this.getAttachResume()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-28
   * @detail   获取附件信息
   * @return   {[type]}   [description]
   */
  getAttachResume() {
    getAttachResumeApi().then(res => {
      this.setData({attachResume: res.data})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-28
   * @detail   扫码上传
   * @return   {[type]}   [description]
   */
  scanCode() {
    wx.scanCode({
      onlyFromCamera: true,
      success: res => {
        const uuid = res.result.split('&')[0].slice(5)
        scanQrcodeApi({uuid}).then(res => {
          scanLoginApi({uuid}).then(res => console.log(res))
        })
      }
    })
  }
})