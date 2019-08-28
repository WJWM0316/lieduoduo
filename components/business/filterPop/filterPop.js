import {getFilterDataApi} from '../../../api/pages/aggregate.js'
import {getSelectorQuery} from '../../../utils/util.js'
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    filterType: {
      type: String,
      value: ''
    },
    filterResult: {
      type: Object,
      value: {}
    },
    openPop: {
      type: Boolean,
      value: false,
      observer: function(newVal, oldVal) {
        getFilterDataApi().then(res => {
          let filter       = res.data,
              filterResult = this.data.filterResult
          for (var type in filterResult) {
            switch (type) {
              case 'cityNums':
                if (filterResult['cityNums']) {
                  filter['area'].filter((item, index) => {
                    if (item.areaId === parseInt(filterResult['cityNums'])) item.active = true
                  })
                } else {
                  filter['area'][0].active = true
                }
                break
              case 'positionTypeIds':
                if (filterResult['positionTypeIds']) {
                  filter['positionType'].filter((item, index) => {
                    if (item.labelId === parseInt(filterResult['topId'])) {
                      item.active = true
                      filter.topIndex = index
                      item.children.filter((item0) => {
                        if (parseInt(item0.labelId) === parseInt(filterResult['positionTypeIds'])) item0.active = true
                      })
                    }
                  })
                } else {
                  filter['positionType'][0].active = true
                }
                break
              case 'emolumentIds':
                if (filterResult['emolumentIds'] && filterResult['emolumentIds'] !== 1) {
                  filterResult['emolumentIds'].split(',').forEach((item, index) => {
                    filter['emolument'].filter((item0) => {
                      if (item0.id === parseInt(item)) item0.active = true
                    })
                  })
                } else {
                  filter['emolument'][0].active = true
                }
                break
              case 'industryIds':
                if (filterResult['industryIds']) {
                  filterResult['industryIds'].split(',').forEach((item, index) => {
                    filter['industry'].filter((item0) => {
                      if (item0.labelId === parseInt(item)) item0.active = true
                    })
                  })
                } else {
                  filter['industry'][0].active = true
                }
                break
              case 'employeeIds':
                if (filterResult['employeeIds']) {
                  filterResult['employeeIds'].split(',').forEach((item, index) => {
                    filter['employee'].filter((item0) => {
                      if (item0.value === parseInt(item)) item0.active = true
                    })
                  })
                } else {
                  filter['employee'][0].active = true
                }
                break
              case 'financingIds':
                if (filterResult['financingIds']) {
                  filterResult['financingIds'].split(',').forEach((item, index) => {
                    filter['financing'].filter((item0) => {
                      if (item0.value === parseInt(item)) item0.active = true
                    })
                  })
                } else {
                  filter['financing'][0].active = true
                }
                break
              case 'experienceIds':
                if (filterResult['experienceIds']) {
                  filterResult['experienceIds'].split(',').forEach((item, index) => {
                    filter['experience'].filter((item0) => {
                      if (item0.value === parseInt(item)) item0.active = true
                    })
                  })
                } else {
                  filter['experience'][0].active = true
                }
                break
            }
          }
          this.setData({filter}, () => {
            wx.nextTick(() => {
              getSelectorQuery('.scrollView', this).then(res => {
                let headerFlexed = res.height >=  (app.globalData.systemInfo.windowHeight - (224 / app.globalData.xs))
                setTimeout(() => {
                  this.setData({headerFlexed})
                }, 300)
              })
            })
          })
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    filter: {},
    comanyMore: false
  },
  attached () {
  },
  /**
   * 组件的方法列表
   */
  methods: {
    chooseItem (e) {
      let dataset  = e.currentTarget.dataset,
          item     = dataset.item,
          filterResult = this.data.filterResult,
          typeData = null,
          type     = null,
          filter   = this.data.filter,
          active   = null
      switch (dataset.type) {
        case 'city':
          typeData = filter['area']
          type     = `filter.area`
          filterResult.cityNums = item.areaId
          filterResult.cityName = item.name
          this.setData({openPop: false})
          this.triggerEvent('FilterResult', filterResult)
          break
        case 'employee':
          typeData = filter['employee']
          type     = `filter.employee`
          break
        case 'industry':
          typeData = filter['industry']
          type     = `filter.industry`
          break
        case 'financing':
          typeData = filter['financing']
          type     = `filter.financing`
          break
        case 'experience':
          typeData = filter['experience']
          type     = `filter.experience`
          break
        case 'emolument':
          typeData = filter['emolument']
          type     = `filter.emolument`
          break
        case 'positionType':
          if (dataset.first) {
            typeData = filter['positionType']
            this.setData({[`filter.topIndex`]: dataset.topindex})
            type     = `filter.positionType`
          } else {
            typeData = filter['positionType'][filter.topIndex].children
            type     = `filter.positionType[${filter.topIndex}].children`
          }
          break
      }
      
      // 职位类别 比较特殊，单独写逻辑
      if (dataset.type === 'positionType') {
        typeData.forEach((item, index) => {
          item.active = false
        })
        if (dataset.first) {
          active = typeData[dataset.topindex].active || false
          typeData[dataset.topindex].active = !active
          typeData.topindex = dataset.topindex
        } else {
          active = typeData[dataset.index].active || false
          typeData[dataset.index].active = !active
        }
        this.setData({[`${type}`]: typeData})
      } else {
        active = typeData[dataset.index].active || false
        if (dataset.index === 0 || dataset.type === 'city') {
          typeData.forEach((item, index) => {
            if (index) item.active = false
          })
          typeData[dataset.index].active = !active
          this.setData({[`${type}`]: typeData})
        } else {
          if (typeData.filter(item => { return item.active}).length >= 3) {
            app.wxToast({title: '最多可选3个'})
            return
          }
          this.setData({[`${type}[${dataset.index}].active`]: !active, [`${type}[0].active`]: false})
        }
      }
         
    },
    openMore (e) {
      let type = e.currentTarget.dataset.type
      switch (type) {          
        case 'company':
          let comanyMore = this.data.comanyMore
          this.setData({comanyMore: !comanyMore})
          break
      }
    },
    reset () {
      let resetList = (array) => {
        array.forEach((item) => {
          if (item.active) item.active = false
        })
      }
      let filter = this.data.filter
      switch (this.data.filterType) {
        case 'company':
          resetList(filter.employee)
          resetList(filter.industry)
          resetList(filter.financing)
          filter.employee[0].active = true
          filter.industry[0].active = true
          filter.financing[0].active = true
          break
        case 'require':
          resetList(filter.experience)
          resetList(filter.emolument)
          filter.experience[0].active = true
          filter.emolument[0].active = true
          break
        case 'emolument':
          resetList(filter.emolument)
          filter.emolument[0].active = true
          break
        case 'positionType':
          resetList(filter.positionType)
          resetList(filter.positionType[filter.topindex].children)
          filter.positionType[0].active = true
          filter.positionType[0].children[0].active = true
          break
      }
      this.setData({filter})
    },
    sure () {
      let filter = this.data.filter,
          filterResult = this.data.filterResult
      let filterList = (array) => {
        let list = []
        array.forEach((item) => {
          if (item.active) list.push(item.value || item.labelId || item.id)
        })
        return list
      }
      switch (this.data.filterType) {
        case 'company':
          filterResult.employeeIds = filterList(filter.employee).join()
          filterResult.industryIds = filterList(filter.industry).join()
          filterResult.financingIds = filterList(filter.financing).join()
          break
        case 'require':
          filterResult.experienceIds = filterList(filter.experience).join()
          filterResult.emolumentIds = filterList(filter.emolument).join()
          break
        case 'emolument':
          filterResult.emolumentIds = filterList(filter.emolument).join()
          break
        case 'positionType':
          console.log(filter.positionType, filter.topindex, 111)
          filterResult.positionTypeIds = filterList(filter.positionType[filter.topindex].children).join()
          filterResult.topId = filter.topindex
          if (filterResult.positionTypeIds === '0') filterResult.positionTypeIds = 0
          break
      }
      this.setData({openPop: false})
      this.triggerEvent('FilterResult', filterResult)
    },
    close () {
      this.setData({openPop: false})
    }
  }
})
