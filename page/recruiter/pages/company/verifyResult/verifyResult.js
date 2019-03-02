import {
  getApplyjoinInfosApi,
  failApplyjoinApi,
  passApplyjoinApi
} from '../../../../../api/pages/recruiter.js'

import {COMMON,RECRUITER} from "../../../../../config.js"

const app = getApp()

Page({
  data: {
    cdnImagePath: app.globalData.cdnImagePath,
    options: {},
    infos: {}
  },
  onLoad(options) {
  	this.setData({options})
  	this.getApplyjoinInfos()
  },
  getApplyjoinInfos() {
  	getApplyjoinInfosApi({id: this.data.options.id}).then(res => {
  		this.setData({infos: res.data.applyInfo})
  	})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-03-02
   * @detail   不给予通过
   */
  failApplyjoin() {
    const infos = this.data.infos
    app.wxConfirm({
      title: '温馨提示',
      content: '确认该申请人不予加入组织？',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      confirmBack: () => {
        failApplyjoinApi({id: infos.id}).then(res => {
          app.wxToast({title: '操作成功'})
        })
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-03-02
   * @detail   通过
   */
  passApplyjoin() {
    const infos = this.data.infos
    app.wxConfirm({
      title: '温馨提示',
      content: '确认该申请人不予加入组织？',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      confirmBack: () => {
        passApplyjoinApi({id: infos.id}).then(res => {
          app.wxToast({title: '操作成功'})
        }).catch(err => {
          app.wxConfirm({
            title: '温馨提示',
            content: '该招聘官已加入其它公司 无需处理审核',
            showCancel: false,
            confirmText: '知道了',
            confirmBack() {}
          })
        })
      }
    })
  },
  goHome() {
    wx.reLaunch({url: `${RECRUITER}index/index`})
  },
  onPullDownRefresh() {
    this.getApplyjoinInfos()
  }
})