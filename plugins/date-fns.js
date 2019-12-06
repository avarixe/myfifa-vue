import Vue from 'vue'
import { format, parseISO } from 'date-fns'

Vue.prototype.$_parse = parseISO
Vue.prototype.$_format = (date, dateFormat) => format(date, dateFormat || 'yyyy-MM-dd')
