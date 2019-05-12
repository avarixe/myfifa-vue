// initial state
export const state = () => ({
  title: '',
  drawer: false
})

// mutations
export const mutations = {
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
