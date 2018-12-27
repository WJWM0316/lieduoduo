const QQMapWX = require('./lib/qqmap-wx-jssdk.min.js')

const qqmapsdk = new QQMapWX({
  key: 'P63BZ-4RM35-BIJIV-QOL7E-XNCZZ-WIF4L'
})

export const reverseGeocoder = (res) => {
	return new Promise((resolve, reject) => {
		qqmapsdk.reverseGeocoder({
	    location: {
	      latitude: res.latitude,
	      longitude: res.longitude
	    },
	    success: res => {
	    	resolve(res)
	    }
	  })
	})
}