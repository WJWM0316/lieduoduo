const app = getApp()
Component({
  externalClasses: ['personality'],
  behaviors: [],
  properties: {
    // 传入的列表数据
    list: {
    	type: Array,
    	value: []
    },
    // 红点类型 text circle
    dotType: {
    	type: String,
    	value: 'text'
    },
    // 是否显示底部分割线
    showDividingLine: {
      type: Boolean,
      value: true
    },
    // 是否显示底部
    showFooter: {
      type: Boolean,
      value: true
    },
    // 是否显示底部
    showItemStatus: {
      type: Boolean,
      value: false
    },
    // 是否收藏
    isCollect: {
      type: Boolean,
      value: false
    },
    /* 底部状态栏类型 */
    type: {
      type: String,
      value: ''
    }
  },
  data: {
    identity: ''
  },
  attached() {
    this.setData({identity: wx.getStorageSync('choseType')})
  },
	methods: {
    formSubmit(e) {
      app.postFormId(e.detail.formId)
    },
		routeJump(e) {
		  const Identity = wx.getStorageSync('choseType')
			const itemId = e.currentTarget.dataset.itemId
			const status = e.currentTarget.dataset.status
			const jobhunteruid = e.currentTarget.dataset.jobhunteruid || e.currentTarget.dataset.uid
			const recruiteruid = e.currentTarget.dataset.recruiteruid
      const positionId = e.currentTarget.dataset.positionid
      const url = wx.getStorageSync('choseType') === 'APPLICANT'
                  ? `/page/common/pages/recruiterDetail/recruiterDetail?uid=${jobhunteruid}`
                  : `/page/common/pages/resumeDetail/resumeDetail?uid=${jobhunteruid}`

      const jobhunterRoute = () => {
        switch(status) {
          case 51:
            if(Number(positionId) > 0) {
              wx.navigateTo({url: `/page/common/pages/positionDetail/positionDetail?positionId=${positionId}`})
            } else {
              wx.navigateTo({url: `/page/common/pages/recruiterDetail/recruiterDetail?uid=${recruiteruid}`})
            }
            break
          case 12:
            if(Number(positionId) > 0) {
              wx.navigateTo({url: `/page/common/pages/positionDetail/positionDetail?positionId=${positionId}`})
            } else {
              wx.navigateTo({url: `/page/common/pages/recruiterDetail/recruiterDetail?uid=${recruiteruid}`})
            }
            break
          case 11:
            if(Number(positionId) > 0) {
              wx.navigateTo({url: `/page/common/pages/positionDetail/positionDetail?positionId=${positionId}`})
            } else {
              wx.navigateTo({url: `/page/common/pages/recruiterDetail/recruiterDetail?uid=${recruiteruid}`})
            }
            break
          case 21:
            if(Number(positionId) > 0) {
              wx.navigateTo({url: `/page/common/pages/positionDetail/positionDetail?positionId=${positionId}`})
            } else {
              wx.navigateTo({url: `/page/common/pages/recruiterDetail/recruiterDetail?uid=${recruiteruid}`})
            }
            break
          case 54:
            if(Number(positionId) > 0) {
              wx.navigateTo({url: `/page/common/pages/positionDetail/positionDetail?positionId=${positionId}`})
            } else {
              wx.navigateTo({url: `/page/common/pages/recruiterDetail/recruiterDetail?uid=${recruiteruid}`})
            }
            break
          default:
            wx.navigateTo({url: `/page/common/pages/arrangement/arrangement?id=${itemId}`})
            break
        }
      }

      const recruiterRoute = () => {
        switch(status) {
          case 51:
            wx.navigateTo({url: `/page/common/pages/arrangement/arrangement?id=${itemId}`})
            break
          case 12:
            wx.navigateTo({url: `/page/common/pages/resumeDetail/resumeDetail?uid=${jobhunteruid}`})
            break
          case 11:
            wx.navigateTo({url: `/page/common/pages/resumeDetail/resumeDetail?uid=${jobhunteruid}`})
            break
          case 52:
            wx.navigateTo({url: `/page/common/pages/resumeDetail/resumeDetail?uid=${jobhunteruid}`})
            break
          case 54:
            wx.navigateTo({url: `/page/common/pages/resumeDetail/resumeDetail?uid=${jobhunteruid}`})
            break
          default:
            wx.navigateTo({url: `/page/common/pages/arrangement/arrangement?id=${itemId}`})
            break
        }
      }

      // C端面试入口
      if(wx.getStorageSync('choseType') === 'APPLICANT' && !e.currentTarget.dataset.uid) {
        jobhunterRoute()
        return;
      }

      // B端面试入口
      if(wx.getStorageSync('choseType') === 'RECRUITER' && !e.currentTarget.dataset.uid) {
        recruiterRoute()
        return;
      }

      wx.navigateTo({url })
		}
	}
})
