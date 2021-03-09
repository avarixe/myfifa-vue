// actions
export const actions = {
  get () {
    return this.$axios.$get('users/sync')
  },
  async create ({ commit }, user) {
    await this.$axios.$post('users.json', { user })
    commit('broadcaster/announce', {
      message: 'Account has been registered!',
      color: 'success'
    }, { root: true })
  },
  async update ({ commit }, user) {
    await this.$axios.$patch('users.json', { user })
    commit('broadcaster/announce', {
      message: 'Account has been updated!',
      color: 'success'
    }, { root: true })
  }
}
