import {
  getCompanyIdentityInfosApi,
  getCompanyPerfectApi,
  notifyadminApi
} from '../../../../../../api/pages/company.js'

import {RECRUITER, COMMON} from '../../../../../../config.js'

let app = getApp()

Page({
  data: {
    identityInfos: {},
    companyInfos: {},
    pageTitle: '',
    options: {},
    hasReFresh: false,
    cdnImagePath: app.globalData.cdnImagePath
  },
  onLoad(options) {
    this.setData({options})
    console.log(options)
  },
  onShow() {
    this.getCompanyIdentityInfos()
  },
  todoAction(e) {
  	let params = e.currentTarget.dataset
    let companyInfos = this.data.companyInfos
    let options = this.data.options
    let identityInfos = this.data.identityInfos
    
  	switch(params.action) {
  		case 'identity':
        // 没有填写身份信息或者身份信息审核失败
        if(identityInfos.status === 2 || !identityInfos.id) {
          wx.navigateTo({url: `${RECRUITER}user/company/identity/identity?from=${options.from}`})
        }
  			break
  		case 'modifyCompany':
  			wx.navigateTo({url: `${RECRUITER}user/company/apply/apply?action=edit`})
  			break
      case 'email':
        wx.navigateTo({url: `${RECRUITER}user/company/email/email?id=${app.globalData.recruiterDetails.companyInfo.id}`})
        break
      case 'position':
        wx.redirectTo({url: `${RECRUITER}position/post/post`})
        break
      case 'perfect':
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
        let options = this.data.options

        if(infos.applyJoin) {
          pageTitle = '申请加入公司'
        } else {
          pageTitle = '公司认证'
        }

        if(options.from === 'identity' || (companyInfos.status === 1 && infos.status === 2)) {
          pageTitle = '身份认证'
        }

        this.setData({identityInfos: infos, companyInfos, pageTitle}, () => {
          resolve(res)
          wx.stopPullDownRefresh()
          
          // 加入公司
          if(infos.applyJoin) {
            if(infos.identityAuth === 1) app.getAllInfo().then(() => wx.reLaunch({url: `${RECRUITER}index/index`}))
          } else {

            // 公司已经认证
            if(companyInfos.status === 1) {
              // 个人身份已经认证
              if(infos.identityAuth === 1) {
                app.getAllInfo()
                return;
              }
              // 还没有填写个人信息
              if(!infos.id) {
                wx.reLaunch({url: `${RECRUITER}user/company/identity/identity?from=identity`})
              }
            }
          }
        })
      })
    })
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.setData({hasReFresh: true})
    this.getCompanyIdentityInfos().then(res => this.setData({hasReFresh: false}))
  }
})