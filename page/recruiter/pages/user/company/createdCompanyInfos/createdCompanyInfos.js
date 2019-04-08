let app = getApp()

import {RECRUITER} from '../../../../../../config.js'

Page({
  data: {
    cdnImagePath: app.globalData.cdnImagePath,
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-08
   * @detail   切换身份
   * @return   {[type]}   [description]
   */
  toggle() {
    app.toggleIdentity()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-08
   * @detail   更改手机
   * @return   {[type]}   [description]
   */
  changePhone() {
    app.wxConfirm({
      title: '换个账号',
      content: '退出后不会删除任何历史数据，下次登录依然可以使用本账号',
      confirmBack() {
        app.uplogin()
      },
      cancelBack: () => {}
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-08
   * @detail   使用其他验证方式
   * @return   {[type]}   [description]
   */
  changeIndentifyMethods() {
    wx.redirectTo({url: `${RECRUITER}user/company/post/post`})
  },
})