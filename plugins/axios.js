export default function ({ $axios, store }) {
  $axios.onRequest(() => {
    $axios.setToken(store.state.auth.token || false, 'Bearer')
  })
}
