/* 聚合接口 */
import localstorage from '../../utils/localstorage.js'
import { request } from '../require.js'
/* C端首页 筛选数据 */
export const getFilterDataApi = (data, hasLoading) => {
	return new Promise((resolve, reject) => {
		let filterData = localstorage.get('filterData')
		if (filterData) {
			resolve(filterData)
		} else {
			return request({
		  	name: 'getFilterDataApi',
		    method: 'get',
		    url: '/aggr/index',
		    data,
		    hasLoading: false
		  }).then(res => {
		  	resolve(res)
		  	localstorage.set('filterData', {data: res.data, type: 'resetTheDay'})
		  }).catch(e => {
		  	reject(e)
		  })
		}
  })
}