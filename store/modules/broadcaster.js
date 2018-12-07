// initial state
const state = () => ({
  message: '',
  color: ''
})

// mutations
const mutations = {
  ANNOUNCE (state, { message, color }) {
    state.color = color
    state.message = message || ''
  },
  CLEAR (state) {
    state.message = ''
    state.color = ''
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
