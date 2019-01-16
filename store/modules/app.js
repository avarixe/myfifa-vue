// initial state
const state = () => ({
  title: '',
  drawer: false
})

// mutations
const mutations = {
  SET_TITLE (state, title) {
    state.title = title
  },
  SET_DRAWER (state, drawer) {
    state.drawer = drawer
  },
  TOGGLE_DRAWER (state) {
    state.drawer = !state.drawer
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
