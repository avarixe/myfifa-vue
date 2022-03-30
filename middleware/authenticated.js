export default function ({ app, store, route, redirect }) {
  if (store.state.auth.token) {
    if (route.name === 'login') {
      redirect('/')
    }
  } else if (route.name !== 'login') {
    app.$cookies.set('targetRoute', {
      name: route.name,
      query: route.query
    })
    redirect({ name: 'login' })
  }
}
