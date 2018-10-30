import axios from 'axios'
import { baseURL } from './myfifa'

function urlFor (path, pathData) {
  const matches = path.match(/\{\{(.+)\}\}/g) || []
  for (var i = 0; i < matches.length; i++) {
    let prop = matches[i].replace(/[{}\s]/g, '')
    path = path.replace(matches[i], pathData[prop])
  }

  return path
}

async function apiRequest ({
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

export default apiRequest
