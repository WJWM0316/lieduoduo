Component({
	behaviors: [],
	externalClasses: ['iconfont1'],
  properties: {
    listType: {
      type: String,
      // 'apply, invite, interview'
      value: 'apply'
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
