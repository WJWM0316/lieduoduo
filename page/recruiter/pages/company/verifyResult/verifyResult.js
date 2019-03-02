import {
  getApplyjoinInfosApi
} from '../../../../../api/pages/recruiter.js'

const app = getApp()

Page({
  data: {
    cdnImagePath: app.globalData.cdnImagePath,
    options: {},
    infos: {}
  },
  onLoad(options) {
  	this.setData({options})
  	this.getApplyjoinInfos()
  },
  getApplyjoinInfos() {
  	getApplyjoinInfosApi({id: this.data.options.id}).then(res => {
  		this.setData({infos: res.data.applyInfo})
  		console.log(res)
  	})
  }
})