import Vue from 'vue'
import { format, parseISO } from 'date-fns'

Vue.filter('listArray', function (arr, emptyString) {
  return arr && arr.length > 0
    ? arr.join(', ')
    : emptyString || 'N/A'
})

Vue.filter('formatMoney', function (amount, currency, emptyString) {
  return amount
    ? `${currency || '$'}${parseInt(amount).toLocaleString()}`
    : emptyString || 'N/A'
})

Vue.filter('formatDate', function (date, dateFormat, emptyString) {
  return date
    ? format(parseISO(date), dateFormat || 'MMM dd, yyyy')
    : emptyString || 'N/A'
})
