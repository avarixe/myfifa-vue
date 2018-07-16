function required (field, options) {
  return v => !!v || field + ' is required'
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

export default function (field, rules) {
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
      case 'email':
      case 'date':
        validators.push(format(field, func, options))
        break
    }
  }

  return validators
}
