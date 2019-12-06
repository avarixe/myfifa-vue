import { format, parseISO } from 'date-fns'

export function listArray (arr, emptyString = 'N/A') {
  return arr && arr.length > 0 ? arr.join(', ') : emptyString
}

export function formatMoney (amount, currency) {
  return amount
    ? `${currency || '$'}${parseInt(amount).toLocaleString()}`
    : 'N/A'
}

export function formatDate (date, dateFormat) {
  return date
    ? format(parseISO(date), dateFormat || 'MMM dd, yyyy')
    : 'N/A'
}

export function sum (array) {
  return array.reduce((total, num) => total + num, 0)
}
