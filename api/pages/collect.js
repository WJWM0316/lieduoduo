import { request } from '../require.js'

// 收藏的招聘官列表
export const getMyCollectUsersApi = (data, isLoading) => {
  return request({
    method: 'get',
    url: '/collect/myCollectUsers',
    data,
    isLoading: true
  })
}

// 收藏的职位列表
export const getMyCollectPositionsApi = (data, isLoading) => {
  return request({
    method: 'get',
    url: '/collect/myCollectPositions',
    data,
    isLoading: true
  })
}

// 收藏招聘官
export const getMyCollectUserApi = (data, isLoading) => {
  return request({
    method: 'put',
    url: `/collect/collectUser/${data.uid}`,
    data,
    isLoading: true
  })
}

// 取消收藏招聘官
export const deleteMyCollectUserApi = (data, isLoading) => {
  return request({
    method: 'delete',
    url: `/collect/collectUser/${data.uid}`,
    data,
    isLoading: true
  })
}

// 收藏职位
export const getMycollectPositionApi = (data, isLoading) => {
  return request({
    method: 'put',
    url: `/collect/collectPosition/${data.id}`,
    data,
    isLoading: true
  })
}

// 取消收藏职位
export const deleteMycollectPositionApi = (data, isLoading) => {
  return request({
    method: 'delete',
    url: `/collect/collectPosition/${data.id}`,
    data,
    isLoading: true
  })
}

// 取消收藏职位(招聘端)
export const getBrowseMySelfApi = (data, isLoading) => {
  return request({
    method: 'get',
    url: `/browse/browseMySelf`,
    data,
    isLoading: true
  })
}
