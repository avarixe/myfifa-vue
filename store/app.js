// initial state
export const state = () => ({
  drawer: false,
  title: 'MyFIFA Manager',
  overline: '',
  headline: '',
  caption: '',
})

// mutations
export const mutations = {
  SET_TITLE (state, title) {
    state.title = title
  },
  SET_PAGE (state, { title, overline, headline, caption }) {
    state.title = title || 'MyFIFA Manager'
    state.overline = overline
    state.headline = headline
    state.caption = caption
  },
  SET_DRAWER (state, drawer) {
    state.drawer = drawer
  },
  TOGGLE_DRAWER (state) {
    state.drawer = !state.drawer
  }
}
