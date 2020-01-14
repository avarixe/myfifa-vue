export default function ({ store, route, redirect }) {
  if (store.getters.authenticated) {
    if (route.name === 'index') {
      return redirect('/teams')
    }
  } else if (route.name !== 'index') {
    return redirect(`/#${route.path}`)
  }
}
