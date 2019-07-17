import Vue from 'vue'
import pick from 'lodash.pick'
import compact from 'lodash.compact'
import orderBy from 'lodash.orderby'

Vue.prototype.$_pick = pick
Vue.prototype.$_compact = compact
Vue.prototype.$_orderBy = orderBy
