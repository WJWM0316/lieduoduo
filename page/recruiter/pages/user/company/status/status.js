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
    isPerfect: false
  },
  onLoad(options) {
    switch(options.from) {
      case 'identity':
        this.setData({pageTitle: '身份认证'})
        break
      case 'company':
        this.setData({pageTitle: '公司认证'})
        break
      case 'apply':
        this.setData({pageTitle: '申请加入公司'})
        break
      default:
        break
    }
    getCompanyIdentityInfosApi()
    	.then(res => {
        const infos = res.data
        const companyInfos = infos.companyInfo
    		this.setData({identityInfos: infos, companyInfos, options})
    	})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-14
   * @detail   获取公司是否完善
   * @return   {[type]}   [description]
   */
  getCompanyPerfect() {
    getCompanyPerfectApi({id: this.data.companyInfos.id})
      .then(res => {
        console.log(res)
      })
  },
  todoAction(e) {
  	const params = e.currentTarget.dataset
  	switch(params.action) {
  		case 'modifyIdentity':
  			wx.reLaunch({url: `${RECRUITER}user/company/identity/identity?type=edit`})
  			break
  		case 'modifyCompany':
  			wx.redirectTo({url: `${RECRUITER}user/company/apply/apply?type=edit`})
  			break
      case 'email':
        wx.redirectTo({url: `${RECRUITER}user/company/email/email?id=${this.data.companyInfos.id}`})
        break
      case 'position':
        wx.redirectTo({url: `${RECRUITER}position/post/post`})
        break
      case 'identity':
        wx.reLaunch({url: `${RECRUITER}user/company/identity/identity`})
        break
      case 'perfect':
        wx.reLaunch({url: `${RECRUITER}company/baseEdit/baseEdit`})
        break
      case 'notice':
        app.wxToast({title: '通知成功'})
        break
  		default:
  			break
  	}
  }
})