Component({
	behaviors: [],
	externalClasses: ['iconfont1'],
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
        value: true
    },
    // 是否显示左上圆角
    showTopRadius: {
        type: Boolean,
        value: false
    },
    // 是否显示右上圆角
    showRightRadius: {
        type: Boolean,
        value: false
    },
    // 是否显示右下圆角
    showBottomRadius: {
        type: Boolean,
        value: true
    },
    // 是否显示左下圆角
    showLeftRadius: {
        type: Boolean,
        value: true
    },
    // 操作
    action: {
        type: String,
        value: ''
    }
  },
	methods: {
		routeJump(e) {
			let companyId = e.currentTarget.dataset.companyId
			console.log(companyId)
		}
	}
})
