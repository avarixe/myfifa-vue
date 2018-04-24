import axios from 'axios'
import apiRootUrl from './root'

const apiUrl = {
  logUserIn: '/oauth/token'
}

export default {
  logUserIn (payload) {
    return axios.post(apiRootUrl + apiUrl.logUserIn, payload)
  }
}
