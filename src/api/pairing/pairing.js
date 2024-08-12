import request from '@/utils/request'

// 查询星座配对列表
export function listPairing(query) {
  return request({
    url: '/pairing/pairing/list',
    method: 'get',
    params: query
  })
}

// 查询星座配对详细
export function getPairing(id) {
  return request({
    url: '/pairing/pairing/' + id,
    method: 'get'
  })
}

// 新增星座配对
export function addPairing(data) {
  return request({
    url: '/pairing/pairing',
    method: 'post',
    data: data
  })
}

// 修改星座配对
export function updatePairing(data) {
  return request({
    url: '/pairing/pairing',
    method: 'put',
    data: data
  })
}

// 删除星座配对
export function delPairing(id) {
  return request({
    url: '/pairing/pairing/' + id,
    method: 'delete'
  })
}
