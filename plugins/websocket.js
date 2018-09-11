// import Vue from 'vue'
// import VueNativeWebsocket from 'vue-native-websocket'
import ActionCable from 'actioncable'
import { cableURL } from '@/api/myfifa'

export default ({ store }, inject) => {
  // Vue.use(VueNativeWebsocket, cableURL, { store: store })
  const cable = ActionCable.createConsumer(cableURL, store.state.token)
  store.commit('listener/SET_CABLE', cable)
}
// Vue.$_cable = cable
