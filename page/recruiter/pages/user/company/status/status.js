import {
  getCompanyIdentityInfosApi,
  getCompanyPerfectApi
} from '../../../../../../api/pages/company.js'

import {RECRUITER} from '../../../../../../config.js'

const app = getApp()

Page({
  data: {
  	// status状态： 0审核中（已提交），1审核通过，2审核未通过，3重新提交
    identityInfos: {},
    companyInfos: {},
    page: '',
    pageTitle: '公司认证',
    options: {},
    isPerfect: false,
    cdnImagePath: app.globalData.cdnImagePath
  },
  onLoad(options) {
    let pageTitle = ''
    switch(options.from) {
      case 'identity':
        pageTitle = '身份认证'
        break
      case 'company':
        pageTitle = '公司认证'
        break
      case 'apply':
        pageTitle = '申请加入公司'
        break
      default:
        break
    }
    this.setData({pageTitle, options})
    this.getCompanyIdentityInfos()
  },
  onShow() {},
  backEvent() {
    wx.reLaunch({url: `${RECRUITER}user/mine/infos/infos`})
  },
  todoAction(e) {
  	const params = e.currentTarget.dataset
    const companyInfos = this.data.companyInfos
    const options = this.data.options
    
  	switch(params.action) {
  		case 'modifyIdentity':
        wx.navigateTo({url: `${RECRUITER}user/company/identity/identity?action=edit&type=create`})
  			break
  		case 'modifyCompany':
  			wx.navigateTo({url: `${RECRUITER}user/company/apply/apply?action=edit&type=create`})
  			break
      case 'email':
        wx.navigateTo({url: `${RECRUITER}user/company/email/email?id=${this.data.companyInfos.id}`})
        break
      case 'position':
        wx.redirectTo({url: `${RECRUITER}position/post/post`})
        break
      case 'applyIdentity':
        wx.navigateTo({url: `${RECRUITER}user/company/identity/identity?type=apply`})
        break
      case 'modifyAddIdentity':
        wx.navigateTo({url: `${RECRUITER}user/company/identity/identity?type=apply&action=edit`})
        break
      case 'perfect':
        wx.navigateTo({url: `${RECRUITER}company/baseEdit/baseEdit`})
        break
      case 'applyAddModify':
        wx.navigateTo({url: `${RECRUITER}user/company/apply/apply?type=apply&action=edit`})
        break
      case 'notice':
        app.wxToast({title: '通知成功'})
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
    getCompanyIdentityInfosApi().then(res => {
      const infos = res.data
      const companyInfos = infos.companyInfo
      const options = this.data.options
      this.setData({identityInfos: infos, companyInfos})

      // 公司验证已经通过
      if(companyInfos.status === 1 && (options.from === 'company' || options.from === 'apply')) {
        wx.reLaunch({url: `${RECRUITER}index/index`})
        return;
      }
      // 身份验证已经通过
      if(infos.status === 1) {
        wx.reLaunch({url: `${RECRUITER}index/index`})
        return;
      }
    })
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.getCompanyIdentityInfos()
  }
})