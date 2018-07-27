import Vue from 'vue'

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
