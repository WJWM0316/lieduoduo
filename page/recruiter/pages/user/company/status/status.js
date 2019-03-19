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
    wx.setStorageSync('choseType', 'RECRUITER')
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
  getCompanyIdentityInfos(hasLoading = true) {
    return new Promise((resolve, reject) => {
      getCompanyIdentityInfosApi({...app.getSource()}, hasLoading).then(res => {
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

            // 这里的判断是 加入公司审核已经通过 但是还没有填写身份信息 在当前页面刷新 直接返回首页
            if(companyInfos.status === 1 && options.from === 'join' && !infos.id) {
              app.getAllInfo().then(() => wx.reLaunch({url: `${RECRUITER}index/index`}))
            }

            // 这里的判断是从发布职位过来或者我的页面过来或者api判断过来 个人身份已经通过 则返回上一个页面或者首页
            if(companyInfos.status === 1 && options.from === 'identity' && infos.identityAuth) {
              if(getCurrentPages().length > 1) {
                wx.navigateBack({delta: 1 })
              } else {
                wx.reLaunch({url: `${RECRUITER}index/index`})
              }
            }
          } else {

            // 公司已经认证
            if(companyInfos.status === 1) {
              // 个人身份已经认证
              if(infos.identityAuth) {
                app.getAllInfo().then(() => {
                  wx.reLaunch({url: `${RECRUITER}index/index`})
                })
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
    this.getCompanyIdentityInfos(false).then(res => this.setData({hasReFresh: false}))
  }
})