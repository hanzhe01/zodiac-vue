import request from '@/utils/request'

// 查询白名单列表
export function listPet(query) {
  return request({
    url: '/pet/pet/list',
    method: 'get',
    params: query
  })
}

// 查询白名单详细
export function getPet(id) {
  return request({
    url: '/pet/pet/' + id,
    method: 'get'
  })
}

// 新增白名单
export function addPet(data) {
  return request({
    url: '/pet/pet',
    method: 'post',
    data: data
  })
}

// 修改白名单
export function updatePet(data) {
  return request({
    url: '/pet/pet',
    method: 'put',
    data: data
  })
}

// 删除白名单
export function delPet(id) {
  return request({
    url: '/pet/pet/' + id,
    method: 'delete'
  })
}
