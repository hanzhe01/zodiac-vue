import request from '@/utils/request'

// 查询素材管理列表
export function listMateriallibrary(query) {
  return request({
    url: '/materiallibrary/materiallibrary/list',
    method: 'get',
    params: query
  })
}

// 查询素材管理详细
export function getMateriallibrary(id) {
  return request({
    url: '/materiallibrary/materiallibrary/' + id,
    method: 'get'
  })
}

// 新增素材管理
export function addMateriallibrary(data) {
  return request({
    url: '/materiallibrary/materiallibrary',
    method: 'post',
    data: data
  })
}

// 修改素材管理
export function updateMateriallibrary(data) {
  return request({
    url: '/materiallibrary/materiallibrary',
    method: 'put',
    data: data
  })
}

// 删除素材管理
export function delMateriallibrary(id) {
  return request({
    url: '/materiallibrary/materiallibrary/' + id,
    method: 'delete'
  })
}
