import {
  getCompanyIdentityInfosApi,
  getCompanyPerfectApi,
  notifyadminApi
} from '../../../../../../api/pages/company.js'

import {RECRUITER, COMMON} from '../../../../../../config.js'

let app = getApp()

Page({
  data: {
  	// status状态： 0审核中（已提交），1审核通过，2审核未通过，3重新提交
    identityInfos: {},
    companyInfos: {},
    pageTitle: '公司认证',
    options: {},
    isPerfect: false,
    hasReFresh: false,
    cdnImagePath: app.globalData.cdnImagePath
  },
  onLoad(options) {
    this.setData({options})
  },
  onShow() {
    this.getCompanyIdentityInfos()
  },
  backEvent() {
    wx.reLaunch({url: `${RECRUITER}user/mine/infos/infos`})
  },
  todoAction(e) {
  	let params = e.currentTarget.dataset
    let companyInfos = this.data.companyInfos
    let options = this.data.options
    
  	switch(params.action) {
  		case 'identity':
        wx.navigateTo({url: `${RECRUITER}user/company/identity/identity?from=identity`})
  			break
  		case 'modifyCompany':
  			wx.navigateTo({url: `${RECRUITER}user/company/apply/apply?action=edit`})
  			break
      case 'email':
        console.log('招聘官公司id', app.globalData.recruiterDetails.companyInfo.id)
        wx.navigateTo({url: `${RECRUITER}user/company/email/email?id=${app.globalData.recruiterDetails.companyInfo.id}`})
        break
      case 'position':
        wx.redirectTo({url: `${RECRUITER}position/post/post`})
        break
      case 'perfect':
        console.log('招聘官uid', app.globalData.recruiterDetails.uid)
        wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${app.globalData.recruiterDetails.uid}`})
        break
      case 'applyModify':
        wx.navigateTo({url: `${RECRUITER}user/company/apply/apply?action=edit`})
        break
      case 'notice':
        notifyadminApi().then(() => app.wxToast({title: '通知成功'}))
        break
  		default:
  			break
  	}
  },
  /**
   * @Author   小书包
   * @DateTime 2019-02-16
   * @detail   获取公司状态和个人身份状态
   * @return   {[type]}   [description]
   */
  getCompanyIdentityInfos() {
    return new Promise((resolve, reject) => {
      getCompanyIdentityInfosApi().then(res => {
        let infos = res.data
        let companyInfos = infos.companyInfo
        let pageTitle = ''
        if(infos.applyJoin) {
          pageTitle = '申请加入公司'
        } else {
          pageTitle = '公司认证'
        }
        if(this.data.options.from === 'identity') {
          pageTitle = '身份认证'
        }
        this.setData({identityInfos: infos, companyInfos, pageTitle}, () => {
          resolve(res)
          wx.stopPullDownRefresh()
          // 认证通过 重新那一次招聘管的数据
          if(companyInfos.status === 1) {
            app.getAllInfo()
          }
        })
      })
    })
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.setData({hasReFresh: true})
    this.getCompanyIdentityInfos().then(res => {
      let infos = res.data
      let companyInfos = infos.companyInfo
      this.setData({hasReFresh: false})

      // 公司验证已经通过
      if(companyInfos.status === 1 && this.data.options.from !== 'identity') {
        app.getAllInfo()
        return;
      }

      // 身份验证已经通过
      if(infos.identityAuth === 1) {
        app.getAllInfo().then(() => wx.reLaunch({url: `${RECRUITER}index/index`}))
        return;
      }
    })
  }
})