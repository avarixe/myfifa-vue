import Vue from 'vue'
import { format, parse } from 'date-fns'

Vue.prototype.$parse = parse
Vue.prototype.$format = (date, dateFormat) => format(date, dateFormat || 'YYYY-MM-DD')
