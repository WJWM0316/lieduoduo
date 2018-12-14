Component({
	behaviors: [],
	externalClasses: ['iconfont'],
  properties: {
    list: Array
  },
	methods: {
		routeJump(e) {
			let companyId = e.currentTarget.dataset.companyId
			// wx.navigateTo({
			//   url: `detaiil?companyId=${companyId}`
			// })
			console.log(companyId)
		}
	}
})
