// actions
export const actions = {
  GET () {
    return this.$axios.$get('users/sync')
  },
  async CREATE ({ commit }, user) {
    await this.$axios.$post('users.json', { user })
    commit('broadcaster/ANNOUNCE', {
      message: 'Account has been registered!',
      color: 'success'
    }, { root: true })
  },
  async UPDATE ({ commit }, user) {
    await this.$axios.$patch('users.json', { user })
    commit('broadcaster/ANNOUNCE', {
      message: 'Account has been updated!',
      color: 'success'
    }, { root: true })
  }
}
