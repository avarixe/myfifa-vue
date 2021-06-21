const appTitle = 'MyFIFA Manager'

// initial state
export const state = () => ({
  title: appTitle,
  headline: '',
  caption: ''
})

// mutations
export const mutations = {
  setTitle (state, title) {
    state.title = title || appTitle
  },
  setPage (state, { title, headline, caption }) {
    state.title = title || appTitle
    state.headline = headline
    state.caption = caption
  }
}
