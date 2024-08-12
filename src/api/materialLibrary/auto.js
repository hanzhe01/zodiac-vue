import request from '@/utils/request'

export function autoAiGeneration(data) {
    return request({
        url: '/send/auto',
        method: 'post',
        data: data,
        timeout: 600000
    })
}