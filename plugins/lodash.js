import Vue from 'vue'
import get from 'lodash.get'
import compact from 'lodash.compact'
import groupBy from 'lodash.groupby'
import orderBy from 'lodash.orderby'

Vue.prototype.$_get = get
Vue.prototype.$_compact = compact
Vue.prototype.$_groupBy = groupBy
Vue.prototype.$_orderBy = orderBy
