import axios from 'axios'
import urlFor from './root'

const subPath = {
  logUserIn: '/oauth/token'
}

export default {
  logUserIn (payload) {
    return axios.post(urlFor(subPath.logUserIn), payload)
  }
}
