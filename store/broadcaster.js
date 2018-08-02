// initial state
export const state = () => ({
  message: '',
  color: ''
})

// mutations
export const mutations = {
  announce (state, { message, color }) {
    state.color = color
    state.message = message || ''
  },
  clear (state) {
    state.message = ''
    state.color = ''
  }
}
