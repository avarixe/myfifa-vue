import axios from 'axios'
import { baseURL } from './routes'

function urlFor (path, pathData = {}) {
  return Object.entries(pathData)
    .reduce((url, data) => {
      const regex = `{{\\s*${data[0]}\\s*}}`
      const escapedData = data[1]
        .toString()
        .replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
      return url.replace(new RegExp(regex, 'g'), escapedData)
    }, path)
}

function capitalize (word) {
  return `${word[0].toUpperCase()}${word.slice(1)}`
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
      baseURL,
      url: urlFor(path, pathData),
      params,
      data,
      credentials: false,
      headers: token ? { Authorization: `Bearer ${token}` } : null
    })
    success && await success(res)
    return res
  } catch (e) {
    if (e.response && e.response.data &&
        typeof e.response.data === 'object') {
      const res = e.response.data
      if ('errors' in res) {
        if (Array.isArray(res.errors)) {
          throw new Error(res.errors[0])
        } else {
          const key = Object.keys(res.errors)[0]
          const attr = key.split('_').map(w => capitalize(w)).join(' ')
          throw new Error(`${attr} ${res.errors[key]}`)
        }
      } else if ('error_description' in res) {
        throw new Error(res.error_description)
      }
    } else {
      console.error(e)
      console.trace(e)
      throw new Error(`An Error occurred when sending a request to ${path}. Please try again.`)
    }
  }
}

export default sendRequest
