// initial state
export const state = () => ({
  cable: null,
  channels: {}
})

// actions
export const actions = {
  initialize ({ commit, rootState }, cable) {
    commit('SET_CABLE', cable)
  },
  subscribe ({ state, commit }, { channel, received }) {
    const subscription = state.cable.subscriptions.create({
      channel
    }, {
      received,
      connected: () => {},
      disconnected: () => {}
    })
    commit('SET_CHANNEL', { channel, subscription })
  }
}

// mutations
export const mutations = {
  SET_CABLE (state, cable) {
    state.cable = cable
  },
  SET_CHANNEL (state, { channel, subscription }) {
    state.subscriptions[channel] = subscription
  }
}
