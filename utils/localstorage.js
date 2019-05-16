class localstorage {
	set (key, value, object) {
		let date = new Date(),
				year = date.getFullYear(),
				month = date.getMonth() + 1,
				day = date.getDate(),
				timeStamp = date.getTime()
		console.log(date, year, month, day)
		if (object) {
			switch (object.type) {
				case 'resetTheDay': // 每天0点过期
					let nextDay = new Date(`${year}/${month}/${day}`).getTime()
					console.log(nextDay, 111111)
					break
				case 'timeStamp': // 指定过了多次事件‘过期
					break
				case 'date': // 指定日期过期
					break
			}
		}
		wx.setStorageSync(key, value)
	}
}
export default new localstorage()