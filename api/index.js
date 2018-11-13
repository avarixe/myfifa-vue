import axios from 'axios'
import { baseURL } from './myfifa'

function urlFor (path, pathData) {
  return Object.entries(pathData)
    .reduce((url, data) => {
      const regex = `{{\\s*${data[0]}\\s*}}`
      const escapedData = data[1]
        .toString()
        .replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
      return url.replace(new RegExp(regex, 'g'), escapedData)
    }, path)
}

async function sendRequest ({
  method,
  path,
  pathData,
  params,
  data,
  token,
  success
}) {
  try {
    const res = await axios({
      method: method || 'get',
      baseURL: baseURL,
      url: urlFor(path, pathData),
      params: params,
      data: data,
      credentials: false,
      headers: token ? { 'Authorization': 'Bearer ' + token } : null
    })
    success && success(res)
    return res
  } catch (e) {
    if (e.response && e.response.data &&
        typeof e.response.data === 'Object') {
      const res = e.response.data
      if ('error_description' in res) {
        throw new Error(res.error_description)
      } else if ('errors' in res) {
        throw new Error(res.errors[0])
      }
    } else {
      // console.error(e)
      // console.trace(e)
      throw new Error('An Error occurred. Please try again.')
    }
  }
}

export default sendRequest
