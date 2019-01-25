import {getRecruitersListApi} from '../../../../../api/pages/company.js'

let app = getApp()

Page({
  data: {
    recruiterList: [],
    isCompanyAdmin: 0
  },
  onLoad(options) {
    let recruiterList = app.globalData.companyInfo.recruiterList
    recruiterList.map(field => field.active = false)
    let isCompanyAdmin = app.globalData.recruiterDetails.isCompanyAdmin || 0
    this.setData({recruiterList, isCompanyAdmin})
    console.log(app.globalData.companyInfo)
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-24
   * @detail   申请转移权限
   * @return   {[type]}   [description]
   */
  authTransfer() {
  	const result = () => {
  		app.wxConfirm({
	      title: '申请成功',
	      content: `我们已收到您的申请，24小时内会有专人给您致电了解情况，请保持手机畅通。`,
	      showCancel: false,
	      confirmText: '知道了',
	      confirmBack: () => {}
	    })
  	}
  	app.wxConfirm({
      title: '申请转移管理权限',
      content: `您即将转移${'老虎科技'}的公司管理权限给${'陆强'}，确定转移吗？`,
      confirmBack: () => {
        result()
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-24
   * @detail   移除招聘官
   * @return   {[type]}   [description]
   */
  delete(e) {
  	const params = e.currentTarget.dataset
  	const result = (params) => {
  		let recruiterList = this.data.recruiterList
  		recruiterList = recruiterList.filter(field => field.uid !== params.uid)
  		this.setData(recruiterList)
  	}
  	app.wxConfirm({
      title: '移除招聘官',
      content: `即将从公司中移除${'陆强'}，该招聘官发布的职位将被关闭且无法继续进行招聘，确认移除吗?`,
      confirmText: '移除',
      confirmBack: () => {
        result(params)
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-24
   * @detail   选择当前招聘官
   * @return   {[type]}   [description]
   */
  select(e) {
  	const recruiterList = this.data.recruiterList
  	recruiterList.map((field, index) => field.active = index === params.active ? true : false)
  	this.setData({recruiterList})
  }
})