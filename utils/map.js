const QQMapWX = require('../vendor/lib/qqmap-wx-jssdk.min.js')

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
	    success(res) {
	    	resolve(res)
	    },
	    fail(res) {
	    	reject(res)
	    }
	  })
	})
}

export const mapInfos = {
	markers: [],
  polyline: [
    {
      points: [
        {
          longitude: 113.3245211,
          latitude: 23.10229
        },
        {
          longitude: 113.324520,
          latitude: 23.21229
        }
      ],
      color:"#FF0000DD",
      width: 2,
      dottedLine: true
    }
  ],
  controls: [
    {
      id: 1,
      iconPath: '../vendor/resources/location.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }
  ],
  enableScroll: true
}