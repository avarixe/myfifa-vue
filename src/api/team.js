import axios from 'axios'
import apiRootUrl from './root'

const apiUrl = {
  getAllTeams: '{{userId}}/teams'
}

function urlFor (action, data) {
  let actionUrl = apiRootUrl + apiUrl[action]
  let matches = actionUrl.match(/\{\{(.+)\}\}/)
  console.log(matches)
  return actionUrl
}

export default {
  getAllTeams ({ token, userId }) {
    return urlFor('getAllTeams', { userId })
    // return axios.get(urlFor('getAllTeams', { userId }), { headers: { 'Authorization': 'Bearer ' + token } })
  }
}
