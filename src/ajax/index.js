import axios from 'axios'
// 请求错误处理 注意根据具体的服务器端设置，此处仅仅是个示例
const errorFn = err => {
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '请求错误'
        break

      case 401:
        err.message = '未授权，请登录'
        break

      case 403:
        err.message = '拒绝访问'
        break

      case 404:
        err.message = `请求地址出错: ${err.response.config.url}`
        break

      case 408:
        err.message = '请求超时'
        break

      case 500:
        err.message = '服务器开个小差，请稍后再试'
        break

      case 501:
        err.message = '服务器开个小差，请稍后再试'
        break

      case 502:
        err.message = '服务器开个小差，请稍后再试'
        break

      case 503:
        err.message = '服务器开个小差，请稍后再试'
        break

      case 504:
        err.message = '服务器开个小差，请稍后再试'
        break

      case 505:
        err.message = 'HTTP版本不受支持'
        break

      default:
        err.message = '请求失败，请稍后再试'
    }
  }
  return Promise.reject(err)
}
/* ***此处开始封装不同后台下的axios实例 ****/
// 龙湖后台
const $ajax = axios.create({
  headers: {},
  // baseURL: BASE_URL,
  timeout: 30000,
  withCredentials: true
})
$ajax.interceptors.request.use(
  config => {
    // 这里一个token，你需要在这里取到你设置好的token的值
    config.headers['Content-Type'] = 'application/json;charset=UTF-8' // 请求数据格式
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
$ajax.interceptors.response.use(
  response => {
    // 如果状态码是ES7008，表示token失效，则直接跳转到登录页面
    if (response.data.code == 'ES7008') {
      alert('请求超时')
    }
  }, errorFn
)
export default function ajax(url, data = {}, type = 'get') {
  return new Promise((resolve, reject) => {
    $ajax({
      url: url,
      method: type,
      data: data
    }).then(function (res) {
      let result = res.data
      resolve(result)
    }).catch(function (err) {
      reject(err)
      // eslint-disable-next-line
      console.error(url, data, err)
    })
  })
}
