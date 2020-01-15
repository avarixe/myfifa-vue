import Cookie from 'js-cookie'

const appTitle = 'MyFIFA Manager'

// initial state
export const state = () => ({
  drawer: false,
  title: appTitle,
  overline: '',
  headline: '',
  caption: '',
  mode: 'light'
})

// mutations
export const mutations = {
  SET_TITLE (state, title) {
    state.title = title || appTitle
  },
  SET_PAGE (state, { title, overline, headline, caption }) {
    state.title = title || appTitle
    state.overline = overline
    state.headline = headline
    state.caption = caption
  },
  SET_DRAWER (state, drawer) {
    state.drawer = drawer
  },
  TOGGLE_DRAWER (state) {
    state.drawer = !state.drawer
  },
  SET_MODE (state, mode) {
    state.mode = mode || 'light'
    Cookie.set('mode', state.mode, { expires: 365 })
  }
}
