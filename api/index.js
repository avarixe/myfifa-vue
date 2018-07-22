import axios from 'axios'

const baseURL = 'https://api.myfifa.joondev.com'
// const baseURL = 'http://api.myfifa.joondev.com:3000'

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
    const errorMessage = e.response && e.response.data
      ? e.response.data.error_description
      : 'An Error occurred. Please try again.'
    throw new Error(errorMessage)
  }
}

export default apiRequest
