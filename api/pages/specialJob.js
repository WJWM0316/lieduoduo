import { request } from '../require.js'

// 顯示搶購
export const getRapidlyApi = (data) => {
  return request({
    url: '/surface/rapidly',
    host: 'NODEHOST',
    method: 'get',
    data
  })
}

// 近期精選
export const getRecentApi = (data) => {
  return request({
    url: '/surface/recent',
    host: 'NODEHOST',
    method: 'get',
    data
  })
}


// 城市列表
export const getSurfaceCityListApi = (data) => {
  return request({
    url: '/surface/city/list',
    host: 'NODEHOST',
    method: 'get',
    data
  })
}
