Component({
  externalClasses: ['personality'],
  behaviors: [],
  properties: {
    // 传入的列表数据
    list: {
    	type: Array,
    	value: []
    },
    // 当前用户的身份
    identity: {
      type: String,
      value:'APPLICANT' //默认求职者
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
      value: true
    }
  },
  attached() {
    console.log(this.data.list)
  },
	methods: {
		routeJump(e) {
			const itemId = e.currentTarget.dataset.itemId
			const status = e.currentTarget.dataset.status
			const jobhunteruid = e.currentTarget.dataset.jobhunteruid || e.currentTarget.dataset.uid
			if (e.currentTarget.dataset.uid) { // 首页入口
			  wx.navigateTo({
          url: `/page/common/pages/resumeDetail/resumeDetail?uid=${jobhunteruid}`
        })
			} else { // 职位机会入口
			  if (status === 11) {
          wx.navigateTo({
            url: `/page/common/pages/resumeDetail/resumeDetail?uid=${jobhunteruid}`
          })
        } else {
          wx.navigateTo({
            url: `/page/common/pages/arrangement/arrangement?id=${itemId}`
          })
        }
			}
		}
	}
})
