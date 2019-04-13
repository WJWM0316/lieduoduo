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
    applyJoin: false,
    cdnImagePath: app.globalData.cdnImagePath
  },
  onLoad(options) {
    wx.setStorageSync('choseType', 'RECRUITER')
    this.setData({options})
  },
  onShow() {
    this.getCompanyIdentityInfos()
    console.log(12121)
  },
  todoAction(e) {
  	let params = e.currentTarget.dataset
    let companyInfos = this.data.companyInfos
    let options = this.data.options
    let identityInfos = this.data.identityInfos
    
  	switch(params.action) {
  		case 'identity':
        // 没有填写身份信息或者身份信息审核失败
        if(!identityInfos.haveIdentity) {
          wx.navigateTo({url: `${RECRUITER}user/company/identity/identity?from=${options.from}`})
        } else {
          wx.navigateTo({url: `${RECRUITER}user/company/status/status?from=identity`})
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
      case 'recruitment':
        wx.reLaunch({url: `${RECRUITER}/index/index`})
        break
      case 'call':
        wx.makePhoneCall({phoneNumber: app.globalData.telePhone})
      case 'notice':
        // app.wxConfirm({
        //   title: '温馨提示',
        //   content: '该面试官已加入其它公司 无需处理审核',
        //   showCancel: false,
        //   confirmText: '知道了',
        //   confirmBack:() => {
        //     failApplyjoinApi({id: infos.id}).then(res => {
        //       that.getApplyjoinInfos(false).then(() => app.wxToast({title: '处理成功'}))
        //     })
        //   }
        // })
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
        // 公司信息
        let companyInfos = res.data.companyInfo
        let pageTitle = ''
        let options = this.data.options
        // 个人身份信息
        let identityInfos = res.data
        // 是否加入
        let applyJoin = res.data.applyJoin
        // 是否返回上一页
        let isReturnBack = false
        // 是否已经填写个人信息
        let hasOwerInfos = false

        if(applyJoin) {
          pageTitle = '申请加入公司'
        } else {
          pageTitle = '公司认证'
        }

        if(options.from === 'identity' || (companyInfos.status === 1 && identityInfos.status === 2)) {
          pageTitle = '身份认证'
        }

        this.setData({identityInfos, companyInfos, pageTitle, applyJoin}, () => {
          
          resolve(res)
          
          // 加入公司
          if(applyJoin) {

            // 这里的判断是从发布职位过来或者我的页面过来或者api判断过来 个人身份已经通过 则返回上一个页面或者首页
            isReturnBack = 
              companyInfos.status === 1 
              && options.from === 'identity'
              && identityInfos.identityAuth
              && getCurrentPages()
              && getCurrentPages().length > 1

            if(isReturnBack) wx.navigateBack({delta: 1 })
          } else {
            hasOwerInfos = !identityInfos.haveIdentity && companyInfos.status === 1
            if(hasOwerInfos) wx.reLaunch({url: `${RECRUITER}user/company/identity/identity?from=identity`})
          }
        })
      })
    })
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.setData({hasReFresh: true})
    this.getCompanyIdentityInfos(false).then(res => {
      this.setData({hasReFresh: false})
      wx.stopPullDownRefresh()
    }).catch(e => {
      wx.stopPullDownRefresh()
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-08
   * @detail   切换身份
   * @return   {[type]}   [description]
   */
  toggle() {
    app.toggleIdentity()
  }
})