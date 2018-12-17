Component({
	behaviors: [],
	externalClasses: ['iconfont1'],
  properties: {
    listType: {
      type: String,
      // 'apply, invite, interview'
      value: 'apply'
    },
    currentTab: {
    	type: String,
      // 'all, pending resolve reject'
    	value: 'all'
    },
    list: {
      type: Array,
      value: []
    }
  },
	methods: {
		routeJump(e) {
			let companyId = e.currentTarget.dataset.companyId
			console.log(companyId)
		}
	}
})
