import Vue from 'vue'
import objectify from './objectify'

Vue.prototype.$_objectify = objectify

// FORM VALIDATION FUNCTIONS

function required (field, options) {
  return v => !!v || field + ' is required'
}

function range (field, options) {
  return v => (
    (!isNaN(v) && options.min <= parseFloat(v) && parseFloat(v) <= options.max) ||
    field + ' must be between ' + options.min + ' and ' + options.max
  )
}

function format (field, type, options) {
  const error = field + ' must be valid'
  switch (type) {
    case 'email':
      return v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || error
    case 'date':
      return v => /^\d{4}-\d{2}-\d{2}$/.test(v) || error
  }
}

Vue.prototype.$_validate = function (field, rules) {
  let validators = []

  for (let i in rules) {
    let func, options
    let complex = typeof rules[i] === 'object'

    func = complex ? rules[i].type : rules[i]
    options = complex ? rules[i].options : {}

    switch (func) {
      case 'required':
        validators.push(required(field, options))
        break
      case 'range':
        validators.push(range(field, options))
        break
      case 'email':
      case 'date':
        validators.push(format(field, func, options))
        break
    }
  }

  return validators
}

// UTILITY FUNCTIONS

Vue.prototype.$_listArray = function (arr, emptyString = 'N/A') {
  return arr && arr.length > 0 ? arr.join(', ') : emptyString
}

Vue.prototype.$_formatMoney = function (amount) {
  return amount
    ? `${this.team.currency}${parseInt(amount).toLocaleString()}`
    : 'N/A'
}

Vue.prototype.$_formatDate = function (date, dateFormat = 'MMM DD, YYYY') {
  return date ? this.$_format(this.$_parse(date), dateFormat) : 'N/A'
}

Vue.prototype.$_sum = function (array) {
  return array.reduce((total, num) => total + num, 0)
}
