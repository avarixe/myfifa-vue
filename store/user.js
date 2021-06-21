// actions
export const actions = {
  async get ({ commit }) {
    const data = await this.$axios.$get('users/sync')
    this.$db().model('User').insert({ data })
    commit('setUserId', data.id, { root: true })
  },
  async create ({ commit }, user) {
    await this.$axios.$post('users.json', { user })
    commit('broadcaster/announce', {
      message: 'Account has been registered!',
      color: 'success'
    }, { root: true })
  },
  async update ({ dispatch }, user) {
    await this.$axios.$patch('users.json', { user })
    await dispatch('get')
  },
  async changePassword (_, user) {
    await this.$axios.$patch('users.json', { user })
  },
  async setDarkMode ({ dispatch }, darkModeOn) {
    await this.$axios.$patch('users.json', {
      user: { dark_mode: darkModeOn }
    })
    await dispatch('get')
  }
}
