import Vue from 'vue'
import { format, parse } from 'date-fns'

Vue.prototype.$_parse = parse
Vue.prototype.$_format = (date, dateFormat) => format(date, dateFormat || 'YYYY-MM-DD')
