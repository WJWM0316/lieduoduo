import {
  getPositionListNumApi
} from '../../../api/pages/position.js'

import {
  applyInterviewApi,
} from '../../../api/pages/interview.js'

import {
  getCompanyIdentityInfosApi
} from '../../../api/pages/company.js'

import {
  applyChatApi,
  deleteNotInterestApi,
  getNotInterestAllReasonListApi,
  deleteNotInterestForUserApi
} from '../../../api/pages/chat.js'
import {
  RECRUITER, 
  COMMON, 
  APPLICANT, 
  DOWNLOADAPPPATH
} from '../../../config.js'

import {
  agreedTxtC,
  agreedTxtB
} from '../../../utils/randomCopy.js'

import {
  getRecommendChargeApi
} from '../../../api/pages/recruiter.js'

let app = getApp()
let identity = ''
Component({
  properties: {
    infos: {
      type: Object,
      value: {}
    },
    isOwner: {
      type: Boolean,
      value: false
    },
    // 跟后端协商的type
    type: {
      type: String,
      value: ''
    },
    positionId: {
      type: String,
      value: ''
    },
    options: {
      type: Object,
      value: {}
    }
  },
  data: {
    interviewInfos: {
      haveInterview: 0
    },
    showLoginBox: false,
    identity: '', // 身份标识
    slogoIndex: 0,
    // 是否是我发布
    isOwerner: false,
    index: 0,
    jobWords: agreedTxtC(),
    recruiterWords: agreedTxtB(),
    cdnImagePath: app.globalData.cdnImagePath,
    positionInfos: {},
    show: false,
    showSuccessPop: false,
    successPopDesc: '',
    showEndIcon: false,
    model: {
      show: false,
      title: '',
      type: 'showReason',
      reason: {}
    },
    payPop: {
      show: false,
      title: ''
    },
    chargeData: {}, // 扣点信息
    showAdvisor: false,
    notInterestReasonList: [],
    chatType: '',
    downLoadAppType: 1,
    popDesc: ''
  },
  attached() {
    identity = wx.getStorageSync('choseType')
    if (this.data.options && this.data.options.directChat) {
      automatic = true
    }
    this.setData({ identity })
  },
  methods: {
    /**
     * @Author   小书包
     * @DateTime 2019-01-29
     * @detail   获取约聊不合适的列表
     * @return   {[type]}   [description]
     */
    getNotInterestAllReasonList() {
      getNotInterestAllReasonListApi().then(({ data }) => this.setData({ notInterestReasonList: data }))
    },
    /**
     * @Author   小书包
     * @DateTime 2019-01-29
     * @detail   获取扣点信息
     * @return   {[type]}   [description]
     */
    getRecommendCharge(params) {
      return getRecommendChargeApi({ jobhunter: params.jobhunter }).then(({ data }) => this.setData({ chargeData: data }))
    },
    /**
     * @Author   小书包
     * @DateTime 2019-01-29
     * @detail   取消约聊不合适
     * @return   {[type]}   [description]
     */
    deleteNotInterest(params) {
      return deleteNotInterestApi({jobhunter: params.jobhunter})
    },
    /**
     * @Author   小书包
     * @DateTime 2019-01-29
     * @detail   显示不合适原因
     * @return   {[type]}   [description]
     */
    showNotInterestReason() {
      let model = this.data.model
      model.show = true
      model.type = 'showReason'
      this.setData({ model })
    },
    /**
     * @Author   小书包
     * @DateTime 2019-01-29
     * @detail   发布职位
     * @return   {[type]}   [description]
     */
    publicPosition() {
      let identityInfos = this.data.identityInfos
      // 跟后端协商  =1 则可以发布
      if(identityInfos.identityAuth || identityInfos.status === 1) {
        wx.navigateTo({url: `${RECRUITER}position/post/post`})
        return;
      }
      // 已经填写身份证 但是管理员还没有处理或者身份证信息不符合规范
      if(identityInfos.status === 0 || identityInfos.status === 2) {
        this.setData({show: false})
        app.wxConfirm({
          title: '',
          content: `您当前认证身份信息已提交申请，猎多多将尽快审核处理，请耐心的等待，感谢您的配合~`,
          cancelText: '联系客服',
          confirmText: '我知道了',
          confirmBack: () => {
            wx.navigateTo({url: `${RECRUITER}user/company/status/status?from=identity`})
          },
          cancelBack: () => {
            wx.makePhoneCall({phoneNumber: this.data.telePhone})
          }
        })
        return;
      }
      // 没有填身份证 则没有验证
      if(!identityInfos.identityNum) {
        this.setData({show: false})
        app.wxConfirm({
          title: '',
          content: `检测到您尚未认证身份，请立即认证，完成发布职位`,
          confirmText: '去认证',
          confirmBack: () => {
            wx.navigateTo({url: `${RECRUITER}user/company/identity/identity?from=identity`})
          }
        })
        return;
      }
    },
    /**
     * @Author   小书包
     * @DateTime 2019-03-14
     * @detail   获取招聘官的职位类型
     * @return   {[type]}   [description]
     */
    getPositionListNum() {
      return new Promise((resolve, reject) => {
        getPositionListNumApi().then(res => this.setData({ positionInfos: res.data }, () => resolve(res)))
      })
    },
    /**
     * @Author   小书包
     * @DateTime 2019-01-14
     * @detail   显示合并弹窗
     * @return   {[type]}         [description]
     */
    showMergeBox(infos) {
      let content = infos.tipsData.positionId === 0
        ? '面试官已接受与你约面，但没有选择约面职位，其他职位申请将自动合并，如需修改约面职位，可直接与面试官协商'
        : `面试官已选择你申请职位中的“${infos.tipsData.positionName}”，其他职位申请将自动合并，如需修改约面职位，可直接与面试官协商。`
      app.wxConfirm({
        title: '',
        content,
        showCancel: false,
        confirmText: '我知道了',
        confirmBack() {}
      })
    },
    /**
     * @Author   小书包
     * @DateTime 2019-01-30
     * @detail   通过分享入口进行开撩
     * @return   {[type]}   [description]
     */
    shareChat() {
      let hasLogin = app.globalData.hasLogin
      let isRecruiter = app.globalData.isRecruiter
      let isJobhunter = app.globalData.isJobhunter
      let interviewInfos = this.data.interviewInfos
      let infos = this.data.infos
      // 开撩动作
      let chat = () => {
        isRecruiter = app.globalData.isRecruiter
        isJobhunter = app.globalData.isJobhunter
        let detail = this.data.infos

        // 是急速约面开撩
        let isSpecail = detail.isRapidly === 1 
                        && detail.rapidlyInfo.applyNum + detail.rapidlyInfo.natureApplyNum < detail.rapidlyInfo.seatsNum
        let successPop = (res) => {
          if (res.code === 916) {
            this.setData({downLoadAppType: 3}, () => {
              this.selectComponent('#downLoadApp').show()
            })
          } else if (res.code === 915) {
            this.setData({downLoadAppType: 4}, () => {
              this.selectComponent('#downLoadApp').show()
            })
          } else if (res.code === 917) {
            if (app.globalData.resumeInfo.resumeCompletePercentage < 0.75) {
              this.setData({downLoadAppType: 5, popDesc: res.msg}, () => {
                this.selectComponent('#downLoadApp').show()
              })
            } else {
              this.setData({downLoadAppType: 8, popDesc: res.msg}, () => {
                this.selectComponent('#downLoadApp').show()
              })
            }
          } else {
            if (isSpecail) {
              if (app.globalData.resumeInfo.resumeCompletePercentage < 0.75) {
                this.setData({downLoadAppType: 7}, () => {
                  this.selectComponent('#downLoadApp').show()
                })
              } else {
                this.setData({downLoadAppType: 6}, () => {
                  this.selectComponent('#downLoadApp').show()
                })
              }
            } else {
              if (app.globalData.resumeInfo.resumeCompletePercentage < 0.75) {
                this.setData({downLoadAppType: 1}, () => {
                  this.selectComponent('#downLoadApp').show()
                })
              } else {
                this.setData({downLoadAppType: 2}, () => {
                  this.selectComponent('#downLoadApp').show()
                })
              }
            }
          }
        }

        if( identity === 'APPLICANT' ) {
          if(!isJobhunter) {
            let path = app.getCurrentPagePath()
            wx.navigateTo({url: `${APPLICANT}createUser/createUser?directChat=${encodeURIComponent(path)}&from=2`})
          } else {
            // 走正常流程
            if(this.data.type === 'recruiter') {
              // 招聘官没有在线职位或者招聘官没发布过职位
              if(!this.data.infos.positionNum) {
                app.wxReportAnalytics('btn_report', {
                  isjobhunter: app.globalData.isJobhunter,
                  resume_perfection: app.globalData.resumeInfo.resumeCompletePercentage * 100,
                  btn_type: 'job-hunting-chat'
                })
                applyChatApi({recruiterUid: this.data.infos.uid}).then(res => successPop(res))
              } else {
                wx.navigateTo({url: `${COMMON}chooseJob/chooseJob?type=job_hunting_chat&recruiterUid=${this.data.infos.uid}`})
              }
            } else {
              app.wxReportAnalytics('btn_report', {
                isjobhunter: app.globalData.isJobhunter,
                resume_perfection: app.globalData.resumeInfo.resumeCompletePercentage * 100,
                btn_type: 'job-hunting-chat'
              })
              let params = {recruiter: this.data.infos.recruiterInfo.uid, position: this.data.infos.id}
              if (isSpecail) params.interview_type = 2
              let cb = () => {
                let that = this
                // 约面过期后  只存在约聊才会出现
                if(infos.rapidlyInfo && infos.rapidlyInfo.changePositionToast) {
                  app.wxConfirm({
                    title: '已约面该招聘官的其他职位',
                    content: '是否要更换约面职位',
                    cancelText: '我再想想',
                    confirmText: '更换职位',
                    confirmBack() {
                      applyInterviewApi({positionId: that.data.infos.id, interview_type: 2, recruiterUid: that.data.infos.recruiterInfo.uid}).then(res => {
                        successPop(res)
                        this.triggerEvent('reLoad', true)
                        // 未满急速约面开撩成功，需要记录一下返回时候重置一下数据
                        if (isSpecail) {
                          that.triggerEvent('chatPosition', true)
                          wx.setStorageSync('chatSuccess', detail)
                        }
                      }).catch(() => {
                        that.triggerEvent('reLoad', true)
                      })
                    }
                  })
                } else {
                  if(isSpecail) {
                    applyInterviewApi({positionId: this.data.infos.id, interview_type: 2, recruiterUid: this.data.infos.recruiterInfo.uid}).then(res => {
                      successPop(res)
                      this.triggerEvent('reLoad', true)
                      // 未满急速约面开撩成功，需要记录一下返回时候重置一下数据
                      if (isSpecail) {
                        wx.setStorageSync('chatSuccess', detail)
                        this.triggerEvent('chatPosition', true)
                      }
                    }).catch(() => {
                      this.triggerEvent('reLoad', true)
                    })
                  } else {
                    applyChatApi(params).then(res => {
                      successPop(res)
                      this.triggerEvent('reLoad', true)
                      // 未满急速约面开撩成功，需要记录一下返回时候重置一下数据
                      if (isSpecail) {
                        wx.setStorageSync('chatSuccess', detail)
                        this.triggerEvent('chatPosition', true)
                      }
                    })
                  }
                }
              }
              cb()
            }
          }
        } else {
          if(!isRecruiter) {
            this.getCompanyIdentityInfos()
          } else {
            // 走正常流程
            wx.navigateTo({url: `${COMMON}chooseJob/chooseJob?type=recruiter_chat&jobhunterUid=${ infos.uid }&recruiterUid=${app.globalData.recruiterDetails.uid}&sourceType=${this.data.infos.sourceType}&chattype=${this.data.chatType}`})
          }
        }
      }
      let getRole = () => {
        if(app.getRoleInit) {
          chat()
        } else {
          app.getRoleInit = () => chat()
        }
      }

      // 判断用户是否登录
      if (app.loginInit) {
        if (!app.globalData.hasLogin) {
          this.setData({ showLoginBox: true })
        } else {
          getRole()
        }
      } else {
        app.loginInit = () => {
          if (!app.globalData.hasLogin) {
            this.setData({showLoginBox: true})
          } else {
            getRole()
          }
        }
      }      
    },
    closePop () {
      this.setData({ showSuccessPop: false })
    },
    /**
     * @Author   小书包
     * @DateTime 2019-01-29
     * @detail   获取个人身份信息
     * @return   {[type]}   [description]
     */
    getCompanyIdentityInfos() {
      return new Promise((resolve, reject) => {
        getCompanyIdentityInfosApi({hasLoading: false}).then(res => {
          this.setData({identityInfos: res.data}, () => resolve(res))
        })
      })
    },
    /**
     * @Author   小书包
     * @DateTime 2019-01-29
     * @detail   招聘官、顾问发起约面
     * @return   {[type]}   [description]
     */
    recruiterChat() {
      let infos = this.data.infos
      let cb = () => {
        // 简历详情会有这个字段
        if(infos.interviewSummary && infos.interviewSummary.interviewId) {
          wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${ infos.interviewSummary.interviewId }`})
          // app.wxConfirm({
          //   title: '提示',
          //   content: '您当前存在进行中的约面记录，处理完该面试后，即可使用当前功能；',
          //   cancelText: '取消',
          //   confirmText: '前往查看',
          //   confirmBack: () => {
          //     wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${ infos.interviewSummary.interviewId }`})
          //   },
          //   cancelBack: () => {}
          // })
        } else {
          this.getPositionListNum().then(res => {
            if (!res.data.online) {
              this.setData({show: true})
            } else {
              this.shareChat()
            }
          })
        }
      }
      if (!wx.getStorageSync('firstOpenAdvisor')) {
        wx.setStorageSync('firstOpenAdvisor', 1)
        this.setData({showAdvisor: true})
      } else {
        cb()
      }
    },
    /**
     * @Author   小书包
     * @DateTime 2019-01-02
     * @detail   待办项
     * @return   {[type]}     [description]
     */
    todoAction(e) {
      let action = e.currentTarget.dataset.action
      let infos = this.data.infos
      switch(action) {
        // 求职端发起开撩
        case 'job-hunting-chat':
          if (identity === 'APPLICANT') {
            app.subscribeWechatMessage('openChat').then(() => this.shareChat())            
          } else {
            app.promptSwitch({
              source: identity
            })
          }
          break
        case 'keep-communicating':
          wx.navigateTo({url: DOWNLOADAPPPATH})
          // let changePositionToast = this.data.infos.rapidlyInfo && this.data.infos.rapidlyInfo.changePositionToast
          // if ( changePositionToast ) {
          //   app.wxConfirm({
          //     title: '已约面该招聘官的其他职位',
          //     content: '是否要更换约面职位',
          //     cancelText: '我再想想',
          //     confirmText: '更换职位',
          //     confirmBack() {
          //       wx.navigateTo({url: `${COMMON}chooseJob/chooseJob?type=job_hunting_chat&recruiterUid=${infos.recruiterInfo.uid}`})
          //     }
          //   })
          // } else {
          //   wx.navigateTo({url: DOWNLOADAPPPATH})
          // }
          break
        case 'recruiter-chat':
          app.subscribeWechatMessage('openChatInterview').then(() => {
            this.setData({chatType: 'onekey'})
            let type = this.data.type
            if ((identity !== 'RECRUITER' && type === 'position') || (identity === 'RECRUITER' && type === 'resume')) {
              if(type === 'resume') {
                this.getPositionListNum().then(res => {
                  if(!res.data.online) {
                    this.setData({show: true})
                  } else {
                    this.shareChat()
                  }
                })
              }
            } else {
              app.promptSwitch({
                source: identity
              })
            }
          })
          break
        case 'advisor-popup-help':
          this.setData({chatType: 'advisorHelp'})
          this.recruiterChat()
          break
        case 'viewRecruiter':
          if(this.data.type === 'position') wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${this.data.infos.recruiterInfo.uid}`})
          break
        case 'close':
          this.setData({show: !this.data.show})
          break
        case 'public':
          this.getCompanyIdentityInfos().then(() => {
            let identityInfos = this.data.identityInfos
            if(identityInfos.identityAuth || identityInfos.status === 1) {
              wx.setStorageSync('recruiter_chat_first', {jobhunterUid: infos.uid })
              this.publicPosition()
              wx.navigateTo({url: `${RECRUITER}position/post/post`})
              return;
            }
            // 已经填写身份证 但是管理员还没有处理或者身份证信息不符合规范
            if(identityInfos.status === 0 || identityInfos.status === 2) {
              app.wxConfirm({
                title: '',
                content: `您当前认证身份信息已提交申请，猎多多将尽快审核处理，请耐心的等待，感谢您的配合~`,
                cancelText: '联系客服',
                confirmText: '我知道了',
                confirmBack: () => {
                  wx.navigateTo({url: `${RECRUITER}user/company/status/status?from=identity`})
                },
                cancelBack: () => {
                  wx.makePhoneCall({phoneNumber: this.data.telePhone})
                }
              })
              return;
            }
            // 没有填身份证 则没有验证
            if(!identityInfos.identityNum) {
              app.wxConfirm({
                title: '',
                content: `检测到您尚未认证身份，请立即认证，完成发布职位`,
                confirmText: '去认证',
                confirmBack: () => {
                  wx.navigateTo({url: `${RECRUITER}user/company/identity/identity?from=identity`})
                }
              })
              return;
            }
          })
          break
        case 'openPosition':
          wx.navigateTo({url: `${COMMON}chooseJob/chooseJob?type=recruiter_chat&jobhunterUid=${infos.uid}`})
          break
        case 'toSpecialJob':
          wx.reLaunch({url: `${APPLICANT}specialJob/specialJob`})
          break
        case 'delete-not-interest':
          // deleteNotInterestForUserApi({uid: infos.uid})
          this.deleteNotInterest({jobhunter: infos.uid}).then(() => {
            wx.navigateTo({url: DOWNLOADAPPPATH})
          })
          break
        case 'view-not-interest-reason':
          this.showNotInterestReason()
          break
        case 'advisor-help-chat':
          this.setData({ showAdvisor: false })
          this.recruiterChat()
          break
        case 'close-advisor-model':
          this.setData({ showAdvisor: false })
          break
        case 'advisor-helping':
          wx.navigateTo({ url: `${COMMON}arrangement/arrangement?id=${ infos.chatInfo.imTopInterviewInfo.interviewInfo.interviewId }` })
          break
        default:
          break
      }
    },
    formSubmit(e) {
      app.postFormId(e.detail.formId)
    }
  }
})
