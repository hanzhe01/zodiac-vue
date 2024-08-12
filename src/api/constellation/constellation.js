import request from '@/utils/request'

// 查询星座管理列表
export function listConstellation(query) {
  return request({
    url: '/constellation/constellation/list',
    method: 'get',
    params: query
  })
}

// 查询星座管理详细
export function getConstellation(id) {
  return request({
    url: '/constellation/constellation/' + id,
    method: 'get'
  })
}

// 新增星座管理
export function addConstellation(data) {
  return request({
    url: '/constellation/constellation',
    method: 'post',
    data: data
  })
}

// 修改星座管理
export function updateConstellation(data) {
  return request({
    url: '/constellation/constellation',
    method: 'put',
    data: data
  })
}

// 删除星座管理
export function delConstellation(id) {
  return request({
    url: '/constellation/constellation/' + id,
    method: 'delete'
  })
}

// 星座预览效果
export function getPreviewDetails(viewQuery) {
  return request({
    url: '/constellation/constellation/previewDetails',
    method: 'get',
    params: viewQuery
  })
}
