// initial state
export const state = () => ({
  message: '',
  color: ''
})

// mutations
export const mutations = {
  ANNOUNCE (state, { message, color }) {
    state.color = color
    state.message = message || ''
  },
  CLEAR (state) {
    state.message = ''
    state.color = ''
  }
}
