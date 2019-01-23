import { request } from '../require.js'

// 浏览过的招聘官列表
export const getMyBrowseUsersListApi = (data) => {
  return request({
    url: '/browse/myBrowseUsers',
    method: 'get',
    data,
    hasLoading: true
  })
}

// 浏览过的职位列表
export const getMyBrowsePositionApi = (data) => {
  return request({
    url: '/browse/myBrowsePosition',
    method: 'get',
    data,
    hasLoading: true
  })
}

// 浏览过我的招聘官
export const getBrowseMySelfApi = (data) => {
  return request({
    url: '/browse/browseMySelf',
    method: 'get',
    data,
    hasLoading: true
  })
}

//// 我的收藏（求职端）
//export const getMyCollectUsersApi = (data) => {
//return request({
//  url: '/collect/myCollectUsers',
//  method: 'get',
//  data,
//  hasLoading: true
//})
//}


// 收藏我的(招聘端)
export const getCollectMySelfApi = (data, isLoading) => {
  return request({
    method: 'get',
    url: `/collect/getCollectMySelf`,
    data,
    isLoading: true
  })
}

// 我的收藏的(招聘端)
export const getMyCollectUsersApi = (data, isLoading) => {
  return request({
    method: 'get',
    url: `/collect/myCollectUsers`,
    data,
    isLoading: true
  })
}

// 删除查看用户
export const deleteBrowseUserApi = (data, isLoading) => {
  return request({
    method: 'delete',
    url: `/browse/deleteBrowseUser/${data.uid}`,
    isLoading: true
  })
}
