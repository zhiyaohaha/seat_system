import axios from 'axios'
// 请求错误处理 注意根据具体的服务器端设置，此处仅仅是个示例
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
export default function ajax(url, data = {}, type = 'post') {
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
