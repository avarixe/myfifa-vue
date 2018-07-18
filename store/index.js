import cookieparser from 'cookieparser'
import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

// initial state
export const state = () => ({
  token: null // localStorage.getItem('token'),
  // expirationDate: localStorage.getItem('expirationDate')
})

// getters
export const getters = {
  authenticated: state => state.token !== null
}

// mutations
export const mutations = {
  setToken (state, token) {
    state.token = token
    // if (token !== null) {
    //   localStorage.setItem('token', token)
    // } else {
    //   localStorage.removeItem('token')
    // }
  }
  // setExpirationDate (state, expirationDate) {
  //   state.expirationDate = expirationDate
  //   if (expirationDate !== null) {
  //     localStorage.setItem('expirationDate', expirationDate)
  //   } else {
  //     localStorage.removeItem('expirationDate')
  //   }
  // }
}

// actions
export const actions = {
  nuxtServerInit ({ commit }, { req }) {
    let accessToken = null
    if (req.headers.cookie) {
      var parsed = cookieparser.parse(req.headers.cookie)
      accessToken = parsed.token
    }
    commit('setToken', accessToken)
  },
  login ({ commit }, payload) {
    return apiRequest({
      method: 'post',
      path: myfifa.token.get,
      data: payload,
      success: ({ data }) => {
        // let expirationDate = (data.created_at + data.expires_in) * 1000
        commit('setToken', data.access_token)
        // commit('setExpirationDate', expirationDate)
        // commit('team/set', data.user.current_team, { root: true })
      },
      errorMessage: 'Invalid Email or Password. Please try again.'
    })
  },
  logout ({ commit, state }) {
    return apiRequest({
      method: 'post',
      path: myfifa.token.revoke,
      data: { token: state.token },
      success: ({ data }) => {
        commit('setToken', null)
      },
      errorMessage: 'An error occurred when logging out. Please try again.'
    })
  }
  // info ({ state }) {
  //   return apiRequest({
  //     path: myfifa.user,
  //     token: state.token,
  //     success: ({ data }) => {
  //       console.log(data)
  //     }
  //   })
  // }
}
