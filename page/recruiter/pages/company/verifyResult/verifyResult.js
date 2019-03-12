import {
  getApplyjoinInfosApi,
  failApplyjoinApi,
  passApplyjoinApi
} from '../../../../../api/pages/recruiter.js'

import {COMMON, RECRUITER} from "../../../../../config.js"

const app = getApp()

Page({
  data: {
    cdnImagePath: app.globalData.cdnImagePath,
    options: {},
    infos: {},
    hasReFresh: false,
    onBottomStatus: 0
  },
  onLoad(options) {
  	this.setData({options})
  	this.getApplyjoinInfos()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-03-07
   * @detail   获取加入者信息
   * @return   {[type]}              [description]
   */
  getApplyjoinInfos(hasLoading = true) {
    return new Promise((resolve, reject) => {
      const params = {id: this.data.options.id, hasLoading}
    	getApplyjoinInfosApi(params).then(res => {
    		this.setData({infos: res.data.applyInfo}, () => resolve(res))
    	})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-03-02
   * @detail   不给予通过
   */
  failApplyjoin() {
    const infos = this.data.infos
    const that = this
    app.wxConfirm({
      title: '温馨提示',
      content: '确认该申请人不予加入组织？',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      confirmBack: () => {
        failApplyjoinApi({id: infos.id}).then(res => {
          app.wxToast({
            title: '处理成功',
            callback() {
              that.getApplyjoinInfos(false)
            }}
          )
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
    const that = this
    app.wxConfirm({
      title: '温馨提示',
      content: '确认该申请人加入组织？',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      confirmBack: () => {
        passApplyjoinApi({id: infos.id}).then(res => {
          if(res.code === 402) {
            app.wxConfirm({
              title: '',
              content: '该招聘官已加入其它公司 无需处理审核',
              showCancel: false,
              confirmText: '知道了',
              confirmBack:() => {
                failApplyjoinApi({id: infos.id}).then(res => {
                  app.wxToast({
                    title: '处理成功',
                    callback() {
                      that.getApplyjoinInfos(false)
                    }}
                  )
                })
              }
            })
          } else if(res.code === 803) {
            app.wxConfirm({
              title: '温馨提示',
              content: '招聘官人数已到达上限 可升级版本或申请增值权益',
              showCancel: true,
              cancelText: '考虑一下',
              confirmText: '联系客服',
              confirmBack:() => {
                wx.makePhoneCall({phoneNumber: app.globalData.telePhone})
              }
            })
          } else {
            app.wxToast({
              title: '处理成功',
              callback() {
                that.getApplyjoinInfos(false)
              }}
            )
          }
        })
      }
    })
  },
  goHome() {
    wx.reLaunch({url: `${RECRUITER}index/index`})
  },
  onPullDownRefresh() {
    this.setData({hasReFresh: true})
    this.getApplyjoinInfos(false).then(() => {
      this.setData({hasReFresh: false})
      wx.stopPullDownRefresh()
    })
  }
})