function apiUrl (path) {
  return 'https://api.myfifa.joondev.com/' + path
}

function urlFor (subPath, data) {
  let actionUrl = apiUrl(subPath)

  const matches = actionUrl.match(/\{\{(.+)\}\}/g) || []
  for (var i = 0; i < matches.length; i++) {
    let prop = matches[i].replace(/[{}\s]/g, '')
    actionUrl = actionUrl.replace(matches[i], data[prop])
  }

  return actionUrl
}

export default urlFor
