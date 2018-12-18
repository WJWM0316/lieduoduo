Component({
	behaviors: [],
	externalClasses: ['iconfont1'],
  properties: {
    list: Array
  },
	methods: {
		routeJump(e) {
			let companyId = e.currentTarget.dataset.companyId
			console.log(companyId)
		}
	}
})
