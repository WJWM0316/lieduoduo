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
    attachResume: {vkey: ''}
  },
  onLoad() {
    const attachResume = app.globalData.resumeInfo.resumeAttach ? app.globalData.resumeInfo.resumeAttach : this.data.attachResume
    this.setData({attachResume})
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
        console.log(res)
        const uuid = res.result.split('&')[0].slice(5)
        // scanQrcodeApi({uuid}).then(res => {
        //   scanLoginApi({uuid}).then(res => console.log(res))
        // })
      }
    })
  },
  preview() {
    wx.downloadFile({
      url: 'https://lieduoduo-uploads-test.oss-cn-shenzhen.aliyuncs.com/front-assets/file/111.pdf',
      success(res) {
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath,
          success(res) {
            console.log('打开文档成功')
          }
        })
      },
      fail(e) {
        console.log(e)
      }
    })
  },
})