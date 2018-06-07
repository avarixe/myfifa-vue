import axios from 'axios'

const baseURL = 'https://api.myfifa.joondev.com/'

function urlFor (path, pathData) {
  const matches = path.match(/\{\{(.+)\}\}/g) || []
  for (var i = 0; i < matches.length; i++) {
    let prop = matches[i].replace(/[{}\s]/g, '')
    path = path.replace(matches[i], pathData[prop])
  }

  return path
}

function apiRequest ({
  method,
  path,
  pathData,
  params,
  data,
  token,
  errorMessage,
  success
}) {
  return new Promise(function (resolve, reject) {
    axios({
      method: method || 'get',
      baseURL: baseURL,
      url: urlFor(path, pathData),
      params: params,
      data: data,
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then((response) => {
      try {
        if (success) {
          success(response)
        }
        resolve(response.data)
      } catch (error) {
        reject(error)
      }
    }).catch((error) => {
      if (error) {
        reject(new Error(errorMessage))
      }
    })
  })
}

export default apiRequest
