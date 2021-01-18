export default function ({ $axios, store }) {
  $axios.onRequest(() => {
    $axios.setToken(store.state.token || false, 'Bearer')
  })
}
