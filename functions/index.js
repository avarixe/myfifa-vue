export function sum (array) {
  return array.reduce((total, num) => total + num, 0)
}

export function requiredRule (options) {
  options.label = options.label || 'Field'
  return v => !!v || `${options.label} is required`
}

export function rangeRule (options) {
  options.label = options.label || 'Field'
  return v => (
    !v ||
    (!isNaN(v) && options.min <= parseFloat(v) && parseFloat(v) <= options.max) ||
    `${options.label} must be between ${options.min} and ${options.max}`
  )
}

export function formatRule (options) {
  options.label = options.label || 'Field'
  const error = `${options.label} must be valid`
  let regex = null
  switch (options.type) {
    case 'email':
      regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
      break
    case 'date':
      regex = /^\d{4}-\d{2}-\d{2}$/
      break
    case 'number':
      regex = /^\d+$/
  }
  return v => !v || regex.test(v) || error
}
