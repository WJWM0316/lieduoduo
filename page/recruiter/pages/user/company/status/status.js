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
  },
  onShow() {
    this.getCompanyIdentityInfos()
  },
  todoAction(e) {
  	let params = e.currentTarget.dataset
    let companyInfos = this.data.companyInfos
    let options = this.data.options
    
  	switch(params.action) {
  		case 'identity':
        if(options.from === 'identity') {
          wx.navigateTo({url: `${RECRUITER}user/company/identity/identity?from=identity`})
        } else {
          wx.navigateTo({url: `${RECRUITER}user/company/identity/identity`})
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

        if(this.data.options.from === 'identity') {
          pageTitle = '身份认证'
        }

        this.setData({identityInfos: infos, companyInfos, pageTitle}, () => {
          resolve(res)
          wx.stopPullDownRefresh()
          
          // 申请加入公司 通过则回到首页 守则停留在此页面 让招聘官手动点击跳转
          if(companyInfos.status === 1) {
            if(infos.applyJoin) {
              app.getAllInfo().then(() => {
                wx.reLaunch({url: `${RECRUITER}index/index`})
              })
            } else {
              app.getAllInfo()
            }
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

        // 申请加入公司 通过则回到首页 守则停留在此页面 让招聘官手动点击跳转
        if(infos.applyJoin) {
          app.getAllInfo().then(() => {
            wx.reLaunch({url: `${RECRUITER}index/index`})
          })
        } else {
          app.getAllInfo()
        }

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