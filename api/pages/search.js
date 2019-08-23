import { request } from '../require.js'


// 获取职位搜索下拉词条
export const getKeyWordListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/search/matches/position`,
    data,
    hasLoading: hasLoading
  })
}

// 获取热门搜索词
export const getHotKeyWordListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/search/hot/words`,
    data,
    hasLoading: hasLoading
  })
}

// 搜索职位
export const getSearchPositionListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/positions/sch`,
    data,
    hasLoading: hasLoading
  })
}

// 公司搜索
export const getSearchConpanyListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/companies/sch`,
    data,
    hasLoading: hasLoading
  })
}

// 获取推荐策略职位列表
export const getRecommendApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/recommend/oppty/list',
    data,
    hasLoading: hasLoading
  })
}