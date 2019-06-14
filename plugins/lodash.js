import Vue from 'vue'
import get from 'lodash.get'
import pick from 'lodash.pick'
import compact from 'lodash.compact'
import groupBy from 'lodash.groupby'
import orderBy from 'lodash.orderby'
import forEach from 'lodash.foreach'

Vue.prototype.$_get = get
Vue.prototype.$_pick = pick
Vue.prototype.$_compact = compact
Vue.prototype.$_groupBy = groupBy
Vue.prototype.$_orderBy = orderBy
Vue.prototype.$_forEach = forEach
