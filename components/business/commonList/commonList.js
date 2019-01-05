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
	methods: {
		routeJump(e) {
			let itemId = e.currentTarget.dataset.itemId
			console.log(itemId)
		}
	}
})
